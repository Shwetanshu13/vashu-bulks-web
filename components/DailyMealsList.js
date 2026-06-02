'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMealsByDate, updateMeal, deleteMeal } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

export default function DailyMealsList({ selectedDate, onMealDeleted }) {
    const { user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        calories: 0,
        protein: 0,
        fats: 0,
        carbs: 0
    });

    const [editingMealId, setEditingMealId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const handleEditClick = (meal) => {
        setEditingMealId(meal.$id);
        setEditFormData({
            mealName: meal.mealName,
            calories: meal.calories.toString(),
            protein: meal.protein.toString(),
            fats: meal.fats.toString(),
            carbs: meal.carbs.toString(),
            date: meal.date
        });
    };

    const handleCancelEdit = () => {
        setEditingMealId(null);
        setEditFormData({});
    };

    const handleSaveEdit = async (mealId) => {
        try {
            await updateMeal(mealId, {
                mealName: editFormData.mealName,
                calories: parseInt(editFormData.calories) || 0,
                protein: parseFloat(editFormData.protein) || 0,
                fats: parseFloat(editFormData.fats) || 0,
                carbs: parseFloat(editFormData.carbs) || 0,
                date: editFormData.date
            });
            setEditingMealId(null);
            loadMeals();
        } catch (error) {
            console.error('Failed to update meal:', error);
            alert('Failed to update meal. Please try again.');
        }
    };

    const handleDelete = async (mealId) => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                await deleteMeal(mealId);
                loadMeals();
                if (onMealDeleted) onMealDeleted();
            } catch (error) {
                console.error('Failed to delete meal:', error);
                alert('Failed to delete meal. Please try again.');
            }
        }
    };

    const loadMeals = useCallback(async () => {
        setLoading(true);
        try {
            const dateString = selectedDate.toISOString().split('T')[0];
            const mealsData = await getMealsByDate(user.$id, dateString);
            setMeals(mealsData);

            // Calculate totals
            const totalsData = mealsData.reduce((acc, meal) => ({
                calories: acc.calories + (meal.calories || 0),
                protein: acc.protein + (meal.protein || 0),
                fats: acc.fats + (meal.fats || 0),
                carbs: acc.carbs + (meal.carbs || 0)
            }), { calories: 0, protein: 0, fats: 0, carbs: 0 });

            setTotals(totalsData);
        } catch (error) {
            console.error('Failed to load meals:', error);
        } finally {
            setLoading(false);
        }
    }, [user, selectedDate]);

    useEffect(() => {
        if (user && selectedDate) {
            loadMeals();
        }
    }, [user, selectedDate, loadMeals]);

    if (loading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="text-center text-gray-400">Loading meals...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                    {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </h3>
            </div>

            {/* Daily Totals Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-700 rounded-lg">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{totals.calories.toFixed(0)}</div>
                    <div className="text-xs text-gray-400">Calories</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{totals.protein.toFixed(1)}g</div>
                    <div className="text-xs text-gray-400">Protein</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{totals.fats.toFixed(1)}g</div>
                    <div className="text-xs text-gray-400">Fats</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{totals.carbs.toFixed(1)}g</div>
                    <div className="text-xs text-gray-400">Carbs</div>
                </div>
            </div>

            {/* Meals List */}
            {meals.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    No meals logged for this day.
                </div>
            ) : (
                <div className="space-y-3">
                    {meals.map((meal) => (
                        <div
                            key={meal.$id}
                            className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition"
                        >
                            {editingMealId === meal.$id ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Meal Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.mealName}
                                            onChange={(e) => setEditFormData({ ...editFormData, mealName: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Calories</label>
                                            <input
                                                type="number"
                                                value={editFormData.calories}
                                                onChange={(e) => setEditFormData({ ...editFormData, calories: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Protein (g)</label>
                                            <input
                                                type="number"
                                                value={editFormData.protein}
                                                onChange={(e) => setEditFormData({ ...editFormData, protein: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Fats (g)</label>
                                            <input
                                                type="number"
                                                value={editFormData.fats}
                                                onChange={(e) => setEditFormData({ ...editFormData, fats: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Carbs (g)</label>
                                            <input
                                                type="number"
                                                value={editFormData.carbs}
                                                onChange={(e) => setEditFormData({ ...editFormData, carbs: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSaveEdit(meal.$id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white flex items-center gap-2">
                                                {meal.mealName}
                                                {meal.isAIcalculated && (
                                                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                                                        🤖 AI
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-400">
                                                {new Date(meal.$createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(meal)}
                                                className="text-xs text-blue-400 hover:text-blue-300 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(meal.$id)}
                                                className="text-xs text-red-400 hover:text-red-300 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 text-sm">
                                        <div className="bg-gray-800 p-2 rounded text-center">
                                            <div className="font-bold text-blue-400">{meal.calories}</div>
                                            <div className="text-xs text-gray-400">kcal</div>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center">
                                            <div className="font-bold text-green-400">{meal.protein}g</div>
                                            <div className="text-xs text-gray-400">protein</div>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center">
                                            <div className="font-bold text-yellow-400">{meal.fats}g</div>
                                            <div className="text-xs text-gray-400">fats</div>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center">
                                            <div className="font-bold text-purple-400">{meal.carbs}g</div>
                                            <div className="text-xs text-gray-400">carbs</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
