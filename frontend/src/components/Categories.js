import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchArticles } from '../api';
import { Link } from 'react-router-dom';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchArticles()])
      .then(([categoriesRes, articlesRes]) => {
        setCategories(categoriesRes.data.categories || []);
        setArticles(articlesRes.data.articles || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando categorías...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <i className="fas fa-exclamation-triangle"></i>
      <p>Error: {error}</p>
    </div>
  );

  // Agrupar artículos por categoría
  const groupedArticles = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});

  return (
    <div className="categories-page">
      <section className="categories-hero">
        <h1><i className="fas fa-tags"></i> Explorar Categorías</h1>
        <p>Descubre artículos organizados por temas que te interesan</p>
      </section>

      <section className="categories-overview">
        <div className="categories-grid">
          {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
            <div key={category} className="category-card">
              <div className="category-header">
                <h3>
                  <i className="fas fa-folder"></i>
                  {category}
                </h3>
                <span className="article-count">{categoryArticles.length} artículos</span>
              </div>
              
              <div className="category-preview">
                {categoryArticles.slice(0, 3).map((article) => (
                  <Link 
                    key={article._id} 
                    to={`/articles/${article.slug}`}
                    className="preview-article"
                  >
                    <span className="article-title">{article.title}</span>
                    <span className="article-views">
                      <i className="fas fa-eye"></i> {article.views}
                    </span>
                  </Link>
                ))}
              </div>
              
              <Link 
                to={`/categories/${encodeURIComponent(category)}`}
                className="view-all-btn"
              >
                <i className="fas fa-arrow-right"></i>
                Ver todos en {category}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {Object.keys(groupedArticles).length === 0 && (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>No hay categorías disponibles</h3>
          <p>Aún no se han publicado artículos con categorías.</p>
        </div>
      )}
    </div>
  );
}

export default Categories;