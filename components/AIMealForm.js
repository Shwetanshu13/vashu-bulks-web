'use client';

import { useState } from 'react';
import { logMeal } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

export default function AIMealForm({ onSuccess }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mealDescription, setMealDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [analyzedMeal, setAnalyzedMeal] = useState(null);

    async function handleAnalyze(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        setAnalyzedMeal(null);

        try {
            const response = await fetch('/api/analyze-meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mealDescription }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze meal');
            }

            setAnalyzedMeal(data);
        } catch (err) {
            setError(err.message || 'Failed to analyze meal');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!analyzedMeal) return;

        setError('');
        setLoading(true);

        try {
            await logMeal(user.$id, {
                mealName: analyzedMeal.mealName,
                calories: analyzedMeal.calories,
                protein: analyzedMeal.protein,
                fats: analyzedMeal.fats,
                carbs: analyzedMeal.carbs,
                date: date,
                isAIcalculated: true
            });

            // Reset form
            setMealDescription('');
            setAnalyzedMeal(null);
            setDate(new Date().toISOString().split('T')[0]);

            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to log meal');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">AI-Powered Meal Entry</h3>
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded">
                    {error}
                </div>
            )}

            {!analyzedMeal ? (
                <form onSubmit={handleAnalyze} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-1 text-gray-300">
                            Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="mealDescription" className="block text-sm font-medium mb-1 text-gray-300">
                            Describe Your Meal
                        </label>
                        <textarea
                            id="mealDescription"
                            value={mealDescription}
                            onChange={(e) => setMealDescription(e.target.value)}
                            required
                            rows={4}
                            placeholder="e.g., A bowl of oatmeal with blueberries and a glass of milk"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="bg-gray-700 border border-gray-600 p-4 rounded-md">
                        <h4 className="font-bold text-lg mb-2 text-white">{analyzedMeal.mealName}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-300">
                                <span className="font-medium text-blue-400">Calories:</span> {analyzedMeal.calories} kcal
                            </div>
                            <div className="text-gray-300">
                                <span className="font-medium text-green-400">Protein:</span> {analyzedMeal.protein}g
                            </div>
                            <div className="text-gray-300">
                                <span className="font-medium text-yellow-400">Fats:</span> {analyzedMeal.fats}g
                            </div>
                            <div className="text-gray-300">
                                <span className="font-medium text-purple-400">Carbs:</span> {analyzedMeal.carbs}g
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Saving...' : 'Save Meal'}
                        </button>
                        <button
                            onClick={() => setAnalyzedMeal(null)}
                            disabled={loading}
                            className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
