const API_BASE = process.env.REACT_APP_API_URL;

export const getContracts = async (search = '', sortBy = 'createdAt', sortOrder = 'desc', affiliateId) => {
    const token = localStorage.getItem('token');


    try {
        const resp = await fetch(
            `${API_BASE}/contracts?search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}&affiliateId=${affiliateId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return await resp.json();
    } catch (err) {
        console.error('Error getContracts:', err);
        return [];
    }
};

export const getContractById = async (contractId) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/${contractId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return await resp.json();
    } catch (err) {
        console.error('Error getContractById:', err);
    }
};

export const createContract = async (payload) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
        return await resp.json();
    } catch (err) {
        console.error('Error createContract:', err);
    }
};

// Function to update contract status
export const updateContract = async (contractId, data) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/contracts/${contractId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Error updating contract:", error);
        throw error;
    }
};

export const deleteContract = async (contractId) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/${contractId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return await resp.json();
    } catch (err) {
        console.error('Error deleteContract:', err);
    }
};

export const createContractTemplate = async (content, affiliateId) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/template`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, affiliateId }),
        });
        return await resp.json();
    } catch (err) {
        console.error('Error createContractTemplate:', err);
    }
};

export const getLatestContractTemplate = async (affiliateId) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/template/latest?affiliateId=${affiliateId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return await resp.json();
    } catch (err) {
        console.error('Error getLatestContractTemplate:', err);
    }
};

// GET user contracts
export const getUserContracts = async (userId, affiliateId) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/user/${userId}?affiliateId=${affiliateId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await resp.json();
    } catch (error) {
        console.error('Error getUserContracts:', error);
        return [];
    }
};

// Accept contract
export const acceptContract = async (contractId, data) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/contracts/${contractId}/accept`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error accepting contract');
        }

        return await response.json();
    } catch (error) {
        console.error("Error accepting contract:", error);
        throw error;
    }
};

// Get contract terms by ID
export const getContractTermsById = async (termsType) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/terms/${termsType}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await resp.json();
    } catch (error) {
        console.error('Error getContractTermsById:', error);
    }
};

export const createPaymentHoliday = async (payload) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/${payload.contractId}/payment-holiday`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
        return await resp.json();
    } catch (error) {
        console.error('Error createPaymentHoliday:', error);
    }
}

export const updatePaymentHoliday = async (phId, payload) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/${phId}/update-payment-holiday`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
        return await resp.json();
    } catch (error) {
        console.error('Error updatePaymentHoliday:', error);
    }
}

export const getUnpaidUsers = async (affiliateId) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/unpaid?affiliateId=${affiliateId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await resp.json();
    } catch (error) {
        console.error('Error getUnpaidUsers:', error);
        return [];
    }
};

export const updateUnpaidUser = async (transactionId) => {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(`${API_BASE}/contracts/unpaid/${transactionId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },

        });
        return await resp.json();
    } catch (error) {
        console.error('Error updateUnpaidUser:', error);
    }
}