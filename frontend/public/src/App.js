import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Blog de Moda</h1>
          <nav>
            <a href="/">Inicio</a>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
          </Routes>
        </main>
        
        <footer>
          <p>© 2025 Blog de Moda. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;