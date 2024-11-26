import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosBackend";
import PageHeader from '../components/page-header/PageHeader';
import { useHistory, Link } from 'react-router-dom';
import '../assets/css/profile.scss';

function Profile() {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [favorites, setFavorites] = useState([]); // Initialize favorites as an empty array
    const history = useHistory();
    const category = 'Profile';

    useEffect(() => {
        const storedProfile = localStorage.getItem("user");

        if (storedProfile) {
            setProfileData(JSON.parse(storedProfile));
        } else if (user) {
            const fetchProfile = async () => {
                try {
                    await api.get('/sanctum/csrf-cookie');
                    const response = await api.get("/api/profile", {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    setProfileData(response.data);
                    localStorage.setItem("user", JSON.stringify(response.data));
                } catch (error) {
                    console.error("Failed to fetch profile data:", error);
                }
            };

            fetchProfile();
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === "favorites" && user) {
            const fetchFavorites = async () => {
                try {
                    const response = await api.get("/api/favorites", {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    const favoritesData = response.data.map(fav => ({
                        movieId: fav.movie_id,
                        ...fav.movie_details // Spread movie details directly
                    }));
                    setFavorites(favoritesData);
                } catch (error) {
                    console.error("Failed to fetch favorite movies:", error);
                }
            };

            fetchFavorites();
        }
    }, [activeTab, user]);

    const handleEditProfile = () => {
        history.push('/edit-profile');
    };

    const handleChangePassword = () => {
        history.push('/change-password');
    };

    if (!user) {
        return (
            <>
                <PageHeader>{category}</PageHeader>
                <div className="container">
                    <div className="section mb-3">
                        <p>Please log in to view your profile.</p>
                    </div>
                </div>
            </>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="profile-details">
                        {profileData ? (
                            <>
                                <p><strong>Name:</strong> {profileData.name}</p>
                                <p><strong>Email:</strong> {profileData.email}</p>
                                <button className="edit-profile-button" onClick={handleEditProfile}>
                                    Edit Profile
                                </button>
                                <button className="edit-profile-button" onClick={handleChangePassword}>
                                    Change Password
                                </button>
                            </>
                        ) : (
                            <p>Loading profile data...</p>
                        )}
                    </div>
                );
            case "favorites":
                return (
                    <div className="mf-container">
                        <h2 className="mf-title">My Favorites</h2>

                        {favorites && favorites.length > 0 ? (
                            <div className="mf-grid">
                                {favorites.map((movie) => (
                                    <Link to={`/${movie.category}/${movie.id}`}>
                                        <div key={movie.movieId} className="mf-card">
                                        <div className="mf-poster-container">
                                            <img
                                                src={
                                                    movie.poster_path
                                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                        : "https://via.placeholder.com/100x150?text=No+Image"
                                                }
                                                alt={movie.title || movie.name}
                                                className="mf-poster"
                                            />
                                        </div>

                                        <div className="mf-content">
                                            <h3 className="mf-movie-title">{movie.title || movie.name}</h3>
                                            <h4 className="mf-movie-category">({movie.category.toUpperCase()})</h4>
                                            <p className="mf-year">
                                                {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                                            </p>
                                            <p className="mf-description">{movie.description}</p>

                                            {movie?.genre && (
                                                <div className="mf-genre-container">
                                                    {movie.genre.map((g) => (
                                                        <span key={g} className="mf-genre-tag">
                        {g}
                      </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    </Link>
                                    ))}
                            </div>
                        ) : (
                            <div className="mf-empty-state">
                                <p>You have no favorite movies or TV shows.</p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <PageHeader>{category}</PageHeader>
            <div className="container profile-container">
                <div className="section mb-3 profile-card">
                    <div className="profile-header">
                        <h1>{profileData ? profileData.name : "Profile"}</h1>
                    </div>

                    {/* Tabs Menu */}
                    <div className="tabs-menu">
                        <button
                            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            Profile Details
                        </button>
                        <button
                            className={`tab-button ${activeTab === "favorites" ? "active" : ""}`}
                            onClick={() => setActiveTab("favorites")}
                        >
                            Favorites
                        </button>
                    </div>

                    {/* Render Tab Content */}
                    {renderTabContent()}
                </div>
            </div>
        </>
    );
}

export default Profile;
