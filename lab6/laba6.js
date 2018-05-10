'use strict';
// СЧИТАТЬ, ЧТО ГРАФ ОРИЕНТИРОВАННЫЙ

// Весь код по созданию графа: его матрицы, рёбер и транспонирования
const InitGraph = require('../graph.js');

// Инициализировать граф (и транспорированный граф)
const Graph = InitGraph('lab6/graph6.txt', true, true);

let mark = {}; // Объект для отмечания пройденности вершин
const orderByTime = []; // Массив вершин в порядке, который соответствуют 
                        // времени прохода вершин (от меньшего времени к большему)
const components = {}; // Объект с сильно связанными компонентами

getStrongComponents(Graph)

function getStrongComponents(G) {
  
  // Обработка G графа
  mark = {};
  for (let v = 1; v < G.n; v++) {
    if (!mark[v]) {
      DFSR(G, v);
    }
  }

  // Обработка транспонированного G графа
  mark = {};
  let count = 0;
  orderByTime.reverse().forEach(v => {
    if (!mark[v]) {
      count++;
      components[count] = [];
      DFSRtrans(G, v, count);
    }
  });

  console.log("\nКількість компонент св'язності: ", count, "\n");
  console.log(
    "Компоненти та їх вершини:",
    Object.keys(components).map(c => "\nКомпонента " + c + " -> має вершини " + components[c]).join(''),
    "\n");
};

// Поиск в глубину для G графа 
function DFSR(G, v) {
  mark[v] = 1; // отметить вершину как пройденную
  for (let i = 0; i < G.edges[v].length; i++) { // проверить для всех смежных вершин
    if (!mark[G.edges[v][i]]) {
      DFSR(G, G.edges[v][i]);
    }
  }
  orderByTime.push(v); // добавить вершину в order
};

// Поиск в глубину для транспонированного G графа 
function DFSRtrans(G, v, curComp) {
  mark[v] = 1; // отметить вершину как пройденную
  components[curComp].push(v); // добавить вершину в текущую компоненту связности
  for (let i = 0; i < G.transEdges[v].length; i++) { // проверить для всех смежных вершин
    if (!mark[G.transEdges[v][i]]) {
      DFSRtrans(G, G.transEdges[v][i], curComp);
    }
  }
};