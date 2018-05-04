'use strict';

const fs = require('fs'); // Для работы с файлами

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
const InitGraph = (filePath, isOriented, needTrans) => {
  const fileData = fs.readFileSync(filePath); // Прочитать данные из файла
  const data = fileData
    .toString()
    .split("\n")
    .filter(str => str); // Разложить данные файла по строкам и удалить пустые строки

  // По первой строке в файле:
  // [JS]: форма записи const [n, m] = array - означает деструктуризация массива в перменные
  const [n, m] = data[0].split(' ').map(item => parseInt(item)); // достать количество вершин и рёбер
  const matrix = initEmptyMatrix(n, n); // наполнение матрицы смежности пустыми значениями
  let transMatrix = [];
  let transEdges = {};

  // По остальным строкам в файле - рёбрам - заполнить матрицу смежности
  for (let i = 1; i <= m; i++) {
    const [v, u] = data[i].split(' ');
    if (v && u) {
      if (isOriented) { // Не симметричное заполнение матрицы смежности для ориентированного графа
        matrix[v - 1][u - 1] = 1;
      } else { // Симметричное заполнение матрицы смежности для неориентированного графа
        matrix[v - 1][u - 1] = matrix[u - 1][v - 1] = 1;
      }
    }
  };

  // Выписать рёбра на основе матрицы смежности
  const edges = matrix.reduce((res, line, i) => {
    res[i + 1] = line
        .map((col, j) => col ? j + 1 : null)
        .filter(n => n)
        .sort((a, b) => a > b);
    return res;
  }, {});

  if (needTrans) {
    transMatrix = initEmptyMatrix(n, n); // наполнение транспорированной матрицы смежности пустыми значениями

    // Заполнить матрицу смежности для транспорированного графа
    for (let i = 1; i <= m; i++) {
      const [u, v] = data[i].split(' ');
      transMatrix[v - 1][u - 1] = 1;
    };

    // Найти рёбра транспорированного графа на основе матрицы смежности
    transEdges = transMatrix.reduce((res, line, i) => {
      res[i + 1] = line
          .map((col, j) => col ? j + 1 : null)
          .filter(n => n)
          .sort((a, b) => a > b);
      return res;
    }, {});
  }

  // Вернуть информацию про граф:
  return {
    n, // количество вершин
    m, // количество рёбер
    matrix, // матрица смежности
    edges, // рёбра графа
    data, // входящие данные (списком рёбер)
    transMatrix, // матрица смежности транспорированного графа
    transEdges, // рёбра графа транспорированного графа
  };
};

module.exports = InitGraph; // Экспорт для использования во внешних файлах
