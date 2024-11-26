import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import api from '../../api/axiosBackend'; // Import backend API instance
import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';
import MovieList from '../../components/movie-list/MovieList';

const Detail = () => {
    const { category, id } = useParams();
    const { user } = useContext(AuthContext);
    const [item, setItem] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [status, setStatus] = useState("To Be Done");

    useEffect(() => {
        // Fetch movie details on initial load
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, { params: {} });
            setItem(response);
            window.scrollTo(0, 0);
        };
        getDetail();
    }, [category, id]);

    useEffect(() => {
        // Add to watch history when `item` and `user` are available
        if (user && item) {
                addToWatchHistory();
        }
    }, [item, user]);

    useEffect(() => {
        // Fetch favorite and status only if user is available
        if (user) {
            checkFavoriteStatus();
            fetchStatus();
        }
    }, [user, id]);

    const checkFavoriteStatus = async () => {
        try {
            const response = await api.get(`/api/movies/${id}/favorite-status`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };

    const toggleFavoriteStatus = async () => {
        try {
            item.category = category;
            const response = await api.post(`/api/movies/${id}/favorite`, item, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setIsFavorite(response.data.status === 'added');
        } catch (error) {
            console.error("Failed to update favorite status:", error);
        }
    };

    const fetchStatus = async () => {
        try {
            const response = await api.get(`/api/movies/${id}/status`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setStatus(response.data.status);
        } catch (error) {
            console.error("Error fetching movie status:", error);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const response = await api.post(`/api/movies/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setStatus(response.data.status);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        updateStatus(newStatus);
    };

    const addToWatchHistory = async () => {
        try {
            if(category === 'movie') {
                await api.post(`/api/movies/${id}/watch-history`, item, {
                    headers: {Authorization: `Bearer ${user.token}`},
                });
            }
        } catch (error) {
            console.error("Failed to add movie to watch history:", error);
        }
    };

    return (
        <>
            {
                item && (
                    <>
                        <div className="banner" style={{ backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})` }}></div>
                        <div className="mb-3 movie-content container">
                            <div className="movie-content__poster">
                                <div className="movie-content__poster__img" style={{ backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path)})` }}></div>
                            </div>
                            <div className="movie-content__info">
                                <h1 className="title">{item.title || item.name}</h1>
                                <button
                                    className={`favorite-button ${isFavorite ? "favorite-active" : "favorite-inactive"}`}
                                    onClick={toggleFavoriteStatus}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "1.5em",
                                        color: isFavorite ? "red" : "grey"
                                    }}
                                >
                                    {isFavorite ? "❤️" : "🤍"}
                                </button>
                                <div className="movie-rating">
                                    <span>Rating: {item.vote_average} / 10</span>
                                </div>

                                <div className="genres">
                                    {item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                        <span key={i} className="genres__item">{genre.name}</span>
                                    ))}
                                </div>

                                <p className="overview">{item.overview}</p>

                                <div className="movie-status">
                                    <label htmlFor="status-select" className="status-label">Status:</label>
                                    <select
                                        id="status-select"
                                        value={status}
                                        onChange={handleStatusChange}
                                        className="status-select"
                                    >
                                        <option value="To Be Done">To Be Done</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Watched">Watched</option>
                                    </select>
                                </div>

                                <div className="cast">
                                    <div className="section__header">
                                        <h2>Casts</h2>
                                    </div>
                                    <CastList id={item.id}/>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="section mb-3">
                                <VideoList id={item.id}/>
                            </div>
                            <div className="section mb-3">
                                <div className="section__header mb-2">
                                    <h2>Similar</h2>
                                </div>
                                <MovieList category={category} type="similar" id={item.id}/>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}

export default Detail;
