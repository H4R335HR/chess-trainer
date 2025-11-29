import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChessGame } from './components/ChessGame';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { openingManager } from './lib/openingManager';
import { parsePgnToTree } from './lib/pgnParser';
import type { Opening } from './data/openings';
import { Menu, X, Lightbulb } from 'lucide-react';

function App() {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean, message: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    setOpenings(openingManager.getAllOpenings());
    const all = openingManager.getAllOpenings();
    if (all.length > 0) setSelectedId(all[0].id);
  }, []);

  const handleGameComplete = (success: boolean, message: string) => {
    setFeedback({ success, message });
  };

  const handleAddOpening = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const pgn = formData.get('pgn') as string;
    const type = formData.get('type') as any;
    const difficulty = formData.get('difficulty') as any;
    const playerColor = formData.get('playerColor') as 'w' | 'b';
    const description = formData.get('description') as string;

    if (name && pgn) {
      // Validate PGN
      const tree = parsePgnToTree(pgn);
      if (tree.length === 0) {
        alert('Invalid PGN! Please check your notation.');
        return;
      }

      const newOp = openingManager.addCustomOpening({
        name,
        pgn,
        type,
        difficulty,
        playerColor,
        description: description || 'Custom opening'
      });
      setOpenings(openingManager.getAllOpenings());
      setSelectedId(newOp.id);
      setShowAddModal(false);
    }
  };

  const selectedOpening = openings.find(o => o.id === selectedId);

  const [difficulty, setDifficulty] = useState(10);
  const [gameMode, setGameMode] = useState<'trainer' | 'explorer' | 'blind'>('trainer');
  const [showBlindModeModal, setShowBlindModeModal] = useState(false);

  const startBlindMode = (color: 'w' | 'b') => {
    // Create a dummy opening for Blind Mode initialization
    // The actual openings will be loaded in ChessGame
    const dummyOpening: Opening = {
      id: 'blind-mode-dummy',
      name: 'Blind Mode',
      description: 'Hidden Opening',
      pgn: '', // Empty PGN, will be ignored
      playerColor: color,
      difficulty: 'Hard',
      type: 'Opening'
    };

    // We need to set selectedId to something to render the game
    // But selectedId corresponds to 'openings' list.
    // Let's add the dummy to the list temporarily or just handle it?
    // Better: Just set selectedOpening directly? No, it's derived.
    // Let's add it to the list.

    // Actually, we can just set selectedId to null and handle it? 
    // No, the UI checks 'selectedOpening'.

    // Let's push a dummy opening to the list if it doesn't exist.
    const existing = openings.find(o => o.id === 'blind-mode-dummy');
    if (!existing) {
      setOpenings(prev => [...prev, dummyOpening]);
    } else {
      // Update color if needed
      existing.playerColor = color;
    }

    setSelectedId('blind-mode-dummy');
    setGameMode('blind');
    setShowBlindModeModal(false);
  };

  // ...

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white font-sans overflow-hidden">
      <Sidebar
        openings={openings}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setFeedback(null);
        }}
        onAdd={() => setShowAddModal(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative w-full">
        {/* Mobile Header */}
        <div className="md:hidden absolute top-4 left-4 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
          >
            <Menu size={24} />
          </button>
        </div>
        {/* Blind Mode Color Selection Modal */}
        {showBlindModeModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#242424] p-6 rounded-xl w-full max-w-sm border border-gray-700 text-center">
              <h3 className="text-xl font-bold mb-4">Select Your Color</h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => startBlindMode('w')}
                  className="px-6 py-3 bg-gray-200 text-black rounded-lg font-bold hover:bg-white transition-colors"
                >
                  White
                </button>
                <button
                  onClick={() => startBlindMode('b')}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition-colors border border-gray-600"
                >
                  Black
                </button>
              </div>
              <button
                onClick={() => setShowBlindModeModal(false)}
                className="mt-6 text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {(selectedOpening || gameMode === 'blind') ? (
          <>
            <div className="mb-8 text-center w-full max-w-3xl relative">
              {gameMode === 'blind' ? (
                <div className="mb-4">
                  <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Blind Mode
                  </h2>
                  <p className="text-gray-400">The computer has chosen a secret opening...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-2">{selectedOpening?.name}</h2>
                  <p className="text-gray-400 max-w-xl mx-auto mb-4">{selectedOpening?.description}</p>
                </>
              )}

              {/* Controls */}
              <div className="absolute top-0 right-0 flex flex-col items-end gap-4">
                {/* Mode Selector */}
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                  <button
                    onClick={() => setGameMode('trainer')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${gameMode === 'trainer' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Trainer
                  </button>
                  <button
                    onClick={() => setGameMode('explorer')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${gameMode === 'explorer' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Explorer
                  </button>
                  <button
                    onClick={() => {
                      // If switching TO blind mode, we need to reset/ask for color.
                      // But here we are already in a game. 
                      // Maybe just disable switching TO blind mode from here?
                      // Or treat it as a reset.
                      setShowBlindModeModal(true);
                    }}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${gameMode === 'blind' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Blind
                  </button>
                </div>

                {/* Hints Toggle */}
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors border border-gray-700 ${showHints ? 'bg-yellow-600 text-white border-yellow-500' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  <Lightbulb size={16} />
                  {showHints ? 'Hints On' : 'Hints Off'}
                </button>

                {/* Difficulty Selector */}
                <div className="flex flex-col items-end">
                  <label className="text-xs text-gray-400 mb-1">Engine Strength: {difficulty}</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-32 accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <ChessGame
              key={selectedOpening!.id + difficulty + gameMode + (gameMode === 'blind' ? 'blind' : '')} // Remount on change
              opening={selectedOpening!}
              difficulty={difficulty}
              mode={gameMode}
              showHints={showHints}
              onComplete={handleGameComplete}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="text-gray-500 text-xl">Select an opening to start training</div>
            <div className="text-gray-600">- OR -</div>
            <button
              onClick={() => setShowBlindModeModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Enter Blind Mode
            </button>
          </div>
        )}

        {/* Feedback Overlay */}
        {feedback && selectedOpening && (
          <FeedbackOverlay
            success={feedback.success}
            message={feedback.message}
            opening={selectedOpening}
            onRetry={() => setFeedback(null)}
            onNext={() => {
              const currentIndex = openings.findIndex(o => o.id === selectedId);
              const next = openings[currentIndex + 1];
              if (next) {
                setSelectedId(next.id);
                setFeedback(null);
              }
            }}
          />
        )}

        {/* Add Opening Modal */}
        {showAddModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#242424] p-6 rounded-xl w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Custom Opening</h3>
                <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddOpening} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input name="name" required className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500" placeholder="e.g. My Secret Weapon" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select name="type" className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500">
                      <option value="Opening">Opening</option>
                      <option value="Trap">Trap</option>
                      <option value="Gambit">Gambit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select name="difficulty" className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Player Color</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="playerColor" value="w" defaultChecked className="accent-blue-500" />
                      <span>White</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="playerColor" value="b" className="accent-blue-500" />
                      <span>Black</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea name="description" rows={2} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500" placeholder="Briefly describe the goal..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">PGN</label>
                  <textarea name="pgn" required rows={4} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500 font-mono text-sm" placeholder="1. e4 e5 2. Nf3..." />
                </div>

                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-medium transition-colors">
                  Save Opening
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
