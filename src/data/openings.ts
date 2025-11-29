export interface Opening {
    id: string;
    name: string;
    description: string;
    pgn: string; // The full PGN of the line/trap
    playerColor: 'w' | 'b'; // The color the user plays
    difficulty: 'Easy' | 'Medium' | 'Hard';
    type: 'Trap' | 'Gambit' | 'Opening';
}

export const initialOpenings: Opening[] = [
    // --- TRAPS ---
    {
        id: 'fried-liver',
        name: 'Fried Liver Attack',
        description: 'A sharp and aggressive opening for White. Sacrifice the knight on f7 to expose the Black king.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7 7. Qf3+ Ke6 8. Nc3',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Trap'
    },
    {
        id: 'scholars-mate-defense',
        name: 'Scholar\'s Mate Defense',
        description: 'Defend against the early Queen attack.',
        pgn: '1. e4 e5 2. Qh5 Nc6 3. Bc4 g6 4. Qf3 Nf6',
        playerColor: 'b',
        difficulty: 'Easy',
        type: 'Trap'
    },
    {
        id: 'legals-trap',
        name: 'Legal\'s Trap',
        description: 'A beautiful queen sacrifice leading to checkmate.',
        pgn: '1. e4 e5 2. Nf3 d6 3. Bc4 Bg4 4. Nc3 g6 5. Nxe5 Bxd1 6. Bxf7+ Ke7 7. Nd5#',
        playerColor: 'w',
        difficulty: 'Easy',
        type: 'Trap'
    },
    {
        id: 'elephant-trap',
        name: 'Elephant Trap',
        description: 'A trap in the Queen\'s Gambit Declined where Black wins a piece.',
        pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Nbd7 5. cxd5 exd5 6. Nxd5 Nxd5 7. Bxd8 Bb4+ 8. Qd2 Bxd2+ 9. Kxd2 Kxd8',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Trap'
    },
    {
        id: 'lasker-trap',
        name: 'Lasker Trap',
        description: 'An interesting trap in the Albin Countergambit involving underpromotion.',
        pgn: '1. d4 d5 2. c4 e5 3. dxe5 d4 4. e3 Bb4+ 5. Bd2 dxe3 6. Bxb4 exf2+ 7. Ke2 fxg1=N+ 8. Ke1 Qh4+',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Trap'
    },
    {
        id: 'siberian-trap',
        name: 'Siberian Trap',
        description: 'A deadly trap in the Smith-Morra Gambit against the Sicilian.',
        pgn: '1. e4 c5 2. d4 cxd4 3. c3 dxc3 4. Nxc3 Nc6 5. Nf3 e6 6. Bc4 Qc7 7. O-O Nf6 8. Qe2 Ng4 9. h3 Nd4',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Trap'
    },

    // --- GAMBITS ---
    {
        id: 'danish-gambit',
        name: 'Danish Gambit',
        description: 'Sacrifice two pawns for rapid development and open lines.',
        pgn: '1. e4 e5 2. d4 exd4 3. c3 dxc3 4. Bc4 cxb2 5. Bxb2',
        playerColor: 'w',
        difficulty: 'Easy',
        type: 'Gambit'
    },
    {
        id: 'kings-gambit',
        name: 'King\'s Gambit',
        description: 'The romantic era favorite. Sacrifice the f-pawn to attack.',
        pgn: '1. e4 e5 2. f4 exf4 3. Nf3 g5 4. Bc4 Bg7 5. h4',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'evans-gambit',
        name: 'Evans Gambit',
        description: 'Sacrifice the b-pawn in the Italian Game for a strong center.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'smith-morra-gambit',
        name: 'Smith-Morra Gambit',
        description: 'Aggressive response to the Sicilian Defense.',
        pgn: '1. e4 c5 2. d4 cxd4 3. c3 dxc3 4. Nxc3 Nc6 5. Nf3 d6 6. Bc4 e6',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'budapest-gambit',
        name: 'Budapest Gambit',
        description: 'Black sacrifices a pawn for active piece play against 1. d4.',
        pgn: '1. d4 Nf6 2. c4 e5 3. dxe5 Ng4 4. Nf3 Bc5 5. e3 Nc6',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Gambit'
    },

    // --- OPENINGS ---
    {
        id: 'ruy-lopez',
        name: 'Ruy Lopez',
        description: 'One of the oldest and most popular chess openings.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O',
        playerColor: 'w',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'italian-game',
        name: 'Italian Game',
        description: 'Focuses on rapid development and control of the center.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 d6 6. O-O',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'sicilian-najdorf',
        name: 'Sicilian Defense: Najdorf',
        description: 'The Cadillac of chess openings. Sharp and complex.',
        pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'french-defense',
        name: 'French Defense',
        description: 'Solid and counter-attacking defense against 1. e4.',
        pgn: '1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'caro-kann',
        name: 'Caro-Kann Defense',
        description: 'Known for its solidity and endgame structure.',
        pgn: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5 5. Ng3 Bg6 6. h4 h6',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'queens-gambit',
        name: 'Queen\'s Gambit',
        description: 'White fights for the center by sacrificing a wing pawn.',
        pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'kings-indian',
        name: 'King\'s Indian Defense',
        description: 'Hypermodern defense where Black allows White a strong center to attack it later.',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Opening'
    }
];
