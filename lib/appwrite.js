import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
    MEALS: process.env.NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID,
    REQUIREMENTS: process.env.NEXT_PUBLIC_APPWRITE_REQUIREMENTS_COLLECTION_ID,
};

export { ID } from 'appwrite';
