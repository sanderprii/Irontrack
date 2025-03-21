// src/api/trainingPlanApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Get all training plans (either created by or assigned to the current user)
export const getTrainingPlans = async () => {
    try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        const response = await axios.get(`${API_URL}/training-plans`, {
            headers: {
                Authorization: `Bearer ${token}`,

            },
            params: {
                role: role
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching training plans:', error);
        throw error;
    }
};

// Get a specific training plan by ID
export const getTrainingPlanById = async (planId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/training-plans/${planId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching training plan:', error);
        throw error;
    }
};

// Create a new training plan
export const createTrainingPlan = async (trainingPlanData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/training-plans`, trainingPlanData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating training plan:', error);
        throw error;
    }
};

// Update an existing training plan
export const updateTrainingPlan = async (planId, trainingPlanData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/training-plans/${planId}`, trainingPlanData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating training plan:', error);
        throw error;
    }
};

// Delete a training plan
export const deleteTrainingPlan = async (planId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/training-plans/${planId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting training plan:', error);
        throw error;
    }
};

// Add a comment to a training day
export const addCommentToTrainingDay = async (dayId, content) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/training-plans/days/${dayId}/comments`,
            { content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

// Mark a sector as complete or incomplete
export const updateSectorCompletion = async (sectorId, completed) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/training-plans/sectors/${sectorId}/complete`,
            { completed },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating sector completion:', error);
        throw error;
    }
};

// Add a sector to the user's trainings
export const addSectorToTraining = async (sectorId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/training-plans/sectors/${sectorId}/add-to-training`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding sector to training:', error);
        throw error;
    }
};