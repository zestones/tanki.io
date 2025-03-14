import { Info } from 'lucide-react';

export default function RegistrationForm({ username, setUsername, handleSubmit, spacing, layoutSize, themeColor }) {
    return (
        <form onSubmit={handleSubmit} className={spacing.form}>
            <div>
                <div className="flex items-center mb-1">
                    <div className="w-1 h-4 mr-2" style={{ backgroundColor: themeColor }}></div>
                    <label htmlFor="username" className="text-xs uppercase tracking-wider text-gray-300">
                        Commander Identification
                    </label>
                </div>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full ${layoutSize === 'xs' ? 'py-2' : 'py-3'} px-4 bg-black bg-opacity-50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500`}
                    placeholder="Enter tactical callsign"
                    required
                    style={{ boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)" }}
                />
                {layoutSize !== 'xs' && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Info size={10} className="mr-1" />
                        <span>Required for battlefield identification</span>
                    </div>
                )}
            </div>
        </form>
    );
}