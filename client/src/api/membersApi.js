const API_BASE = process.env.REACT_APP_API_URL

export const getMembers = async (affiliateId) => {

    const token = localStorage.getItem("token");


    try {
        const response = await fetch(`${API_BASE}/members?affiliateId=${affiliateId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"}
            });
        return await response.json();
    } catch (error) {
        console.error("Error fetching members:", error);
    }
};

export const searchUsers = async (query) => {

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/search-users?q=${query}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error searching users:", error);
    }
};

export const getMemberInfo = async (userId, affiliateId) => {

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/member-info?userId=${userId}&affiliateId=${affiliateId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching member info:", error);
    }
};

export const addMember = async (userId, affiliateId) => {

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/add-member`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" },
            body: JSON.stringify({ userId, affiliateId }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error adding member:", error);
    }
};

export const addCredit = async (userId, amount) => {

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/add-credit`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" },
            body: JSON.stringify({ userId, amount }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error adding credit:", error);
    }
};

export const getOwnerAffiliateId = async () => {

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/api/owner-affiliate`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching owner affiliate ID:", error);
    }
}

// Search users by name
export const searchUsersByName = async (query) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/trainer/search-users?q=${query}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
};

// Get family members for a user
export const getFamilyMembers = async (userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE}/trainer/family-members?userId=${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching family members:", error);
        return [];
    }
};

// Get plans for a specific user or family member
export const getMemberPlans = async (userId, affiliateId, memberType = 'user', familyMemberId = null) => {
    const token = localStorage.getItem("token");
    try {
        let url = `${API_BASE}/trainer/member-plans?userId=${userId}&affiliateId=${affiliateId}`;

        if (memberType === 'familyMember' && familyMemberId) {
            url += `&memberType=familyMember&familyMemberId=${familyMemberId}`;
        }

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch plans: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching member plans:", error);
        return { plans: [] };
    }
};