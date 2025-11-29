
import { parsePgnToTree } from './src/lib/pgnParser';
import { initialOpenings } from './src/data/openings';

// Mock Chess.js if needed, but we are running this in node so we need to ensure dependencies are available.
// Actually, pgnParser imports 'chess.js' and 'pgn-parser'.
// We need to run this with ts-node or similar.

const italian = initialOpenings.find(o => o.name === 'Italian Game');

if (italian) {
    console.log('Parsing Italian Game PGN:', italian.pgn);
    const tree = parsePgnToTree(italian.pgn);
    console.log('Tree Root Children:', tree.map(n => n.san));

    if (tree.length > 0) {
        console.log('First Move:', tree[0].san);
        if (tree[0].children.length > 0) {
            console.log('Response:', tree[0].children[0].san);
        }
    } else {
        console.error('Tree is empty!');
    }
} else {
    console.error('Italian Game not found');
}
