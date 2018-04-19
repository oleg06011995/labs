// Хэлпер для инициализации пустой матрицы
const initEmptyMatrix = (lines, columns) => {
  const mtrx = [];
  for (let i = 0; i < lines; i++) {
    mtrx[i] = [];
    for (let j = 0; j < columns; j++){
      mtrx[i].push(0);
    }
  }
  return mtrx;
};

// Инициализация матрицы смежности
const AdjacencyMatrix = (data, isOriented) => {
  let n = 0;
  let m = 0;
  let matrix = [];
  data.forEach((line, i) => {
    // Для первой строки в файле со значениями количества вершин и ребёр
    if(i === 0) {
      // Деструктуризация массива в переменные
      [n, m] = line.split(' ').map(item => parseInt(item));
      // Наполнение массива матрицы смежности пустыми значениями
      matrix = initEmptyMatrix(n, n);
    } 
    // Для всех остальных строк в файле
    else {
      const [v, u] = line.split(' ');
      if (isOriented) { // Не симметричное заполнение матрицы смежности для ориентированного графа
        matrix[v - 1][u - 1] = 1;
      } else { // Симметричное заполнение матрицы смежности для неориентированного графа
        matrix[v - 1][u - 1] = matrix[u - 1][v - 1] = 1;
      }
    }
  });
  return { n, m, matrix, data };
};

module.exports = AdjacencyMatrix; // Экспорт для использования во внешних файлах
