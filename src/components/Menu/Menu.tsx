import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/tasks', label: 'Tarefas', icon: '📋' },
    { path: '/calendar', label: 'Calendário', icon: '📅' },
    { path: '/notes', label: 'Notas', icon: '📝' },
    { path: '/matrix', label: 'Calculadora', icon: '🔢' }
  ];

  return (
    <nav style={{
      width: '250px',
      backgroundColor: '#333333',
      borderRight: '2px solid #555555',
      padding: '20px 0',
      overflowY: 'auto'
    }}>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: 'block',
            width: '100%',
            padding: '15px 20px',
            backgroundColor: location.pathname === item.path ? '#555555' : 'transparent',
            border: 'none',
            color: location.pathname === item.path ? '#ffffff' : '#cccccc',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '16px',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== item.path) {
              e.currentTarget.style.backgroundColor = '#555555';
              e.currentTarget.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== item.path) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#cccccc';
            }
          }}
        >
          <span style={{ marginRight: '10px' }}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Menu;