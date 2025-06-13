import React, { useState, useCallback } from 'react';

// Tipos TypeScript
type SolutionType = 'unique' | 'infinite' | 'none';

interface Solution {
  type: SolutionType;
  values?: number[];
  message: string;
}

// Componente Principal
const LinearSystemCalculator: React.FC = () => {
  const [numVariables, setNumVariables] = useState<number>(2);
  const [numEquations, setNumEquations] = useState<number>(2);
  const [coefficientsMatrix, setCoefficientsMatrix] = useState<number[][]>([[1, 1], [1, -1]]);
  const [constantsVector, setConstantsVector] = useState<number[]>([3, 1]);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [error, setError] = useState<string>('');
  
  // NOVO: Estado para nomes das variáveis
  const [variableNames, setVariableNames] = useState<string[]>(['x', 'y']);

  // NOVO: Opções predefinidas de variáveis
  const variablePresets = [
    { name: 'Matemática', vars: ['x', 'y', 'z', 'w', 'v', 'u', 't', 's', 'r', 'q'] },
    { name: 'Alfabeto', vars: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] },
    { name: 'Grego', vars: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ'] },
    { name: 'Numerado', vars: ['x₁', 'x₂', 'x₃', 'x₄', 'x₅', 'x₆', 'x₇', 'x₈', 'x₉', 'x₁₀'] }
  ];

  // NOVO: Função para mudar preset de variáveis
  const changeVariablePreset = (presetIndex: number) => {
    const preset = variablePresets[presetIndex];
    setVariableNames(preset.vars.slice(0, numVariables));
  };

  // NOVO: Função para editar nome de variável individual
  const updateVariableName = (index: number, newName: string) => {
    if (newName.length <= 3) { // Limitar a 3 caracteres
      const newNames = [...variableNames];
      newNames[index] = newName || `x${index + 1}`;
      setVariableNames(newNames);
    }
  };

  // Funções para atualizar dimensões do sistema
  const updateSystemSize = useCallback((newEquations: number, newVariables: number) => {
    const createMatrix = (rows: number, cols: number) => 
      Array(rows).fill(0).map(() => Array(cols).fill(0));

    setNumEquations(newEquations);
    setNumVariables(newVariables);
    setCoefficientsMatrix(createMatrix(newEquations, newVariables));
    setConstantsVector(Array(newEquations).fill(0));
    
    // NOVO: Ajustar nomes das variáveis
    const currentPreset = variablePresets[0]; // Usar matemática como padrão
    const newNames = Array(newVariables).fill(0).map((_, i) => 
      variableNames[i] || currentPreset.vars[i] || `x${i + 1}`
    );
    setVariableNames(newNames);
    
    setSolution(null);
  }, [variableNames]);

  const incrementEquations = () => {
    if (numEquations < 10) updateSystemSize(numEquations + 1, numVariables);
  };

  const decrementEquations = () => {
    if (numEquations > 1) updateSystemSize(numEquations - 1, numVariables);
  };

  const incrementVariables = () => {
    if (numVariables < 10) updateSystemSize(numEquations, numVariables + 1);
  };

  const decrementVariables = () => {
    if (numVariables > 1) updateSystemSize(numEquations, numVariables - 1);
  };

  // Função para atualizar coeficientes
  const updateCoefficient = (row: number, col: number, value: string) => {
    let numValue: number;
    
    if (value === '' || value === '-') {
      numValue = 0;
    } else {
      const parsed = parseFloat(value);
      numValue = isNaN(parsed) ? 0 : parsed;
    }
    
    const newMatrix = coefficientsMatrix.map((r, i) => 
      r.map((c, j) => (i === row && j === col) ? numValue : c)
    );
    
    setCoefficientsMatrix(newMatrix);
  };

  // Função para atualizar constantes
  const updateConstant = (row: number, value: string) => {
    let numValue: number;
    
    if (value === '' || value === '-') {
      numValue = 0;
    } else {
      const parsed = parseFloat(value);
      numValue = isNaN(parsed) ? 0 : parsed;
    }
    
    const newVector = constantsVector.map((c, i) => (i === row) ? numValue : c);
    setConstantsVector(newVector);
  };

  // Método de Eliminação de Gauss
  const solveLinearSystem = (): Solution => {
    const n = numEquations;
    const m = numVariables;
    
    // Criar matriz aumentada
    const augmentedMatrix = coefficientsMatrix.map((row, i) => [...row, constantsVector[i]]);
    
    // Eliminação de Gauss
    for (let i = 0; i < Math.min(n, m); i++) {
      // Encontrar pivô
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
          maxRow = k;
        }
      }
      
      // Trocar linhas
      [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
      
      // Tornar diagonal principal = 1
      const pivot = augmentedMatrix[i][i];
      if (Math.abs(pivot) < 1e-10) continue;
      
      for (let j = 0; j <= m; j++) {
        augmentedMatrix[i][j] /= pivot;
      }
      
      // Eliminar coluna
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmentedMatrix[k][i];
          for (let j = 0; j <= m; j++) {
            augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
          }
        }
      }
    }
    
    // Verificar inconsistência
    for (let i = 0; i < n; i++) {
      let allZero = true;
      for (let j = 0; j < m; j++) {
        if (Math.abs(augmentedMatrix[i][j]) > 1e-10) {
          allZero = false;
          break;
        }
      }
      if (allZero && Math.abs(augmentedMatrix[i][m]) > 1e-10) {
        return { type: 'none', message: 'Sistema impossível (sem solução)' };
      }
    }
    
    // Extrair solução
    if (n === m) {
      const values = augmentedMatrix.map(row => row[m]);
      return { 
        type: 'unique', 
        values, 
        message: 'Sistema com solução única' 
      };
    } else if (n < m) {
      return { 
        type: 'infinite', 
        message: 'Sistema com infinitas soluções (subdeterminado)' 
      };
    } else {
      return { 
        type: 'none', 
        message: 'Sistema sobredeterminado - verificar compatibilidade' 
      };
    }
  };

  // Executar resolução
  const executeCalculation = () => {
    try {
      const result = solveLinearSystem();
      setSolution(result);
      setError('');
    } catch (err) {
      setError('Erro no cálculo do sistema');
      setSolution(null);
    }
  };

  // Limpar sistema
  const clearSystem = () => {
    setCoefficientsMatrix(Array(numEquations).fill(0).map(() => Array(numVariables).fill(0)));
    setConstantsVector(Array(numEquations).fill(0));
    setSolution(null);
    setError('');
  };

  // Renderizar resultado ATUALIZADO
  const renderSolution = () => {
    if (!solution) return null;

    return (
      <div 
        className="solution-section"
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#4a4a6a', // Roxo escuro
          borderRadius: '8px',
          border: '2px solid #8b5cf6' // Roxo claro
        }}
      >
        <h3 
          style={{
            color: '#c4b5fd', // Roxo claro
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          Solução do Sistema
        </h3>
        
        <div 
          style={{
            textAlign: 'center',
            marginBottom: '15px',
            color: '#e5e7eb' // Branco suave
          }}
        >
          <strong>{solution.message}</strong>
        </div>

        {solution.values && (
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            {solution.values.map((value, i) => (
              <div 
                key={i}
                style={{
                  backgroundColor: '#374151', // Cinza escuro
                  color: '#8b5cf6', // Roxo
                  padding: '10px 15px',
                  borderRadius: '6px',
                  border: '1px solid #6b7280',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {variableNames[i]} = {Number.isInteger(value) ? value : value.toFixed(4)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="linear-system-calculator"
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#1f2937', // Cinza escuro base
        color: '#f9fafb', // Branco suave
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowY: 'auto'
      }}
    >
      <h1 
        style={{
          textAlign: 'center',
          color: '#8b5cf6', // Roxo
          marginBottom: '30px',
          fontSize: '28px'
        }}
      >
        Calculadora de Sistemas Lineares
      </h1>

      {/* NOVO: Seletor de variáveis */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#374151',
          borderRadius: '8px',
          border: '1px solid #6b7280'
        }}
      >
        <h3 style={{ color: '#8b5cf6', margin: '0', fontSize: '16px' }}>
          Configurar Variáveis
        </h3>
        
        {/* Presets de variáveis */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {variablePresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => changeVariablePreset(index)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Editor individual de variáveis */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {variableNames.slice(0, numVariables).map((name, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: '#9ca3af' }}>Var {i + 1}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => updateVariableName(i, e.target.value)}
                maxLength={3}
                style={{
                  width: '40px',
                  height: '30px',
                  backgroundColor: '#1f2937',
                  color: '#8b5cf6',
                  border: '1px solid #6b7280',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Controles de dimensão - CORES ATUALIZADAS */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '30px',
          alignItems: 'center'
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <label 
            style={{
              fontSize: '14px',
              color: '#d1d5db' // Branco suave
            }}
          >
            Equações
          </label>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <button
              onClick={decrementEquations}
              disabled={numEquations <= 1}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: numEquations <= 1 ? '#6b7280' : '#8b5cf6', // Roxo
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: numEquations <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              -
            </button>
            <span 
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center',
                color: '#f9fafb'
              }}
            >
              {numEquations}
            </span>
            <button
              onClick={incrementEquations}
              disabled={numEquations >= 10}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: numEquations >= 10 ? '#6b7280' : '#8b5cf6', // Roxo
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: numEquations >= 10 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              +
            </button>
          </div>
        </div>

        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <label 
            style={{
              fontSize: '14px',
              color: '#d1d5db' // Branco suave
            }}
          >
            Variáveis
          </label>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <button
              onClick={decrementVariables}
              disabled={numVariables <= 1}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: numVariables <= 1 ? '#6b7280' : '#8b5cf6', // Roxo
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: numVariables <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              -
            </button>
            <span 
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center',
                color: '#f9fafb'
              }}
            >
              {numVariables}
            </span>
            <button
              onClick={incrementVariables}
              disabled={numVariables >= 10}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: numVariables >= 10 ? '#6b7280' : '#8b5cf6', // Roxo
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: numVariables >= 10 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Sistema de equações - ATUALIZADO COM NOMES PERSONALIZADOS */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '30px'
        }}
      >
        <h3 
          style={{
            color: '#8b5cf6', // Roxo
            marginBottom: '15px'
          }}
        >
          Sistema de Equações
        </h3>
        
        {coefficientsMatrix.map((row, i) => (
          <div 
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              backgroundColor: '#374151', // Cinza escuro
              borderRadius: '6px',
              border: '1px solid #8b5cf6' // Roxo
            }}
          >
            {row.map((coeff, j) => (
              <React.Fragment key={j}>
                <input
                  type="number"
                  value={coeff === 0 ? '' : coeff.toString()}
                  onChange={(e) => updateCoefficient(i, j, e.target.value)}
                  placeholder="0"
                  step="any"
                  style={{
                    width: '60px',
                    height: '35px',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    border: '1px solid #6b7280',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                />
                <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                  {variableNames[j] || `x${j + 1}`}
                </span>
                {j < row.length - 1 && (
                  <span style={{ color: '#d1d5db' }}>+</span>
                )}
              </React.Fragment>
            ))}
            <span style={{ color: '#d1d5db', margin: '0 10px' }}>=</span>
            <input
              type="number"
              value={constantsVector[i] === 0 ? '' : constantsVector[i].toString()}
              onChange={(e) => updateConstant(i, e.target.value)}
              placeholder="0"
              step="any"
              style={{
                width: '60px',
                height: '35px',
                backgroundColor: '#1f2937',
                color: '#c4b5fd', // Roxo claro
                border: '1px solid #6b7280',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            />
          </div>
        ))}
      </div>

      {/* Botões de ação - CORES ATUALIZADAS */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '30px'
        }}
      >
        <button
          onClick={executeCalculation}
          style={{
            padding: '15px 30px',
            backgroundColor: '#8b5cf6', // Roxo
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
        >
          Resolver Sistema
        </button>

        <button
          onClick={clearSystem}
          style={{
            padding: '15px 30px',
            backgroundColor: '#6366f1', // Azul-roxo
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
        >
          Limpar Sistema
        </button>
      </div>

      {renderSolution()}

      {/* Modal de erro - CORES ATUALIZADAS */}
      {error && (
        <>
          <div 
            onClick={() => setError('')}
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: '999'
            }}
          />
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#374151',
              color: '#f9fafb',
              padding: '20px 30px',
              borderRadius: '8px',
              border: '2px solid #ef4444', // Vermelho para erro
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              zIndex: '1000',
              textAlign: 'center'
            }}
          >
            <div>{error}</div>
            <button
              onClick={() => setError('')}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Fechar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LinearSystemCalculator;