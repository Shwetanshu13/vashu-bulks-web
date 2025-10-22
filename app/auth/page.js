'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    async function handleLogin(email, password) {
        await signIn(email, password);
        router.push('/dashboard');
    }

    async function handleSignup(email, password, name) {
        await signUp(email, password, name);
        router.push('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🥗 Nutrient Tracker</h1>
                    <p className="text-gray-600">Track your nutrition with AI assistance</p>
                </div>

                {isLogin ? (
                    <LoginForm
                        onSuccess={handleLogin}
                        onSwitchToSignup={() => setIsLogin(false)}
                    />
                ) : (
                    <SignupForm
                        onSuccess={handleSignup}
                        onSwitchToLogin={() => setIsLogin(true)}
                    />
                )}
            </div>
        </div>
    );
}
