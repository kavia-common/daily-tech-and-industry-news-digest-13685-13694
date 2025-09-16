import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Navbar, Container } from './components/Layout/Layout';
import './components/Layout/layout.css';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Archive from './pages/Archive';
import NewsletterView from './pages/NewsletterView';
import NotFound from './pages/NotFound';

// Hash-based minimal router to avoid adding dependencies.
// PUBLIC_INTERFACE
function useHashRoute() {
  /**
   * Returns { route, params } based on location.hash
   * Supported:
   *   #/ -> Dashboard
   *   #/logs
   *   #/archive
   *   #/newsletter/:id
   */
  const parse = () => {
    const hash = window.location.hash || '#/';
    const parts = hash.replace(/^#/, '').split('/').filter(Boolean);
    if (parts.length === 0) return { route: 'dashboard', params: {} };
    if (parts[0] === 'logs') return { route: 'logs', params: {} };
    if (parts[0] === 'archive') return { route: 'archive', params: {} };
    if (parts[0] === 'newsletter' && parts[1]) {
      return { route: 'newsletter', params: { id: decodeURIComponent(parts[1]) } };
    }
    return { route: 'notfound', params: {} };
  };
  const [state, setState] = useState(parse);

  useEffect(() => {
    const onHashChange = () => setState(parse());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return state;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Persist theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const { route, params } = useHashRoute();

  const Page = useMemo(() => {
    switch (route) {
      case 'dashboard': return <Dashboard />;
      case 'logs': return <Logs />;
      case 'archive': return <Archive />;
      case 'newsletter': return <NewsletterView id={params.id} />;
      default: return <NotFound />;
    }
  }, [route, params]);

  return (
    <div className="App">
      <Navbar title="Newsletter Admin" />
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ position: 'fixed', top: 12, right: 12, zIndex: 50 }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <Container>
        {Page}
      </Container>
    </div>
  );
}

export default App;
