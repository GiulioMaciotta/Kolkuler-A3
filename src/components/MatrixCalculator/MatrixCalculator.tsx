import React, { useState, useCallback } from 'react';

// Tipos TypeScript
type Operation = 'add' | 'subtract' | 'multiply' | 'determinant' | 'transposeA' | 'transposeB';

// Componente Principal
const MatrixCalculator: React.FC = () => {
  const [rows, setRows] = useState<number>(2);
  const [cols, setCols] = useState<number>(2);
  const [matrixA, setMatrixA] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[0, 0], [0, 0]]);
  const [result, setResult] = useState<number[][] | null>(null);
  const [error, setError] = useState<string>('');

  // Funções para atualizar dimensões das matrizes PRESERVANDO valores
  const updateMatrixSize = useCallback((newRows: number, newCols: number) => {
    const preserveMatrix = (oldMatrix: number[][], r: number, c: number) => {
      const newMatrix = Array(r).fill(0).map(() => Array(c).fill(0));
      
      for (let i = 0; i < Math.min(oldMatrix.length, r); i++) {
        for (let j = 0; j < Math.min(oldMatrix[0].length, c); j++) {
          newMatrix[i][j] = oldMatrix[i][j];
        }
      }
      
      return newMatrix;
    };

    setRows(newRows);
    setCols(newCols);
    setMatrixA(preserveMatrix(matrixA, newRows, newCols));
    setMatrixB(preserveMatrix(matrixB, newRows, newCols));
    setResult(null);
    setError('');
  }, [matrixA, matrixB]);

  const incrementRows = () => {
    if (rows < 10) updateMatrixSize(rows + 1, cols);
  };

  const decrementRows = () => {
    if (rows > 1) updateMatrixSize(rows - 1, cols);
  };

  const incrementCols = () => {
    if (cols < 10) updateMatrixSize(rows, cols + 1);
  };

  const decrementCols = () => {
    if (cols > 1) updateMatrixSize(rows, cols - 1);
  };

  // Função CORRIGIDA para atualizar valores das matrizes
  const updateMatrixValue = (matrix: 'A' | 'B', row: number, col: number, value: string) => {
    // Permitir valores vazios, negativos e decimais
    let numValue: number;
    
    if (value === '' || value === '-' || value === '.') {
      numValue = 0;
    } else {
      const parsed = parseFloat(value);
      numValue = isNaN(parsed) ? 0 : parsed;
    }
    
    const setter = matrix === 'A' ? setMatrixA : setMatrixB;
    const currentMatrix = matrix === 'A' ? matrixA : matrixB;
    
    const newMatrix = currentMatrix.map((r, i) => 
      r.map((c, j) => (i === row && j === col) ? numValue : c)
    );
    
    setter(newMatrix);
    setResult(null); // Limpar resultado quando valores mudam
  };

  // Funções de cálculo
  const addMatrices = (a: number[][], b: number[][]): number[][] => {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  };

  const subtractMatrices = (a: number[][], b: number[][]): number[][] => {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  };

  const multiplyMatrices = (a: number[][], b: number[][]): number[][] => {
    const result = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
    
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    
    return result;
  };

  const calculateDeterminant = (matrix: number[][]): number => {
    const n = matrix.length;
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = matrix.slice(1).map(row => row.filter((_, colIndex) => colIndex !== j));
      det += matrix[0][j] * Math.pow(-1, j) * calculateDeterminant(minor);
    }
    
    return det;
  };

  // Função para calcular transposta
  const transposeMatrix = (matrix: number[][]): number[][] => {
    const transposed = Array(matrix[0].length).fill(0).map(() => Array(matrix.length).fill(0));
    
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        transposed[j][i] = matrix[i][j];
      }
    }
    
    return transposed;
  };

  // Executar operações
  const executeOperation = (operation: Operation) => {
    try {
      setError(''); // Limpar erro anterior
      let result: number[][];

      switch (operation) {
        case 'add':
        case 'subtract':
          if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            throw new Error('Matrizes devem ter as mesmas dimensões para soma/subtração');
          }
          result = operation === 'add' ? addMatrices(matrixA, matrixB) : subtractMatrices(matrixA, matrixB);
          break;

        case 'multiply':
          if (matrixA[0].length !== matrixB.length) {
            throw new Error('Número de colunas de A deve ser igual ao número de linhas de B para multiplicação');
          }
          result = multiplyMatrices(matrixA, matrixB);
          break;

        case 'determinant':
          if (matrixA.length !== matrixA[0].length) {
            throw new Error('Determinante só existe para matrizes quadradas');
          }
          const det = calculateDeterminant(matrixA);
          result = [[det]];
          break;

        case 'transposeA':
          result = transposeMatrix(matrixA);
          break;

        case 'transposeB':
          result = transposeMatrix(matrixB);
          break;

        default:
          throw new Error('Operação inválida');
      }

      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setResult(null);
    }
  };

  // Função para limpar tudo
  const clearAll = () => {
    setMatrixA(Array(rows).fill(0).map(() => Array(cols).fill(0)));
    setMatrixB(Array(rows).fill(0).map(() => Array(cols).fill(0)));
    setResult(null);
    setError('');
  };

  // Renderizar resultado
  const renderResult = () => {
    if (!result) return null;

    return (
      <div 
        style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}
      >
        <h3 
          style={{
            color: '#4a90e2',
            margin: '0',
            fontSize: '20px'
          }}
        >
          Resultado
        </h3>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${result[0].length}, 1fr)`,
            gap: '4px',
            padding: '15px',
            backgroundColor: '#3a3a3a',
            borderRadius: '8px',
            border: '2px solid #4a90e2'
          }}
        >
          {result.map((row, i) =>
            row.map((val, j) => (
              <div
                key={`result-${i}-${j}`}
                style={{
                  width: '60px',
                  height: '40px',
                  backgroundColor: '#2a2a2a',
                  color: '#4a90e2',
                  border: '1px solid #555555',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {Number.isInteger(val) ? val : val.toFixed(3)}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#2a2a2a',
        color: '#ffffff',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <h1 
        style={{
          textAlign: 'center',
          color: '#4a90e2',
          marginBottom: '30px',
          fontSize: '28px'
        }}
      >
        Calculadora de Matrizes
      </h1>
      
      {/* Controles de dimensão */}
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
          <label style={{ fontSize: '14px', color: '#cccccc' }}>
            Linhas
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={decrementRows}
              disabled={rows <= 1}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: rows <= 1 ? '#555555' : '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: rows <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              -
            </button>
            <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
              {rows}
            </span>
            <button
              onClick={incrementRows}
              disabled={rows >= 10}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: rows >= 10 ? '#555555' : '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: rows >= 10 ? 'not-allowed' : 'pointer',
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
          <label style={{ fontSize: '14px', color: '#cccccc' }}>
            Colunas
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={decrementCols}
              disabled={cols <= 1}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: cols <= 1 ? '#555555' : '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: cols <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              -
            </button>
            <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
              {cols}
            </span>
            <button
              onClick={incrementCols}
              disabled={cols >= 10}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: cols >= 10 ? '#555555' : '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: cols >= 10 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Matrizes */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '30px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}
      >
        {/* Matriz A */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <h3 style={{ color: '#4a90e2', margin: '0', fontSize: '18px' }}>
            Matriz A
          </h3>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '4px',
              padding: '15px',
              backgroundColor: '#3a3a3a',
              borderRadius: '8px',
              border: '2px solid #4a90e2'
            }}
          >
            {matrixA.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`a-${i}-${j}`}
                  type="number"
                  value={val === 0 ? '' : val.toString()}
                  onChange={(e) => updateMatrixValue('A', i, j, e.target.value)}
                  placeholder="0"
                  step="any"
                  style={{
                    width: '60px',
                    height: '40px',
                    backgroundColor: '#2a2a2a',
                    color: 'white',
                    border: '1px solid #555555',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                  onBlur={(e) => e.target.style.borderColor = '#555555'}
                />
              ))
            )}
          </div>
        </div>

        {/* Matriz B */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <h3 style={{ color: '#4a90e2', margin: '0', fontSize: '18px' }}>
            Matriz B
          </h3>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '4px',
              padding: '15px',
              backgroundColor: '#3a3a3a',
              borderRadius: '8px',
              border: '2px solid #4a90e2'
            }}
          >
            {matrixB.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`b-${i}-${j}`}
                  type="number"
                  value={val === 0 ? '' : val.toString()}
                  onChange={(e) => updateMatrixValue('B', i, j, e.target.value)}
                  placeholder="0"
                  step="any"
                  style={{
                    width: '60px',
                    height: '40px',
                    backgroundColor: '#2a2a2a',
                    color: 'white',
                    border: '1px solid #555555',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                  onBlur={(e) => e.target.style.borderColor = '#555555'}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Botões de operações */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginTop: '40px'
        }}
      >
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '15px',
            maxWidth: '800px',
            width: '100%'
          }}
        >
          <button
            onClick={() => executeOperation('add')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Somar (A + B)
          </button>
          
          <button
            onClick={() => executeOperation('subtract')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Subtrair (A - B)
          </button>
          
          <button
            onClick={() => executeOperation('multiply')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Multiplicar (A × B)
          </button>
          
          <button
            onClick={() => executeOperation('determinant')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Det(A)
          </button>
          
          <button
            onClick={() => executeOperation('transposeA')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
          >
            Transposta A (Aᵀ)
          </button>
          
          <button
            onClick={() => executeOperation('transposeB')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
          >
            Transposta B (Bᵀ)
          </button>
        </div>

        {/* Botão limpar */}
        <button
          onClick={clearAll}
          style={{
            padding: '12px 30px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
        >
          Limpar Tudo
        </button>
      </div>

      {/* Resultado */}
      {renderResult()}

      {/* Modal de erro */}
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
              backgroundColor: '#3a3a3a',
              color: 'white',
              padding: '20px 30px',
              borderRadius: '8px',
              border: '2px solid #e74c3c',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              zIndex: '1000',
              textAlign: 'center',
              maxWidth: '400px'
            }}
          >
            <div style={{ marginBottom: '15px', fontSize: '16px' }}>{error}</div>
            <button
              onClick={() => setError('')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
            >
              Fechar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MatrixCalculator;