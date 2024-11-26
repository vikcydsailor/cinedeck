import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosBackend";
import PageHeader from '../components/page-header/PageHeader';
import '../assets/css/editProfile.scss';

function EditProfile() {
    const { user } = useContext(AuthContext);
    const history = useHistory();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const category = 'Edit Profile';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedProfile = JSON.parse(localStorage.getItem("user"));
                if (storedProfile) {
                    setName(storedProfile.name);
                    setEmail(storedProfile.email);
                } else if (user) {
                    await api.get('/sanctum/csrf-cookie');
                    const response = await api.get("/api/profile", {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    const profileData = response.data;
                    setName(profileData.name);
                    setEmail(profileData.email);
                }
            } catch (error) {
                console.error("Failed to load profile data:", error);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                "/api/edit-profile",
                { name, email },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Update the profile data in local storage
            const updatedProfile = { ...user, name, email };
            localStorage.setItem("user", JSON.stringify(updatedProfile));
            alert("Profile updated successfully");
            // Redirect to profile page
            history.push("/profile");
        } catch (error) {
            console.error("Failed to save profile changes:", error);
        }
    };

    return (
        <>
            <PageHeader>{category}</PageHeader>
            <div className="container edit-profile-container">
                <div className="section mb-3 edit-profile-form">
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="save-button">Save Changes</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditProfile;
