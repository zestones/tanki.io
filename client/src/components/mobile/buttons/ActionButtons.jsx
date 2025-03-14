import React from 'react';
import { ArrowRight } from 'lucide-react';

function ActionButtons({ spacing, layoutSize, themeColor, username, handleSubmit, navigate }) {
    return (
        <div className={`bg-black bg-opacity-80 ${spacing.actionButtons} border-t border-gray-800`}>
            <button
                onClick={handleSubmit}
                disabled={!username.trim()}
                className={`w-full ${layoutSize === 'xs' ? 'py-2' : 'py-3'} mb-2 flex items-center justify-center ${username.trim() ? 'opacity-100' : 'opacity-50'}`}
                style={{
                    backgroundColor: themeColor,
                    boxShadow: username.trim() ? `0 0 20px ${themeColor}80` : 'none'
                }}
            >
                <span className="font-bold tracking-wider mr-2">DEPLOY</span>
                <ArrowRight size={16} />
            </button>

            {layoutSize !== 'xs' && (
                <button
                    onClick={() => navigate('/tanki.io/game')}
                    className={`w-full ${layoutSize === 'xs' ? 'py-2' : 'py-3'} border border-gray-700 bg-transparent flex items-center justify-center`}
                >
                    <span className="text-sm tracking-wider text-gray-400">SPECTATE OPERATION</span>
                </button>
            )}
        </div>
    );
};

export default ActionButtons;
