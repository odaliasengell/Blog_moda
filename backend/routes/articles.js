const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
  getCategories,
  likeArticle
} = require('../controllers/articleController');

// Rutas públicas
router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/categories', getCategories);
router.get('/:slug', getArticleBySlug);
router.post('/:id/like', likeArticle);

// Rutas de administración (en un proyecto real, estas estarían protegidas con autenticación)
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

module.exports = router;