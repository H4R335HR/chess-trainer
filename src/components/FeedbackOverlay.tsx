import React from 'react';
import type { Opening } from '../data/openings';

interface FeedbackOverlayProps {
    success: boolean;
    message: string;
    opening: Opening;
    onRetry: () => void;
    onNext?: () => void;
    onContinueInExplorer?: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ success, message, opening, onRetry, onNext, onContinueInExplorer }) => {
    const getTitle = () => {
        if (success) {
            return `Mastered: ${opening.name}`;
        } else {
            if (opening.type === 'Trap') return `Trapped in ${opening.name}!`;
            if (opening.type === 'Gambit') return `Gambit Failed: ${opening.name}`;
            return `Blunder in ${opening.name}`;
        }
    };

    return (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`bg-[#242424] p-8 rounded-2xl border-2 ${success ? 'border-green-500' : 'border-red-500'} max-w-md text-center shadow-2xl animate-in zoom-in-50 duration-300`}>
                <h3 className={`text-3xl font-bold mb-2 ${success ? 'text-green-500' : 'text-red-500'}`}>
                    {success ? 'Excellent!' : 'Oops!'}
                </h3>
                <h4 className="text-xl font-semibold text-white mb-4">{getTitle()}</h4>
                <p className="text-lg text-gray-300 mb-8">{message}</p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onRetry}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Try Again
                    </button>
                    {success && onNext && (
                        <button
                            onClick={onNext}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Next Opening
                        </button>
                    )}
                    {!success && onContinueInExplorer && (
                        <button
                            onClick={onContinueInExplorer}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Continue in Explorer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
