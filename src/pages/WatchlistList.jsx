import React, {useState, useEffect, useContext} from "react";
import api from "../api/axiosBackend";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import "../assets/css/Watchlist.scss";
import PageHeader from "../components/page-header/PageHeader";

function WatchlistList() {
    const [watchlists, setWatchlists] = useState([]);
    const history = useHistory();
    const { user } = useContext(AuthContext);
    const category = "Watch List";
    useEffect(() => {
        // Fetch all the watchlists from the API when the component mounts
        const fetchWatchlists = async () => {
            try {
                const response = await api.get('/api/watchlists');
                setWatchlists(response.data); // Set the watchlists state
            } catch (error) {
                console.error('Error fetching watchlists:', error);
            }
        };

        fetchWatchlists();
    }, []); // The empty array ensures this effect runs only once when the component mounts



    const viewWatchlist = (index) => {
        history.push(`/watchlist/${index}`);  // Redirect to WatchListSingle with the index as a URL parameter
    };

    const handleBack = () => {
        history.push("/create-watchlist"); // Navigate back to the list of watchlists
    };

    return (
        <>
            <PageHeader>{category}</PageHeader>
            <div className="container">
                <div className="section mb-3">
                    <div className="container watchlist-list">
                        <h1>Watchlists</h1>
                        {user ? (
                            <button onClick={handleBack}  style={{color: 'red'}}>Create Watchlist</button>
                        ) : null}

                        <div className="watchlists">
                            {watchlists.map((watchlist, index) => (
                                <div key={index} className="watchlist-card">
                                    <h3>{watchlist.title}</h3>
                                    <button onClick={() => viewWatchlist(watchlist.id)}>View List</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default WatchlistList;
