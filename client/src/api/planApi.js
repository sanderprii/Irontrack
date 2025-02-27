const API_URL = process.env.REACT_APP_API_URL

export const getPlans = async (affiliateId) => {
    try {

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plans`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching plans:", error);
        return [];
    }
};

export const createPlan = async (planData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plans`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json" },
            body: JSON.stringify(planData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating plan:", error);
    }
};

export const updatePlan = async (planId, planData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plans/${planId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" },
            body: JSON.stringify(planData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating plan:", error);
    }
};

export const deletePlan = async (planId) => {
    try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/plans/${planId}`, { method: "DELETE",
            headers: {
            "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" },


        });
    } catch (error) {
        console.error("Error deleting plan:", error);
    }
};

export const buyPlan = async (planData, currentAffiliateId, currentAppliedCredit, contract, currentMerchantReference) => {
    try {

        const data = { planData, currentAppliedCredit, contract, currentMerchantReference };
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plans/buy-plan/${currentAffiliateId}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await response.json();

    } catch (error) {
        console.error("Error buying plan:", error);

    }
}

export const getUserCredit = async ( affiliateId) => {
    try {

        const token = localStorage.getItem("token");
        // Näiteks fetch() või axios() abil andmed edastada
        const response = await fetch(`${API_URL}/plans/credit/${affiliateId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" },

        });

        if (!response.ok) {
            throw new Error('Failed to fetch credit');
        }
        const data = await response.json();
return data
    } catch (error) {
        console.error(error);
        // kuva error kasutajale
    }
}

export const updateUserPlan = async (planId, planData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plans/user/${planId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(planData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating plan:", error);
        return null;
    }
};

/**
 * Määrab kasutajale (UserPlan tabelisse) valitud plaani.
 * planId: number, userId: number
 */
export const assignPlanToUser = async (planId, userId, affiliateId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plans/assign`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ planId, userId, affiliateId }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error assigning plan to user:", error);
        return null;
    }
};

// In planApi.js or similar file
export const createMontonioPayment = async (
    planData,
    affiliateId,
    appliedCredit,
    contract,
    returnUrl, userData
) => {
    const finalAmount = Math.max(planData.price - appliedCredit, 0);

    // Only proceed with payment if there's an amount to pay
    if (finalAmount === 0) {
        return { is_fully_credited: true };
    }
const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/payments/montonio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                amount: finalAmount.toFixed(2),
                orderId: planData.id || Date.now(),
                description: planData.name,
                userData: userData,
                affiliateId,
                appliedCredit,
                contractId: contract?.id,

            }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Payment creation failed');
        }

        return {
            payment_url: data.paymentUrl,
            order_uuid: data.orderUuid
        };
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};
export const checkPaymentStatus = async (orderToken) => {
    try {

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/payments/montonio/status?token=${orderToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        return await response.json();
    } catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
};