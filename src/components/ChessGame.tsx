
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { RotateCcw, RefreshCw, Settings, Copy, ExternalLink, Lightbulb, Maximize2, Minimize2 } from 'lucide-react';
import type { Opening } from '../data/openings';
import { StockfishEngine } from '../lib/stockfish';
import type { Evaluation } from '../lib/stockfish';
import { EvaluationBar } from './EvaluationBar';
import { PromotionDialog } from './PromotionDialog';
import { parsePgnToTree } from '../lib/pgnParser';
import type { MoveNode } from '../lib/pgnParser';

interface ChessGameProps {
    opening: Opening;
    difficulty: number;
    mode: 'trainer' | 'explorer' | 'blind';
    showHints: boolean;
    onComplete: (success: boolean, message: string) => void;
    onOpenSettings: () => void;
    onToggleHints: () => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

export const ChessGame: React.FC<ChessGameProps> = ({
    opening,
    difficulty,
    mode,
    showHints,
    onComplete,
    onOpenSettings,
    onToggleHints,
    isFullscreen,
    onToggleFullscreen
}) => {
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
    const [pendingPromotion, setPendingPromotion] = useState<{ sourceSquare: Square; targetSquare: Square } | null>(null);


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
    }, [opening, difficulty]); // Removed 'mode' to prevent reset when switching modes (e.g. Blind -> Explorer)

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

    // Handle transition to Explorer mode from Lost/Won state (e.g. "Continue in Explorer")
    useEffect(() => {
        if (mode === 'explorer' && (status === 'lost' || status === 'won')) {
            console.log('Switching to Explorer mode from', status);
            setStatus('out-of-book');
            setBlindModeMessage(null); // Clear any blind mode messages
            // If it's computer's turn, play move
            if (gameRef.current.turn() !== opening.playerColor) {
                playComputerMove(true);
            }
        }
    }, [mode, status]);

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
                if (status !== 'out-of-book') setStatus('out-of-book');
                isThinking.current = true;
                if (!engine.current) {
                    isThinking.current = false;
                    return;
                }
                engine.current.getBestMove(gameRef.current.fen(), 15, (bestMove) => {
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
                    ? `Victory! You completed the hidden opening: ${targetOpening.current?.opening.name} `
                    : `You successfully navigated the ${opening.name} !`
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
            // If we have a promotion piece, we need to construct the move object manually if moveSan doesn't include it
            // But wait, moveSan usually includes it (e.g. "e8=Q").
            // However, if we are coming from the engine or tree, moveSan is full.
            // If we are coming from user selection, we might need to be careful.

            // Actually, for user moves, we usually use the object format in game.move()
            // But here we are passing SAN.
            // Let's change the signature or how we call it.

            // If we look at existing calls: makeMove(nextNode!.san, nextNode)

            // For user moves, we call gameRef.current.move({...}) directly in onDrop.
            // We should refactor onDrop to use makeMove? Or keep them separate?
            // The existing code has makeMove separate from onDrop's direct game.move call.
            // Let's unify or just handle the promotion in onDrop and then call the logic.

            // Actually, I will modify onDrop to NOT call game.move immediately if promotion.

            const result = gameRef.current.move(moveSan);
            if (result) {
                const newFen = gameRef.current.fen();
                setFen(newFen);
                engine.current?.evaluate(newFen);

                if (mode === 'blind') {
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
            setBlindModeMessage(`Switched to ${targetOpening.current.opening.name} `);
            setTimeout(() => setBlindModeMessage(null), 3000);
        }

        // Check if won (leaf node of target)
        if (targetOpening.current?.currentNode?.children.length === 0) {
            setStatus('won');
            onComplete(true, `Victory! You completed the hidden opening: ${targetOpening.current.opening.name} `);
        }
    };

    const handlePromotionSelect = (piece: 'q' | 'r' | 'b' | 'n') => {
        if (!pendingPromotion) return;

        const { sourceSquare, targetSquare } = pendingPromotion;
        setPendingPromotion(null);

        attemptMove(sourceSquare, targetSquare, piece);
    };

    const attemptMove = (sourceSquare: string, targetSquare: string, promotion?: string) => {
        try {
            const move = gameRef.current.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: promotion,
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
                            onComplete(true, `You successfully navigated the ${opening.name} !`);
                        } else {
                            // Explorer mode: Reached end of book, continue with engine
                            playComputerMove();
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



    const onDrop = (sourceSquare: string, targetSquare: string) => {
        if (status !== 'playing' && status !== 'out-of-book') return false;
        if (mode === 'trainer' && gameRef.current.turn() !== opening.playerColor) return false;
        if (mode === 'blind' && gameRef.current.turn() !== opening.playerColor) return false;
        if (gameRef.current.turn() !== opening.playerColor && mode === 'trainer') return false;

        try {
            // Check for promotion
            const piece = gameRef.current.get(sourceSquare as Square);
            const turn = gameRef.current.turn();

            const isPromotion = (piece?.type === 'p' &&
                ((turn === 'w' && targetSquare[1] === '8') ||
                    (turn === 'b' && targetSquare[1] === '1')));

            if (isPromotion) {
                setPendingPromotion({ sourceSquare: sourceSquare as Square, targetSquare: targetSquare as Square });
                return false;
            }

            return attemptMove(sourceSquare, targetSquare);
        } catch (e) {
            console.error('onDrop error', e);
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

    const copyPgn = () => {
        navigator.clipboard.writeText(gameRef.current.pgn());
        // Could add a toast here
        alert('PGN copied to clipboard!');
    };

    const analyzeLichess = () => {
        window.open(`https://lichess.org/analysis/${fen.replace(/ /g, '_')}`, '_blank');
    };

    const undoMove = () => {
        gameRef.current.undo();
        // If it was computer's turn (we undid user move), we might want to undo computer move too?
        // Usually in trainer, we play White. Computer plays Black.
        // If we undo, we undo our move? Or computer's move?
        // If it's currently our turn, and we undo, we undo computer's last move. Then we are at computer's turn.
        // So we should undo twice to get back to our previous position.

        if (gameRef.current.turn() !== opening.playerColor) {
            gameRef.current.undo();
        }

        const newFen = gameRef.current.fen();
        setFen(newFen);
        setStatus('playing');
        engine.current?.evaluate(newFen);
        setBlindModeMessage(null);

        // Re-sync currentNode with game history
        if (mode !== 'blind') {
            const history = gameRef.current.history({ verbose: true });
            let currentLevel = moveTree.current;
            let node: MoveNode | null = null;

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
        }
    };

    const [customArrows, setCustomArrows] = useState<{ startSquare: Square; endSquare: Square; color: string }[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'arrowleft':
                    undoMove();
                    break;
                case 'r':
                    resetGame();
                    break;
                case 'h':
                    onToggleHints();
                    break;
                case 'f':
                    onToggleFullscreen();
                    break;
                case 'c':
                    copyPgn();
                    break;
                case 'a':
                    analyzeLichess();
                    break;
                case 's':
                    onOpenSettings();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undoMove, resetGame, onToggleHints, onToggleFullscreen, copyPgn, analyzeLichess, onOpenSettings]);

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
                            if (move) {
                                return {
                                    startSquare: move.from as Square,
                                    endSquare: move.to as Square,
                                    color: 'rgba(255, 215, 0, 0.6)'
                                };
                            }
                        } catch (e) {
                            return null;
                        }
                        return null;
                    }).filter((a: any): a is { startSquare: Square; endSquare: Square; color: string } => !!a);
                    setCustomArrows(arrows);
                }
            } else {
                // Trainer Mode Hints
                const validChildren = currentNode.current ? currentNode.current.children : moveTree.current;
                arrows = validChildren.map((child: MoveNode) => {
                    try {
                        const tempGame = new Chess(gameRef.current.fen());
                        const move = tempGame.move(child.san);
                        if (move) {
                            return {
                                startSquare: move.from as Square,
                                endSquare: move.to as Square,
                                color: 'rgba(255, 215, 0, 0.6)'
                            };
                        }
                    } catch (e) {
                        return null;
                    }
                    return null;
                }).filter((a: any): a is { startSquare: Square; endSquare: Square; color: string } => !!a);
                setCustomArrows(arrows);
            }
        } else {
            setCustomArrows([]);
        }
    }, [showHints, status, opening, mode, fen]);

    return (
        <div className={`flex gap-4 items-stretch justify-center w-full mx-auto relative ${isFullscreen ? 'h-full' : 'max-w-[700px]'}`}>

            <EvaluationBar evaluation={evaluation} orientation={orientation} />

            <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative">
                <div className={`relative ${isFullscreen ? 'h-screen w-auto aspect-square' : 'w-full aspect-square'}`}>
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
                            boardStyle: {
                                borderRadius: '4px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            }
                        }}
                    />

                    {/* Promotion Dialog */}
                    <PromotionDialog
                        isOpen={!!pendingPromotion}
                        onSelect={handlePromotionSelect}
                        orientation={orientation}
                    />

                    {/* Blind Mode Message */}
                    {blindModeMessage && (
                        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/75 text-white px-6 py-3 rounded-xl text-xl font-bold animate-in fade-in zoom-in duration-300">
                                {blindModeMessage}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Control Bar */}
                <div className={`${isFullscreen
                    ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 opacity-0 hover:opacity-100 transition-opacity duration-300 z-20'
                    : 'w-full bg-gray-800 p-4 rounded-b-lg'} flex items-center justify-between`}>

                    <div className="font-mono text-sm truncate max-w-[200px] opacity-50" title={fen}>
                        {status === 'playing'
                            ? (gameRef.current.turn() === 'w' ? 'White to move' : 'Black to move')
                            : status === 'won' ? 'Victory!' : status === 'lost' ? 'Defeat' : 'Out of Book'}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={undoMove}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Undo Move (Left Arrow)"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={resetGame}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Reset Board (R)"
                        >
                            <RefreshCw size={18} />
                        </button>

                        <div className="w-px h-6 bg-gray-700 mx-1" /> {/* Separator */}

                        <button
                            onClick={onToggleHints}
                            className={`p-2 rounded transition-colors ${showHints ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            title={showHints ? "Hints On (H)" : "Hints Off (H)"}
                        >
                            <Lightbulb size={18} className={showHints ? "fill-current" : ""} />
                        </button>

                        <div className="w-px h-6 bg-gray-700 mx-1" /> {/* Separator */}

                        <button
                            onClick={copyPgn}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Copy PGN (C)"
                        >
                            <Copy size={18} />
                        </button>
                        <button
                            onClick={analyzeLichess}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Analyze on Lichess (A)"
                        >
                            <ExternalLink size={18} />
                        </button>

                        <div className="w-px h-6 bg-gray-700 mx-1" /> {/* Separator */}

                        <button
                            onClick={onOpenSettings}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Settings (S)"
                        >
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={onToggleFullscreen}
                            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
                        >
                            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};
