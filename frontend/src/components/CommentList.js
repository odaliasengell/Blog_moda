import React, { useEffect, useState } from 'react';
import { fetchComments } from '../api';

function CommentList({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (articleId) {
      fetchComments(articleId)
        .then((res) => {
          setComments(res.data.comments);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [articleId]);

  if (loading) return <div>Cargando comentarios...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderComment = (comment) => (
    <li key={comment._id} className="comment">
      <div className="comment-header">
        <strong>{comment.name}</strong>
        <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
      </div>
      <p>{comment.content}</p>
      <div className="comment-actions">
        <span>👍 {comment.likes}</span>
      </div>
      
      {/* Renderizar respuestas si las hay */}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="replies">
          {comment.replies.map(renderComment)}
        </ul>
      )}
    </li>
  );

  return (
    <section className="comment-list">
      <h4>Comentarios ({comments.length})</h4>
      {comments.length === 0 ? (
        <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
      ) : (
        <ul>
          {comments.map(renderComment)}
        </ul>
      )}
    </section>
  );
}

export default CommentList;