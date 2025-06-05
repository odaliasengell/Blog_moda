import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import Categories from './components/Categories';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <div className="container">
            <h1>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fas fa-gem"></i> Blog de Moda
              </Link>
            </h1>
            <nav>
              <Link to="/">
                <i className="fas fa-home"></i>
                <span>Inicio</span>
              </Link>
              <Link to="/categories">
                <i className="fas fa-tags"></i>
                <span>Categorías</span>
              </Link>
              <Link to="/about">
                <i className="fas fa-info-circle"></i>
                <span>Acerca de</span>
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<ArticleList />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:category" element={<ArticleList />} />
            </Routes>
          </div>
        </main>
        
        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h4><i className="fas fa-gem"></i> Blog de Moda</h4>
                <p>Tu destino para las últimas tendencias y consejos de moda.</p>
              </div>
              <div className="footer-section">
                <h4>Enlaces Rápidos</h4>
                <ul>
                  <li><Link to="/">Inicio</Link></li>
                  <li><Link to="/categories">Categorías</Link></li>
                  <li><a href="#newsletter">Newsletter</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Síguenos</h4>
                <div className="social-links">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                  <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest"></i></a>
                  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2025 Blog de Moda. Todos los derechos reservados.</p>
              <p>Creado con <i className="fas fa-heart"></i> para los amantes de la moda</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;