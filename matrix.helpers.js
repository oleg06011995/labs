
// Инициализировать единичную матрицу. n - количество строк/столбцов
const initMatrixI = (n) => {
  const I = [];
  for (let i = 0; i < n; i++) {
    I[i] = [];
    for (let j = 0; j < n; j++) {
      I[i][j] = (i === j) ? 1 : 0;
    }
  }
  return I;
};

// Преобразование всех значений >0 в 1, а всех 0 в 0.
const boolTransform = (matrix) => {
  const res = [];
  for (let i = 0; i < matrix.length; i++) {
    res[i] = [];
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        res[i][j] = 1;
      } else {
        res[i][j] = 0;
      }
    }
  }
  return res;
};

// Сравнить матрицу с матрицей J, у которой все члены равны 1
const compareWithJ = (matrix) => {
  return matrix.every(i => i.every(j => j === 1));
};

// Произведение двух матриц
const multiply = (A, B) => {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;
  const C = [];
  if (colsA !== rowsB) return false;
  for (let i = 0; i < rowsA; i++) {
    C[i] = [];
  }
  for (let k = 0; k < colsB; k++) {
    for (let i = 0; i < rowsA; i++) {
      let t = 0;
      for (let j = 0; j < rowsB; j++) {
        t += A[i][j] * B[j][k];
      }
      C[i][k] = t;
    }
  }
  return C;
};

// Сумма любого количества матриц
const sum = (...matrix) => {
  const m = matrix[0].length;
  const n = matrix[0][0].length;
  const C = [];
  for (var i = 0; i < m; i++) { 
    C[i] = [];
    for (var j = 0; j < n; j++) {
      C[i][j] = matrix.reduce((sum, A) => sum + A[i][j], 0)
    }
  }
  return C;
};

// Возведение матрицы в степень
const pow = (n, A) => {
  if (n == 1) {
    return A;
  } else {
    return multiply(A, pow(n - 1, A));
  }
}

// Транспонирование матрицы
const trans = (A) => {
  const m = A.length;
  const n = A[0].length;
  const AT = [];
  for (var i = 0; i < n; i++) {
    AT[i] = [];
    for (var j = 0; j < m; j++) {
      AT[i][j] = A[j][i];
    }
  }
  return AT;
}

module.exports = {
  initMatrixI,
  boolTransform,
  compareWithJ,
  multiply,
  sum,
  pow,
  trans
}
