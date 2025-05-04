import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const getClasses = async (affiliateId, date) => {

    const token = localStorage.getItem("token");
    try {
        if (!date || isNaN(new Date(date).getTime())) {
            console.error("❌ Invalid date received, using default today.");
            date = new Date();
        } else {
            date = new Date(date);
        }

        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const response = await axios.get(`${API_URL}/classes`, {
            params: {
                affiliateId,
                start: startOfWeek.toISOString(),
                end: endOfWeek.toISOString()
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching classes:", error);
        return [];
    }
};

export const getClassesForSubdomain = async (affiliateId, date) => {


    try {
        if (!date || isNaN(new Date(date).getTime())) {
            console.error("❌ Invalid date received, using default today.");
            date = new Date();
        } else {
            date = new Date(date);
        }

        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const response = await axios.get(`${API_URL}/classes/subdomain`, {
            params: {
                affiliateId,
                start: startOfWeek.toISOString(),
                end: endOfWeek.toISOString()
            },
            headers: {

                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching classes:", error);
        return [];
    }
};

export const createTraining = async (affiliateId, trainingData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/classes`, {
            affiliateId, // ✅ Lisa affiliateId
            trainingType: trainingData.trainingType || "", // ✅ Tagame, et väärtused ei ole undefined
            trainingName: trainingData.trainingName || "", // ✅ Tagame, et väärtused ei ole undefined
            duration: trainingData.duration || "",
            trainer: trainingData.trainer || "",
            memberCapacity: trainingData.memberCapacity || "",
            location: trainingData.location || "",
            repeatWeekly: trainingData.repeatWeekly || false,
            description: trainingData.description || "",
            time: trainingData.time || "",
            wodName: trainingData.wodName || "",
            wodType: trainingData.wodType || "",
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating training:", error);
    }
};

export const updateTraining = async (classId, trainingData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.put(`${API_URL}/classes/${classId}`, trainingData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error updating training:", error);
    }
};

export const deleteClass = async (classId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(`${API_URL}/classes/${classId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error deleting class:", error);
    }
};

export const getClassAttendeesCount = async (classId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/attendees/${classId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        const data = response.data;
        return data.count || 0; // ✅ Tagastame registreeritud osalejate arvu või 0
    } catch (error) {
        console.error("❌ Error fetching class attendees:", error);
        return 0; // ✅ Kui tekib viga, tagastame 0
    }
};

export const getClassAttendees = async (classId) => {
    try {
        const response = await axios.get(`${API_URL}/class-attendees`, {
            params: {
                classId
            },
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching class attendees:", error);
    }
};

export const checkInAttendee = async (classId, userId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.patch(`${API_URL}/class-attendees/check-in`,
            { classId, userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error checking in attendee:", error);
    }
};

export const deleteAttendee = async (classId, freeClass, userId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(`${API_URL}/class-attendees`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: { classId, freeClass, userId }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error deleting attendee:", error);
    }
};

export const registerForClass = async (classId, planId, affiliateId, freeClass, isFamilyMember, familyMemberId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/classes/register`,
            {
                classId,
                planId,
                affiliateId,
                freeClass,
                isFamilyMember,
                familyMemberId,
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error registering for class:", error);
        throw error;
    }
};

export const cancelRegistration = async (classId, freeClass) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/classes/cancel`,
            {
                classId,
                freeClass
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error cancelling registration:", error);
        throw error;
    }
};

export const getUserPlans = async (affiliateId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/plans`, {
            params: { affiliateId },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data; // eeldame, et API tagastab massiivi kasutaja plaanidest
    } catch (error) {
        console.error("Error fetching user plans:", error);
        return [];
    }
};

export const checkUserEnrollment = async (classId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/class/check-enrollment`, {
            params: { classId },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error checking enrollment:", error);
    }
};

export const getUserClassScore = async (classId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/classes/leaderboard/check`, {
            params: { classId },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
        // eeldame, et server tagastab: { hasScore: true/false, scoreType?: "...", score?: "..." }
    } catch (error) {
        console.error("Error checking user class score:", error);
        throw error;
    }
};

export const addClassScore = async (classData, scoreType, score) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/classes/leaderboard/add`,
            { classData, scoreType, score },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error adding class score:", error);
        throw error;
    }
};

export const updateClassScore = async (classData, scoreType, score) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.put(`${API_URL}/classes/leaderboard/update`,
            { classData, scoreType, score },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating class score:", error);
        throw error;
    }
};

export const getWaitlist = async (classId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/classes/waitlist`, {
            params: { classId },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching waitlist:", error);
    }
};

export const createWaitlist = async (classId, userPlanId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/classes/waitlist`,
            { classId, userPlanId },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error creating waitlist:", error);
    }
};

export const deleteWaitlist = async (classId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(`${API_URL}/classes/waitlist/remove`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: { classId }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error deleting waitlist:", error);
    }
};

// Get classes for a specific day
export const getClassesForDay = async (affiliateId, date) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/trainer/day/${affiliateId}/${date}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error getting classes for day:", error);
        throw error;
    }
};

// Assign trainer to multiple classes
export const assignTrainerToClasses = async (classIds, trainerName) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/trainer/assign-trainer`,
            {
                classIds,
                trainerName
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error assigning trainer to classes:", error);
        throw error;
    }
};

export const registerMemberForClass = async (classId, planId, affiliateId, memberInfo) => {
    try {
        const token = localStorage.getItem("token");

        // Determine if we're registering a user or a family member
        const payload = {
            classId,
            planId,
            affiliateId
        };

        if (memberInfo.type === 'familyMember') {
            payload.memberType = 'familyMember';
            payload.memberId = memberInfo.id;
        } else {
            payload.userId = memberInfo.id;
            payload.memberType = 'user';
        }

        const response = await axios.post(`${API_URL}/trainer/register-member`,
            payload,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error registering for class:", error);
        throw error;
    }
};

// Search users by name
export const searchUsersByName = async (query) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/trainer/search-users`, {
            params: { q: query },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
};

// Get family members for a user
export const getFamilyMembers = async (userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/trainer/family-members`, {
            params: { userId },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching family members:", error);
        return [];
    }
};

export const addClassToMyTrainings = async (classId, addCompetition) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/classes/add-training`,
            { classId, addCompetition },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error adding class to my trainings:", error);
    }
};