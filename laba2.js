// const Initial = require('./main.js'); // Весь код по созданию графа и матрицы смежности
const fs = require('fs'); // Для работы с файлами
const fileData = fs.readFileSync('graph.txt'); // Прочитать данные из файла
const dataByStr = fileData
  .toString()
  .split("\n")
  .filter(str => str); // Разложить данные файла по строкам и удалить пустые строки

// const Main = new Initial(dataByStr); // Инициализировать граф
// Main.fillMatrix(); // Инициализировать матрицу смежности графа

class Laba1 {
  static help() {
    console.log(
      "power - степень вершин та однорідність графу.",
      "\nisolated - перелік висячих та ізольованих вершин",
      "\ncharacter - метричні характеристики графу."
    )
  }

  // 1. Степінь усіх вершин графу. 
  // 2. Чи граф є однорідним та якщо так, то степінь однорідності графу.
  static power() {
    console.log("Граф задан списком ребер, де перша строка - n і m - кількість вершин та ребер.\n" + fileData);

    const power = {}; // Степени вершин графа

    // Посчитать степени вершин
    for (let i = 1; i < dataByStr.length; i++) { // Начать с 1 индекса, так как в 0 индексе хранятся значения n и m
      let topAr = dataByStr[i].split(' ').filter(top => top); // Записываем вершины ребра и исключаем работу с пустыми вершинами
      topAr.forEach(top => { // Для каждой не пустой вершины делаем инкремент, если она встречается в ребре
        if (!power[top] && topAr.length === 2) {
          power[top] = 1
        } else if (!power[top] && topAr.length === 1) {
          power[top] = 0
        } else {
          power[top]++;
        }
      });
    }
    for (let p in power) {
      console.log("Вершина " + p + " має степінь " + power[p]);
    }

    // Проверить на однородность
    const uniqueValues = Object.values(power)
      .reduce((unique, p) => {
        if(unique.indexOf(p) === -1) {
          unique.push(p)
        }
        return unique;
      }, []);
    console.log(
      uniqueValues.length === 1 // Если значение степени вершин одинаково,
        ? "Граф однорідний. Степінь однорідності: " + uniqueValues.pop() // то граф однородный
        : "Граф не однорідний." // иначе - не однородный
    )

    // Висячие и изолированные вершины
//     let isDiffTop = false;
//     for (let p in power) {
//       if(power[p] === 1) {
//         isDiffTop = true;
//         console.log("Вершина " + p + " має степінь " + power[p] + " та є висячою.");
//       } else if (power[p] === 0) {
//         isDiffTop = true;
//         console.log("Вершина " + p + " має степінь " + power[p] + " та є ізольованою.");
//       }
//     }
//     if(!isDiffTop) {
//       console.log("У графі немає висячих чи ізольованих вершин.");
//     }

//     // Метрические характеристики графа
//     // Без матрицы расстояний!
//     function setGeodezForEachTop(first, second) {
//       if (!first) return;
//       if (!second) {
//         geodez[first] = { }
//       } else if (!geodez[first]) {
//         geodez[first] = { [second]: 1 }
//       } else {
//         geodez[first][second] = 1
//       }
//     }
//     // Рекурсивный проход по вершинам рёбер 
//     // для поиска яруса вершины topToFind для вершины top
//     function findLevel(top, topToFind) {
//       let level = 0;
//       // Если известно, что вершина изолирована - вернуть 0
//       if (Object.keys(geodez[topToFind]).length === 0) {
//         return 0;
//       }
//       // Иначе - если ярус уже посчитан - вернуть значение
//       else if (geodez[topToFind][top]) {
//         return geodez[topToFind][top];
//       }
//       // Иначе - продолжить подсчёт яруса
//       else {
//         level++;
//         const levels = [];
//         for (let t in geodez[topToFind]) {
//           levels.push(findLevel(t, top));
//         }
//         level += Math.min(...levels)
//       }
//       return level;
//     }
//     const geodez = {}
//     // 1. Прохожусь по рёбрам графа и заполняю первый ярус для каждой вершины
//     dataByStr.slice(1).forEach((line, index) => {
//       const [first, second] = line.split(' ');
//       setGeodezForEachTop(first, second);
//       setGeodezForEachTop(second, first);
//     });
//     console.log("Промежуточный результат:\n", geodez)
//     // 2. Прохожусь по уже составленному объекту геодезичных и строю остальные ярусы при помощи рекурсии
//     const allPoints = Object.keys(geodez);
//     for (let i = 0; i < allPoints.length; i++) {
//       for (let j = 0; j < allPoints.length; j++) {
//         // - если ярус вершины j для вершины i ещё не посчитан 
//         // - и для каждой не одинаковой пары вершин
//         // - и если вершина i не изолирована 
//         // рекурсивно посчитать ярус
//         if (!geodez[allPoints[i]][allPoints[j]] && allPoints[i] !== allPoints[j] && Object.keys(geodez[allPoints[i]]).length) {
//           geodez[allPoints[i]][allPoints[j]] = findLevel(allPoints[i], allPoints[j])
//         } 
//       }
//     }
//     console.log("Финальный результат:\n", geodez)
//   }
// }
// module.exports = Laba1;

const nn = 6

const nn=200;{число линий}
type myset = set of 0..nn;
var i,m,n,k:byte;
ss:array[1..nn] of myset;
s,s1:myset;
begin
  …{считываем входные данные}
  s:=[m]; k:=0;
  while not (n in s) and(k<nn-1) do
    begin
    k:=k+1;
    s1:=s; s:=[];
    for i:=1 to nn do
      if i in s1 then
        if n in s then writeln(k) else
          writeln('it is impossible')
end.

Laba1.power()

// console.log(Main.n, Main.m);
// Main.graph.slice(1).forEach((edge, i) => {
//   console.log(edge.slice(1))
// });