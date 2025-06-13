import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import MatrixCalculator from '../components/MatrixCalculator/MatrixCalculator';
import LinearSystemCalculator from '../components/LinearSystemCalculator/LinearSystemCalculator';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tasks" element={
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h2 style={{color: '#00d4aa', marginBottom: '20px'}}>Organizador de Tarefas</h2>
          <p style={{color: '#cccccc'}}>Em desenvolvimento...</p>
        </div>
      } />
      <Route path="/calendar" element={
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h2 style={{color: '#00d4aa', marginBottom: '20px'}}>Calendário</h2>
          <p style={{color: '#cccccc'}}>Em desenvolvimento...</p>
        </div>
      } />
      <Route path="/notes" element={
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h2 style={{color: '#00d4aa', marginBottom: '20px'}}>Notas e Lembretes</h2>
          <p style={{color: '#cccccc'}}>Em desenvolvimento...</p>
        </div>
      } />
      <Route path="/matrix" element={<MatrixCalculator />} />
      <Route path="/linear-system" element={<LinearSystemCalculator />} />
    </Routes>
  );
};

export default AppRoutes;