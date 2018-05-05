// Хэлпер для интерактивности в работе с командной строкой
const ask = require('./promt.js');

// Весь код по созданию графа: его матрицы, рёбер и транспонирования
const InitGraph = require('./weightedGraph.js');

// Инициализация очереди приоритетов
const PriorityQueue = require('./PriorityQueue.js');

// Инициализировать взвешенный граф
const Graph = InitGraph('graph8.txt', true);

ask(
  "Введіть через пробіл номера вершин, між якими необхідно провести пошук,\n \
або одну вершину - тоді будуть знайдені шляхи від неї до інших вершин\n \
(числа від 1 до n, де n - кількість вершин графа; за замовчуванням '5 6' -> де begin=5, end=6'):",
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

  const { dist, path, isNegLoop, negLoopVertex } = algorithm.findDistancesBetweenTwo(start, finish);
  if (isNegLoop) {
    console.log("\nПрисутній цикл з від'ємною вагою.");
  }

  console.log("\nНАЙКОРОТША ВІДСТАНЬ ВІД ВЕРШИНИ " + start + " ДО:");
  console.log(buildDist(dist));

  if (!path) {
    console.log("\nНемає шляху від вершини " + start + " до вершини " + finish + ".");
  } else {
    console.log("\nНАЙКОРОТША ВІДСТАНЬ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n =", dist[finish]);
    console.log("\nНАЙКОРОТШИЙ ШЛЯХ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n", buildPath(path, start, finish, isNegLoop));
  }
  console.log("\n");
};

// Алгоритм Форда-Беллмана
function FordBellman(G) {
  
  const INFINITY = 1/0;
  this.edges = G.edgeList;
  this.n = G.n;
  this.m = G.m;

  this.findDistances = function(begin) {
    
    // Для каждой вершины заполнить массив дистанций значением по умолчанию
    const dist = {};
    const path = {};
    for (let i = 1; i <= this.n; i++) {
      dist[i] = INFINITY;
    }

    dist[begin] = 0; // Расстояние из текущей вершины до неё же самое = 0
    
    let isNegLoop; // Флаг, показывающий есть ли цикл с отрицательными весами
    let negLoopVertex;
    
    for (let i = 0; i < this.n; i++) {
      isNegLoop = false; // Обнулить флаг каждый цикл
      
      for (let j = 0; j < this.m; j++) { // Проход по всем рёбрам
        
        if (dist[this.edges[j].begin] < INFINITY) {  // Проверка для рёбер с отрицательным весом,
                                                     // иначе могли бы появляться некорректные расстояния вида Infinity - 2
          if (dist[this.edges[j].end] > +dist[this.edges[j].begin] + +this.edges[j].weight) {
            
            dist[this.edges[j].end] = Math.max(-INFINITY, +dist[this.edges[j].begin] + +this.edges[j].weight);
            path[this.edges[j].end] = this.edges[j].begin;
            
            negLoopVertex = this.edges[j].end;
            isNegLoop = true; // Если на последней итерации было 
                                    // произведено вычисление, то присутствует 
                                    // цикл с отрицательным весом
          }
        }
      }
    }

    // Вернуть список расстояний до каждой вершины и список кратчайших путей
    return {
      dist,
      path,
      isNegLoop,
      negLoopVertex,
    }
  }

  this.findDistancesBetweenTwo = function(begin, end) {
    const { dist, path, isNegLoop, negLoopVertex } = this.findDistances(begin);
    let p = [];

    // Найти путь до вершины end (с учётом отрицательного цикла)
    let negVertex = negLoopVertex;
    for (let i = 0; i < this.n; i++) {
      negVertex = path[negVertex];
    }
    p = [];
    for (let current = end; current; current = path[current]) {
      p.push(current);
      if (current === negVertex && p.length > 1) break; // Прерывание для цикла с отрицательным весом
    }
    p.reverse();

    return {
      dist: dist,
      path: p.length ? p : null,
      isNegLoop,
      negLoopVertex
    }
  }
}

// <---- HELPERS ---->
function buildPath(path, begin, end, isNegLoop) {
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

function buildDist(dist) {
  Object.keys(dist).map(v => {
    console.log(' -> вершини', v, '=', dist[v]);
  })
};
