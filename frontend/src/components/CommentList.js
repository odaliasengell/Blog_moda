import React, { useEffect, useState } from 'react';
import { fetchComments, likeComment, reportComment } from '../api';

function CommentList({ articleId, refreshTrigger }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComments = () => {
    if (articleId) {
      setLoading(true);
      fetchComments(articleId)
        .then((res) => {
          setComments(res.data.comments || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadComments();
  }, [articleId, refreshTrigger]);

  const handleLike = async (commentId) => {
    try {
      await likeComment(commentId);
      // Actualizar el comentario localmente
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === commentId 
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const handleReport = async (commentId) => {
    if (window.confirm('¿Estás seguro de que quieres reportar este comentario?')) {
      try {
        await reportComment(commentId);
        alert('Comentario reportado exitosamente');
      } catch (err) {
        console.error('Error al reportar:', err);
        alert('Error al reportar el comentario');
      }
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando comentarios...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <i className="fas fa-exclamation-triangle"></i>
      <p>Error: {error}</p>
    </div>
  );

  const renderComment = (comment, isReply = false) => (
    <li key={comment._id} className={`comment ${isReply ? 'reply' : ''}`}>
      <div className="comment-avatar">
        <i className="fas fa-user-circle"></i>
      </div>
      
      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-author">
            <strong>{comment.name}</strong>
            {comment.website && (
              <a href={comment.website} target="_blank" rel="noopener noreferrer" className="author-website">
                <i className="fas fa-external-link-alt"></i>
              </a>
            )}
          </div>
          <div className="comment-date">
            <i className="fas fa-calendar"></i>
            <small>{new Date(comment.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</small>
          </div>
        </div>
        
        <div className="comment-text">
          <p>{comment.content}</p>
        </div>
        
        <div className="comment-actions">
          <button 
            onClick={() => handleLike(comment._id)}
            className="action-btn like-btn"
            title="Me gusta"
          >
            <i className="fas fa-heart"></i>
            <span>{comment.likes || 0}</span>
          </button>
          
          <button 
            onClick={() => handleReport(comment._id)}
            className="action-btn report-btn"
            title="Reportar comentario"
          >
            <i className="fas fa-flag"></i>
            <span>Reportar</span>
          </button>
          
          <button className="action-btn reply-btn" title="Responder">
            <i className="fas fa-reply"></i>
            <span>Responder</span>
          </button>
        </div>
      </div>
      
      {/* Renderizar respuestas si las hay */}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="replies">
          {comment.replies.map(reply => renderComment(reply, true))}
        </ul>
      )}
    </li>
  );

  return (
    <section className="comment-list">
      <div className="comment-list-header">
        <h4>
          <i className="fas fa-comments"></i>
          Comentarios ({comments.length})
        </h4>
        
        <button 
          onClick={loadComments}
          className="refresh-btn"
          title="Actualizar comentarios"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      
      {comments.length === 0 ? (
        <div className="empty-comments">
          <i className="fas fa-comment-slash"></i>
          <h5>No hay comentarios aún</h5>
          <p>¡Sé el primero en compartir tu opinión!</p>
        </div>
      ) : (
        <ul className="comments-container">
          {comments.map(comment => renderComment(comment))}
        </ul>
      )}
    </section>
  );
}

export default CommentList;