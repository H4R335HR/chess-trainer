import React from 'react';
import type { Evaluation } from '../lib/stockfish';

interface EvaluationBarProps {
    evaluation: Evaluation | null;
    orientation: 'white' | 'black';
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({ evaluation, orientation }) => {
    // Calculate height percentage for white
    // CP: 0 is 50%. +1000 is 100%. -1000 is 0%.
    // Sigmoid-like clamping for better visuals

    let whiteHeight = 50;
    let scoreText = '0.0';

    if (evaluation) {
        if (evaluation.type === 'mate') {
            if (evaluation.value > 0) {
                whiteHeight = 100;
                scoreText = `M${evaluation.value}`;
            } else {
                whiteHeight = 0;
                scoreText = `M${Math.abs(evaluation.value)}`;
            }
        } else {
            // CP
            const cp = evaluation.value;
            // Simple linear clamp for now: +/- 500 cp = full bar
            const clamped = Math.max(-500, Math.min(500, cp));
            whiteHeight = 50 + (clamped / 1000) * 100;
            scoreText = (cp / 100).toFixed(1);
            if (cp > 0) scoreText = '+' + scoreText;
        }
    }

    const isWhiteBottom = orientation === 'white';

    return (
        <div className="w-8 h-full bg-gray-700 rounded overflow-hidden flex flex-col relative border border-gray-600">
            {/* Black bar (top if white bottom) */}
            <div
                className="bg-black w-full transition-all duration-500 ease-in-out flex items-center justify-center text-[10px] text-white font-mono"
                style={{ height: `${100 - whiteHeight}%` }}
            >
                {!isWhiteBottom && evaluation && evaluation.value < 0 && <span className="mb-1">{scoreText}</span>}
                {isWhiteBottom && evaluation && evaluation.value < 0 && <span className="mt-auto mb-1">{scoreText}</span>}
            </div>

            {/* White bar */}
            <div
                className="bg-white w-full transition-all duration-500 ease-in-out flex items-center justify-center text-[10px] text-black font-mono"
                style={{ height: `${whiteHeight}%` }}
            >
                {isWhiteBottom && evaluation && evaluation.value > 0 && <span className="mt-1">{scoreText}</span>}
                {!isWhiteBottom && evaluation && evaluation.value > 0 && <span className="mb-auto mt-1">{scoreText}</span>}
            </div>
        </div>
    );
};
