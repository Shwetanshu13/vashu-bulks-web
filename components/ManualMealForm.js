'use client';

import { useState } from 'react';
import { logMeal } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

export default function ManualMealForm({ onSuccess }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [meal, setMeal] = useState({
        mealName: '',
        calories: '',
        protein: '',
        fats: '',
        carbs: '',
        date: new Date().toISOString().split('T')[0]
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await logMeal(user.$id, {
                mealName: meal.mealName,
                calories: Number(meal.calories),
                protein: Number(meal.protein),
                fats: Number(meal.fats),
                carbs: Number(meal.carbs),
                date: meal.date,
                isAIcalculated: false
            });

            // Reset form
            setMeal({
                mealName: '',
                calories: '',
                protein: '',
                fats: '',
                carbs: '',
                date: new Date().toISOString().split('T')[0]
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to log meal');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Manual Meal Entry</h3>
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                        Date
                    </label>
                    <input
                        id="date"
                        type="date"
                        value={meal.date}
                        onChange={(e) => setMeal({ ...meal, date: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="mealName" className="block text-sm font-medium mb-1">
                        Meal Name
                    </label>
                    <input
                        id="mealName"
                        type="text"
                        value={meal.mealName}
                        onChange={(e) => setMeal({ ...meal, mealName: e.target.value })}
                        required
                        placeholder="e.g., Breakfast - Oatmeal"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium mb-1">
                            Calories (kcal)
                        </label>
                        <input
                            id="calories"
                            type="number"
                            value={meal.calories}
                            onChange={(e) => setMeal({ ...meal, calories: e.target.value })}
                            required
                            min="0"
                            step="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="protein" className="block text-sm font-medium mb-1">
                            Protein (g)
                        </label>
                        <input
                            id="protein"
                            type="number"
                            value={meal.protein}
                            onChange={(e) => setMeal({ ...meal, protein: e.target.value })}
                            required
                            min="0"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="fats" className="block text-sm font-medium mb-1">
                            Fats (g)
                        </label>
                        <input
                            id="fats"
                            type="number"
                            value={meal.fats}
                            onChange={(e) => setMeal({ ...meal, fats: e.target.value })}
                            required
                            min="0"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="carbs" className="block text-sm font-medium mb-1">
                            Carbs (g)
                        </label>
                        <input
                            id="carbs"
                            type="number"
                            value={meal.carbs}
                            onChange={(e) => setMeal({ ...meal, carbs: e.target.value })}
                            required
                            min="0"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-300 transition"
                >
                    {loading ? 'Logging...' : 'Log Meal'}
                </button>
            </form>
        </div>
    );
}
