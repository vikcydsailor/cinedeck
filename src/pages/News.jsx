import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/newsPageCss.scss';
import PageHeader from "../components/page-header/PageHeader";

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const category = 'Latest News';

    const apiKey = '5ae0737e6bdf4d4ea8840d0ea446a94a';  // Replace with your API key
    const pageSize = 12;  // Number of articles per page

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/everything?q=movies&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
            );
            const filteredArticles = response.data.articles.filter(
                (article) => article.url !== 'https://removed.com'
            );
            setNews(prevNews => [...prevNews, ...filteredArticles]);
            setTotalResults(response.data.totalResults - 1); // Adjust total count if needed
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [page]);

    const loadMoreNews = () => {
        if (news.length < totalResults) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <>
            <PageHeader>{category}</PageHeader>
            <div className="container">
                <div className="section mb-3">
                    <div className="news-page">

                        <div className="news-grid">
                            {news.map((article, index) => (
                                <div key={index} className="news-card">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        {article.urlToImage && (
                                            <div
                                                className="news-card__image"
                                                style={{ backgroundImage: `url(${article.urlToImage})` }}
                                            />
                                        )}
                                        <div className="news-card__content">
                                            <h2>{article.title}</h2>
                                            <p>{article.description}</p>
                                            <small>{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</small>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                            {loading && <p>Loading...</p>}
                            {!loading && news.length < totalResults && (
                                <button onClick={loadMoreNews} className="load-more">
                                    Load More
                                </button>
                            )}
                        </div>
                </div>
            </div>
       </>
    );
};

export default NewsPage;
