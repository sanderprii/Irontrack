import axios from 'axios';
import { toast } from 'react-toastify';

// Globaalne flag, mis jälgib rate limiti olekut
window.isRateLimited = false;

// Lisa see funktsioon window objekti külge
window.showRateLimitToast = function() {
    // Kutsu toast siin välja
    if (typeof toast === 'function') {
        toast.error('Rate limit exceeded! Please wait a few minutes before continuing.', {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }
};


// Globaalne funktsioon teate näitamiseks
window.showRateLimitMessage = function() {
    if (!window.isRateLimited) {
        window.isRateLimited = true;
        // Salvesta localStorage
        try {
            const limitExpires = new Date(Date.now() + 60000);
            localStorage.setItem('rateLimitedUntil', limitExpires.toISOString());

        } catch (err) {
            console.error('Failed to save to localStorage:', err);
        }

        checkRateLimit();


        // Kutsu toast notification
        window.showRateLimitToast();

        // Lähtesta pärast 60 sekundit
        setTimeout(function() {

            window.isRateLimited = false;
            localStorage.removeItem('rateLimitedUntil');
        }, 60000);
    }
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';





const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});



// Lihtsustatud interceptor kasutades globaalset meetodit
api.interceptors.response.use(
    response => {

        return response;
    },
    error => {
        console.log('❌ Error in request:', error.message);

        // Check for 429 status
        if (error.response && error.response.status === 429) {

            // Use setTimeout to ensure this runs after current execution
            setTimeout(() => window.showRateLimitMessage(), 0);
        }

        return Promise.reject(error);
    }
);

// Enhanced rate limit check function
export const checkRateLimit = () => {
    console.group('🔍 Checking Rate Limit State');
    try {
        // Loe localStorage väärtus
        const rateLimitedUntil = localStorage.getItem('rateLimitedUntil');


        if (!rateLimitedUntil) {

            window.isRateLimited = false;
            console.groupEnd();
            return null;
        }

        // Kontrolli kas aegumistähtaeg on tulevikus
        const limitExpires = new Date(rateLimitedUntil);
        const now = new Date();


        if (limitExpires > now) {
            // Arvuta järelejäänud aeg
            const remainingMinutes = Math.ceil((limitExpires - now) / 1000 / 60);


            // Update our global tracking variable
            window.isRateLimited = true;

            console.groupEnd();
            return {
                limited: true,
                remainingMinutes,
                expiresAt: limitExpires
            };
        }

        // Limiit on aegunud, puhasta localStorage

        localStorage.removeItem('rateLimitedUntil');
        window.isRateLimited = false;
        console.groupEnd();
        return null;
    } catch (error) {
        console.error('Error checking rate limit:', error);
        console.groupEnd();
        return null;
    }
};

// Ülekirjuta XMLHttpRequest, et püüda kõik 429 vead kinni
(function() {

    const originalXHR = window.XMLHttpRequest;

    function newXHR() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;

        xhr.addEventListener('load', function() {
            if (xhr.status === 429) {

                window.showRateLimitMessage();
            }
        });

        return xhr;
    }

    window.XMLHttpRequest = newXHR;
})();



// Ka siin lisa väga nähtav logi
window.addEventListener('load', () => {


    // Check rate limit on load
    checkRateLimit();
});

export default api;