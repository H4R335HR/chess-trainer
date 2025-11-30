import React from 'react';
import type { Opening } from '../data/openings';
import { BookOpen, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
    openings: Opening[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    openings,
    selectedId,
    onSelect,
    onAdd,
    isOpen,
    onClose,
    isCollapsed,
    onToggleCollapse
}) => {
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
                ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 h-screen border-r border-gray-800 flex flex-col
                transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 mb-2`}>
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-white flex items-center gap-2 truncate">
                            <BookOpen className="w-6 h-6 text-green-500 shrink-0" />
                            Chess Trainer
                        </h1>
                    )}
                    {isCollapsed && (
                        <BookOpen className="w-6 h-6 text-green-500 shrink-0" />
                    )}

                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className={`hidden md:flex items-center justify-center p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ${isCollapsed ? 'absolute -right-3 top-6 bg-gray-900 border border-gray-800 rounded-full shadow-lg' : ''}`}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {!isCollapsed ? (
                    <>
                        <div className="flex-1 overflow-y-auto px-4">
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
                                        <div className="font-medium truncate">{op.name}</div>
                                        <div className="text-xs opacity-70 mt-1 truncate">{op.type} • {op.difficulty}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4">
                            <button
                                onClick={onAdd}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Opening
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center pt-4 gap-4">
                        {/* Collapsed Icons View */}
                        {openings.map(op => (
                            <button
                                key={op.id}
                                onClick={() => onSelect(op.id)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedId === op.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                title={op.name}
                            >
                                <span className="text-xs font-bold">{op.name.substring(0, 2).toUpperCase()}</span>
                            </button>
                        ))}
                        <button
                            onClick={onAdd}
                            className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors mt-auto mb-4"
                            title="Add Opening"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
