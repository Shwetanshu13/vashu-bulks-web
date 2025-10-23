'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import RequirementsForm from '@/components/RequirementsForm';
import ManualMealForm from '@/components/ManualMealForm';
import AIMealForm from '@/components/AIMealForm';
import NutrientCalendar from '@/components/NutrientCalendar';
import DailyMealsList from '@/components/DailyMealsList';

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('meals');
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());

    async function handleLogout() {
        await signOut();
        router.push('/auth');
    }

    function handleMealLogged() {
        setRefreshKey(prev => prev + 1);
        setActiveTab('meals');
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-900">
                {/* Header */}
                <header className="bg-gray-800 shadow-lg border-b border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    🥗 Vashu Bulks
                                </h1>
                                <p className="text-sm text-gray-300">
                                    Welcome, {user?.name}!
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-700">
                        <nav className="flex gap-4 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('meals')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${activeTab === 'meals'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    }`}
                            >
                                📋 Today&apos;s Meals
                            </button>
                            <button
                                onClick={() => setActiveTab('calendar')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${activeTab === 'calendar'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    }`}
                            >
                                📅 Calendar
                            </button>
                            <button
                                onClick={() => setActiveTab('log-meal')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${activeTab === 'log-meal'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    }`}
                            >
                                ✏️ Log Meal
                            </button>
                            <button
                                onClick={() => setActiveTab('ai-meal')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${activeTab === 'ai-meal'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    }`}
                            >
                                🤖 AI Meal
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${activeTab === 'settings'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    }`}
                            >
                                ⚙️ Settings
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="grid gap-6">
                        {activeTab === 'meals' && (
                            <DailyMealsList selectedDate={selectedDate} key={refreshKey} />
                        )}

                        {activeTab === 'calendar' && (
                            <NutrientCalendar refresh={refreshKey} />
                        )}

                        {activeTab === 'log-meal' && (
                            <div className="max-w-2xl mx-auto w-full">
                                <ManualMealForm onSuccess={handleMealLogged} />
                            </div>
                        )}

                        {activeTab === 'ai-meal' && (
                            <div className="max-w-2xl mx-auto w-full">
                                <AIMealForm onSuccess={handleMealLogged} />
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl mx-auto w-full">
                                <RequirementsForm onSave={() => setRefreshKey(prev => prev + 1)} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
