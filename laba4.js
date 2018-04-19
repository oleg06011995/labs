// При реалізації алгоритмів вважати, що заданий граф є зв’язаним.
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
console.log(Graph.matrix)

ask('Введите номер вершины, с которой необходимо начать поиск (число от 0 до n, где n - количество вершин графа):', main);



function main(self, vertex) {
  console.log("\nТАБЛИЦА BFS ПОИСКА:")
  BFSfunc(+vertex);

  console.log("\nТАБЛИЦА DFS ПОИСКА:")
  DFSfunc(+vertex);

  console.log("\nТАБЛИЦА DFS2 ПОИСКА -> Рекурсивный вызов:")
  DFSfunc2(+vertex);
}



// Реализация BFS
function BFSfunc(begin) {
  const BFS = {};
  const Q = []; // Очередь
  
  BFS[begin] = 1; // Записать индекс BFS для начальной вершины
  
  Q.push(begin); // Добавить начальную вершину в очередь

  let k = 1; // Увеличить количество пройденных вершин на 1

  // Логирование первой вершины
  console.log(
    "Вершина: "+begin,
    "BFS-номер: "+BFS[begin],
    "Очередь: "+Q.join(',')
  );
  
  // Цикл: Пока есть вершины в очереди
  while (Q.length > 0) {

    let vertex = Q[0]; // Взять первую вершину в очереди

    // Для текущей вершины узнать все смежные с ней вершины
    let adjacencyVertex = Graph.data // [JS] Все строки из файла
      .slice(1) // [JS] Отделить рёбра от первой строки - количества вершин и рёбер (n и m)
      .map(item => { // [JS] Цикл по рёбрам

        let edge = item.split(' ').map(item => +item); // [JS] Привести вершины ребра к числам
        
        if (edge.indexOf(vertex) !== -1) {
          // Найти и вернуть смежную вершину u, если данное ребро 
          // содержит в себе текущую вершину 'vertex'
          let u = edge.pop();
          return (vertex === u) ? edge.pop() : u;
        } else {
          // Вернуть null, если данное ребро
          // не содержит в себе текущую вершину 'vertex'
          return null;
        }

      }).filter(item => item); // [JS] Очистить получившейся массив от значений null
    
    // Цикл по смежным c текущей вершиной 'vertex' вершинам
    for (let i = 0; i < adjacencyVertex.length; i++) {
      if (!BFS[adjacencyVertex[i]]) { // Если для вершины ещё нет номера BFS
        
        k++; // Увеличить индекс пройденных вершин на 1
        
        BFS[adjacencyVertex[i]] = k; // Записать индекс BFS для текущей вершины
        
        Q.push(adjacencyVertex[i]); // Добавить текущую вершину в очередь
        
        // Логирование каждой вершины, с которой граничит текущая]
        console.log("Вершина: "+adjacencyVertex[i], "BFS-номер: "+BFS[adjacencyVertex[i]], "Очередь: "+Q.join(','));
      }
    }

    Q.shift(); // Удалить вершину из очереди

    // Логирование после удаления вершины
    console.log("Вершина: -", "BFS-номер: -", "Очередь: "+Q.join(','));
  }
};



