// UserData.js
import api from './axiosBackend';

export const getUserPreferences = async () => {
    try {
        const response = await api.get('/api/recommendation-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return null;
    }
};

export const getWatchHistory = async () => {
    try {
        const response = await api.get('/api/watch-history');
        return response.data;
    } catch (error) {
        console.error("Error fetching watch history:", error);
    }
};

export const getRecommendations = async (userId, type, category) => {
    try {
        const response = await api.get(`/api/recommendations/${userId}/${type}/${category}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching watch history:", error);
    }
}


