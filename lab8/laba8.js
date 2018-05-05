// Хэлпер для интерактивности в работе с командной строкой
const ask = require('../promt.js');

// Весь код по созданию графа: его матрицы, рёбер и транспонирования
const InitGraph = require('../weightedGraph.js');

// Инициализировать взвешенный граф
const Graph = InitGraph('lab8/graph8.txt', true);

ask(
  "Введіть через пробіл номера вершин, між якими необхідно провести пошук,\n \
(числа від 1 до n, де n - кількість вершин графа; за замовчуванням '5 6', де begin=5 та end=6'):",
  main
);

// ТОЧКА ВХОДА!
function main(self, str) {
  let [start, finish] = str.trim().split(' ');

  if (!start) {
    start = '5';
  }

  if (!finish) {
    finish = '6';
  }
  
  const INFINITY = 1/0;
  const algorithm = new FordBellman(Graph); // // Инциализировать алгоритм Форда-Беллмана

  console.log("\nРЕБРА ГРАФУ:");
  console.log(Graph.edgeList);

  const { dist, prev, path, isNegLoop } = algorithm.findPathBetweenTwo(start, finish);

  console.log("\nНАЙКОРОТША ВІДСТАНЬ ВІД ВЕРШИНИ " + start + " ДО:");
  console.log(printDist(dist));

  if (!path) {
    console.log("\nНемає шляху від вершини " + start + " до вершини " + finish + ".");
  } else {
    console.log("\nНАЙКОРОТША ВІДСТАНЬ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n =", dist[finish]);
    console.log(
      "\nНАЙКОРОТШИЙ ШЛЯХ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n",
      printPath(path, start, finish, isNegLoop)
    );
  }

  if (isNegLoop) {
    console.log("\nУВАГА! Присутній цикл з від'ємною вагою.");
  }

  console.log("\n");
};

// Алгоритм Форда-Беллмана
function FordBellman(G) {
  
  const INFINITY = 1/0;
  this.edges = G.edgeList;
  this.n = G.n;
  this.m = G.m;

  // Найти расстояния между вершиной begin и всеми вершинами
  this.findDistances = function(begin) {
    
    // Для каждой вершины заполнить массив дистанций значением по умолчанию
    const dist = {};
    const prev = {};
    for (let i = 1; i <= this.n; i++) {
      dist[i] = INFINITY;
    }
    dist[begin] = 0; // Расстояние из текущей вершины до неё же самое = 0
    
    let isNegLoop; // Флаг, показывающий есть ли цикл с отрицательными весами
    let negLoopVertex;
    
    for (let i = 0; i < this.n; i++) {
      isNegLoop = false; // Обнулить флаг каждый цикл
      
      for (let j = 0; j < this.m; j++) { // Проход по всем рёбрам

        let alt = +dist[this.edges[j].begin] + +this.edges[j].weight;
        
        // Проверка для INFINITY:
        // -> для рёбер с отрицательным весом, чтобы не появлялись некорректные расстояния вида Infinity-2
        // Проверка для текущего значения dist[i][end]:
        // -> выполнится если новое расстояние между i и j меньше текущего
        if (dist[this.edges[j].begin] < INFINITY && dist[this.edges[j].end] > alt) {  
          dist[this.edges[j].end] = Math.max(-INFINITY, alt);
          prev[this.edges[j].end] = this.edges[j].begin;

          negLoopVertex = this.edges[j].end;
          isNegLoop = true; // Если на последней итерации было 
                            // произведено вычисление, то присутствует 
                            // цикл с отрицательным весом
        }
      }
    }

    // Вернуть:
    // -> @dist - список расстояний до каждой вершины из вершины begin
    // -> @prev - список предшественников для вершин начиная с вершины begin
    // -> @isNegLoop - наличие цикла с отрицательными весами
    // -> @negLoopVertex - вершину, с которой начался цикл с отрицательными весами
    return {
      dist,
      prev,
      isNegLoop,
      negLoopVertex,
    }
  }

  // Найти путь между двумя вершинами
  this.findPathBetweenTwo = function(begin, end) {
    const { dist, prev, isNegLoop, negLoopVertex } = this.findDistances(begin);
    const path = []; // Массив кратчайшего пути

    // Найти путь до вершины end (с учётом отрицательного цикла)
    let negVertex = negLoopVertex;
    for (let i = 0; i < this.n; i++) {
      negVertex = prev[negVertex];
    }
    for (let current = end; current; current = prev[current]) {
      path.push(current); // Добавить вершину в путь
      if (current === negVertex && path.length > 1) break; // Прерывание для цикла с отрицательным весом
    }
    path.reverse();

    return {
      dist,
      prev,
      path,
      isNegLoop,
      negLoopVertex
    }
  }
}


// <---- HELPERS ---->

// Вывести путь
function printPath(path, begin, end, isNegLoop) {
  if (begin === end) {
    return begin;
  }
  if (path[0] !== begin && isNegLoop) {
    return "Неможливо побудувати через присутність циклу з від'ємною вагою.";
  }
  if (path[0] === end) {
    return 'Не існує.';
  }
  return path.join(' ---> ');
};

// Вывести список расстояний
function printDist(dist) {
  Object.keys(dist).map(v => {
    console.log(' -> вершини', v, '=', dist[v]);
  })
  return '';
};
