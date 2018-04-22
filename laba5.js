'use strict';
// При реалізації вважати, що заданий граф є орієнтованим.

// Весь код по созданию графа: его матрицы, рёбер
const InitGraph = require('./graph.js');

// Инициализировать граф
const Graph = InitGraph('graph5.txt', true);

const mark = {}; // Объект для отмечания пройденности вершин
const topSort = {}; // Объект для отмечания топологического порядка вершин
const order = []; // Массив вершин в порядке обратном топологическому
let currentLabel = Graph.n; // Текущий порядок вершин

const canSort = TopologicalSort(Graph); // Возвращает true, если граф ацикличный

if (canSort) {
  console.log("\nТопологічний порядок кожної вершини: ", topSort, "\n");
  console.log("Вершини, відповідно до порядку: ", order.reverse().join(' --- '), "\n");
} else {
  console.log("\nНеможливо відсортувати, оскільки присутній цикл\n");
}

// Сортирует вершины графа
function TopologicalSort(G) {
  let loop = false; // проверка наличия цикла через DFSR метод
  for (let v = 1; v < G.n; v++) {
    loop = DFSR(G, v);
    if(loop) return false; // если есть цикл - топологическое построение невозможно
  }
  return true;
};

// Поиск в глубину (с проверкой графа на цикличность)
function DFSR(G, v) {
  if (mark[v] === 1) return true; // найден цикл: вершина уже встречалась, но не все смежные вершины проверены
  if (mark[v] === 2) return false; // вершина уже встречалась и все смежные вершины проверены
  mark[v] = 1; // отмечаю вершину как пройденную
  for (let i = 0; i < G.edges[v].length; i++) {
    if (DFSR(G, G.edges[v][i])) { // если вершина уже встречалась, то найден цикл
      return true;
    }
  }
  topSort[v] = currentLabel; // записываю порядок для текущей вершины
  order.push(v);
  mark[v] = 2; // отмечаю вершину как полностью проверенную
  currentLabel--; // уменьшаю порядок топологической сортировки
  return false;
};
