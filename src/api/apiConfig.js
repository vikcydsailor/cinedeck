const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: '7698ea65bdc2221faa82b2879849a087',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;