const express = require('express');
const router = express.Router();
const {
  getCommentsByArticle,
  createComment,
  approveComment,
  deleteComment,
  likeComment,
  reportComment,
  getPendingComments,
  getCommentsStats
} = require('../controllers/commentController');

// Rutas públicas
router.get('/article/:articleId', getCommentsByArticle);
router.post('/article/:articleId', createComment);
router.post('/:id/like', likeComment);
router.post('/:id/report', reportComment);

// Rutas de administración (en un proyecto real, estas estarían protegidas con autenticación)
router.get('/pending', getPendingComments);
router.get('/stats', getCommentsStats);
router.put('/:id/approve', approveComment);
router.delete('/:id', deleteComment);

module.exports = router;