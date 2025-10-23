'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserRequirements, saveRequirements } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

export default function RequirementsForm({ onSave }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [requirements, setRequirements] = useState({
        targetCalories: '',
        targetProtein: '',
        targetFats: '',
        targetCarbs: ''
    });

    const loadRequirements = useCallback(async () => {
        try {
            const data = await getUserRequirements(user.$id);
            if (data) {
                setRequirements({
                    targetCalories: data.targetCalories || '',
                    targetProtein: data.targetProtein || '',
                    targetFats: data.targetFats || '',
                    targetCarbs: data.targetCarbs || ''
                });
            }
        } catch (err) {
            console.error('Failed to load requirements:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadRequirements();
        }
    }, [user, loadRequirements]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await saveRequirements(user.$id, {
                targetCalories: Number(requirements.targetCalories),
                targetProtein: Number(requirements.targetProtein),
                targetFats: Number(requirements.targetFats),
                targetCarbs: Number(requirements.targetCarbs)
            });
            setSuccess('Daily targets saved successfully!');
            if (onSave) onSave();
        } catch (err) {
            setError(err.message || 'Failed to save targets');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="text-center py-4 text-gray-400">Loading...</div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Daily Nutrient Targets</h2>
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-700 text-green-200 rounded">
                    {success}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="targetCalories" className="block text-sm font-medium mb-1 text-gray-300">
                        Target Calories (kcal)
                    </label>
                    <input
                        id="targetCalories"
                        type="number"
                        value={requirements.targetCalories}
                        onChange={(e) => setRequirements({ ...requirements, targetCalories: e.target.value })}
                        required
                        min="0"
                        step="1"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="targetProtein" className="block text-sm font-medium mb-1 text-gray-300">
                        Target Protein (g)
                    </label>
                    <input
                        id="targetProtein"
                        type="number"
                        value={requirements.targetProtein}
                        onChange={(e) => setRequirements({ ...requirements, targetProtein: e.target.value })}
                        required
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="targetFats" className="block text-sm font-medium mb-1 text-gray-300">
                        Target Fats (g)
                    </label>
                    <input
                        id="targetFats"
                        type="number"
                        value={requirements.targetFats}
                        onChange={(e) => setRequirements({ ...requirements, targetFats: e.target.value })}
                        required
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="targetCarbs" className="block text-sm font-medium mb-1 text-gray-300">
                        Target Carbohydrates (g)
                    </label>
                    <input
                        id="targetCarbs"
                        type="number"
                        value={requirements.targetCarbs}
                        onChange={(e) => setRequirements({ ...requirements, targetCarbs: e.target.value })}
                        required
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                >
                    {saving ? 'Saving...' : 'Save Targets'}
                </button>
            </form>
        </div>
    );
}
