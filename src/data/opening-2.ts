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
    // =========================================================================
    // --- OPENINGS (Fundamental principles, structure) ---
    // =========================================================================

    // --- EASY ---
    {
        id: 'london-system',
        name: 'London System',
        description: 'A solid, universal system for White against almost any Black defense.',
        pgn: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3',
        playerColor: 'w',
        difficulty: 'Easy',
        type: 'Opening'
    },
    {
        id: 'scandinavian-defense',
        name: 'Scandinavian Defense',
        description: 'A direct challenge to White\'s center. Simple to learn.',
        pgn: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5',
        playerColor: 'b',
        difficulty: 'Easy',
        type: 'Opening'
    },
    {
        id: 'scotch-game',
        name: 'Scotch Game',
        description: 'White opens the center immediately. Active and classical.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4',
        playerColor: 'w',
        difficulty: 'Easy',
        type: 'Opening'
    },
    {
        id: 'bishops-opening',
        name: 'Bishop\'s Opening',
        description: 'White develops the bishop to c4 immediately to target f7.',
        pgn: '1. e4 e5 2. Bc4 Nf6 3. d3 c6',
        playerColor: 'w',
        difficulty: 'Easy',
        type: 'Opening'
    },
    {
        id: 'philidor-defense',
        name: 'Philidor Defense',
        description: 'A solid but slightly passive defense protecting the e5 pawn.',
        pgn: '1. e4 e5 2. Nf3 d6 3. d4 exd4 4. Nxd4',
        playerColor: 'b',
        difficulty: 'Easy',
        type: 'Opening'
    },

    // --- MEDIUM ---
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
        id: 'queens-gambit',
        name: 'Queen\'s Gambit',
        description: 'White fights for the center by sacrificing a wing pawn.',
        pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3',
        playerColor: 'w',
        difficulty: 'Medium',
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
        id: 'vienna-game',
        name: 'Vienna Game',
        description: 'An aggressive alternative to the Ruy Lopez or Italian.',
        pgn: '1. e4 e5 2. Nc3 Nf6 3. f4 d5 4. fxe5 Nxe4',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'slav-defense',
        name: 'Slav Defense',
        description: 'One of the most solid defenses against the Queen\'s Gambit.',
        pgn: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'english-opening',
        name: 'English Opening',
        description: 'A flank opening (1. c4) leading to positional maneuvering.',
        pgn: '1. c4 e5 2. Nc3 Nf6 3. g3 d5 4. cxd5 Nxd5',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'pirc-defense',
        name: 'Pirc Defense',
        description: 'A hypermodern defense where Black allows White a broad center.',
        pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 g6',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'queens-indian',
        name: 'Queen\'s Indian Defense',
        description: 'A solid hypermodern response to 1. d4.',
        pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'petrov-defense',
        name: 'Petrov\'s Defense',
        description: 'The Russian Game. Symmetrical and drawish, but solid.',
        pgn: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'closed-sicilian',
        name: 'Closed Sicilian',
        description: 'A quieter, more positional approach to the Sicilian.',
        pgn: '1. e4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'kings-indian-attack',
        name: 'King\'s Indian Attack',
        description: 'A flexible system for White, mirroring the King\'s Indian Defense.',
        pgn: '1. Nf3 d5 2. g3 Nf6 3. Bg2 c6 4. O-O Bg4 5. d3',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Opening'
    },
    {
        id: 'nimzowitsch-larsen',
        name: 'Nimzowitsch-Larsen Attack',
        description: 'A hypermodern flank opening preparing to control the long diagonal.',
        pgn: '1. b3 e5 2. Bb2 Nc6 3. e3 Nf6 4. Bb5',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Opening'
    },

    // --- HARD ---
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
        id: 'sicilian-najdorf',
        name: 'Sicilian Defense: Najdorf',
        description: 'The Cadillac of chess openings. Sharp and complex.',
        pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4',
        playerColor: 'b',
        difficulty: 'Hard',
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
    },
    {
        id: 'sicilian-dragon',
        name: 'Sicilian Defense: Dragon',
        description: 'An aggressive and sharp variation of the Sicilian.',
        pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'catalan-opening',
        name: 'Catalan Opening',
        description: 'Combines the Queen\'s Gambit and the Réti. Very positional.',
        pgn: '1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 Be7 5. Nf3 O-O',
        playerColor: 'w',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'grunfeld-defense',
        name: 'Grünfeld Defense',
        description: 'Black allows White a big center to attack it with pieces.',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'nimzo-indian',
        name: 'Nimzo-Indian Defense',
        description: 'Controls the center with pieces rather than pawns.',
        pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'dutch-defense',
        name: 'Dutch Defense',
        description: 'An aggressive counter to 1. d4, creating an unbalanced game.',
        pgn: '1. d4 f5 2. c4 Nf6 3. g3 e6 4. Bg2 Be7',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'alekhine-defense',
        name: 'Alekhine Defense',
        description: 'Provokes White to advance pawns, hoping they become weak.',
        pgn: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. c4 Nb6 5. f4',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'birds-opening',
        name: 'Bird\'s Opening',
        description: 'A sharp and aggressive opening starting with f4.',
        pgn: '1. f4 d5 2. Nf3 Nf6 3. e3 g6 4. b3 Bg7',
        playerColor: 'w',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'grob-opening',
        name: 'Grob Opening',
        description: 'A risky, unorthodox opening. Can surprise unprepared opponents.',
        pgn: '1. g4 d5 2. Bg2 Bxg4 3. c4 c6',
        playerColor: 'w',
        difficulty: 'Hard',
        type: 'Opening'
    },
    {
        id: 'polish-opening',
        name: 'Polish Opening',
        description: 'The Orangutan. Controls b5 and prepares to fianchetto.',
        pgn: '1. b4 e5 2. Bb2 Bxb4 3. Bxe5 Nf6',
        playerColor: 'w',
        difficulty: 'Hard',
        type: 'Opening'
    },

    // =========================================================================
    // --- GAMBITS (Sacrificing material for time/attack) ---
    // =========================================================================

    // --- EASY ---
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
        id: 'scotch-gambit',
        name: 'Scotch Gambit',
        description: 'An aggressive line in the Scotch Game postponing the recapture.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Bc4 Bc5 5. c3',
        playerColor: 'w',
        difficulty: 'Easy',
        type: 'Gambit'
    },

    // --- MEDIUM ---
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
    {
        id: 'stafford-gambit',
        name: 'Stafford Gambit',
        description: 'A venomous gambit in the Petrov Defense. Highly tactical.',
        pgn: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 Nc6 4. Nxc6 dxc6 5. d3 Bc5',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'halloween-gambit',
        name: 'Halloween Gambit',
        description: 'White sacrifices a knight for a massive center. Very scary!',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Nxe5 Nxe5 5. d4 Ng6 6. e5',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'blackmar-diemer',
        name: 'Blackmar-Diemer Gambit',
        description: 'White sacrifices a pawn to open lines for an attack on the King.',
        pgn: '1. d4 d5 2. e4 dxe4 3. Nc3 Nf6 4. f3 exf3 5. Nxf3',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'albin-countergambit',
        name: 'Albin Countergambit',
        description: 'An aggressive defense against the Queen\'s Gambit.',
        pgn: '1. d4 d5 2. c4 e5 3. dxe5 d4 4. Nf3 Nc6 5. g3',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'urusov-gambit',
        name: 'Urusov Gambit',
        description: 'A dangerous gambit in the Bishop\'s Opening.',
        pgn: '1. e4 e5 2. Bc4 Nf6 3. d4 exd4 4. Nf3 Nxe4 5. Qxd4',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Gambit'
    },
    {
        id: 'rousseau-gambit',
        name: 'Rousseau Gambit',
        description: 'A mirrored King\'s Gambit played by Black.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 f5',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Gambit'
    },

    // --- HARD ---
    {
        id: 'benko-gambit',
        name: 'Benko Gambit',
        description: 'A positional gambit for long-term pressure on the queenside.',
        pgn: '1. d4 Nf6 2. c4 c5 3. d5 b5 4. cxb5 a6 5. bxa6 Bxa6',
        playerColor: 'b',
        difficulty: 'Hard',
        type: 'Gambit'
    },

    // =========================================================================
    // --- TRAPS (Specific tactical tricks) ---
    // =========================================================================

    // --- EASY ---
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
        id: 'blackburne-shilling',
        name: 'Blackburne Shilling',
        description: 'Black pretends to blunder a pawn to trap White\'s Queen.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nd4 4. Nxe5 Qg5 5. Nxf7 Qxg2 6. Rf1 Qxe4+ 7. Be2 Nf3#',
        playerColor: 'b',
        difficulty: 'Easy',
        type: 'Trap'
    },
    {
        id: 'fishing-pole',
        name: 'Fishing Pole Trap',
        description: 'Black baits White into taking a knight, opening the h-file.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Ng4 5. h3 h5 6. hxg4 hxg4 7. Ne1 Qh4',
        playerColor: 'b',
        difficulty: 'Easy',
        type: 'Trap'
    },
    {
        id: 'tennison-gambit-icbm',
        name: 'Tennison Gambit (ICBM)',
        description: 'The Intercontinental Ballistic Missile variation. Deadly against the Scandinavian.',
        pgn: '1. Nf3 d5 2. e4 dxe4 3. Ng5 Nf6 4. d3 exd3 5. Bxd3 h6 6. Nxf7 Kxf7 7. Bg6+ Kxg6 8. Qxd8',
        playerColor: 'w',
        difficulty: 'Easy',
        type: 'Trap'
    },

    // --- MEDIUM ---
    {
        id: 'fried-liver',
        name: 'Fried Liver Attack',
        description: 'A sharp and aggressive opening for White. Sacrifice the knight on f7.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7 7. Qf3+ Ke6 8. Nc3',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Trap'
    },
    {
        id: 'elephant-trap',
        name: 'Elephant Trap',
        description: 'A trap in the Queen\'s Gambit Declined where Black wins a piece.',
        pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Nbd7 5. cxb5 exd5 6. Nxd5 Nxd5 7. Bxd8 Bb4+ 8. Qd2 Bxd2+ 9. Kxd2 Kxd8',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Trap'
    },
    {
        id: 'noahs-ark',
        name: 'Noah\'s Ark Trap',
        description: 'Trapping White\'s light-squared bishop in the Ruy Lopez.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 d6 5. d4 b5 6. Bb3 Nxd4 7. Nxd4 exd4 8. Qxd4 c5 9. Qd5 Be6 10. Qc6+ Bd7 11. Qd5 c4',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Trap'
    },
    {
        id: 'mortimer-trap',
        name: 'Mortimer Trap',
        description: 'A tricky trap in the Ruy Lopez Berlin Defense.',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. d3 Ne7 5. Nxe5 c6 6. Nc4 cxb5 7. Nd6#',
        playerColor: 'w',
        difficulty: 'Medium',
        type: 'Trap'
    },
    {
        id: 'englund-gambit-trap',
        name: 'Englund Gambit Trap',
        description: 'A quick mate if White is greedy against the Englund Gambit.',
        pgn: '1. d4 e5 2. dxe5 Nc6 3. Nf3 Qe7 4. Bf4 Qb4+ 5. Bd2 Qxb2 6. Bc3 Bb4 7. Qd2 Bxc3 8. Qxc3 Qc1#',
        playerColor: 'b',
        difficulty: 'Medium',
        type: 'Trap'
    },

    // --- HARD ---
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
    }
];
