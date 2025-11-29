import React from 'react';
import type { Opening } from '../data/openings';
import { BookOpen, Plus, X } from 'lucide-react';

interface SidebarProps {
    openings: Opening[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ openings, selectedId, onSelect, onAdd, isOpen, onClose }) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Content */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 bg-gray-900 h-screen p-4 border-r border-gray-800 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-green-500" />
                        Chess Trainer
                    </h1>
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        {openings.map(op => (
                            <button
                                key={op.id}
                                onClick={() => {
                                    onSelect(op.id);
                                    onClose(); // Close on selection on mobile
                                }}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedId === op.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <div className="font-medium">{op.name}</div>
                                <div className="text-xs opacity-70 mt-1">{op.type} • {op.difficulty}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onAdd}
                    className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Opening
                </button>
            </div>
        </>
    );
};
