import React, { useState, useEffect, useRef } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Copy, ExternalLink, RotateCcw, RefreshCw } from 'lucide-react';
import type { Opening } from '../data/openings';
import { StockfishEngine } from '../lib/stockfish';
import type { Evaluation } from '../lib/stockfish';
import { EvaluationBar } from './EvaluationBar';
import { parsePgnToTree } from '../lib/pgnParser';
import type { MoveNode } from '../lib/pgnParser';

interface ChessGameProps {
    opening: Opening;
    difficulty: number; // 0-20
    mode: 'trainer' | 'explorer' | 'blind';
    showHints: boolean;
    onComplete: (success: boolean, message: string) => void;
}

export const ChessGame: React.FC<ChessGameProps> = ({ opening, difficulty, mode, showHints, onComplete }) => {
    // Use useRef for the game instance to avoid stale closures in timeouts/callbacks
    const gameRef = useRef(new Chess());
    // We still need state to trigger re-renders when the board updates
    const [fen, setFen] = useState(gameRef.current.fen());
    const [orientation, setOrientation] = useState<'white' | 'black'>('white');
    const [status, setStatus] = useState<'playing' | 'won' | 'lost' | 'out-of-book'>('playing');
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const engine = useRef<StockfishEngine | null>(null);

    // Tree State
    const moveTree = useRef<MoveNode[]>([]);
    const currentNode = useRef<MoveNode | null>(null); // Null means root

    // Blind Mode State
    const [blindModeMessage, setBlindModeMessage] = useState<string | null>(null);

    interface BlindModeOpening {
        opening: Opening;
        currentNode: MoveNode | null;
        treeRoot: MoveNode[];
    }

    const possibleOpenings = useRef<BlindModeOpening[]>([]);
    const targetOpening = useRef<BlindModeOpening | null>(null);

    useEffect(() => {
        // Parse PGN to Tree
        const tree = parsePgnToTree(opening.pgn);
        moveTree.current = tree;
        currentNode.current = null;

        // Reset game to start
        gameRef.current = new Chess();
        setFen(gameRef.current.fen());
        setStatus('playing');
        setOrientation(opening.playerColor === 'w' ? 'white' : 'black');
        setEvaluation(null);
        setBlindModeMessage(null);

        // Initialize Engine
        engine.current = new StockfishEngine();
        engine.current.setSkillLevel(difficulty);

        // Initial Eval
        engine.current.evaluate(gameRef.current.fen());
        engine.current.setOnEvaluation((eval_) => {
            setEvaluation(eval_);
        });

        return () => {
            engine.current?.quit();
        };
    }, [opening, difficulty, mode]);

    // We need a separate effect for Blind Mode initialization because we need to read all openings
    useEffect(() => {
        if (mode === 'blind') {
            import('../lib/openingManager').then(({ openingManager }) => {
                const allOpenings = openingManager.getAllOpenings();
                const relevantOpenings = allOpenings.filter(o => o.playerColor === opening.playerColor);

                const parsed = relevantOpenings.map(op => ({
                    opening: op,
                    currentNode: null as MoveNode | null,
                    treeRoot: parsePgnToTree(op.pgn)
                }));

                possibleOpenings.current = parsed;

                // Pick random target
                if (possibleOpenings.current.length > 0) {
                    const randomIdx = Math.floor(Math.random() * possibleOpenings.current.length);
                    targetOpening.current = possibleOpenings.current[randomIdx];
                    console.log('Blind Mode Start. Target:', targetOpening.current.opening.name);

                    // If computer is white, play first move of target
                    if (opening.playerColor === 'b') {
                        playComputerMove();
                    }
                }
            });
        }
    }, [mode, opening.playerColor]); // Re-run if color changes (new game)

    useEffect(() => {
        // If computer is white and it's start of game, play first move
        // In Blind mode, this is handled in the initialization effect above
        if (mode !== 'blind' && opening.playerColor === 'b' && gameRef.current.moveNumber() === 1 && gameRef.current.turn() === 'w') {
            playComputerMove();
        }
    }, [opening, mode]);

    const isThinking = useRef(false);

    const playComputerMove = (isOutOfBookOverride = false) => {
        const currentStatus = isOutOfBookOverride ? 'out-of-book' : status;

        if (isThinking.current) return;
        if (gameRef.current.turn() === opening.playerColor) return;
        if (currentStatus === 'out-of-book' && mode !== 'explorer') return;

        let nextNode: MoveNode | null = null;

        if (mode === 'blind') {
            // Use targetOpening
            if (!targetOpening.current) return;

            const validChildren = targetOpening.current.currentNode
                ? targetOpening.current.currentNode.children
                : targetOpening.current.treeRoot;

            if (validChildren && validChildren.length > 0) {
                // Pick main line or random? Let's pick random valid move for this opening
                const randomIdx = Math.floor(Math.random() * validChildren.length);
                nextNode = validChildren[randomIdx];
            }
        } else {
            // Normal Trainer/Explorer
            let validChildren: MoveNode[] = [];
            if (currentStatus !== 'out-of-book') {
                validChildren = currentNode.current ? currentNode.current.children : moveTree.current;
            }
            if (validChildren.length > 0) {
                const randomIdx = Math.floor(Math.random() * validChildren.length);
                nextNode = validChildren[randomIdx];
            }
        }

        if (nextNode) {
            isThinking.current = true;
            setTimeout(() => {
                makeMove(nextNode!.san, nextNode);
                isThinking.current = false;
            }, 500);
        } else {
            // No moves in tree
            if (mode === 'explorer') {
                // ... (Existing Explorer Logic)
                if (status !== 'out-of-book') setStatus('out-of-book');
                isThinking.current = true;
                engine.current?.getBestMove(gameRef.current.fen(), 15, (bestMove) => {
                    const from = bestMove.substring(0, 2);
                    const to = bestMove.substring(2, 4);
                    const promotion = bestMove.length > 4 ? bestMove.substring(4, 5) : undefined;
                    setTimeout(() => {
                        makeMoveFromEngine({ from, to, promotion });
                        isThinking.current = false;
                    }, 500);
                });
            } else if (status === 'playing') {
                setStatus('won');
                onComplete(true, mode === 'blind'
                    ? `Victory! You completed the hidden opening: ${targetOpening.current?.opening.name}`
                    : `You successfully navigated the ${opening.name}!`
                );
            }
        }
    };

    const makeMoveFromEngine = (moveObj: { from: string; to: string; promotion?: string }) => {
        try {
            const result = gameRef.current.move(moveObj);
            if (result) {
                const newFen = gameRef.current.fen();
                setFen(newFen);
                engine.current?.evaluate(newFen);
                currentNode.current = null;
                if (status !== 'out-of-book') setStatus('out-of-book');
            }
        } catch (e) {
            console.error("Engine move failed", e);
        }
    };

    const makeMove = (moveSan: string, node: MoveNode | null) => {
        try {
            const result = gameRef.current.move(moveSan);
            if (result) {
                const newFen = gameRef.current.fen();
                setFen(newFen);
                engine.current?.evaluate(newFen);

                if (mode === 'blind') {
                    // Update all possible openings
                    // For the one we just played (computer move), we know it's valid for targetOpening
                    // But we should update ALL possible openings just in case
                    updateBlindModeState(result.san);
                } else {
                    currentNode.current = node;
                }
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    };

    const updateBlindModeState = (moveSan: string) => {
        // Filter possible openings
        const nextPossible: any[] = [];

        possibleOpenings.current.forEach(po => {
            const children = po.currentNode ? po.currentNode.children : po.treeRoot;
            const match = children.find((c: MoveNode) => c.san === moveSan);
            if (match) {
                nextPossible.push({
                    ...po,
                    currentNode: match
                });
            }
        });

        possibleOpenings.current = nextPossible;

        if (possibleOpenings.current.length === 0) {
            // Deviated from ALL openings
            checkBlunder();
            return;
        }

        // Check if target is still valid
        const targetStillValid = possibleOpenings.current.find(po => po.opening.id === targetOpening.current?.opening.id);

        if (targetStillValid) {
            targetOpening.current = targetStillValid;
        } else {
            // Switch target!
            const randomIdx = Math.floor(Math.random() * possibleOpenings.current.length);
            targetOpening.current = possibleOpenings.current[randomIdx];
            setBlindModeMessage(`Switched to ${targetOpening.current.opening.name}`);
            setTimeout(() => setBlindModeMessage(null), 3000);
        }

        // Check if won (leaf node of target)
        if (targetOpening.current?.currentNode?.children.length === 0) {
            setStatus('won');
            onComplete(true, `Victory! You completed the hidden opening: ${targetOpening.current.opening.name}`);
        }
    };

    const onDrop = (sourceSquare: string, targetSquare: string) => {
        if (status !== 'playing' && status !== 'out-of-book') return false;
        if (mode === 'trainer' && gameRef.current.turn() !== opening.playerColor) return false;
        if (mode === 'blind' && gameRef.current.turn() !== opening.playerColor) return false;
        if (gameRef.current.turn() !== opening.playerColor && mode === 'trainer') return false;

        try {
            const move = gameRef.current.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });

            if (!move) return false;
            const newFen = gameRef.current.fen();
            setFen(newFen);
            engine.current?.evaluate(newFen);

            if (mode === 'blind') {
                updateBlindModeState(move.san);
                if (status === 'playing') { // If not lost
                    playComputerMove();
                }
            } else {
                // Normal Logic
                const validChildren = currentNode.current ? currentNode.current.children : moveTree.current;
                const matchingNode = validChildren.find(child => child.san === move.san);

                if (matchingNode) {
                    currentNode.current = matchingNode;
                    setStatus('playing');
                    if (matchingNode.children.length === 0) {
                        if (mode === 'trainer') {
                            setStatus('won');
                            onComplete(true, `You successfully navigated the ${opening.name}!`);
                        }
                    } else {
                        playComputerMove();
                    }
                } else {
                    if (mode === 'trainer') {
                        checkBlunder();
                    } else {
                        setStatus('out-of-book');
                        currentNode.current = null;
                        playComputerMove(true);
                    }
                }
            }

            return true;
        } catch (e) {
            return false;
        }
    };

    const checkBlunder = () => {
        setStatus('lost');
        onComplete(false, mode === 'blind'
            ? "You deviated from all known openings!"
            : `You deviated from the ${opening.name} line!`
        );
    };

    const resetGame = () => {
        gameRef.current = new Chess();
        setFen(gameRef.current.fen());
        setStatus('playing');
        setEvaluation(null);
        currentNode.current = null;
        isThinking.current = false;
        setBlindModeMessage(null);

        engine.current?.evaluate(gameRef.current.fen());

        if (mode === 'blind') {
            // Re-init blind mode
            import('../lib/openingManager').then(({ openingManager }) => {
                const allOpenings = openingManager.getAllOpenings();
                const relevantOpenings = allOpenings.filter(o => o.playerColor === opening.playerColor);

                const parsed = relevantOpenings.map(op => ({
                    opening: op,
                    currentNode: null as MoveNode | null,
                    tree: parsePgnToTree(op.pgn)
                }));

                possibleOpenings.current = parsed.map(p => ({
                    ...p,
                    treeRoot: p.tree
                }));

                if (possibleOpenings.current.length > 0) {
                    const randomIdx = Math.floor(Math.random() * possibleOpenings.current.length);
                    targetOpening.current = possibleOpenings.current[randomIdx];
                    console.log('Blind Mode Reset. Target:', targetOpening.current.opening.name);

                    if (opening.playerColor === 'b') {
                        setTimeout(() => playComputerMove(), 500);
                    }
                }
            });
        } else if (opening.playerColor === 'b') {
            setTimeout(() => {
                playComputerMove();
            }, 500);
        }
    };

    const copyFen = () => {
        navigator.clipboard.writeText(fen);
        alert('FEN copied to clipboard!');
    };

    const analyzeLichess = () => {
        window.open(`https://lichess.org/analysis/${fen.replace(/ /g, '_')}`, '_blank');
    };

    const [customArrows, setCustomArrows] = useState<{ startSquare: Square; endSquare: Square; color: string }[]>([]);

    useEffect(() => {
        if (showHints && status === 'playing' && gameRef.current.turn() === opening.playerColor) {
            let arrows: any[] = [];
            if (mode === 'blind') {
                // Hint for target opening
                if (targetOpening.current) {
                    const validChildren = targetOpening.current.currentNode
                        ? targetOpening.current.currentNode.children
                        : (targetOpening.current as any).treeRoot;

                    arrows = validChildren.map((child: MoveNode) => {
                        try {
                            const tempGame = new Chess(gameRef.current.fen());
                            const move = tempGame.move(child.san);
                            if (move) return { startSquare: move.from, endSquare: move.to, color: 'rgba(255, 170, 0, 0.8)' };
                        } catch (e) { return null; }
                        return null;
                    }).filter(Boolean);
                }
            } else {
                const validChildren = currentNode.current ? currentNode.current.children : moveTree.current;
                arrows = validChildren.map((child) => {
                    try {
                        const tempGame = new Chess(gameRef.current.fen());
                        const move = tempGame.move(child.san);
                        if (move) {
                            return { startSquare: move.from, endSquare: move.to, color: 'rgba(255, 170, 0, 0.8)' };
                        }
                    } catch (e) {
                        return null;
                    }
                    return null;
                }).filter((x): x is { startSquare: Square; endSquare: Square; color: string } => x !== null);
            }
            setCustomArrows(arrows);
        } else {
            setCustomArrows([]);
        }
    }, [showHints, status, opening.playerColor, currentNode.current, fen, mode]);

    return (
        <div className="flex gap-4 items-stretch justify-center w-full max-w-[700px] mx-auto relative">
            {blindModeMessage && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl animate-fade-in-out">
                    {blindModeMessage}
                </div>
            )}
            <EvaluationBar evaluation={evaluation} orientation={orientation} />

            <div className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-square relative">
                    <Chessboard
                        options={{
                            arrows: customArrows,
                            position: fen,
                            onPieceDrop: ({ sourceSquare, targetSquare }: any) => {
                                if (!targetSquare) return false;
                                return onDrop(sourceSquare, targetSquare);
                            },
                            boardOrientation: orientation,
                            darkSquareStyle: { backgroundColor: '#779556' },
                            lightSquareStyle: { backgroundColor: '#ebecd0' },
                        }}
                    />
                </div>

                <div className="mt-4 w-full flex justify-between items-center text-white bg-gray-800 p-3 rounded-lg">
                    <div className="font-mono text-sm truncate max-w-[200px] opacity-50" title={fen}>
                        {status === 'playing'
                            ? (gameRef.current.turn() === 'w' ? 'White to move' : 'Black to move')
                            : status === 'won' ? 'Victory!' : status === 'lost' ? 'Defeat' : 'Out of Book'}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={resetGame}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Reset Board"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={() => {
                                gameRef.current.undo();
                                if (gameRef.current.turn() !== opening.playerColor) {
                                    gameRef.current.undo();
                                }
                                const newFen = gameRef.current.fen();
                                setFen(newFen);
                                setStatus('playing');
                                engine.current?.evaluate(newFen);

                                // Undo for Blind Mode is hard because we lose 'possibleOpenings' history.
                                // For now, let's just reset game if they undo in Blind Mode? 
                                // Or just warn them.
                                // Actually, we can just re-calculate possibleOpenings from history.
                                // But that's expensive.
                                // Let's just disable Undo in Blind Mode for now or make it simple (reset).
                                if (mode === 'blind') {
                                    alert("Undo not fully supported in Blind Mode yet. Reseting game.");
                                    resetGame();
                                    return;
                                }

                                // ... (Existing Undo Logic)
                                let node: MoveNode | null = null;
                                const history = gameRef.current.history({ verbose: true });
                                let currentLevel = moveTree.current;

                                for (const move of history) {
                                    const found = currentLevel.find(n => n.san === move.san);
                                    if (found) {
                                        node = found;
                                        currentLevel = found.children;
                                    } else {
                                        node = null;
                                        break;
                                    }
                                }
                                currentNode.current = node;
                            }}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Undo Move"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={copyFen}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Copy FEN"
                        >
                            <Copy size={18} />
                        </button>
                        <button
                            onClick={analyzeLichess}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Analyze on Lichess"
                        >
                            <ExternalLink size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
