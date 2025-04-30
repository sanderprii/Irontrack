import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL

export const getMembers = async (affiliateId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${API_BASE}/members`, {
            params: {
                affiliateId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching members:", error);
    }
};

export const searchUsers = async (query) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${API_BASE}/search-users`, {
            params: {
                q: query
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
    }
};

export const getMemberInfo = async (userId, affiliateId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${API_BASE}/member-info`, {
            params: {
                userId,
                affiliateId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching member info:", error);
    }
};

export const addMember = async (userId, affiliateId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post(`${API_BASE}/add-member`,
            { userId, affiliateId },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        console.error("Error adding member:", error);
    }
};

export const addCredit = async (userId, amount) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post(`${API_BASE}/add-credit`,
            { userId, amount },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        console.error("Error adding credit:", error);
    }
};

export const getOwnerAffiliateId = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${API_BASE}/api/owner-affiliate`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching owner affiliate ID:", error);
    }
};

// Search users by name
export const searchUsersByName = async (query) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${API_BASE}/trainer/search-users`, {
            params: {
                q: query
            },
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
        const response = await axios.get(`${API_BASE}/trainer/family-members`, {
            params: {
                userId
            },
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

// Get plans for a specific user or family member
export const getMemberPlans = async (userId, affiliateId, memberType = 'user', familyMemberId = null) => {
    const token = localStorage.getItem("token");

    try {
        const params = {
            userId,
            affiliateId
        };

        if (memberType === 'familyMember' && familyMemberId) {
            params.memberType = 'familyMember';
            params.familyMemberId = familyMemberId;
        }

        const response = await axios.get(`${API_BASE}/trainer/member-plans`, {
            params,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching member plans:", error);
        return { plans: [] };
    }
};