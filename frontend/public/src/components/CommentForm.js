import React, { useState } from 'react';
import { postComment } from '../api';

function CommentForm({ articleId }) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postComment({ articleId, author, text });
    setAuthor('');
    setText('');
    window.location.reload(); // o mejor con estado, pero para simplificar
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h4>Deja un comentario</h4>
      <input
        type="text"
        placeholder="Tu nombre"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        placeholder="Escribe tu comentario"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      ></textarea>
      <button type="submit">Publicar</button>
    </form>
  );
}

export default CommentForm;