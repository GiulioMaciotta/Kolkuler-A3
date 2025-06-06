import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      backgroundColor: '#333333',
      borderBottom: '2px solid #555555',
      padding: '15px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <h1 style={{
        color: '#00d4aa',
        fontSize: '24px',
        fontWeight: '600',
        margin: 0
      }}>
        Kolkuler - Organizador & Calculadora
      </h1>
    </header>
  );
};

export default Header;