import React from 'react';

interface PromotionDialogProps {
    isOpen: boolean;
    onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
    orientation: 'white' | 'black';
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({ isOpen, onSelect, orientation }) => {
    if (!isOpen) return null;

    const pieces = [
        { id: 'q', label: 'Queen', symbol: orientation === 'white' ? '♕' : '♛' },
        { id: 'r', label: 'Rook', symbol: orientation === 'white' ? '♖' : '♜' },
        { id: 'b', label: 'Bishop', symbol: orientation === 'white' ? '♗' : '♝' },
        { id: 'n', label: 'Knight', symbol: orientation === 'white' ? '♘' : '♞' },
    ] as const;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="bg-white p-4 rounded-lg shadow-xl flex gap-4 animate-in fade-in zoom-in duration-200">
                {pieces.map((piece) => (
                    <button
                        key={piece.id}
                        onClick={() => onSelect(piece.id)}
                        className="w-16 h-16 flex items-center justify-center text-4xl hover:bg-gray-100 rounded-lg transition-colors border-2 border-transparent hover:border-blue-500"
                        title={`Promote to ${piece.label}`}
                    >
                        <span className={orientation === 'white' ? 'text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' : 'text-black'}>
                            {piece.symbol}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
