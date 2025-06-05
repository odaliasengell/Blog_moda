const Article = require('../models/Article');
const Comment = require('../models/Comment');

// Obtener todos los artículos publicados
const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const featured = req.query.featured;
    const skip = (page - 1) * limit;

    let query = { published: true };

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const articles = await Article.find(query)
      .select('-content')
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener artículos', error: error.message });
  }
};

// Obtener artículo por slug
const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ 
      slug: req.params.slug, 
      published: true 
    });

    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Incrementar vistas
    await article.incrementViews();

    // Obtener artículos relacionados
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      category: article.category,
      published: true
    })
    .select('-content')
    .limit(3)
    .sort({ publishDate: -1 });

    res.json({
      article,
      relatedArticles
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener artículo', error: error.message });
  }
};

// Crear nuevo artículo
const createArticle = async (req, res) => {
  try {
    const articleData = req.body;
    
    // Generar slug si no se proporciona
    if (!articleData.slug && articleData.title) {
      articleData.slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const article = new Article(articleData);
    await article.save();

    res.status(201).json({
      message: 'Artículo creado exitosamente',
      article
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Ya existe un artículo con ese slug' });
    } else {
      res.status(400).json({ message: 'Error al crear artículo', error: error.message });
    }
  }
};

// Actualizar artículo
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json({
      message: 'Artículo actualizado exitosamente',
      article
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar artículo', error: error.message });
  }
};

// Eliminar artículo
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Eliminar comentarios asociados
    await Comment.deleteMany({ article: article._id });

    res.json({ message: 'Artículo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar artículo', error: error.message });
  }
};

// Buscar artículos
const searchArticles = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Término de búsqueda requerido' });
    }

    let query = {
      published: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (category) {
      query.category = category;
    }

    const articles = await Article.find(query)
      .select('-content')
      .limit(parseInt(limit))
      .sort({ publishDate: -1 });

    res.json({ articles, total: articles.length });
  } catch (error) {
    res.status(500).json({ message: 'Error en la búsqueda', error: error.message });
  }
};

// Obtener categorías disponibles
const getCategories = async (req, res) => {
  try {
    const categories = await Article.distinct('category', { published: true });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

// Dar like a un artículo
const likeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    article.likes += 1;
    await article.save();

    res.json({ 
      message: 'Like agregado', 
      likes: article.likes 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar like', error: error.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
  getCategories,
  likeArticle
};