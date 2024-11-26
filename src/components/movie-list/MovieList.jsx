import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';

import './movie-list.scss';

import { SwiperSlide, Swiper } from 'swiper/react';
import { Link } from 'react-router-dom';

import Button from '../button/Button';

import tmdbApi, { category } from '../../api/tmdbApi';
import { AuthContext } from "../../context/AuthContext";
import { getRecommendations } from '../../api/userData';
import MovieCard from '../movie-card/MovieCard';

const MovieList = props => {

    const [items, setItems] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getList = async () => {
            let response = null;
            const params = {};

            if (user) {
                let response = await getRecommendations(user.id, props.type, props.category);

                // Check if response is defined and has results
                if (!response || !response.results || !response.results.length) {
                    // Fetch default list if recommendation results are empty or undefined
                    response = await tmdbApi.getMoviesList(props.type, { params });
                }

                // Ensure response is defined to avoid errors when accessing results
                setItems((response && response.results) || []);
            } else {
                // Use default movie or TV lists if the user is not logged in
                if (props.type !== 'similar') {
                    switch(props.category) {
                        case category.movie:
                            response = await tmdbApi.getMoviesList(props.type, { params });
                            break;
                        default:
                            response = await tmdbApi.getTvList(props.type, { params });
                    }
                } else {
                    response = await tmdbApi.similar(props.category, props.id);
                }
                setItems(response.results || []);
            }
        };

        getList();
    }, [user, props.type, props.category, props.id]);


    return (
        <div className="movie-list">
            <Swiper
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
            >
                {
                    items.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard item={item} category={props.category}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
}

MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

export default MovieList;
