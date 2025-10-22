import { databases, DATABASE_ID, COLLECTIONS, ID } from './appwrite';
import { Query } from 'appwrite';

// Requirements Functions
export async function getUserRequirements(userId) {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.REQUIREMENTS,
            [Query.equal('userId', userId)]
        );
        return response.documents[0] || null;
    } catch (error) {
        console.error('Error getting user requirements:', error);
        throw error;
    }
}

export async function saveRequirements(userId, requirements) {
    try {
        const existing = await getUserRequirements(userId);

        if (existing) {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.REQUIREMENTS,
                existing.$id,
                requirements
            );
        } else {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.REQUIREMENTS,
                ID.unique(),
                { userId, ...requirements }
            );
        }
    } catch (error) {
        console.error('Error saving requirements:', error);
        throw error;
    }
}// Meals Functions
export async function logMeal(userId, mealData) {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.MEALS,
            ID.unique(),
            {
                userId,
                date: mealData.date || new Date().toISOString().split('T')[0],
                mealName: mealData.mealName,
                calories: mealData.calories,
                protein: mealData.protein,
                fats: mealData.fats,
                carbs: mealData.carbs,
                isAIcalculated: mealData.isAIcalculated || false
            }
        );
    } catch (error) {
        console.error('Error logging meal:', error);
        throw error;
    }
}

export async function getMealsByDate(userId, date) {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.MEALS,
            [
                Query.equal('userId', userId),
                Query.equal('date', date)
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error getting meals by date:', error);
        throw error;
    }
}

export async function getMealsByDateRange(userId, startDate, endDate) {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.MEALS,
            [
                Query.equal('userId', userId),
                Query.greaterThanEqual('date', startDate),
                Query.lessThanEqual('date', endDate),
                Query.limit(1000)
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error getting meals by date range:', error);
        throw error;
    }
}

export async function getAllUserMeals(userId) {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.MEALS,
            [
                Query.equal('userId', userId),
                Query.limit(1000)
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error getting all user meals:', error);
        throw error;
    }
}

// Aggregate meals by date
export function aggregateMealsByDate(meals) {
    const aggregated = {};

    meals.forEach(meal => {
        const date = meal.date;
        if (!aggregated[date]) {
            aggregated[date] = {
                date,
                calories: 0,
                protein: 0,
                fats: 0,
                carbs: 0,
                meals: []
            };
        }

        aggregated[date].calories += meal.calories || 0;
        aggregated[date].protein += meal.protein || 0;
        aggregated[date].fats += meal.fats || 0;
        aggregated[date].carbs += meal.carbs || 0;
        aggregated[date].meals.push(meal);
    });

    return aggregated;
}
