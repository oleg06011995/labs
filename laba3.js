const helpers = require('./matrix.helpers.js'); // Хэлперы для работы с матрицами
const AdjacencyMatrix = require('./graph.js'); // Весь код по созданию матрицы смежности
const fs = require('fs'); // Для работы с файлами
const fileData = fs.readFileSync('graph.txt'); // Прочитать данные из файла
const dataByStr = fileData
  .toString()
  .split("\n")
  .filter(str => str); // Разложить данные файла по строкам и удалить пустые строки

// Инициализировать граф и его матрицу смежности
const Graph = AdjacencyMatrix(dataByStr, true);

// Хэлпер: композиция функций
const compose = (f1, f2, f3) => (...args) => f3(f2(f1(...args)))

// 1. ЗНАЙТИ МАТРИЦЮ ВІДСТАНЕЙ
const D = getDistanceMatrix();
console.log("\nМАТРИЦЯ ВІДСТАНЕЙ:\n", D, "\n");

// 2. ЗНАЙТИ МАТРИЦЮ ДОСЯЖНОСТІ
const R = getReachabilityMatrix();
console.log("\nМАТРИЦЯ ДОСЯЖНОСТІ:\n", R, "\n")

// 3. ЗНАЙТИ ТИП ГРАФУ
const type = checkGraphType(R);
switch(type) {
  case 'strong':
    console.log("Граф сильно зв’язананий");
    break;
  case 'singleSide':
    console.log("Граф однобічно зв’язананий");
    break;
  case 'low':
    console.log("Граф слабо зв’язананий");
    break;
  default: 
    console.log("Граф не зв’язананий")
}

// МАТРИЦА РАССТОЯНИЙ
function getDistanceMatrix() {
  const D = [];
  let matrixPower;
  let nullPresent = true;
  let power = 1;
  let notNull = true;

  // Пока есть нули в графе (флаг nullPresent) и степень матрицы смежности не нулевая матрица (флаг notNull)
  while (nullPresent && notNull) {
    nullPresent = false;
    power++;
    matrixPower = helpers.multiply(matrixPower || Graph.matrix, Graph.matrix); // Возвести в степень матрицу смежности
    notNull = matrixPower.some(i => i.some(j => j)) // Проверяю, является ли степень матрицы нулевой матрицей
    for (let i = 0; i < matrixPower.length; i++) {
      D[i] = D[i] || [];
      for (let j = 0; j < matrixPower[i].length; j++) {
        if (i === j) {
          D[i][j] = 0;
        } else if (!D[i][j]) {
          nullPresent = true;
          D[i][j] = matrixPower[i][j] ? power : Graph.matrix[i][j];
        }
      }
    }
  }
  return D;
}

// МАТРИЦЯ ДОСЯЖНОСТІ
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
}

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
}
