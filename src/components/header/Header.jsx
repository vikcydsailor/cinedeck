import React, { useRef, useEffect, useState, useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext if you have it
import './header.scss';
import logo from '../../assets/tmovie.png';

const headerNav = [
    { display: 'Home', path: '/' },
    { display: 'Movies', path: '/movie' },
    { display: 'TV Series', path: '/tv' },
    { display: 'News', path: '/news' },
    { display: 'Watch Lists', path: '/watchlists' }
];

const Header = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    const headerRef = useRef(null);
    const { user, logout } = useContext(AuthContext); // Access user from AuthContext


    const active = headerNav.findIndex(e => e.path === pathname);

    // Replace this with real authentication logic
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in by checking for user or token in localStorage
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Sets isLoggedIn to true if token exists
    }, [user]); // Runs when user changes

    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current.classList.add('shrink');
            } else {
                headerRef.current.classList.remove('shrink');
            }
        };
        window.addEventListener('scroll', shrinkHeader);
        return () => {
            window.removeEventListener('scroll', shrinkHeader);
        };
    }, []);

    const handleLogout = () => {
        logout(); // Calls logout from AuthContext to clear the token
        history.push('/'); // Redirect to home page after logging out
    };


    return (
        <div ref={headerRef} className="header">
            <div className="header__wrap container">
                <div className="logo">
                    <img src={logo} alt="CineDeck Logo" />
                    <Link to="/">CineDeck</Link>
                </div>
                <ul className="header__nav">
                    {headerNav.map((e, i) => (
                        <li key={i} className={`${i === active ? 'active' : ''}`}>
                            <Link to={e.path}>
                                {e.display}
                            </Link>
                        </li>
                    ))}

                    {/* Conditional Rendering for Login/Register/Profile */}
                    {isLoggedIn ? (
                        <>
                            <li className="profile">
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li className="logout">
                                <span onClick={handleLogout}>Logout</span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="register">
                                <Link to="/register">Register</Link>
                            </li>
                            <li className="login">
                                <Link to="/login">Login</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Header;
