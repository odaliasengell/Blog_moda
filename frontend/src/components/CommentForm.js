import React, { useState } from 'react';
import { postComment } from '../api';

function CommentForm({ articleId, onCommentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El email no es válido');
      return false;
    }
    if (!formData.content.trim()) {
      setError('El comentario es requerido');
      return false;
    }
    if (formData.content.length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      const commentData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        website: formData.website.trim() || undefined,
        content: formData.content.trim()
      };

      await postComment(articleId, commentData);
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        website: '',
        content: ''
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Callback para actualizar la lista de comentarios
      if (onCommentAdded) {
        onCommentAdded();
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al publicar comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="comment-form">
      <div className="comment-form-header">
        <h4>
          <i className="fas fa-pen"></i>
          Deja tu comentario
        </h4>
        <p>Tu opinión es importante para nosotros. Comparte tus pensamientos sobre este artículo.</p>
      </div>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          ¡Comentario publicado exitosamente! Gracias por participar.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="comment-form-content">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              <i className="fas fa-user"></i>
              Nombre *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className={error && !formData.name.trim() ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className={error && !formData.email.trim() ? 'error' : ''}
            />
            <small>No compartiremos tu email con terceros</small>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="website">
            <i className="fas fa-globe"></i>
            Sitio web (opcional)
          </label>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="https://tu-sitio.com"
            value={formData.website}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">
            <i className="fas fa-comment"></i>
            Comentario *
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Comparte tu opinión sobre este artículo..."
            value={formData.content}
            onChange={handleChange}
            required
            disabled={loading}
            rows="5"
            className={error && !formData.content.trim() ? 'error' : ''}
          />
          <div className="character-count">
            <span className={formData.content.length < 10 ? 'insufficient' : 'sufficient'}>
              {formData.content.length} caracteres (mínimo 10)
            </span>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Publicando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Publicar Comentario
              </>
            )}
          </button>
          
          <button 
            type="button" 
            onClick={() => setFormData({
              name: '',
              email: '',
              website: '',
              content: ''
            })}
            disabled={loading}
            className="clear-btn"
          >
            <i className="fas fa-eraser"></i>
            Limpiar
          </button>
        </div>
        
        <div className="form-note">
          <i className="fas fa-info-circle"></i>
          <small>
            Al enviar tu comentario, aceptas nuestras políticas de privacidad y términos de uso.
            Los comentarios son moderados antes de ser publicados.
          </small>
        </div>
      </form>
    </section>
  );
}

export default CommentForm;