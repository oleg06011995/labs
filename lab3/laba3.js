'use strict';

// Хэлперы для работы с матрицами
const helpers = require('../matrix.helpers.js');

// Весь код по созданию графа: его матрицы, рёбер
const InitGraph = require('../graph.js');

// Инициализировать граф
const Graph = InitGraph('graph3.txt', true);

// Хэлпер: композиция функций
const compose = (f1, f2, f3) => (...args) => f3(f2(f1(...args)));

// 1. НАЙТИ МАТРИЦУ РАССТОЯНИЙ
const D = getDistanceMatrix();
console.log("\nМАТРИЦЯ ВІДСТАНЕЙ:");
printMatrix(D);

// 2. НАЙТИ МАТРИЦУ ДОСТИЖИМОСТИ
const R = getReachabilityMatrix();
console.log("\nМАТРИЦЯ ДОСЯЖНОСТІ:");
printMatrix(R);

// 3. НАЙТИ ТИП ГРАФА
console.log("\nТИП ГРАФУ:");
const type = checkGraphType(R);
switch(type) {
  case 'strong':
    console.log("Граф сильно зв’язананий\n");
    break;
  case 'singleSide':
    console.log("Граф однобічно зв’язананий\n");
    break;
  case 'low':
    console.log("Граф слабо зв’язананий\n");
    break;
  default: 
    console.log("Граф не зв’язананий\n")
}

// МАТРИЦА РАССТОЯНИЙ
function getDistanceMatrix() {
  const D = [];
  let matrixPower; // матрица степени матрицы смежности
  let nullPresent = true; // присутствуют не установленные расстояния
  let power = 1; // степень
  let notNull = true;

  // Пока есть нули в графе (флаг nullPresent) и степень матрицы смежности не нулевая матрица (флаг notNull)
  // и пока значение power не превысило количество вершин, потому что такого количества итераций хватит, чтоб заполнить матрицу
  while (nullPresent && notNull && power < Graph.n) {
    nullPresent = false;
    matrixPower = power === 1 // если степень первая, то матрица степени равна матрице смежности
      ? Graph.matrix
      : helpers.multiply(matrixPower, Graph.matrix); // Возвести в степень матрицу смежности
    notNull = matrixPower.some(i => i.some(j => j)) // Проверяю, является ли степень матрицы нулевой матрицей
    for (let i = 0; i < matrixPower.length; i++) {
      D[i] = D[i] || [];
      for (let j = 0; j < matrixPower[i].length; j++) {
        if (i === j) {
          D[i][j] = 0; // диагональ в ноль
        } else if (!D[i][j]) {
          nullPresent = true; // нули присутствуют
          D[i][j] = matrixPower[i][j] ? power : matrixPower[i][j]; // значит установить значение в матрицу расстояний
        }
      }
    }
    power++;
  }
  return D;
};

// МАТРИЦА ДОСТИЖИМОСТИ
// По формуле: B[(I + ∆)^n–1], где:
// n - количество вершин
// B - преобразование всех значений >0 в 1, а всех 0 в 0.
// I - единичная матрица
function getReachabilityMatrix() {
  // 1) Единичная матрица I
  const I = helpers.initMatrixI(Graph.n);
  
  // 2) Сумма матриц смежности и единичной
  let res = helpers.sum(Graph.matrix, I)
  
  // 3) Степень получившейся матрицы (n = количество вершин минус 1)
  res = helpers.pow(Graph.n - 1, res);

  // 4) Булевое преобразование (B - замена всех значений >0 на 1)
  return helpers.boolTransform(res);
};

// ТИП ГРАФА
// При помощи композиции функций compose поочерёдно проверяю ТИП графа
function checkGraphType(R) {
  const I = helpers.initMatrixI(Graph.n); // 1. Единичная матрица I
  let type = helpers.compareWithJ(R) ? 'strong' : null; // Граф сильносвязный
  if (!type) { // Граф одностороннесвязный
    type = compose(
      helpers.sum,
      helpers.boolTransform,
      helpers.compareWithJ
    )(R, helpers.trans(R)) ? 'singleSide' : null;
  }
  if (!type) { // Граф слабосвязный
    type = compose(
      helpers.pow,
      helpers.boolTransform,
      helpers.compareWithJ
    )(
      Graph.n - 1,
      helpers.sum(I, Graph.matrix, helpers.trans(Graph.matrix))
    ) ? 'low' : null;
  }
  return type;
};

// Вывести матрицу
function printMatrix(matrix) {
  matrix.forEach(item => {
    console.log(item.join('\t'));
  });
};
