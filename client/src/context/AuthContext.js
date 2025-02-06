import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
    });

    // LocalStorage sünk
    useEffect(() => {
        if (authState.token) {
            localStorage.setItem('token', authState.token);
        } else {
            localStorage.removeItem('token');
        }
        if (authState.role) {
            localStorage.setItem('role', authState.role);
        } else {
            localStorage.removeItem('role');
        }
    }, [authState]);

    const isLoggedIn = !!authState.token;

    const setToken = (token) => {
        setAuthState((prev) => ({ ...prev, token }));
    };

    const setRole = (role) => {
        setAuthState((prev) => ({ ...prev, role }));
    };

    // NB! võtab `navigate` argumendina
    const logout = (navigate) => {
        setAuthState({ token: null, role: null });
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        // suuna avalehele (või kuhu vaja)
        if (navigate) {
            navigate('/HomePage');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token: authState.token,
                role: authState.role,
                isLoggedIn,
                setToken,
                setRole,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
