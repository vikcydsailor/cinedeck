import { createContext, useState, useEffect } from "react";
import api from "../api/axiosBackend";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            // Fetch user profile with token
            fetchUserProfile(token);
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            console.log('Fetching user profile from authcontext');
            await api.get('/sanctum/csrf-cookie');
            const response = await api.get("/api/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = response.data;

            // Store user data and token separately in localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);

            // Update the user state with fetched profile
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            logout(); // Remove token and user data if fetching profile fails
        }
    };

    const login = (token) => {
        localStorage.setItem("token", token);
        fetchUserProfile(token); // Fetch and set user profile on login
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
