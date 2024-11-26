import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosBackend";
import PageHeader from '../components/page-header/PageHeader';
import '../assets/css/Register.css'; // Reuse the same CSS file

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const category = 'Login';
    const history = useHistory(); // Use useHistory instead of useNavigate
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // First, call the csrf-cookie endpoint
            await api.get('/sanctum/csrf-cookie');
            const response = await api.post("/api/login", { email, password });
            login(response.data.token);
            // Redirect to profile page after successful login
            history.push("/profile"); // Use history.push instead of navigate
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <>
            <PageHeader>
                {category}
            </PageHeader>
            <div className="container register">
                <div className="form-section">
                    <form onSubmit={handleLogin} className="register-form">
                        <h2>Log In to Your Account</h2>
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
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="submit-button">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
