/*1. Промисифицировать setTimeout() : напишите функцию delay(ms), которая возвращает промис, переходящий в состояние
"resolved" через ms миллисекунд.
Должен быть возможен вот такой вызов delay(ms).then(doSomething)

Пример использования и эквивалетный вызов setTimeout():
delay(1000).then(() => alert("Hello!"))

setTimeout(()=> alert("Hello!"),1000)
*/

delay(1000).then(() => alert("Hello!"));

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout( () => resolve(), ms);
    });
}

/*2. Напишите функцию, которая последовательно выводит в консоль числа от 1 до 20, с интервалом между числами 100мс.
То есть, весь вывод должен занимать 2000мс, в течение которых каждые 100мс в консоли появляется очередное число.
Решение задачи должно использовать setTimeout. (По циклу таймеры не создавать)*/

console.time('timeout');
logNumbersWithTimeout();

function logNumbersWithTimeout() {
    let i = 1;
    let timeoutId = setTimeout(function logNumbers() {
        console.log(i);
        i++;
        timeoutId = setTimeout(logNumbers, 100);
        if (i > 20) {
            clearTimeout(timeoutId);
            console.timeEnd('timeout');
        }
    }, 100);
}