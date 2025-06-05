import React, { useEffect, useState } from 'react';
import { fetchComments } from '../api';

function CommentList({ articleId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments(articleId).then((res) => setComments(res.data));
  }, [articleId]);

  return (
    <div className="comment-list">
      <h3>Comentarios</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.author}</strong>: {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;
