import React, { useState, useCallback } from 'react';

// Tipos TypeScript
type Operation = 'add' | 'subtract' | 'multiply' | 'determinant';

// Componente Principal
const MatrixCalculator: React.FC = () => {
  const [rows, setRows] = useState<number>(2);
  const [cols, setCols] = useState<number>(2);
  const [matrixA, setMatrixA] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[0, 0], [0, 0]]);
  const [result, setResult] = useState<number[][] | null>(null);
  const [error, setError] = useState<string>('');

  // Funções para atualizar dimensões das matrizes
  const updateMatrixSize = useCallback((newRows: number, newCols: number) => {
    const createMatrix = (r: number, c: number) => 
      Array(r).fill(0).map(() => Array(c).fill(0));

    setRows(newRows);
    setCols(newCols);
    setMatrixA(createMatrix(newRows, newCols));
    setMatrixB(createMatrix(newRows, newCols));
    setResult(null);
  }, []);

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

  // Função para atualizar valores das matrizes
  const updateMatrixValue = (matrix: 'A' | 'B', row: number, col: number, value: string) => {
    let numValue: number;
    
    if (value === '' || value === '-') {
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

  // Executar operações
  const executeOperation = (operation: Operation) => {
    try {
      let result: number[][];

      switch (operation) {
        case 'add':
        case 'subtract':
          if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            throw new Error('Operação inválida');
          }
          result = operation === 'add' ? addMatrices(matrixA, matrixB) : subtractMatrices(matrixA, matrixB);
          break;

        case 'multiply':
          if (matrixA[0].length !== matrixB.length) {
            throw new Error('Operação inválida');
          }
          result = multiplyMatrices(matrixA, matrixB);
          break;

        case 'determinant':
          if (matrixA.length !== matrixA[0].length) {
            throw new Error('Operação inválida');
          }
          const det = calculateDeterminant(matrixA);
          result = [[det]];
          break;

        default:
          throw new Error('Operação inválida');
      }

      setResult(result);
    } catch (err) {
      setError('Operação inválida');
    }
  };

  const renderMatrix = (matrix: number[][], matrixType: 'A' | 'B', title: string) => (
    <div className="matrix-section">
      <h3 className="matrix-title">{title}</h3>
      <div 
        className="matrix"
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
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              className="matrix-input"
              type="number"
              value={val || ''}
              onChange={(e) => updateMatrixValue(matrixType, i, j, e.target.value)}
              step="0.1"
              style={{
                width: '50px',
                height: '40px',
                backgroundColor: '#2a2a2a',
                color: 'white',
                border: '1px solid #555555',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '14px'
              }}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="result-section">
        <h3 className="result-title">Resultado</h3>
        <div 
          className="result-matrix"
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
                className="result-cell"
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
                {Number.isInteger(val) ? val : val.toFixed(2)}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="matrix-calculator"
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#2a2a2a',
        color: '#ffffff',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowY: 'auto'
      }}
    >
      <h1 
        className="title"
        style={{
          textAlign: 'center',
          color: '#4a90e2',
          marginBottom: '30px',
          fontSize: '28px'
        }}
      >
        Calculadora de Matrizes
      </h1>
      
      <div 
        className="top-controls"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '30px',
          alignItems: 'center'
        }}
      >
        <div 
          className="stepper-group"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <label 
            className="stepper-label"
            style={{
              fontSize: '14px',
              color: '#cccccc'
            }}
          >
            Linhas
          </label>
          <div 
            className="stepper-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <button
              className="stepper-button"
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
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              -
            </button>
            <span 
              className="stepper-value"
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center'
              }}
            >
              {rows}
            </span>
            <button
              className="stepper-button"
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
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          </div>
        </div>

        <div 
          className="stepper-group"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <label 
            className="stepper-label"
            style={{
              fontSize: '14px',
              color: '#cccccc'
            }}
          >
            Colunas
          </label>
          <div 
            className="stepper-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <button
              className="stepper-button"
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
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              -
            </button>
            <span 
              className="stepper-value"
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center'
              }}
            >
              {cols}
            </span>
            <button
              className="stepper-button"
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
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div 
        className="matrices-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '30px',
          marginBottom: '30px'
        }}
      >
        <div 
          className="matrix-section"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <h3 
            className="matrix-title"
            style={{
              color: '#4a90e2',
              margin: '0',
              fontSize: '18px'
            }}
          >
            Matriz A
          </h3>
          <div 
            className="matrix"
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
                  className="matrix-input"
                  type="number"
                  value={val.toString()}  
                  onChange={(e) => updateMatrixValue('A', i, j, e.target.value)}
                  step="0.1"
                  style={{
                    width: '50px',
                    height: '40px',
                    backgroundColor: '#2a2a2a',
                    color: 'white',
                    border: '1px solid #555555',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div 
          className="matrix-section"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <h3 
            className="matrix-title"
            style={{
              color: '#4a90e2',
              margin: '0',
              fontSize: '18px'
            }}
          >
            Matriz B
          </h3>
          <div 
            className="matrix"
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
                  className="matrix-input"
                  type="number"
                  value={val.toString()}
                  onChange={(e) => updateMatrixValue('B', i, j, e.target.value)}
                  step="0.1"
                  style={{
                    width: '50px',
                    height: '40px',
                    backgroundColor: '#2a2a2a',
                    color: 'white',
                    border: '1px solid #555555',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div 
        className="operation-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          marginTop: '40px'
        }}
      >
        <div 
          className="operation-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}
        >
          <button
            className="operation-button"
            onClick={() => executeOperation('add')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Somar (A + B)
          </button>
          <button
            className="operation-button"
            onClick={() => executeOperation('subtract')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Subtrair (A - B)
          </button>
          <button
            className="operation-button"
            onClick={() => executeOperation('multiply')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Multiplicar (A × B)
          </button>
          <button
            className="operation-button"
            onClick={() => executeOperation('determinant')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Det(A)
          </button>
        </div>
      </div>

      {renderResult()}

      {error && (
        <>
          <div 
            className="error-overlay"
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
            className="error-popup"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#3a3a3a',
              color: 'white',
              padding: '20px 30px',
              borderRadius: '8px',
              border: '2px solid #ff4444',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              zIndex: '1000',
              textAlign: 'center'
            }}
          >
            <div>{error}</div>
            <button
              className="close-button"
              onClick={() => setError('')}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cc3333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff4444'}
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