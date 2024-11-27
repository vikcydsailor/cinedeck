import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../api/axiosBackend";
import PageHeader from '../components/page-header/PageHeader';
import '../assets/css/Register.css'; // Import the CSS file for styling
import { AuthContext } from "../context/AuthContext";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const category = 'Register';
    const { user } = useContext(AuthContext);
    const history = useHistory();

    // Redirect to profile page if user is already authenticated
    useEffect(() => {
        if (user) {
            history.push("/profile"); // Replace "/profile" with the actual route for your profile page
        }
    }, [user]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // First, call the csrf-cookie endpoint
            await api.get('/sanctum/csrf-cookie');
            await api.post("/api/register", { name, email, password });
            alert("Registration successful. You can log in now.");
            history.push("/login"); // Redirect to login page after successful registration
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <>
            <PageHeader>
                {category}
            </PageHeader>
            <div className="container register">
                <div className="form-section">
                    <form onSubmit={handleRegister} className="register-form">
                        <h2>Create an Account</h2>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                        <button type="submit" className="submit-button">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
