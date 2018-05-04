// Хэлпер для интерактивности в работе с командной строкой
const ask = require('./promt.js');

// Весь код по созданию графа: его матрицы, рёбер и транспонирования
const InitGraph = require('./weightedGraph.js');

// Инициализация очереди приоритетов
const PriorityQueue = require('./PriorityQueue.js');

// Инициализировать взвешенный граф
const Graph = InitGraph('graph8.txt', true);

// if (Graph.isNegative) {
//   console.log("\n\
// Алгоритм Дейкстры работает только для графов с неотрицательными весами.\n\
// Проверьте граф и попробуйте ещё раз.\n");
// } else {
//   ask(
//     "Введите через пробел номера вершин, между которыми необходимо провести поиск\n \
// (числа от 1 до n, где n - количество вершин графа; по умолчанию '1 8'):",
//     main
//   );
// }
Graph.matrix.map(item => {
  console.log(item.join('\t'), '\n')
})
const dist = FordBellman(5);
console.log(dist)

function FordBellman(start) {
  // Инициализация
  const dist = {};
  for (let i = 1; i <= Graph.n; i++) {
    dist[i] = 1/0;
  }
  dist[start] = 0;
  let calcData;
  for (let i = 0; i < Graph.n; i++) {
    calcData = false;
    for (let j = 0; j < Graph.m; j++) {
      if (dist[Graph.edgeList[j].first] < 1/0) {
        dist[Graph.edgeList[j].second] = Math.min(
          dist[Graph.edgeList[j].second],
          +dist[Graph.edgeList[j].first] + +Graph.edgeList[j].weight
        );
        calcData = true;
      }
    }
  }
  if (calcData) {
    console.log("Знайден цикл з від'ємною вагою.");
    return null;
  }
  return dist;
}