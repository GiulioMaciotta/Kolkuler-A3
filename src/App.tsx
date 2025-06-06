import React from 'react';
import { HashRouter } from 'react-router-dom';  // ← Mude de BrowserRouter para HashRouter
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';  
import Footer from './components/Footer/Footer';
import AppRoutes from './routes';

function App() {
  return (
    <HashRouter>  {/* ← HashRouter funciona melhor no Electron */}
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2a2a2a',
        color: '#ffffff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: 0,
        padding: 0
      }}>
        <Header />
        <div style={{
          display: 'flex',
          flex: 1
        }}>
          <Menu />
          <main style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#2a2a2a'
          }}>
            <AppRoutes />
          </main>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;