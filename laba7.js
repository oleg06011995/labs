'use strict';
// При реалізації вважати, що заданий граф є орієнтованим.

// Реализован при помощи Очереди Приоритетов -> PriorityQueue
// для уменьшения количества проходов в алгоритме.

// NOTE!
// Чтобы реализовать очередь на простом JS-массиве необходимо заменить:
// ** Q = new PriorityQueue() -> const Q = []
// ** Q.enqueue(...) -> Q.push({ key: v })
// ** Q.dequeue() -> Q.shift().key
// ** while(!Q.isEmpty()) -> while(Q.length > 0)

// Хэлпер для интерактивности в работе с командной строкой
const ask = require('./promt.js');

// Весь код по созданию графа: его матрицы, рёбер и транспонирования
const InitGraph = require('./weightedGraph.js');

// Инициализация очереди приоритетов
const PriorityQueue = require('./PriorityQueue.js');

// Инициализировать взвешенный граф
const Graph = InitGraph('graph7.txt', true);

if (Graph.isNegative) {
  console.log("\n\
Алгоритм Дейкстри працює тільки для графів с невід'ємними вагами.\n\
Перевірте граф та спробуйте ще раз.\n");
} else {
  ask(
    "Введіть через пробіл номера вершин, між якими необхідно провести пошук\n \
(числа від 1 до n, де n - кількість вершин графа; за замовчуванням '1 8'):",
    main
  );
}

// ТОЧКА ВХОДА!
function main(self, str) {
  let [start, finish] = str.trim().split(' ');

  if (!start || !finish) {
    start = '1';
    finish = '8';
  }
  
  const algorithm = new Dijkstra(Graph); // Инициализация алгоритма Дейкстры

  console.log("\nРЕБРА ГРАФУ У ВИГЛЯДІ СУМІЖНИХ ВЕРШИН (З ВАГОЮ):");
  printEdges(Graph.edges);

  const { path, distances, count } = algorithm.findDistances(start, finish); // Найти путь и дистанции
  const distance = distances[finish]; // подсчёт полной дистанции между указанными вершинами

  // Вывод результатов
  console.log("\nНАЙКОРОТША ВІДСТАНЬ:\n =", distance);
  console.log(
    "\nНАЙКОРОТШИЙ ШЛЯХ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n",
    printPath(path.reverse())
  );
  console.log("\nКІЛЬКІСТЬ ПРОХОДІВ ДЛЯ ПОШУКУ НАЙКОРОТШОГО ШЛЯХУ:\n =", count);
  console.log("\nНАЙКОРОТШИЙ ШЛЯХ ВІД ВЕРШИНИ " + start + " ДО:");
  console.log(printDist(distances));
  console.log("\n");
};

// Алгоритм Дейкстры
function Dijkstra(G) {

  const INFINITY = 1/0;
  this.edges = G.edges;

  // Найти кратчайший путь между вершинами
  this.findDistances = function (begin, end) {
    const Q = new PriorityQueue(), // Очередь Приоритетов
    // const Q = [], // см. NOTE!
        distances = {},
        previous = {}; // массив текущего пути: вершины с минимальными дистанциями
    let path = [],
        smallest,
        count = 0; // количество проходов: будет разное, если использовать/не использовать Очередь Приоритетов

    // Для каждой вершины заполняем очередь приоритетов (v - вершина)
    for (let v in this.edges) {
      if (v === begin) {
        distances[v] = 0;
        Q.enqueue(v, 0);
        // Q.push({ key: v }); // см. NOTE!
      } else {
        distances[v] = INFINITY;
        Q.enqueue(v, INFINITY);
        // Q.push({ key: v }); // см. NOTE!
      }
      previous[v] = null;
    }

    // Цикл: пока очередь не пуста
    while (!Q.isEmpty()) {
    // while(Q.length > 0) { // см. NOTE!
      
      // Считать проходы только пока не найден кратчайший путь между begin и end.
      // Остальные проходы нужны для нахождения расстояния от begin до остальных вершин.
      if(path.length === 0) { 
        count++; 
      }
      
      smallest = Q.dequeue(); // берём из очереди вершину с минимальным расстоянием
      // smallest = Q.shift().key; // см. NOTE!

      // Сформировать ОБРАТНЫЙ маршрут, если найдена end вершина:
      if (smallest === end) {
        path = this.shortestPath(smallest, previous, begin);
        // break; // -> прервать цикл, если НЕ стоит задача нахождения путей между другими вершинами
      }

      // Если нет вершины или дистация для этой вершины не посчитана
      // -> продолжить цикл и перейти к следующей вершине
      if (!smallest || distances[smallest] === INFINITY) {
        continue;
      }

      // Определить дистанцию для каждой смежной с текущей вершины
      // Найти минимальную ДИСТАНЦИЮ среди всех смежных вершин
      // -> сохранить эту дистанцию 
      // -> сохранить эквивалентную этой дистанции ВЕРШИНУ в объект пройденных вершин previous
      for (let v in this.edges[smallest]) {
        let dist = distances[smallest] + this.edges[smallest][v];

        // -> если найденная дистанция минимальна
        if (dist < distances[v]) {
          distances[v] = dist; // сохранить дистанцию до вершины
          previous[v] = smallest; // запомнить вершину как "предыдущую" к текущей

          Q.enqueue(v, dist); // добавить в очередь вершину с дистанцией
          // Q.push({ key: v }); // см. NOTE!
        }
      }
    }

    return {
      path, // полный путь
      distances, // подсчитанная дистанция для кадого ребра в пути
      count, // количество проходов
    };
  };

  // Пройтись по цепочке вершин назад и сформировать путь.
  // Добавить begin вершину для получения полного пути.
  this.shortestPath = function(smallest, previous, begin) {
    const path = [];
    while (previous[smallest]) {
      path.push(smallest);
      smallest = previous[smallest];
    }
    return path.concat(begin);
  }
};


// <---- HELPERS ---->

// Вывести путь
function printPath(path) {
  return path.join(' ---> ')
};

// Вывести расстояния
function printDist(dist) {
  Object.keys(dist).map(v => {
    console.log(' -> вершини', v, '=', dist[v])
  })
  return '';
};

// Вывести ребра
function printEdges(edges) {
  const final = {...edges};
  Object.keys(final).forEach(begin => {
    console.log(begin);
    Object.keys(final[begin]).forEach(end => {
      if (final[begin][end] < 1/0) {
        console.log("->", end, "=", final[begin][end]);
      }
    });
  });
};
