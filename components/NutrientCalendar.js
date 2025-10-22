'use client';

import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, refresh]);

    useEffect(() => {
        updateSelectedDayData();
    }, [selectedDate, mealData]);

    async function loadData() {
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
    }

    function updateSelectedDayData() {
        const dateString = selectedDate.toISOString().split('T')[0];
        setSelectedDayData(mealData[dateString] || null);
    }

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
        return <div className="text-center py-8">Loading calendar...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Nutrient Calendar</h3>

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
                        <div className="w-4 h-4 bg-green-200 border border-green-400"></div>
                        <span>Target Met</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-200 border border-blue-400"></div>
                        <span>Surplus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-200 border border-orange-400"></div>
                        <span>Deficit</span>
                    </div>
                </div>
            </div>

            {selectedDayData && requirements && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold mb-4">
                        {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h4>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Calories:</span>
                            <div className="text-right">
                                <div className="font-bold">{selectedDayData.calories.toFixed(0)} kcal</div>
                                <div className="text-sm text-gray-600">
                                    Target: {requirements.targetCalories}
                                    <span className={selectedDayData.calories >= requirements.targetCalories ? 'text-blue-600' : 'text-orange-600'}>
                                        {' '}({calculateDifference(selectedDayData.calories, requirements.targetCalories)})
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Protein:</span>
                            <div className="text-right">
                                <div className="font-bold">{selectedDayData.protein.toFixed(1)}g</div>
                                <div className="text-sm text-gray-600">
                                    Target: {requirements.targetProtein}g
                                    <span className={selectedDayData.protein >= requirements.targetProtein ? 'text-blue-600' : 'text-orange-600'}>
                                        {' '}({calculateDifference(selectedDayData.protein, requirements.targetProtein)}g)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Fats:</span>
                            <div className="text-right">
                                <div className="font-bold">{selectedDayData.fats.toFixed(1)}g</div>
                                <div className="text-sm text-gray-600">
                                    Target: {requirements.targetFats}g
                                    <span className={selectedDayData.fats >= requirements.targetFats ? 'text-blue-600' : 'text-orange-600'}>
                                        {' '}({calculateDifference(selectedDayData.fats, requirements.targetFats)}g)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Carbs:</span>
                            <div className="text-right">
                                <div className="font-bold">{selectedDayData.carbs.toFixed(1)}g</div>
                                <div className="text-sm text-gray-600">
                                    Target: {requirements.targetCarbs}g
                                    <span className={selectedDayData.carbs >= requirements.targetCarbs ? 'text-blue-600' : 'text-orange-600'}>
                                        {' '}({calculateDifference(selectedDayData.carbs, requirements.targetCarbs)}g)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h5 className="font-medium mb-2">Meals ({selectedDayData.meals.length}):</h5>
                        <ul className="space-y-2">
                            {selectedDayData.meals.map((meal, index) => (
                                <li key={index} className="text-sm p-2 bg-blue-50 rounded flex justify-between items-center">
                                    <span className="font-medium">{meal.mealName}</span>
                                    <span className="text-xs text-gray-600">
                                        {meal.isAIcalculated && '🤖 AI'} {meal.calories} kcal
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {selectedDayData && !requirements && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                        Set your daily nutrient targets to see deficit/surplus information.
                    </p>
                </div>
            )}

            {!selectedDayData && (
                <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
                    No meals logged for this day.
                </div>
            )}
        </div>
    );
}
