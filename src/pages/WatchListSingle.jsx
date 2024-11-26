import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios"; // For making API calls
import api from "../api/axiosBackend";
import "../assets/css/Watchlist.scss";
import PageHeader from '../components/page-header/PageHeader';

function WatchListSingle() {
    const { id } = useParams(); // Get the watchlist ID from the URL parameters
    const [watchlist, setWatchlist] = useState(null);
    const history = useHistory();
    const category = "Watch List";

    useEffect(() => {
        // Fetch the specific watchlist from the backend API
        const fetchWatchlist = async () => {
            try {
                const response = await api.get(`/api/watchlist/${id}`);
                setWatchlist(response.data); // Set the fetched watchlist data
            } catch (error) {
                console.error("Error fetching watchlist:", error);
            }
        };

        fetchWatchlist();
    }, [id]); // Re-run when the ID changes

    const handleBack = () => {
        history.push("/watchlists"); // Navigate back to the list of watchlists
    };

    if (!watchlist) {
        return <>
                <PageHeader>{category}</PageHeader>
                <div className="container">
                    <div className="section mb-3">
                        <p>Loading watchlist...</p>
                    </div>
                </div>
               </>; // Display loading message until data is fetched
    }

    return (
        <>
            <PageHeader>{category}</PageHeader>
            <div className="container">
                <div className="section mb-3">
                    <div className="container watchlist-single">
                        <h1>{watchlist.title} ({watchlist?.user?.name}) </h1>
                        <ul className="watchlist-items">
                            {watchlist.items.map((item, index) => (
                                <Link to={`/movie/${item.id}`}>
                                    <li key={item.id} className="watchlist-item single">
                                        <h3>

                                            {item.order} - {item.title || item.name}

                                        </h3>
                                        <img
                                            src={
                                                item.poster_path
                                                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                                    : "https://via.placeholder.com/100x150?text=No+Image"
                                            }
                                            alt={item.title || item.name}
                                            className="watchlist-preview-image"
                                        />
                                    </li>
                                </Link>
                            ))}
                        </ul>
                        <button onClick={handleBack} className="back-button">Back to Watchlists</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WatchListSingle;
