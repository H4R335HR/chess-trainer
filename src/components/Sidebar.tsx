import React, { useState, useEffect } from 'react';
import type { OpeningCategory } from '../lib/openingManager';
import { BookOpen, Plus, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface SidebarProps {
    categories: OpeningCategory[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    categories,
    selectedId,
    onSelect,
    onAdd,
    isOpen,
    onClose,
    isCollapsed,
    onToggleCollapse
}) => {
    // Track expanded state for both Categories (level 1) and Groups (level 2)
    // Keys will be IDs of categories or groups
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    // Auto-expand path to selected opening
    useEffect(() => {
        if (selectedId) {
            for (const cat of categories) {
                for (const group of cat.groups) {
                    if (group.variations.some(v => v.id === selectedId)) {
                        setExpandedItems(prev => ({
                            ...prev,
                            [cat.id]: true,
                            [group.id]: true
                        }));
                        return;
                    }
                }
            }
        }
    }, [selectedId, categories]);

    const toggleItem = (id: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

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
                ${isCollapsed ? 'w-16' : 'w-80'} bg-gray-900 h-screen border-r border-gray-800 flex flex-col
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
                        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                            <div className="space-y-1">
                                {categories.map(category => {
                                    const isCatExpanded = expandedItems[category.id];

                                    return (
                                        <div key={category.id} className="mb-2">
                                            {/* Level 1: Category */}
                                            <button
                                                onClick={() => toggleItem(category.id)}
                                                className="w-full flex items-center gap-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm font-bold uppercase tracking-wider"
                                            >
                                                {isCatExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                <span className="truncate">{category.name}</span>
                                            </button>

                                            {isCatExpanded && (
                                                <div className="ml-2 mt-1 space-y-1 border-l-2 border-gray-800 pl-2">
                                                    {category.groups.map(group => {
                                                        const isGroupExpanded = expandedItems[group.id];

                                                        return (
                                                            <div key={group.id}>
                                                                {/* Level 2: Group */}
                                                                <button
                                                                    onClick={() => toggleItem(group.id)}
                                                                    className="w-full flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-semibold"
                                                                >
                                                                    {isGroupExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                                    <span className="truncate">{group.name}</span>
                                                                </button>

                                                                {isGroupExpanded && (
                                                                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-800 pl-2">
                                                                        {group.variations.map(op => (
                                                                            <button
                                                                                key={op.id}
                                                                                onClick={() => {
                                                                                    onSelect(op.id);
                                                                                    onClose();
                                                                                }}
                                                                                className={`w-full text-left p-2 rounded-lg transition-colors ${selectedId === op.id
                                                                                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                                                                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                                                                                    }`}
                                                                            >
                                                                                <div className="font-medium text-sm truncate">{op.name}</div>
                                                                                <div className="text-[10px] opacity-60 truncate flex gap-2">
                                                                                    <span>{op.type}</span>
                                                                                    <span>•</span>
                                                                                    <span>{op.difficulty}</span>
                                                                                </div>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-800">
                            <button
                                onClick={onAdd}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Opening
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center pt-4 gap-4 overflow-y-auto no-scrollbar">
                        {/* Collapsed View - Show flattened list of icons/initials */}
                        {categories.flatMap(c => c.groups.flatMap(g => g.variations)).map(op => (
                            <button
                                key={op.id}
                                onClick={() => onSelect(op.id)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${selectedId === op.id
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
                            className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors mt-auto mb-4 shrink-0"
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
