'use strict';

// Хэлперы для работы с матрицами
const helpers = require('../matrix.helpers.js');

// Весь код по созданию графа: его матрицы, рёбер
const InitGraph = require('../graph.js');

// Инициализировать граф
const Graph = InitGraph('graph2.txt');

main();

// 1. Степень всех вершин графа
// 2. Является ли граф однородным (если да - степень вершин)
function main() {

  console.log("\nГраф задан списком ребер, де перша строка - n і m - кількість вершин та ребер.\n" + Graph.data.join("\n") + "\n");

  const power = {}; // Степени вершин графа

  // Пройтись по рёбрам и посчитать степени вершин
  for (let i = 1; i <= Graph.m; i++) { // Начать с 1 индекса, так как в 0 индексе хранятся значения n и m
    let topAr = Graph.data[i].split(' ').filter(top => top); // Записываем вершины ребра и исключаем работу с пустыми значениями
    topAr.forEach(top => { // Для каждой вершины делаем инкремент, если она встречается в ребре
      if (!power[top] && topAr.length === 2) {
        power[top] = 1
      } else if (!power[top] && topAr.length === 1) {
        power[top] = 0
      } else {
        power[top]++;
      }
    });
  }
  for (let p in power) {
    console.log("Вершина " + p + " має степінь " + power[p]);
  }

  // Проверить на однородность
  // 1. Вернуть все уникальные элементы
  // 2. Если такой элемент 1, то граф однородный
  const uniqueValues = Object.values(power)
    .reduce((unique, p) => {
      if(unique.indexOf(p) === -1) {
        unique.push(p)
      }
      return unique;
    }, []);
  console.log(
    uniqueValues.length === 1 // Если значение степени вершин одинаково,
      ? "\nГраф однорідний. Степінь однорідності: " + uniqueValues.pop() + "\n" // то граф однородный
      : "\nГраф не є однорідним.\n" // иначе - не однородный
  )

  // Висячие и изолированные вершины
  // 1. Если вершина имеет степень "1" - она висячая
  // 2. Если "0" - изолированная
  let isDiffTop = false;
  for (let p in power) {
    if(power[p] === 1) {
      isDiffTop = true;
      console.log("Вершина " + p + " має степінь " + power[p] + " та є висячою.");
    } else if (power[p] === 0) {
      isDiffTop = true;
      console.log("Вершина " + p + " має степінь " + power[p] + " та є ізольованою.");
    }
  }
  if(!isDiffTop) {
    console.log("У графі немає висячих чи ізольованих вершин.");
  }

  // нахожу матрицу расстояний
  const distanceMatrix = getDistanceMatrix();

  // Получаю набор максимальных расстойний для каждой вершины
  const maxDistances = {};
  for (let i = 0; i < distanceMatrix.length; i++) {
    maxDistances[i + 1] = Math.max(...distanceMatrix[i]);
  }

  // Диаметр графа G -> D(G) = максимально возможное расстояние между двумя его вершинами
  const D = Math.max(...Object.values(maxDistances));
  console.log("\nДіаметр D(G) = " + D);

  // Радиус графа G -> R(G) = максимальное расстояние между двумя вершинами является наименьшим из всех возможных
  const R = Math.min(...Object.values(maxDistances).filter(val => val !== 0)); // искать только среди НЕ нулевых значений
  console.log("\nРадіус R(G) = " + R);

  // Центры графа -> вершина, что максимальное расстояние между ней и другой является наименьшим из всех возможных
  const centers = [];
  for (let v in maxDistances) {
    if (maxDistances[v] === R) {
      centers.push(v); // сохранить центр
    }
  }
  console.log("\nЦентральні вершини: " + centers.join(', ') + "\n");

  // Ярусы графа 
  for (let i = 0; i < distanceMatrix.length; i++) {
    let levels = {};
    for (let j = 0; j < distanceMatrix[i].length; j++) {
      if (distanceMatrix[i][j] !== 0) { // Если дистанция не "0"
        if (!levels[distanceMatrix[i][j]]) { // Если ещё нет этого яруса - создать ярус
          levels[distanceMatrix[i][j]] = [];
        }
        levels[distanceMatrix[i][j]].push(j+1); // Добавить вершину в ярус
      }
    }
    console.log("Вершина " + (i+1) + " має яруси: "
      + (Object.keys(levels).map(dist => "[" + levels[dist] + "]"))
    );
  }

  console.log("\n");
};

// МАТРИЦА РАССТОЯНИЙ
// -> для дальнейшего нахождения метрических характеристик
function getDistanceMatrix() {
  const D = [];
  let matrixPower; // матрица степени матрицы смежности
  let nullPresent = true; // присутствуют не установленные расстояния
  let power = 1; // степень
  let notNull = true;

  // Пока есть нули в графе (флаг nullPresent) и степень матрицы смежности не нулевая матрица (флаг notNull)
  while (nullPresent && notNull) {
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
