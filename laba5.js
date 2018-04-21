'use strict';
// При реалізації вважати, що заданий граф є орієнтованим та ациклічним.

const ask = require('./promt.js'); // Хэлпер для интерактивности в работе с командной строкой
const helpers = require('./matrix.helpers.js'); // Хэлперы для работы с матрицами
const AdjacencyMatrix = require('./graph.js'); // Весь код по созданию матрицы смежности
const fs = require('fs'); // Для работы с файлами
const fileData = fs.readFileSync('graph4.txt'); // Прочитать данные из файла
const dataByStr = fileData
  .toString()
  .split("\n")
  .filter(str => str); // Разложить данные файла по строкам и удалить пустые строки

// Инициализировать граф и его матрицу смежности
const Graph = AdjacencyMatrix(dataByStr);
// console.log(Graph.matrix); // Вывод матрицы смежности на экран

TopologicalSort(граф G)
1. позначити всі вершини як не відвідані
2. current_label ← n (кількість вершин графу)
3. для кожної вершини v графу G:
4. if вершина v ще не відвідана
5. DFSR(G, v)
DFSR(граф G, початкова вершина s)
1. позначити s як відвідану
2. для кожного ребра (s, u) в G:
3. if вершина u ще не відвідана
4. DFSR(G, u)
5. f[s] ← current_label
6. current_label ← current_label – 1