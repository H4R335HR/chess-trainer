import { initialOpenings, initialOpeningCategories } from '../data/openings';
import type { Opening, OpeningCategory } from '../data/openings';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'chess-trainer-custom-openings';

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
        // Deep copy the initial categories to avoid mutating the source
        const categories: OpeningCategory[] = JSON.parse(JSON.stringify(initialOpeningCategories));

        // Find custom openings (those not in initialOpenings)
        // Note: We check by ID. initialOpenings contains all built-in variations.
        const customOpenings = this.openings.filter(o => !initialOpenings.find(io => io.id === o.id));

        if (customOpenings.length > 0) {
            // For now, add all custom openings to a specific "Custom" category
            // In the future, we could try to auto-categorize them based on PGN
            const customCategory: OpeningCategory = {
                id: 'custom-openings',
                name: 'Custom Openings',
                groups: [
                    {
                        id: 'user-added',
                        name: 'User Added',
                        variations: customOpenings
                    }
                ]
            };
            categories.push(customCategory);
        }

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
