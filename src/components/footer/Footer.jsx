import React from 'react';

import './footer.scss';

import { Link } from 'react-router-dom';

import bg from '../../assets/footer-bg.jpg';
import logo from '../../assets/tmovie.png';

const Footer = () => {
    return (
        <div className="footer" style={{backgroundImage: `url(${bg})`}}>
            <div className="footer__content container">
                <div className="footer__content__logo">
                    <div className="logo">
                        <img src={logo} alt="" />
                        <Link to="/">CineDeck</Link>
                    </div>
                </div>
                <div className="footer__content__menus">
                    <div className="footer__content__menu">
                        <Link to="/">Home</Link>
                        <Link to="/register">Register</Link>
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/movies">Movies</Link>
                        <Link to="/watchlists">Watch List</Link>
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/tv">TV Series</Link>
                        <Link to="/news">News</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
