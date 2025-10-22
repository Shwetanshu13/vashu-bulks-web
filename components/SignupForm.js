'use client';

import { useState } from 'react';

export default function SignupForm({ onSuccess, onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSuccess(email, password, name);
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Must be at least 8 characters
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                >
                    {loading ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button
                    onClick={onSwitchToLogin}
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                    Login
                </button>
            </p>
        </div>
    );
}
