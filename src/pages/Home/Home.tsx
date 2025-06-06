import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'tasks',
      title: 'Organizador de Tarefas',
      description: 'Gerencie suas tarefas diárias, projetos e compromissos de forma eficiente e organizada.',
      icon: '📋',
      path: '/tasks'
    },
    {
      id: 'calendar',
      title: 'Calendário',
      description: 'Visualize seus compromissos e prazos em um calendário intuitivo e personalizável.',
      icon: '📅',
      path: '/calendar'
    },
    {
      id: 'matrix',
      title: 'Calculadora de Matrizes',
      description: 'Realize operações matemáticas com matrizes: soma, subtração, multiplicação e determinante.',
      icon: '🔢',
      path: '/matrix'
    },
    {
      id: 'notes',
      title: 'Notas e Lembretes',
      description: 'Anote ideias importantes, crie lembretes e mantenha suas informações organizadas.',
      icon: '📝',
      path: '/notes'
    }
  ];

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        marginBottom: '40px'
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '32px',
          marginBottom: '20px'
        }}>
          Bem-vindo ao Kolkuler
        </h1>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          color: '#cccccc',
          marginBottom: '20px'
        }}>
          Seu organizador pessoal completo com ferramentas matemáticas integradas. 
          Mantenha suas tarefas, compromissos e cálculos todos em um só lugar.
        </p>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          color: '#cccccc'
        }}>
          Organize sua vida e facilite seus estudos com nossas ferramentas:
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        {features.map((feature) => (
          <div
            key={feature.id}
            style={{
              backgroundColor: '#333333',
              border: '2px solid #555555',
              borderRadius: '8px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onClick={() => handleFeatureClick(feature.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '15px',
              color: '#00d4aa'
            }}>
              {feature.icon}
            </div>
            <h3 style={{
              fontSize: '20px',
              color: '#00d4aa',
              marginBottom: '10px'
            }}>
              {feature.title}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#cccccc',
              lineHeight: '1.4',
              margin: 0
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;