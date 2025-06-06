import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#333333',
      borderTop: '2px solid #555555',
      padding: '15px 20px',
      textAlign: 'center'
    }}>
      <p style={{ 
        color: '#cccccc',
        margin: 0,
        fontSize: '14px'
      }}>
        &copy; 2025 Kolkuler. O verdadeiro trabalho são os amigos que fizemos no caminho.
      </p>
      <p style={{ 
        fontSize: '12px', 
        marginTop: '5px', 
        color: '#999999',
        margin: '5px 0 0 0'
      }}>
        Feito com React + TypeScript + Electron
      </p>
    </footer>
  );
};

export default Footer;