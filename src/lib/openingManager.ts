import { initialOpenings } from '../data/openings';
import type { Opening } from '../data/openings';
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
