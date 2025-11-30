import React from 'react';
import { X, Volume2, Monitor, Cpu } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    difficulty: number;
    setDifficulty: (diff: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, difficulty, setDifficulty }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#242424] rounded-xl w-full max-w-md border border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Engine Strength */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-white">
                            <Cpu className="text-blue-500" size={20} />
                            <span className="font-medium">Engine Strength</span>
                            <span className="ml-auto text-sm bg-gray-800 px-2 py-1 rounded text-blue-400 font-mono">
                                Level {difficulty}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                            className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none"
                        />
                        <p className="text-xs text-gray-500">
                            Higher levels provide stronger moves but take longer to calculate.
                        </p>
                    </div>

                    {/* Placeholders for future settings */}
                    <div className="space-y-4 opacity-50 pointer-events-none">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <Volume2 className="text-green-500" size={20} />
                                <span className="font-medium">Sound Effects</span>
                            </div>
                            <div className="w-10 h-6 bg-gray-700 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <Monitor className="text-purple-500" size={20} />
                                <span className="font-medium">Board Theme</span>
                            </div>
                            <span className="text-sm text-gray-400">Green (Default)</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-700 bg-[#1a1a1a] rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
