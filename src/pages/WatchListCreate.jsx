// WatchlistCreate.js
import React, { useState } from "react";
import axios from "axios";
import api from "../api/axiosBackend";
import apiConfig from "../api/apiConfig";
import "../assets/css/Watchlist.scss";
import PageHeader from "../components/page-header/PageHeader";

function WatchlistCreate() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [title, setTitle] = useState("");
    const category = "Create Watchlist";

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `${apiConfig.baseUrl}search/multi?api_key=${apiConfig.apiKey}&query=${searchTerm}`
            );
            setSearchResults(response.data.results);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const addToWatchlist = (item) => {
        // Check if the item is already in the watchlist by ID
        if (!watchlist.some((watchItem) => watchItem.id === item.id)) {
            // Set the order based on the current length of the watchlist
            const itemWithOrder = { ...item, order: watchlist.length + 1 };

            // Add the item to the watchlist with the order property
            setWatchlist((prevWatchlist) => [...prevWatchlist, itemWithOrder]);

            // Clear the search term and search results for the next search
            setSearchTerm("");
            setSearchResults([]);
        }
    };


    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const saveWatchlist = async () => {
        if (title.trim() === "") return; // Ensure title is not empty

        try {
            // Prepare the data to be sent to the backend
            const newWatchlist = { title, items: watchlist };

            // Send the data to the Laravel API
            const response = await api.post("/api/watchlists", newWatchlist);

            if (response.status === 200) {
                // Handle success (You can reset or show a success message)
                setTitle("");
                setWatchlist([]);
                setSearchResults([]);
                setSearchTerm("");
                alert("Watchlist saved successfully!");
            }
        } catch (error) {
            console.error("Error saving watchlist:", error);
            alert("There was an error saving your watchlist. Please try again.");
        }
    };

    return (
        <>
            <PageHeader>{category}</PageHeader>
            <div className="container full-width">
                <div className="watchlist-create-wrapper">
                    {/* Left Column: Search and Add */}
                    <div className={`watchlist-create-column ${watchlist.length === 0 ? 'full-width' : ''}`}>
                        <h1>Create a New Watchlist</h1>
                        <input
                            type="text"
                            placeholder="Watchlist Title"
                            value={title}
                            onChange={handleTitleChange}
                            className="watchlist-title-input"
                            required
                        />
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Search for movies or TV shows"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">Search</button>
                        </form>

                        <div className="search-results">
                            {searchResults.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="search-result-item">
                                    <img
                                        src={
                                            item.poster_path
                                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                                : "https://via.placeholder.com/100x150?text=No+Image"
                                        }
                                        alt={item.title || item.name}
                                        className="search-result-image"
                                    />
                                    <div className="search-item-info">
                                        <h3>{item.title || item.name}</h3>
                                        <button onClick={() => addToWatchlist(item)} className="add-to-watchlist-btn">
                                            Add to Watchlist
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Right Column: Watchlist (only visible if there are items in the watchlist) */}
                    {watchlist.length > 0 && (
                        <div className="watchlist-display-column">
                            {title && <h2 className="watchlist-title">{title}</h2>}
                            <ul className="watchlist-preview">
                                {watchlist.map((item, index) => (
                                    <li key={`${item.id}-${index}`} className="watchlist-item">
                                        <span className="watchlist-index">{index + 1} . &nbsp;</span>
                                        <img
                                            src={
                                                item.poster_path
                                                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                                    : "https://via.placeholder.com/100x150?text=No+Image"
                                            }
                                            alt={item.title || item.name}
                                            className="watchlist-preview-image"
                                        />
                                        <span className="watchlist-item-title">{item.title || item.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={saveWatchlist} disabled={!title || watchlist.length === 0}
                                    className="save-watchlist-btn">
                                Save Watchlist
                            </button>
                        </div>

                    )}
                </div>
            </div>
        </>
    );
}

export default WatchlistCreate;