// Реализация DFS
function DFSfunc(begin) {
  const DFS = {};
  const S = []; // Стек
  
  DFS[begin] = 1; // Записать индекс DFS для начальной вершины
  
  S.push(begin); // Добавить начальную вершину в очередь

  let k = 1; // Увеличить количество пройденных вершин на 1

  // Логирование первой вершины
  console.log(
    "Вершина: "+begin,
    "DFS-номер: "+DFS[begin],
    "Стек: "+S.join(',')
  );
  
  // Цикл: Пока есть вершины в стеке
  while (S.length > 0) {

    let vertex = S[S.length - 1]; // Взять первую вершину в стека

    // Для текущей вершины узнать все смежные с ней вершины
    let adjacencyVertex = Graph.data // [JS] Все строки из файла
      .slice(1) // [JS] Отделить рёбра от первой строки - количества вершин и рёбер (n и m)
      .map(item => { // [JS] Цикл по рёбрам

        let edge = item.split(' ').map(item => +item); // [JS] Привести вершины ребра к числам
        
        if (edge.indexOf(vertex) !== -1) {
          // Найти и вернуть смежную вершину u, если данное ребро 
          // содержит в себе текущую вершину 'vertex'
          let u = edge.pop();
          return (vertex === u) ? edge.pop() : u;
        } else {
          // Вернуть null, если данное ребро
          // не содержит в себе текущую вершину 'vertex'
          return null;
        }

      })
      .filter(item => item) // [JS] Очистить получившейся массив от значений null
      .sort((a, b) => a > b); // [JS] Отсортировать по возрастанию вершин

      // console.log(adjacencyVertex)
    
    // Цикл по смежным c текущей вершиной 'vertex' вершинам
    let allVertexPass = true;
    for (let i = 0; i < adjacencyVertex.length; i++) {

      if (!DFS[adjacencyVertex[i]]) { // Если для вершины ещё нет номера DFS
        allVertexPass = false; // Флаг для того, чтобы после цикла удалить текущую вершину из стека
        
        k++; // Увеличить индекс пройденных вершин на 1
        
        DFS[adjacencyVertex[i]] = k; // Записать индекс DFS для текущей вершины
        
        S.push(adjacencyVertex[i]); // Добавить текущую вершину в стек
        
        // Логирование каждой вершины, с которой граничит текущая]
        console.log("Вершина: "+adjacencyVertex[i], "DFS-номер: "+DFS[adjacencyVertex[i]], "Стек: "+S.join(','));

        break; // Как только находим не посещенную вершину - завершаем цикл по смежным вершинам
      }
    }

    if (allVertexPass) {
      S.pop(); // Удалить вершину из стека

      // Логирование после удаления вершины
      console.log("Вершина: -", "DFS-номер: -", "Стек: "+S.join(','));
    }
  }
}


// Другая реализация DFS
function DFSfunc2(begin) {
  const DFS = {};
  const S = []; // Стек

  // Найти рёбра
  const edges = Graph.matrix.reduce((res, line, i) => {
    res[i + 1] = line.map((col, j) => col ? j + 1 : null).filter(n => n);
    return res;
  }, {})

  let k = 1; // Увеличить количество пройденных вершин на 1

  inner(begin);

  console.log("\nФинальный результат для каждой из веришн:");
  for (let i = 1; i < Object.keys(DFS).length; i++) {
    console.log("Вершина: "+i, "DFS-номер: "+DFS[i]);
  }

  function inner(v) {
    if (DFS[v]) { // Если индекс у вершины уже есть - ничего не делать 
      console.log("Вершина: -", "DFS-номер: -", "Индексы вершин: "+Object.keys(DFS).join(','));
      return;
    }
    DFS[v] = k; // Задать текущей вершине индекс
    console.log("Вершина: "+v, "DFS-номер: "+k, "Индексы вершин: "+Object.keys(DFS).join(','));
    k++; // Увеличить количество пройденных вершин на 1
    for (let i = 0; i < edges[v].length; i++) {  // Для каждого ребра
      inner(edges[v][i]);  // Запускаемся из смежной вершины
    }
  };
}


// void DFS(int v)
// {
//     if (mark[v] != 0)  // Если мы здесь уже были, то тут больше делать нечего
//     {
//         return;
//     }
//     mark[v] = 1;   // Помечаем, что мы здесь были
//     if (v == finish)   // Проверяем, конец ли
//     {
//         cout << "Hooray! The path was found!\n";
//         return;
//     }
//     for (int i = 0; i < (int)edges[v].size(); ++i)  // Для каждого ребра
//     {
//         DFS(edges[v][i]);  // Запускаемся из соседа
//     }
// }