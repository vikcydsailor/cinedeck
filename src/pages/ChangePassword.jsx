import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosBackend";
import PageHeader from '../components/page-header/PageHeader';
import '../assets/css/changePassword.scss';

function ChangePassword() {
    const { user } = useContext(AuthContext);
    const history = useHistory();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const category = 'Change Password';

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            await api.put(
                "/api/change-password",
                { current_password: currentPassword, new_password: newPassword },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert("Password changed successfully");
            history.push("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        }
    };

    return (
        <>
            <PageHeader>{category}</PageHeader>
            <div className="container change-password-container">
                <div className="section mb-3 change-password-form">
                    <h2>Change Password</h2>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label className="label" htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label" htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="save-button">Change Password</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;
