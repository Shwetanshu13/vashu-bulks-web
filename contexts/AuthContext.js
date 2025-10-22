'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, createAccount } from '@/lib/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function signIn(email, password) {
        await login(email, password);
        await checkUser();
    }

    async function signUp(email, password, name) {
        await createAccount(email, password, name);
        await checkUser();
    }

    async function signOut() {
        await logout();
        setUser(null);
    }

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
