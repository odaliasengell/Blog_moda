const mongoose = require('mongoose');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
require('dotenv').config({ path: '../.env' });

const sampleArticles = [
  {
    title: "Tendencias de Primavera 2025: Colores que Dominan",
    slug: "tendencias-primavera-2025-colores",
    content: "La primavera 2025 trae una paleta vibrante y llena de vida. Los colores pasteles se combinan con tonos neón para crear looks únicos y llamativos. El verde menta, el rosa coral y el amarillo limón son los protagonistas de esta temporada.\n\nEn las pasarelas hemos visto cómo los diseñadores juegan con estos colores para crear piezas que transmiten optimismo y frescura. La tendencia del color blocking sigue vigente, pero ahora con una perspectiva más suave y orgánica.",
    excerpt: "Descubre los colores que marcarán la temporada primavera-verano 2025 y cómo incorporarlos en tu guardarropa.",
    author: "María Stylista",
    category: "tendencias",
    tags: ["primavera", "colores", "2025", "tendencias"],
    featuredImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
    published: true,
    featured: true,
    views: 150,
    likes: 25
  },
  {
    title: "Street Style: Lo Mejor de la Moda Urbana",
    slug: "street-style-moda-urbana-2025",
    content: "El street style continúa siendo una fuente inagotable de inspiración. En las calles de las principales capitales de la moda, vemos cómo la creatividad y la individualidad se expresan a través de combinaciones únicas.\n\nLas zapatillas chunky siguen siendo protagonistas, pero ahora se combinan con piezas más elegantes como blazers oversized y pantalones de vestir. La mezcla de estilos formal e informal crea looks equilibrados y modernos.",
    excerpt: "Explora las mejores tendencias de street style que están marcando pauta en las calles del mundo.",
    author: "Carlos Fashion",
    category: "street-style", 
    tags: ["street-style", "urbano", "zapatillas", "casual"],
    featuredImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
    published: true,
    featured: false,
    views: 89,
    likes: 12
  },
  {
    title: "Belleza Natural: Rutinas Minimalistas que Funcionan",
    slug: "belleza-natural-rutinas-minimalistas",
    content: "La tendencia hacia la belleza natural y las rutinas minimalistas está ganando cada vez más adeptos. Se trata de potenciar la belleza natural con productos de calidad y técnicas sencillas.\n\nLa clave está en una buena base de cuidado de la piel: limpieza, hidratación y protección solar. El maquillaje se centra en resaltar las mejores características sin sobrecargar el rostro.",
    excerpt: "Aprende a crear rutinas de belleza efectivas con menos productos pero mejores resultados.",
    author: "Ana Beauty",
    category: "belleza",
    tags: ["belleza", "natural", "minimalista", "cuidado"],
    featuredImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    published: true,
    featured: true,
    views: 203,
    likes: 45
  },
  {
    title: "Accesorios Sostenibles: Moda Consciente",
    slug: "accesorios-sostenibles-moda-consciente",
    content: "La moda sostenible no se limita solo a la ropa. Los accesorios también pueden ser parte de un guardarropa más consciente y respetuoso con el medio ambiente.\n\nMarcas locales están creando bolsos, joyas y calzado utilizando materiales reciclados y procesos de producción éticos. Estos accesorios no solo son hermosos, sino que también cuentan una historia de responsabilidad social.",
    excerpt: "Descubre cómo elegir accesorios que sean hermosos, duraderos y respetuosos con el planeta.",
    author: "Verde Estilo",
    category: "sostenibilidad",
    tags: ["sostenible", "accesorios", "eco-friendly", "consciente"],
    featuredImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    published: true,
    featured: false,
    views: 67,
    likes: 8
  }
];

const sampleComments = [
  {
    name: "Laura Martínez",
    email: "laura@example.com",
    content: "¡Me encanta este artículo! Los colores que mencionas son perfectos para la primavera. Ya quiero incorporar el verde menta en mi guardarropa.",
    approved: true,
    likes: 3
  },
  {
    name: "Diego Fernández", 
    email: "diego@example.com",
    content: "Muy buen análisis del street style actual. Es cierto que la mezcla de formal e informal está muy de moda.",
    approved: true,
    likes: 1
  }
];

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-moda');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Article.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️ Datos existentes eliminados');

    // Insertar artículos
    const articles = await Article.insertMany(sampleArticles);
    console.log(`📝 ${articles.length} artículos creados`);

    // Insertar comentarios (asociados a los primeros artículos)
    if (articles.length >= 2) {
      sampleComments[0].article = articles[0]._id;
      sampleComments[1].article = articles[1]._id;
      
      const comments = await Comment.insertMany(sampleComments);
      console.log(`💬 ${comments.length} comentarios creados`);
    }

    console.log('🎉 Base de datos poblada exitosamente');
    
    // Mostrar estadísticas
    const stats = {
      articulos: await Article.countDocuments(),
      articulosPublicados: await Article.countDocuments({ published: true }),
      comentarios: await Comment.countDocuments(),
      categorias: await Article.distinct('category')
    };
    
    console.log('\n📊 Estadísticas:', stats);
    
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔒 Conexión cerrada');
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;