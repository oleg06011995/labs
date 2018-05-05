// Хэлпер для интерактивности в работе с командной строкой
const ask = require('./promt.js');

// Весь код по созданию графа: его матрицы, рёбер и транспонирования
const InitGraph = require('./weightedGraph.js');

// Инициализация очереди приоритетов
const PriorityQueue = require('./PriorityQueue.js');

// Инициализировать взвешенный граф
const Graph = InitGraph('graph9.txt', true);

ask(
  "Введіть через пробіл номера вершин, між якими необхідно провести пошук,\n \
(числа від 1 до n, де n - кількість вершин графа; за замовчуванням '1 8'):",
  main
);

// ТОЧКА ВХОДА!
function main(self, str) {
  let [start, finish] = str.trim().split(' ');

  if (!start || !finish) {
    start = '1';
    finish = '8';
  }
  
  const INFINITY = 1/0;
  const algorithm = new FloydWarshall(Graph); // Инциализировать алгоритм Флойда-Уоршелла

  const { dist, path, isNegLoop, negLoopVertex } = algorithm.findDistances(start, finish); // Найти расстояния
  if (isNegLoop) {
    console.log("\nПрисутній цикл з від'ємною вагою.");
  }

  console.log("\nМАТРИЦЯ НАЙКОРОТШИХ ВІДСТАНЕЙ МІЖ УСІМА ПАРАМИ ВЕРШИН:");
  printMatrix(dist);

  console.log("\nМАТРИЦЯ НАЙКОРОТШИХ ШЛЯХІВ МІЖ УСІМА ПАРАМИ ВЕРШИН:");
  printMatrix(path);

  // const { dist, path, isNegLoop, negLoopVertex } = algorithm.findDistancesBetweenTwo(start, finish);
  //   if (isNegLoop) {
  //     console.log("\nЗнайден цикл з від'ємною вагою.");
  //   }

  //   if (!path) {
  //     console.log("\nНемає шляху від вершини " + start + " до вершини " + finish + ".");
  //   } else {
  //     printMatrix(dist)
  //     // console.log("\nНАЙКОРОТША ВІДСТАНЬ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n =", dist);
  //     // console.log("\nНАЙКОРОТШИЙ ШЛЯХ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n", buildPath(path, start, finish, isNegLoop));
  //   }
  // console.log("\n");
};

// Алгоритм Флойда-Уоршелла
function FloydWarshall(G) {
  
  const INFINITY = 1/0;
  this.matrix = G.matrix;
  this.n = G.n;
  this.m = G.m;

  this.findDistances = function(begin) {
    
    // Для каждой вершины заполнить массив дистанций значением по умолчанию
    // -> применить для всех dist[i][i] = 0
    const dist = [...this.matrix.map((row, i) => {
      return row.map((col, j) => j === i ? 0 : col);
    })];
    const path = [...this.matrix.map((row, i) => {
      return row.map((col, j) => j === i ? 0 : INFINITY);
    })];

    console.log("\nМАТРИЦЯ СУМІЖНОСТІ ГРАФУ:");
    printMatrix(dist);
    
    let isNegLoop = false; // Флаг, показывающий есть ли цикл с отрицательными весами
    let negLoopVertex;

    // Сделать k фаз
    for (let k = 0; k < this.n; k++)

      // На каждой фазе пройтись по всем значениям матрицы
      for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
          
          // Присвоить значение расстояние между вершинами i и j
          if (dist[i][k] < INFINITY && dist[k][j] < INFINITY) {
            // path[i][j] = path[i][j] !== INFINITY ? path[i][j] + ' ' + k : k;
            dist[i][j] = Math.min(dist[i][j], +dist[i][k] + +dist[k][j]);
          }
          
          // Проверка вершин на принадлежность к негативному циклу
          for (let t = 0; t < this.n; t++) {
            if (dist[i][t] < INFINITY && dist[t][t] < 0 && dist[t][j] < INFINITY) {
              dist[i][j] = -INFINITY;
              path[i][j] = -INFINITY;
              isNegLoop = true;
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
      dist: dist[end],
      path: p.length ? p : null,
      isNegLoop,
      negLoopVertex
    }
  }
}

// <---- HELPERS ---->
function printPath(path, begin, end, isNegLoop) {
  if (begin === end) {
    return begin;
  }
  if (path[0] !== begin && isNegLoop) {
    return "Присутній цикл з від'ємною вагою.";
  }
  if (path[0] === end) {
    return 'Не існує.';
  }
  return path.join(' ---> ');
};

function printDist(dist) {
  Object.keys(dist).map(v => {
    console.log(' -> вершини', v, '=', dist[v]);
  })
};

function printMatrix(matrix) {
  const final = matrix.map(row => {
    return row.map(col => 
      col === 1/0 ? 'INF'
      : col === -1/0
        ? '-INF'
        : col
    )
  });
  final.forEach(item => {
    console.log(item.join('\t'));
  });
};
