import { initialOpenings } from '../data/openings';
import type { Opening } from '../data/openings';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'chess-trainer-custom-openings';

// Define the interface locally since it was removed from openings.ts
export interface OpeningCategory {
    id: string;
    name: string;
    groups: OpeningGroup[];
}

export interface OpeningGroup {
    id: string;
    name: string;
    description?: string;
    variations: Opening[];
}

export class OpeningManager {
    private openings: Opening[];

    constructor() {
        this.openings = [...initialOpenings];
        this.loadCustomOpenings();
    }

    private loadCustomOpenings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const custom = JSON.parse(stored) as Opening[];
                this.openings = [...this.openings, ...custom];
            }
        } catch (e) {
            console.error('Failed to load custom openings', e);
        }
    }

    public getAllOpenings(): Opening[] {
        return this.openings;
    }

    public getOpeningById(id: string): Opening | undefined {
        return this.openings.find(o => o.id === id);
    }

    public getCategorizedOpenings(): OpeningCategory[] {
        const categories: OpeningCategory[] = [];

        // Helper to find or create a category
        const getCategory = (id: string, name: string) => {
            let cat = categories.find(c => c.id === id);
            if (!cat) {
                cat = { id, name, groups: [] };
                categories.push(cat);
            }
            return cat;
        };

        // Helper to find or create a group within a category
        const getGroup = (category: OpeningCategory, id: string, name: string) => {
            let group = category.groups.find(g => g.id === id);
            if (!group) {
                group = { id, name, variations: [] };
                category.groups.push(group);
            }
            return group;
        };

        this.openings.forEach(opening => {
            let categoryId = 'other';
            let categoryName = 'Other Openings';

            // Determine Category based on First Move
            if (opening.pgn.startsWith('1. e4')) {
                categoryId = 'kings-pawn';
                categoryName = 'King\'s Pawn (e4)';
            } else if (opening.pgn.startsWith('1. d4')) {
                categoryId = 'queens-pawn';
                categoryName = 'Queen\'s Pawn (d4)';
            } else if (opening.pgn.startsWith('1. c4')) {
                categoryId = 'english';
                categoryName = 'English Opening (c4)';
            } else if (opening.pgn.startsWith('1. Nf3')) {
                categoryId = 'reti';
                categoryName = 'Reti / Flank (Nf3)';
            }

            const category = getCategory(categoryId, categoryName);

            // Determine Group based on Opening Name (simple heuristic)
            // e.g. "Sicilian Defense: Najdorf" -> "Sicilian Defense"
            let groupName = opening.name.split(':')[0].trim();
            // Handle "Defense" suffix grouping if needed, but name prefix is usually good enough

            // Special case for Gambits/Traps if we want to group them differently?
            // For now, let's stick to the name-based grouping as it keeps related lines together.

            const groupId = groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const group = getGroup(category, groupId, groupName);

            group.variations.push(opening);
        });

        // Sort categories to put e4/d4 first
        const order = ['kings-pawn', 'queens-pawn', 'english', 'reti', 'other'];
        categories.sort((a, b) => {
            const indexA = order.indexOf(a.id);
            const indexB = order.indexOf(b.id);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        return categories;
    }

    public addCustomOpening(opening: Omit<Opening, 'id'>): Opening {
        const newOpening: Opening = {
            ...opening,
            id: uuidv4()
        };

        this.openings.push(newOpening);
        this.saveCustomOpenings();
        return newOpening;
    }

    private saveCustomOpenings() {
        const custom = this.openings.filter(o => !initialOpenings.find(io => io.id === o.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    }

    public deleteCustomOpening(id: string) {
        const index = this.openings.findIndex(o => o.id === id);
        if (index !== -1) {
            // Check if it's a custom opening (not in initial)
            if (!initialOpenings.find(io => io.id === id)) {
                this.openings.splice(index, 1);
                this.saveCustomOpenings();
            }
        }
    }
}

export const openingManager = new OpeningManager();
