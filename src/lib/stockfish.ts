export type Evaluation = {
    type: 'cp' | 'mate';
    value: number; // centipawns or moves to mate
};

export class StockfishEngine {
    private worker: Worker | null = null;
    private onEvaluation: ((eval_: Evaluation) => void) | null = null;
    private onBestMove: ((move: string) => void) | null = null;

    constructor() {
        this.init();
    }

    private init() {
        try {
            this.worker = new Worker('/stockfish/stockfish.js');

            this.worker.onmessage = (e) => {
                const line = e.data;
                // console.log('SF RAW:', line);

                if (line.startsWith('info') && line.includes('score')) {
                    this.parseScore(line);
                }

                if (line.startsWith('bestmove')) {
                    console.log('SF bestmove line:', line);
                    const move = line.split(' ')[1];
                    if (this.onBestMove) {
                        this.onBestMove(move);
                        this.onBestMove = null; // Ensure we only trigger once per request
                    }
                }
            };

            this.worker.postMessage('uci');
        } catch (err) {
            console.error('Failed to load Stockfish worker', err);
        }
    }

    private parseScore(line: string) {
        // Example: info depth 10 ... score cp 50 ...
        // Example: info depth 10 ... score mate 3 ...
        const parts = line.split(' ');
        const scoreIndex = parts.indexOf('score');
        if (scoreIndex !== -1) {
            const type = parts[scoreIndex + 1] as 'cp' | 'mate';
            const value = parseInt(parts[scoreIndex + 2]);

            // Adjust for side to move? Stockfish usually reports score from side to move perspective.
            // But usually we want white's perspective or relative.
            // For now let's just pass it raw.

            if (this.onEvaluation) {
                this.onEvaluation({ type, value });
            }
        }
    }

    public evaluate(fen: string, depth: number = 10) {
        if (!this.worker) return;
        this.stop();
        this.worker.postMessage(`position fen ${fen}`);
        this.worker.postMessage(`go depth ${depth}`);
    }

    public getBestMove(fen: string, depth: number = 10, onMove: (move: string) => void) {
        if (!this.worker) return;
        this.stop();
        this.onBestMove = onMove;
        this.worker.postMessage(`position fen ${fen}`);
        this.worker.postMessage(`go depth ${depth}`);
    }

    public setSkillLevel(level: number) {
        // Skill Level is 0-20
        if (!this.worker) return;
        this.worker.postMessage(`setoption name Skill Level value ${level}`);
    }

    public setOnEvaluation(callback: (eval_: Evaluation) => void) {
        this.onEvaluation = callback;
    }

    public stop() {
        if (this.worker) {
            this.worker.postMessage('stop');
        }
    }

    public quit() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}
