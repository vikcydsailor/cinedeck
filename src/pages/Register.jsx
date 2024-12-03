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
    const [errors, setErrors] = useState({});
    const category = 'Register';
    const { user } = useContext(AuthContext);
    const history = useHistory();

    // Redirect to profile page if user is already authenticated
    useEffect(() => {
        if (user) {
            history.push("/profile"); // Replace "/profile" with the actual route for your profile page
        }
    }, [user, history]);

    const validate = () => {
        const tempErrors = {};
        if (!name) tempErrors.name = "Name is required.";
        if (!email) tempErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid.";
        if (!password) tempErrors.password = "Password is required.";
        else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setErrors({}); // Clear any previous errors
            // First, call the csrf-cookie endpoint
            await api.get('/sanctum/csrf-cookie');
            await api.post("/api/register", { name, email, password });
            alert("Registration successful. You can log in now.");
            history.push("/login"); // Redirect to login page after successful registration
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors); // Set API validation errors
            } else {
                console.error("Registration failed:", error);
            }
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
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>
                        <button type="submit" className="submit-button">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
