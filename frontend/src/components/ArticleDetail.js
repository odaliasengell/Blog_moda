import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticleBySlug } from '../api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticleBySlug(slug)
      .then((res) => {
        setArticle(res.data.article);
        setRelatedArticles(res.data.relatedArticles);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Cargando artículo...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Artículo no encontrado</div>;

  return (
    <section className="article-detail">
      <h1>{article.title}</h1>
      <div className="article-meta">
        <span>Por: {article.author}</span>
        <span>Categoría: {article.category}</span>
        <span>Vistas: {article.views}</span>
        <span>Likes: {article.likes}</span>
      </div>
      
      {article.featuredImage && (
        <img src={article.featuredImage} alt={article.title} />
      )}
      
      <div className="article-content">
        {article.content}
      </div>

      <div className="article-tags">
        {article.tags && article.tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>

      {relatedArticles.length > 0 && (
        <div className="related-articles">
          <h3>Artículos Relacionados</h3>
          <ul>
            {relatedArticles.map((related) => (
              <li key={related._id}>
                <a href={`/articles/${related.slug}`}>{related.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CommentList articleId={article._id} />
      <CommentForm articleId={article._id} />
    </section>
  );
}

export default ArticleDetail;