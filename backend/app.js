const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const articlesRoutes = require('./routes/articles');
const commentsRoutes = require('./routes/comments');

app.use('/api/articles', articlesRoutes);
app.use('/api/comments', commentsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API del Blog de Moda funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      articles: '/api/articles',
      comments: '/api/comments'
    }
  });
});

// Ruta para obtener estadísticas generales del blog
app.get('/api/stats', async (req, res) => {
  try {
    const Article = require('./models/Article');
    const Comment = require('./models/Comment');

    const articlesCount = await Article.countDocuments({ published: true });
    const commentsCount = await Comment.countDocuments({ approved: true });
    const totalViews = await Article.aggregate([
      { $match: { published: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const stats = {
      articles: articlesCount,
      comments: commentsCount,
      totalViews: totalViews[0]?.total || 0,
      categories: await Article.distinct('category', { published: true })
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
});

// Middleware para manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint no encontrado',
    requestedUrl: req.originalUrl
  });
});

// Middleware para manejo de errores globales
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-moda';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Inicializar conexión a la base de datos
connectDB();

// Manejo de eventos de MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en MongoDB:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔒 Conexión a MongoDB cerrada');
  process.exit(0);
});

module.exports = app;