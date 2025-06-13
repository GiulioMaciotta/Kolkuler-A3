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
      path: '/tasks',
      color: '#10b981' // Verde
    },
    {
      id: 'calendar',
      title: 'Calendário',
      description: 'Visualize seus compromissos e prazos em um calendário intuitivo e personalizável.',
      icon: '📅',
      path: '/calendar',
      color: '#10b981' // Verde
    },
    {
      id: 'matrix',
      title: 'Calculadora de Matrizes',
      description: 'Execute operações matemáticas com matrizes: soma, subtração, multiplicação, determinante e transposta.',
      icon: '📊',
      path: '/matrix',
      color: '#3b82f6' // Azul
    },
    {
      id: 'linear-system',
      title: 'Sistemas Lineares',
      description: 'Resolva sistemas de equações lineares com múltiplas variáveis usando eliminação gaussiana.',
      icon: '🔢',
      path: '/linear-system',
      color: '#8b5cf6' // Roxo
    },
    {
      id: 'notes',
      title: 'Notas e Lembretes',
      description: 'Anote ideias importantes, crie lembretes e mantenha suas informações organizadas.',
      icon: '📝',
      path: '/notes',
      color: '#10b981' // Verde
    }
  ];

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        marginBottom: '40px'
      }}>
        <h1 style={{
          color: '#f9fafb', // Branco suave
          fontSize: '36px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Bem-vindo ao Kolkuler
        </h1>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          color: '#d1d5db', // Cinza claro
          marginBottom: '15px'
        }}>
          Seu organizador pessoal completo com ferramentas matemáticas integradas. 
        </p>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#9ca3af', // Cinza médio
          marginBottom: '30px'
        }}>
          Organize sua vida e facilite seus estudos com nossas ferramentas especializadas:
        </p>
        
        {/* Categorias */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#10b981',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            <span>●</span> Produtividade
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#3b82f6',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            <span>●</span> Matemática - Matrizes
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#8b5cf6',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            <span>●</span> Matemática - Sistemas
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        marginTop: '40px'
      }}>
        {features.map((feature) => (
          <div
            key={feature.id}
            style={{
              backgroundColor: '#374151', // Cinza escuro
              border: `2px solid ${feature.color}`,
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => handleFeatureClick(feature.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = `0 12px 30px ${feature.color}40`;
              e.currentTarget.style.backgroundColor = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = '#374151';
            }}
          >
            {/* Borda decorativa */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: `linear-gradient(90deg, ${feature.color}, ${feature.color}80)`
            }} />
            
            <div style={{
              fontSize: '52px',
              marginBottom: '20px',
              color: feature.color,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>
              {feature.icon}
            </div>
            
            <h3 style={{
              fontSize: '20px',
              color: feature.color,
              marginBottom: '15px',
              fontWeight: 'bold'
            }}>
              {feature.title}
            </h3>
            
            <p style={{
              fontSize: '14px',
              color: '#d1d5db', // Cinza claro
              lineHeight: '1.5',
              margin: 0
            }}>
              {feature.description}
            </p>

            {/* Indicador de categoria */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '15px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: feature.color,
              opacity: 0.7
            }} />
          </div>
        ))}
      </div>

      {/* Seção de estatísticas */}
      <div style={{
        marginTop: '60px',
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#f9fafb',
            marginBottom: '5px'
          }}>
            5
          </div>
          <div style={{ fontSize: '12px' }}>
            Ferramentas
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#f9fafb',
            marginBottom: '5px'
          }}>
            2
          </div>
          <div style={{ fontSize: '12px' }}>
            Calc. Matemáticas
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#f9fafb',
            marginBottom: '5px'
          }}>
            v1.0.1
          </div>
          <div style={{ fontSize: '12px' }}>
            Versão Atual
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;