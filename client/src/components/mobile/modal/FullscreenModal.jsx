import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Maximize2, X } from 'lucide-react';

function FullscreenModal({ onEnable, onDismiss }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-gray-900 border border-gray-700 w-5/6 max-w-md rounded-md overflow-hidden animate-in fade-in duration-300">
                {/* Modal Header */}
                <div className="bg-red-900 bg-opacity-50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                        <AlertTriangle size={16} className="text-red-400 mr-2" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Combat Alert</h3>
                    </div>
                    <button onClick={onDismiss} className="text-gray-400 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-5">
                    <div className="mb-4 text-center">
                        <Maximize2 size={40} className="mx-auto mb-3 text-blue-400" />
                        <h4 className="text-lg font-semibold text-white mb-2">Tactical Display Optimization Required</h4>
                        <p className="text-sm text-gray-300">
                            For optimal battlefield awareness and control interface, fullscreen mode is recommended.
                        </p>
                    </div>

                    <div className="border-t border-gray-800 pt-4 mt-4">
                        <p className="text-xs text-gray-400 mb-4 text-center">
                            Enable fullscreen mode to maximize tactical advantage
                        </p>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={onEnable}
                                className="w-full py-3 bg-blue-600 text-white font-bold tracking-wider flex items-center justify-center"
                                style={{ boxShadow: `0 0 15px rgba(52, 152, 219, 0.5)` }}
                            >
                                <span>ENABLE FULLSCREEN</span>
                            </button>

                            <button
                                onClick={onDismiss}
                                className="w-full py-2 border border-gray-700 text-gray-400 text-sm tracking-wider"
                            >
                                CONTINUE WITHOUT FULLSCREEN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

FullscreenModal.propTypes = {
    onEnable: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
};

export default FullscreenModal;