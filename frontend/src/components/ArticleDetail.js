import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleBySlug, likeArticle } from '../api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentRefresh, setCommentRefresh] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchArticleBySlug(slug)
      .then((res) => {
        setArticle(res.data.article);
        setRelatedArticles(res.data.relatedArticles || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const handleLike = async () => {
    if (!article || liked) return;
    
    try {
      await likeArticle(article._id);
      setArticle(prev => ({ ...prev, likes: prev.likes + 1 }));
      setLiked(true);
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const handleCommentAdded = () => {
    setCommentRefresh(prev => prev + 1);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando artículo...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <i className="fas fa-exclamation-triangle"></i>
      <p>Error: {error}</p>
      <Link to="/" className="back-home-btn">
        <i className="fas fa-arrow-left"></i> Volver al inicio
      </Link>
    </div>
  );

  if (!article) return (
    <div className="not-found-container">
      <i className="fas fa-search"></i>
      <h2>Artículo no encontrado</h2>
      <p>El artículo que buscas no existe o ha sido eliminado.</p>
      <Link to="/" className="back-home-btn">
        <i className="fas fa-arrow-left"></i> Volver al inicio
      </Link>
    </div>
  );

  return (
    <div className="article-detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/"><i className="fas fa-home"></i> Inicio</Link>
        <i className="fas fa-chevron-right"></i>
        <span className="category-link">{article.category}</span>
        <i className="fas fa-chevron-right"></i>
        <span>{article.title}</span>
      </nav>

      <article className="article-detail">
        <header className="article-header">
          <div className="article-category">
            <i className="fas fa-tag"></i>
            {article.category}
          </div>
          
          <h1>{article.title}</h1>
          
          <div className="article-meta">
            <div className="meta-item">
              <i className="fas fa-user"></i>
              <span>Por: <strong>{article.author}</strong></span>
            </div>
            <div className="meta-item">
              <i className="fas fa-calendar"></i>
              <span>{new Date(article.createdAt || Date.now()).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-eye"></i>
              <span>{article.views} vistas</span>
            </div>
          </div>

          <div className="article-actions">
            <button 
              onClick={handleLike} 
              className={`like-btn ${liked ? 'liked' : ''}`}
              disabled={liked}
            >
              <i className="fas fa-heart"></i>
              <span>{article.likes} {liked ? 'Te gusta' : 'Me gusta'}</span>
            </button>
            
            <button className="share-btn" onClick={() => navigator.share?.({
              title: article.title,
              url: window.location.href
            })}>
              <i className="fas fa-share"></i>
              <span>Compartir</span>
            </button>
          </div>
        </header>
        
        {article.featuredImage && (
          <div className="featured-image">
            <img src={article.featuredImage} alt={article.title} />
          </div>
        )}
        
        <div className="article-content">
          {article.content?.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          )) || <p>{article.content}</p>}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            <h5><i className="fas fa-tags"></i> Etiquetas:</h5>
            <div className="tags-container">
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">
                  <i className="fas fa-hashtag"></i>{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {relatedArticles.length > 0 && (
        <section className="related-articles">
          <h3><i className="fas fa-newspaper"></i> Artículos Relacionados</h3>
          <div className="related-grid">
            {relatedArticles.map((related) => (
              <Link 
                key={related._id} 
                to={`/articles/${related.slug}`}
                className="related-article"
              >
                <div className="related-article-content">
                  <h4>{related.title}</h4>
                  <p>{related.excerpt}</p>
                  <div className="related-meta">
                    <span><i className="fas fa-eye"></i> {related.views}</span>
                    <span><i className="fas fa-heart"></i> {related.likes}</span>
                  </div>
                </div>
                <i className="fas fa-arrow-right"></i>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CommentList 
        articleId={article._id} 
        refreshTrigger={commentRefresh}
      />
      
      <CommentForm 
        articleId={article._id} 
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}

export default ArticleDetail;