import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Artículos
export const fetchArticles = () => axios.get(`${API_URL}/articles`);
export const fetchArticleBySlug = (slug) => axios.get(`${API_URL}/articles/${slug}`);
export const fetchCategories = () => axios.get(`${API_URL}/articles/categories`);
export const searchArticles = (query) => axios.get(`${API_URL}/articles/search?q=${query}`);
export const likeArticle = (id) => axios.post(`${API_URL}/articles/${id}/like`);

// Comentarios
export const fetchComments = (articleId) => axios.get(`${API_URL}/comments/article/${articleId}`);
export const postComment = (articleId, comment) => axios.post(`${API_URL}/comments/article/${articleId}`, comment);
export const likeComment = (id) => axios.post(`${API_URL}/comments/${id}/like`);
export const reportComment = (id) => axios.post(`${API_URL}/comments/${id}/report`);