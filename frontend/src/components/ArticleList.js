import React, { useEffect, useState } from 'react';
import { fetchArticles } from '../api';
import { Link } from 'react-router-dom';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles()
      .then((res) => {
        // El backend devuelve { articles: [], pagination: {} }
        setArticles(res.data.articles || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando artículos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="article-list">
      <h2>Artículos Recientes</h2>
      {articles.length === 0 ? (
        <p>No hay artículos disponibles.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article._id}>
              <Link to={`/articles/${article.slug}`}>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="article-meta">
                  <span>Categoría: {article.category}</span>
                  <span>Vistas: {article.views}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ArticleList;