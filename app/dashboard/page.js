'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import RequirementsForm from '@/components/RequirementsForm';
import ManualMealForm from '@/components/ManualMealForm';
import AIMealForm from '@/components/AIMealForm';
import NutrientCalendar from '@/components/NutrientCalendar';

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('calendar');
    const [refreshKey, setRefreshKey] = useState(0);

    async function handleLogout() {
        await signOut();
        router.push('/auth');
    }

    function handleMealLogged() {
        setRefreshKey(prev => prev + 1);
        setActiveTab('calendar');
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    🥗 Nutrient Tracker
                                </h1>
                                <p className="text-sm text-gray-600">
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
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('calendar')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'calendar'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                📅 Calendar
                            </button>
                            <button
                                onClick={() => setActiveTab('log-meal')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'log-meal'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                ✏️ Log Meal
                            </button>
                            <button
                                onClick={() => setActiveTab('ai-meal')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'ai-meal'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                🤖 AI Meal
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'settings'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                ⚙️ Settings
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="grid gap-6">
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
