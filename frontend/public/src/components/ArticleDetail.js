import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticleById } from '../api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticleById(id).then((res) => setArticle(res.data));
  }, [id]);

  if (!article) return <div>Cargando...</div>;

  return (
    <section className="article-detail">
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <CommentList articleId={id} />
      <CommentForm articleId={id} />
    </section>
  );
}

export default ArticleDetail;
