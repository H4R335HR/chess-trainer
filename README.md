# Chess Opening Trainer

A comprehensive chess opening trainer application built with React, TypeScript, and Vite. This tool is designed to help players recognize, defend against, and practice common chess openings, gambits, and traps.

## Features

- **Opening Trainer**: Practice against specific openings and traps. Get immediate feedback on your moves.
- **Blind Mode**: Play against the computer where the computer secretly selects an opening. You must adapt and identify the opening as you play.
- **Repertoire Tree**: Explore opening variations in a tree structure. Visualize different lines and transpositions.
- **Interactive Board**: Fully interactive chessboard using `react-chessboard` and `chess.js`.
- **Stockfish Integration**: Integrated Stockfish engine for move validation and evaluation.
- **PGN Support**: Parse and display games from PGN files using `pgn-parser`.
- **Promotion Choice**: Custom dialog for pawn promotion selection.
- **Responsive Design**: Modern and responsive UI built with Tailwind CSS.

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Chess Logic**: chess.js
- **Board Component**: react-chessboard
- **PGN Parsing**: pgn-parser
- **Engine**: stockfish.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chess-trainer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project is configured for deployment to GitHub Pages.

To deploy:

```bash
npm run deploy
```

## License

MIT
