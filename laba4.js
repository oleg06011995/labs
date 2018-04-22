'use strict';
// При реалізації алгоритмів вважати, що заданий граф є зв’язаним.

// Хэлпер для интерактивности в работе с командной строкой
const ask = require('./promt.js');

// Весь код по созданию графа: его матрицы, рёбер
const InitGraph = require('./graph.js');

// Инициализировать граф
const Graph = InitGraph('graph4.txt');
// console.log(Graph.matrix); // Вывод матрицы смежности

ask(
  "Введите номер вершины, с которой необходимо начать поиск \
(число от 1 до n, где n - количество вершин графа; \
по умолчанию 2):",
  main
);

function main(self, vertex) {
  console.log("\nТАБЛИЦА BFS ПОИСКА:")
  BFSfunc(+vertex.trim() || 2);

  console.log("\nТАБЛИЦА DFS2 ПОИСКА -> Простой вызов:")
  DFSfunc(+vertex.trim() || 2);

  console.log("\nТАБЛИЦА DFS2 ПОИСКА -> Рекурсивный вызов:")
  DFSfuncRec(+vertex.trim() || 2);

  console.log("\n")
}


// Реализация BFS
function BFSfunc(start) {
  const BFS = {};
  const Q = []; // Очередь

  let k = 1; // Задать начальный индекс вершины
  BFS[start] = k; // Записать индекс BFS для начальной вершины
  Q.push(start); // Добавить начальную вершину в очередь
  console.log("Вершина: "+start, "BFS-номер: "+BFS[start], "Очередь: "+Q.join(','));

  // Цикл: пока есть вершины в очереди
  while (Q.length > 0) {
    let v = Q.shift(); // Взять первую вершину в очереди
    console.log("Вершина: -", "BFS-номер: -", "Очередь: "+Q.join(','));

    // Проходим по всем смежным вершинам
    for (let i = 0; i < Graph.edges[v].length; i++) {
      if (!BFS[Graph.edges[v][i]]) { // Если ещё нет BFS индекса
        k++; // Увеличить индекс пройденных вершин на 1
        BFS[Graph.edges[v][i]] = k; // Записать индекс BFS вершины
        Q.push(Graph.edges[v][i]); // Добавить вершину в конец очереди
        console.log("Вершина: "+Graph.edges[v][i], "BFS-номер: "+BFS[Graph.edges[v][i]], "Очередь: "+Q.join(','));
      }
    }
  }
};


// Нерекурсивная реализация DFS
function DFSfunc(start) {
  const DFS = {};
  const S = []; // Стек

  let k = 1; // Задать начальный индекс вершины
  DFS[start] = k // Задать индекс DFS для начальной вершины
  S.push(start); // Добавить начальную вершину в стек
  console.log("Вершина: "+start, "DFS-номер: "+DFS[start], "Стек: "+S.join(','));

  // Цикл: пока стек не пуст
  while (S.length > 0) {
    let v = S[S.length - 1]; // Взять верхню вершину из стека

    // Ищем первую смежную вершину, индекс DFS для которой ещё не определён
    let i = 0;
    while (DFS[Graph.edges[v][i]]) {
      i++;
    }

    // Если есть вершина с индексом i и индекс DFS ещё не определён
    if (Graph.edges[v][i] && !DFS[Graph.edges[v][i]]) {
      k++; // Увеличить индекс пройденных вершин на 1
      DFS[Graph.edges[v][i]] = k; // Записать индекс DFS вершины
      S.push(Graph.edges[v][i]); // Добавить вершину в стек
      console.log("Вершина: "+Graph.edges[v][i], "DFS-номер: "+DFS[Graph.edges[v][i]], "Стек: "+S.join(','));
    } else {
      S.pop(); // Удалить вершину из стека
      console.log("Вершина: -", "DFS-номер: -", "Стек: "+S.join(','));
    }
  }

  return DFS;
};


// Рекурсивная реализация DFS
function DFSfuncRec(v) {
  let k = 1; // Задать начальный индекс вершины
  const DFS = {};
  const order = [];
  search(v);

  function search(v) {
    DFS[v] = k; // Пометить вершины как пройденную. Задать ей индекс k
    order.push(v);
    console.log("Вершина: "+v, "DFS-номер: "+k, "Последовательность прохода: "+order.join(','));
    k++; // Увеличить индекс пройденных вершин на 1
    for (let i = 0; i < Graph.edges[v].length; i++) { // Для каждого ребра
      if (!DFS[Graph.edges[v][i]]) {
        search(Graph.edges[v][i]); // Запускаемся из смежной вершины
      } else {
        console.log("Вершина: -", "DFS-номер: -", "Последовательность прохода: "+order.join(','));
      }
    }
  };

  return DFS;
};
