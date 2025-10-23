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

                    <div className="mt-4">
                        <h5 className="font-medium mb-2 text-gray-200">Meals ({selectedDayData.meals.length}):</h5>
                        <ul className="space-y-2">
                            {selectedDayData.meals.map((meal, index) => (
                                <li key={index} className="text-sm p-2 bg-gray-700 rounded flex justify-between items-center">
                                    <span className="font-medium text-white">{meal.mealName}</span>
                                    <span className="text-xs text-gray-400">
                                        {meal.isAIcalculated && '🤖 AI'} {meal.calories} kcal
                                    </span>
                                </li>
                            ))}
                        </ul>
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
                <div className="bg-gray-700 p-6 rounded-lg text-center text-gray-400">
                    No meals logged for this day.
                </div>
            )}
        </div>
    );
}
