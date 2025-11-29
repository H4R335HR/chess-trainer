import { parse } from 'pgn-parser';
import { Chess } from 'chess.js';

export interface MoveNode {
    san: string;
    fen: string;
    children: MoveNode[];
    comment?: string;
    moveNumber?: number;
    color?: 'w' | 'b';
}

export function parsePgnToTree(pgn: string): MoveNode[] {
    if (!pgn.trim()) return [];

    try {
        // Ensure PGN has a result token, otherwise parser might fail
        const safePgn = pgn.trim().match(/(\*|1-0|0-1|1\/2-1\/2)$/) ? pgn : `${pgn} *`;
        const [game] = parse(safePgn);
        const chess = new Chess();

        // The parser returns a list of moves, where each move has 'ravs' (Recursive Annotation Variations)
        // We need to traverse this structure.

        return convertMoves(game.moves, chess);
    } catch (e) {
        console.error('PGN Parse Error', e);
        return [];
    }
}

function convertMoves(pgnMoves: any[], chess: Chess): MoveNode[] {
    if (!pgnMoves || pgnMoves.length === 0) return [];

    const currentMove = pgnMoves[0];
    const nodes: MoveNode[] = [];

    // 1. Process the main move
    try {
        const move = chess.move(currentMove.move);
        if (move) {
            const node: MoveNode = {
                san: move.san,
                fen: chess.fen(),
                children: [], // Will be populated with next moves
                color: move.color,
                comment: currentMove.comments?.map((c: any) => c.text).join(' ')
            };

            // 2. Process Variations (RAVs)
            // Variations start from the SAME position as 'node' (i.e. alternatives to 'node')
            // Wait, pgn-parser structure:
            // [ { move: 'e4', ravs: [ { moves: [...] } ] }, { move: 'e5' } ]
            // 'ravs' are alternatives to the CURRENT move.

            // So 'node' is one option. The RAVs provide sibling nodes.
            // But my return type is MoveNode[].
            // So I should return [node, ...variationNodes].

            // However, 'node.children' should contain the response (next move in pgnMoves).

            // Let's recurse for children (Next move in the sequence)
            const nextMoves = pgnMoves.slice(1);
            if (nextMoves.length > 0) {
                node.children = convertMoves(nextMoves, chess);
            }

            nodes.push(node);

            // 3. Handle Variations
            // We need to undo the move to get back to the state before 'node'
            // to parse the variations.
            chess.undo();

            if (currentMove.ravs) {
                for (const rav of currentMove.ravs) {
                    // Each RAV is a sequence of moves.
                    // We parse the first move of the RAV as a sibling.
                    // We need a clone of the chess state? 
                    // Or just use the current state (which is now undone).

                    // We need to clone because convertMoves mutates the game state?
                    // convertMoves traverses down.
                    // So we should clone the chess instance for the variation.
                    const variationChess = new Chess(chess.fen());
                    const variationNodes = convertMoves(rav.moves, variationChess);
                    nodes.push(...variationNodes);
                }
            }

            // Restore state? No, we are done with this level.
            // But wait, the 'chess' object passed in is mutated by 'chess.move'.
            // If we undo, it is back to start.
            // But we called 'convertMoves(nextMoves, chess)' BEFORE undoing.
            // So 'chess' inside that call has advanced.
            // But here in this scope, we undid it.

            // Actually, we should pass a CLONE to the children to avoid side effects?
            // Or be careful with undo order.

            // Let's re-verify logic:
            // 1. Play move on 'chess'.
            // 2. Recurse for children using 'chess' (which is now advanced).
            // 3. Undo move on 'chess' (back to start).
            // 4. Loop variations, using 'chess' (at start) -> clone for safety.

            // Issue: 'convertMoves' processes a SEQUENCE.
            // [e4, e5, Nf3]
            // convertMoves([e4...]) -> plays e4.
            //   -> children = convertMoves([e5...]) -> plays e5.

            // This seems correct.
        }
    } catch (e) {
        console.error('Move conversion error', e);
    }

    return nodes;
}
