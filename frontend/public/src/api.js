import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchArticles = () => axios.get(`${API_URL}/articles`);
export const fetchArticleById = (id) => axios.get(`${API_URL}/articles/${id}`);
export const fetchComments = (articleId) => axios.get(`${API_URL}/comments?articleId=${articleId}`);
export const postComment = (comment) => axios.post(`${API_URL}/comments`, comment);
