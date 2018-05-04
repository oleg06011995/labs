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
const InitGraph = (filePath, isOriented) => {
  const fileData = fs.readFileSync(filePath); // Прочитать данные из файла
  const data = fileData
    .toString()
    .split("\n")
    .filter(str => str); // Разложить данные файла по строкам и удалить пустые строки
  const edgeList = [];
  let isNegative = false;

  // По первой строке в файле:
  // [JS]: форма записи const [n, m] = array - означает деструктуризация массива в перменные
  const [n, m] = data[0].split(' ').map(item => parseInt(item)); // достать количество вершин и рёбер
  const matrix = initEmptyMatrix(n, n); // наполнение матрицы смежности пустыми значениями

  // По остальным строкам в файле - рёбрам - заполнить матрицу смежности
  for (let i = 1; i <= m; i++) {
    const [v, u, w] = data[i].split(' ');
    edgeList.push({ 
      first: v, 
      second: u, 
      weight: w
    })
    isNegative = w < 0 ? true : isNegative;
    if (isOriented) { // Не симметричное заполнение матрицы смежности для ориентированного графа
      matrix[v - 1][u - 1] = w;
    } else { // Симметричное заполнение матрицы смежности для неориентированного графа
      matrix[v - 1][u - 1] = matrix[u - 1][v - 1] = w;
    }
  };

  // Выписать рёбра на основе матрицы смежности, где значение с индексом ij - вес ребра
  const edges = matrix.reduce((res, line, i) => {
    res[i + 1] = line.reduce((obj, col, j) => {
      if (col) {
        obj[j + 1] = +col;
      }
      return obj;
    }, {})
    return res;
  }, {});

  // Вернуть информацию про граф:
  return {
    n, // количество вершин
    m, // количество рёбер
    matrix, // матрица смежности
    edges, // рёбра графа списком из каждой вершины
    edgeList, // все рёбра графа списком
    data, // входящие данные
    isNegative, // присутствуют отрицательные веса ребёр
  };
};

module.exports = InitGraph; // Экспорт для использования во внешних файлах
