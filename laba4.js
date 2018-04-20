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

  console.log("\nТАБЛИЦА BFS2 ПОИСКА:")
  // BFSfunc2(+vertex);

  console.log("\nТАБЛИЦА DFS2 ПОИСКА -> Простой вызов:")
  DFSfunc(+vertex);

  console.log("\nТАБЛИЦА DFS2 ПОИСКА -> Рекурсивный вызов:")
  DFSfuncRec(+vertex);
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


// // Реализация BFS
// function BFSfunc2(begin) {
//   const BFS = {};
//   const Q = []; // Очередь

//   BFS[begin] = 1; // Записать индекс BFS для начальной вершины
  
//   Q.push(begin); // Добавить начальную вершину в очередь

//   // Цикл: Пока есть вершины в очереди
//   while (Q.length > 0) {
//       let vertex = Q[0]; // Взять первую вершину в очереди
//       Q.pop();
//       // Пробегаемся по всем ее соседям
//       for (int i = 0; i < (int)edges[v].size(); ++i) {
//           // Если сосед белый
//           if (mark[edges[v][i]] == 0)
//           {
//               // То вычисляем расстояние
//               d[edges[v][i]] = d[v] + 1;
//               // И он становится серым
//               mark[edges[v][i]] = 1;
//               q.push(edges[v][i]);
//           }
//       }
//   }
// };


// void BFS()
// {
//     queue<int> q;
//     // Инициализация: есть информация про начальную вершину
//     q.push(start);
//     d[start] = 0;
//     mark[start] = 1;
//     // Главный цикл - пока есть серые вершины
//     while (!q.empty())
//     {
//         // Берем первую из них
//         int v = q.front();
//         q.pop();
//         // Пробегаемся по всем ее соседям
//         for (int i = 0; i < (int)edges[v].size(); ++i)
//         {
//             // Если сосед белый
//             if (mark[edges[v][i]] == 0)
//             {
//                 // То вычисляем расстояние
//                 d[edges[v][i]] = d[v] + 1;
//                 // И он становится серым
//                 mark[edges[v][i]] = 1;
//                 q.push(edges[v][i]);
//             }
//         }
//     }
// }



// Нерекурсивная реализация DFS
function DFSfunc(start) {
  const DFS = {};
  const S = []; // Стек

  let k = 0; // Задать начальный индекс вершины
  S.push(start); // Добавить начальную вершину в стек

  // Цикл
  while (S.length > 0) {
    let v = S.pop(); // Взять верхню вершину из стека

    if (!DFS[v]) { // Если вершина ещё не пройдена
      k++; // Увеличить индекс пройденных вершин на 1
      DFS[v] = k; // Записать индекс DFS вершины
      S.push(v); // Добавить вершину в стек
      console.log("Вершина: "+v, "DFS-номер: "+DFS[v], "Стек: "+S.join(','));
    } else {
      console.log("Вершина: -", "DFS-номер: -", "Стек: "+S.join(','));
    }

    for (let i = 0; i < Graph.edges[v].length; i++) { // Для каждой смежной вершины
      if (!DFS[Graph.edges[v][i]]) { // Если вершина ещё не пройдена
        k++; // Увеличить индекс пройденных вершин на 1
        DFS[Graph.edges[v][i]] = k; // Записать индекс DFS вершины
        S.push(Graph.edges[v][i]); // Добавить вершину в стек
        console.log("Вершина: "+Graph.edges[v][i], "DFS-номер: "+DFS[Graph.edges[v][i]], "Стек: "+S.join(','));
      }
    }
  }

  return DFS;
};


// Рекурсивная реализация DFS
function DFSfuncRec(start) {
  const DFS = {};
  const order = [];
  let k = 1; // Задать начальный индекс вершины

  search(start);

  console.log("\nBFS индексы для каждой из веришн:");
  for (let i = 1; i < Object.keys(DFS).length; i++) {
    console.log("Вершина: "+i, "DFS-номер: "+DFS[i]);
  }

  function search(v) {
    if (DFS[v]) { // Если индекс у вершины уже есть - ничего не делать 
      console.log("Вершина: -", "DFS-номер: -", "Последовательность прохода: "+order.join(','));
      return;
    }
    DFS[v] = k; // Пометить вершины как пройденную. Задать ей индекс k
    order.push(v);
    console.log("Вершина: "+v, "DFS-номер: "+k, "Последовательность прохода: "+order.join(','));
    k++; // Увеличить индекс пройденных вершин на 1
    for (let i = 0; i < Graph.edges[v].length; i++) { // Для каждого ребра
      search(Graph.edges[v][i]); // Запускаемся из смежной вершины
    }
  };

  return DFS;
};
