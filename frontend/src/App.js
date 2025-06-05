import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              ✨ Blog de Moda
            </Link>
          </h1>
          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/categories">Categorías</Link>
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
          <p>Creado con ❤️ para los amantes de la moda</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;