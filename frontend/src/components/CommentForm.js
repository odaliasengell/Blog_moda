import React, { useState } from 'react';
import { postComment } from '../api';

function CommentForm({ articleId, onCommentAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const commentData = {
        name,
        email,
        website: website || undefined,
        content
      };

      await postComment(articleId, commentData);
      
      // Limpiar formulario
      setName('');
      setEmail('');
      setWebsite('');
      setContent('');
      
      // Callback para actualizar la lista de comentarios
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      alert('¡Comentario publicado exitosamente!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al publicar comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="comment-form">
      <h4>Deja tu comentario</h4>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Tu nombre *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Tu email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="url"
            placeholder="Tu sitio web (opcional)"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Escribe tu comentario *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
            rows="4"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar Comentario'}
        </button>
      </form>
    </section>
  );
}

export default CommentForm;