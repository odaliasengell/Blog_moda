const Comment = require('../models/Comment');
const Article = require('../models/Article');

// Obtener comentarios de un artículo
const getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verificar que el artículo existe
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Obtener comentarios principales (no respuestas)
    const comments = await Comment.find({
      article: articleId,
      approved: true,
      parentComment: null
    })
    .populate({
      path: 'replies',
      match: { approved: true },
      options: { sort: { createdAt: 1 } }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Comment.countDocuments({
      article: articleId,
      approved: true,
      parentComment: null
    });

    res.json({
      comments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};

// Crear nuevo comentario
const createComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { name, email, website, content, parentComment } = req.body;

    // Verificar que el artículo existe
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent || parent.article.toString() !== articleId) {
        return res.status(400).json({ message: 'Comentario padre inválido' });
      }
    }

    const comment = new Comment({
      article: articleId,
      name,
      email,
      website,
      content,
      parentComment: parentComment || null,
      approved: true // Auto-aprobar comentarios (puedes cambiar esto)
    });

    await comment.save();

    // Poblar el comentario con respuestas si es necesario
    await comment.populate({
      path: 'replies',
      match: { approved: true },
      options: { sort: { createdAt: 1 } }
    });

    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comment
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear comentario', error: error.message });
  }
};

// Aprobar comentario (admin)
const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await comment.approve();

    res.json({
      message: 'Comentario aprobado',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al aprobar comentario', error: error.message });
  }
};

// Eliminar comentario
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Si tiene respuestas, eliminarlas también
    if (comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    // Si es una respuesta, quitarla del comentario padre
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: comment._id } }
      );
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar comentario', error: error.message });
  }
};

// Dar like a un comentario
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await comment.incrementLikes();

    res.json({
      message: 'Like agregado',
      likes: comment.likes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar like', error: error.message });
  }
};

// Reportar comentario
const reportComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await comment.report();

    res.json({
      message: 'Comentario reportado',
      reportCount: comment.reportCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al reportar comentario', error: error.message });
  }
};

// Obtener comentarios pendientes de aprobación (admin)
const getPendingComments = async (req, res) => {
  try {
    const comments = await Comment.find({ approved: false })
      .populate('article', 'title slug')
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios pendientes', error: error.message });
  }
};

// Obtener estadísticas de comentarios
const getCommentsStats = async (req, res) => {
  try {
    const total = await Comment.countDocuments();
    const approved = await Comment.countDocuments({ approved: true });
    const pending = await Comment.countDocuments({ approved: false });
    const reported = await Comment.countDocuments({ reported: true });

    res.json({
      total,
      approved,
      pending,
      reported
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

module.exports = {
  getCommentsByArticle,
  createComment,
  approveComment,
  deleteComment,
  likeComment,
  reportComment,
  getPendingComments,
  getCommentsStats
};