import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const debug = (message, data) => {
    console.log(`[API DEBUG] ${message}`, JSON.stringify(data, null, 2));
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    debug('REQUEST CONFIG', {
        url: config.url,
        method: config.method,
        headers: config.headers
    });
    return config;
});

// Global variable to track if we're already rate limited
// This helps us avoid excessive localStorage operations
let isCurrentlyRateLimited = false;

api.interceptors.response.use(
    response => {
        debug('RESPONSE SUCCESS', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.group('🚨 AXIOS INTERCEPTOR ERROR');
        console.error('Error:', error.message);

        // Don't try to handle if we're already rate limited
        if (isCurrentlyRateLimited) {
            console.log('Already rate limited, skipping additional processing');
            console.groupEnd();
            return Promise.reject(error);
        }

        // Check if this is a rate limit error
        if (error.response && error.response.status === 429) {
            console.log('🔒 Rate limit detected (429 status)');

            try {
                // Extract rate limit info from response data instead of headers
                // This works better with CORS restrictions
                const responseData = error.response.data;
                console.log('Rate limit response data:', responseData);

                // Get retry info from response data
                const retryAfter = responseData?.retryAfter || 1; // Default to 1 minute

                // Calculate expiry time - convert minutes to milliseconds
                const limitExpires = new Date(Date.now() + retryAfter * 60 * 1000);

                // Save to localStorage
                localStorage.setItem('rateLimitedUntil', limitExpires.toISOString());
                console.log('Rate limit saved until:', limitExpires.toISOString());

                // Set our global tracking variable
                isCurrentlyRateLimited = true;

                // Show toast notification with detailed info
                toast.error(
                    <div>
                        <h4>⏳ Päringute limiit ületatud</h4>
                        <p>Palun oodake {retryAfter} minutit enne uute päringute tegemist.</p>
                        <p>Taastub: {limitExpires.toLocaleTimeString()}</p>
                    </div>,
                    {
                        position: "top-right",
                        autoClose: 10000,
                        closeOnClick: true,
                        pauseOnHover: true
                    }
                );

                // Set a timeout to clear the rate limit after it expires
                setTimeout(() => {
                    console.log('Rate limit timeout expired, clearing state');
                    isCurrentlyRateLimited = false;
                    localStorage.removeItem('rateLimitedUntil');
                }, retryAfter * 60 * 1000);
            } catch (storageError) {
                console.error('Error saving rate limit info:', storageError);
            }
        }

        console.groupEnd();
        return Promise.reject(error);
    }
);

// Enhanced rate limit check function
export const checkRateLimit = () => {
    try {
        const rateLimitedUntil = localStorage.getItem('rateLimitedUntil');
        console.log('Checking rate limit, stored value:', rateLimitedUntil);

        if (!rateLimitedUntil) {
            isCurrentlyRateLimited = false;
            return null;
        }

        const limitExpires = new Date(rateLimitedUntil);
        const now = new Date();

        if (limitExpires > now) {
            const remainingMinutes = Math.ceil((limitExpires - now) / 1000 / 60);
            console.log('Rate limit is active, remaining minutes:', remainingMinutes);

            // Update our global tracking variable
            isCurrentlyRateLimited = true;

            return {
                limited: true,
                remainingMinutes,
                expiresAt: limitExpires
            };
        }

        // Limit has expired, clean up localStorage
        console.log('Rate limit has expired, removing from localStorage');
        localStorage.removeItem('rateLimitedUntil');
        isCurrentlyRateLimited = false;
        return null;
    } catch (error) {
        console.error('Error checking rate limit:', error);
        return null;
    }
};

export default api;