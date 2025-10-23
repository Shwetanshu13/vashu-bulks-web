'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAllUserMeals, aggregateMealsByDate, getUserRequirements } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

export default function NutrientCalendar({ refresh }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealData, setMealData] = useState({});
    const [requirements, setRequirements] = useState(null);
    const [selectedDayData, setSelectedDayData] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [meals, reqs] = await Promise.all([
                getAllUserMeals(user.$id),
                getUserRequirements(user.$id)
            ]);

            const aggregated = aggregateMealsByDate(meals);
            setMealData(aggregated);
            setRequirements(reqs);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateSelectedDayData = useCallback(() => {
        const dateString = selectedDate.toISOString().split('T')[0];
        setSelectedDayData(mealData[dateString] || null);
    }, [selectedDate, mealData]);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, loadData, refresh]);

    useEffect(() => {
        updateSelectedDayData();
    }, [updateSelectedDayData]);

    function getTileClassName({ date }) {
        const dateString = date.toISOString().split('T')[0];
        const dayData = mealData[dateString];

        if (!dayData || !requirements) return '';

        const caloriesDiff = dayData.calories - requirements.targetCalories;
        const tolerance = requirements.targetCalories * 0.1; // 10% tolerance

        if (Math.abs(caloriesDiff) <= tolerance) {
            return 'calendar-day-met';
        } else if (caloriesDiff > 0) {
            return 'calendar-day-surplus';
        } else {
            return 'calendar-day-deficit';
        }
    }

    function calculateDifference(actual, target) {
        const diff = actual - target;
        const sign = diff >= 0 ? '+' : '';
        return `${sign}${diff.toFixed(1)}`;
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-400">Loading calendar...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-white">Nutrient Calendar</h3>

                <div className="mb-4">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileClassName={getTileClassName}
                        className="w-full border-none"
                        maxDate={new Date()}
                        tileDisabled={({ date }) => date > new Date()}
                    />
                </div>

                <div className="flex gap-4 text-xs justify-center flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-700 border border-green-500"></div>
                        <span className="text-gray-300">Target Met</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-700 border border-blue-500"></div>
                        <span className="text-gray-300">Surplus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-700 border border-orange-500"></div>
                        <span className="text-gray-300">Deficit</span>
                    </div>
                </div>
            </div>

            {selectedDayData && requirements && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                    <h4 className="text-lg font-bold mb-4 text-white">
                        {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h4>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                            <span className="font-medium text-gray-200">Calories:</span>
                            <div className="text-right">
                                <div className="font-bold text-white">{selectedDayData.calories.toFixed(0)} kcal</div>
                                <div className="text-sm text-gray-400">
                                    Target: {requirements.targetCalories}
                                    <span className={selectedDayData.calories >= requirements.targetCalories ? 'text-blue-400' : 'text-orange-400'}>
                                        {' '}({calculateDifference(selectedDayData.calories, requirements.targetCalories)})
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                            <span className="font-medium text-gray-200">Protein:</span>
                            <div className="text-right">
                                <div className="font-bold text-white">{selectedDayData.protein.toFixed(1)}g</div>
                                <div className="text-sm text-gray-400">
                                    Target: {requirements.targetProtein}g
                                    <span className={selectedDayData.protein >= requirements.targetProtein ? 'text-blue-400' : 'text-orange-400'}>
                                        {' '}({calculateDifference(selectedDayData.protein, requirements.targetProtein)}g)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                            <span className="font-medium text-gray-200">Fats:</span>
                            <div className="text-right">
                                <div className="font-bold text-white">{selectedDayData.fats.toFixed(1)}g</div>
                                <div className="text-sm text-gray-400">
                                    Target: {requirements.targetFats}g
                                    <span className={selectedDayData.fats >= requirements.targetFats ? 'text-blue-400' : 'text-orange-400'}>
                                        {' '}({calculateDifference(selectedDayData.fats, requirements.targetFats)}g)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                            <span className="font-medium text-gray-200">Carbs:</span>
                            <div className="text-right">
                                <div className="font-bold text-white">{selectedDayData.carbs.toFixed(1)}g</div>
                                <div className="text-sm text-gray-400">
                                    Target: {requirements.targetCarbs}g
                                    <span className={selectedDayData.carbs >= requirements.targetCarbs ? 'text-blue-400' : 'text-orange-400'}>
                                        {' '}({calculateDifference(selectedDayData.carbs, requirements.targetCarbs)}g)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h5 className="font-semibold mb-3 text-lg text-white border-b border-gray-600 pb-2">
                            Meals for this day ({selectedDayData.meals.length})
                        </h5>
                        {selectedDayData.meals.length > 0 ? (
                            <div className="space-y-3">
                                {selectedDayData.meals.map((meal, index) => (
                                    <div key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <h6 className="font-semibold text-white text-base">{meal.mealName}</h6>
                                            {meal.isAIcalculated && (
                                                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                                                    🤖 AI Calculated
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <div className="bg-gray-800 p-2 rounded text-center">
                                                <div className="text-xs text-gray-400 mb-1">Calories</div>
                                                <div className="font-bold text-blue-400">{meal.calories}</div>
                                                <div className="text-xs text-gray-500">kcal</div>
                                            </div>
                                            <div className="bg-gray-800 p-2 rounded text-center">
                                                <div className="text-xs text-gray-400 mb-1">Protein</div>
                                                <div className="font-bold text-green-400">{meal.protein}g</div>
                                                <div className="text-xs text-gray-500">grams</div>
                                            </div>
                                            <div className="bg-gray-800 p-2 rounded text-center">
                                                <div className="text-xs text-gray-400 mb-1">Fats</div>
                                                <div className="font-bold text-yellow-400">{meal.fats}g</div>
                                                <div className="text-xs text-gray-500">grams</div>
                                            </div>
                                            <div className="bg-gray-800 p-2 rounded text-center">
                                                <div className="text-xs text-gray-400 mb-1">Carbs</div>
                                                <div className="font-bold text-orange-400">{meal.carbs}g</div>
                                                <div className="text-xs text-gray-500">grams</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                No meals logged for this day
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedDayData && !requirements && (
                <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700">
                    <p className="text-yellow-300">
                        Set your daily nutrient targets to see deficit/surplus information.
                    </p>
                </div>
            )}

            {!selectedDayData && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                    <div className="text-center py-8">
                        <div className="text-4xl mb-3">📅</div>
                        <h4 className="text-lg font-semibold mb-2 text-white">
                            {selectedDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h4>
                        <p className="text-gray-400">No meals logged for this day</p>
                        <p className="text-sm text-gray-500 mt-2">Start tracking your nutrition to see data here!</p>
                    </div>
                </div>
            )}
        </div>
    );
}
