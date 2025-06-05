import React, { useEffect, useState } from 'react';
import { fetchArticles } from '../api';
import { Link } from 'react-router-dom';

function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then((res) => setArticles(res.data));
  }, []);

  return (
    <section className="article-list">
      <h2>Artículos Recientes</h2>
      <ul>
        {articles.map((article) => (
          <li key={article._id}>
            <Link to={`/articles/${article._id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ArticleList;
