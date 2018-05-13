// Хэлпер для интерактивности в работе с командной строкой
const ask = require('../promt.js');

// Весь код по созданию графа: его матрицы, рёбер и транспонирования
const InitGraph = require('../weightedGraph.js');

// Инициализировать взвешенный граф
const Graph = InitGraph('graph9.txt', true);

ask(
"Введіть через пробіл номера вершин, між якими необхідно провести пошук.\n\
Числа від 1 до n, де n - кількість вершин графа (за замовчуванням '1 8'):",
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

  const { dist, prev, path, isNegLoop } = algorithm.findPathBetweenTwo(start, finish); // Найти расстояния

  console.log("\nМАТРИЦЯ НАЙКОРОТШИХ ВІДСТАНЕЙ МІЖ УСІМА ПАРАМИ ВЕРШИН:");
  printMatrix(dist);

  console.log("\nМАТРИЦЯ ПОПЕРЕДНІХ ШЛЯХІВ ДЛЯ УСІХ ПАР ВЕРШИН:");
  printMatrix(prev);

  console.log(
    "\nНАЙКОРОТШИЙ ШЛЯХ ВІД ВЕРШИНИ " + start + " ДО ВЕРШИНИ " + finish + ":\n",
    printPath(path, prev, start, finish)
  );

  if (isNegLoop) {
    console.log("\nУВАГА! Присутній цикл з від'ємною вагою.");
  }

  console.log("\n");
};

// Алгоритм Флойда-Уоршелла
function FloydWarshall(G) {
  
  const INFINITY = 1/0;
  this.matrix = G.matrix;
  this.n = G.n;
  this.m = G.m;

  // Найти расстояния между всеми парами вершин
  this.findDistances = function() {
    
    // Для каждой вершины заполнить массив расстояний значением по умолчанию
    // -> применить для всех dist[i][i] = 0
    const dist = [...this.matrix.map((row, i) => {
      return row.map((col, j) => j === i ? 0 : col);
    })];

    // Для каждой вершины заполнить массив её предшественника значением по умолчанию
    // -> применить для всех вершин prev[i][i] = 0
    // -> для всех других вершин заполнить значением -1
    const prev = [...this.matrix.map((row, i) => {
      return row.map((col, j) => j === i ? 0 : -1);
    })];

    console.log("\nМАТРИЦЯ СУМІЖНОСТІ ГРАФУ:");
    printMatrix(dist);
    
    let isNegLoop = false; // Флаг, показывающий есть ли цикл с отрицательными весами

    // Сделать k фаз
    for (let k = 0; k < this.n; k++) { 

      // На каждой фазе пройтись по всем значениям матрицы
      for (let i = 0; i < this.n; i++) {

        for (let j = 0; j < this.n; j++) {

          let alt = +dist[i][k] + +dist[k][j];
          
          // Проверка для INFINITY:
          // -> для рёбер с отрицательным весом, чтобы не появлялись некорректные расстояния вида Infinity-2
          // Проверка для текущего значения dist[i][j]:
          // -> выполнится если новое расстояние между i и j меньше текущего
          if (dist[i][k] < INFINITY && dist[k][j] < INFINITY && dist[i][j] > alt) {
            dist[i][j] = alt; // Присвоить новое расстояние между вершинами i и j
            prev[i][j] = k; // Обновить номер фазы в массиве предшественников:
                            // -> здесь prev[i][j] - предшественник вершины j на кратчайшем пути из i
          }
          
          // Проверка вершин на принадлежность к негативному циклу
          for (let t = 0; t < this.n; t++) {
            if (dist[i][t] < INFINITY && dist[t][t] < 0 && dist[t][j] < INFINITY) {
              dist[i][j] = -INFINITY;
              prev[i][j] = -INFINITY;
              isNegLoop = true;
            }
          }
        }
      }
    }

    // Вернуть:
    // -> @dist - матрица расстояний для каждой пары вершин
    // -> @prev - матрица предшественников для каждой пары вершин
    // -> @isNegLoop - наличие цикла с отрицательными весами
    return {
      dist,
      prev,
      isNegLoop
    }
  }

  // Найти путь между двумя вершинами
  this.findPathBetweenTwo = function(begin, end) {
    const { dist, prev, isNegLoop } = this.findDistances();
    const path = []; // Массив кратчайшего пути

    // Найти путь от вершины begin до вершины end (с учётом отрицательного цикла)
    let i = begin - 1; // Отнять 1, так как элементы матрицы считаются с нулевого индекса
    let j = end - 1;
    while (j !== -1 && j !== -INFINITY) { // Пока есть предшественники:
      path.push(j + 1); // -> добавить вершину в путь
                        // -> добавить 1 так, как в массиве prev сохранены не номера вершин, а номера ФАЗ
      j = prev[i][j]; // -> взять предыдущую вершину
    }
    path.push(begin); // Добавить в массив начальную вершину
    path.reverse(); // Полученный массив отразить, для получения пути

    return {
      dist,
      prev,
      path,
      isNegLoop
    }
  }
}


// HELPERS ---->

// Вывести путь
function printPath(path, prev, begin, end) {
  if (begin === end) {
    return begin;
  }
  if (prev[begin - 1][end - 1] === -1/0) {
    return "Неможливо побудувати через присутність циклу з від'ємною вагою.";
  }
  if (prev[begin - 1][end - 1] === -1) {
    return 'Не існує.';
  }
  return path.join(' ---> ');
};

// Вывести матрицу
function printMatrix(matrix) {
  const final = matrix.map(row => {
    return row.map(col => 
      col === 1/0 ? 'INF' // Если 'бесконечность', то заменить значение на 'INF'
      : col === -1/0 // Если 'минус бесконечность', то заменить значение на '-INF'
        ? '-INF'
        : col
    )
  });
  final.forEach(item => {
    console.log(item.join('\t'));
  });
};
