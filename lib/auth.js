import { account, ID } from './appwrite';

export async function createAccount(email, password, name) {
    try {
        const user = await account.create(ID.unique(), email, password, name);
        // Auto-login after signup
        await login(email, password);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function login(email, password) {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        return await account.deleteSession('current');
    } catch (error) {
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        return await account.get();
    } catch (error) {
        return null;
    }
}
