'use strict';

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

/*3. Доделать "fetch users practice" . Асинхронно подгружать информацию о пользователях из users.json и рендерить
карточки пользователей. Файл users.json не менять. Профессию каждого пользователя сделать рандомной по вашему массиву.
Вёрстка должна быть сделана адаптивно. Все карточки размещать в ряд, как на card_pattern.png. Карточку, на которую
кликнули выделять соответствующими стилями(как на шаблоне). */

const root = document.getElementById('root');

fetch('../../users.json')
.then(responce => responce.json())
.then(createUsersList)

function createUsersList(users) {
    const userCardsWrapper = document.createElement('ul');
    userCardsWrapper.classList.add('userCardsWrapper', 'displayFlex');
    root.append(userCardsWrapper);

    const userCards = users.map((user) => createUserCard({
            onClick: userCardHandler,
            children: [
                getUserPhoto(user),
                getFullname(user),
                getProfession(),
                createButton(user.id, 'Connect'),
            ]
        })
    );

    userCardsWrapper.append(...userCards);
}

function createUserCard({ onClick = () => {}, children }) {
    const userCard = document.createElement('li');

    userCard.classList.add('userCard', 'displayFlex');
    userCard.append(...children);
    userCard.onclick = onClick;

    return userCard;
}

function getUserPhoto({ profilePicture, firstName, lastName }) {
    const userPhotoWrapper = document.createElement('div');
    const img = document.createElement('img');

    userPhotoWrapper.classList.add('userPhotoWrapper');
    userPhotoWrapper.append(img);
    img.src = profilePicture;
    img.onerror = () => imageOnErrorHandler(userPhotoWrapper, lastName, firstName);

    return userPhotoWrapper;
}

function imageOnErrorHandler(userPhotoWrapper, lastName, firstName) {
    if(!firstName && !lastName) {
        userPhotoWrapper.textContent = '?';
    } else {
        userPhotoWrapper.textContent = firstName.charAt(0) + lastName.charAt(0);
    }
    userPhotoWrapper.classList.add('userIconWithInitials', 'displayFlex');
};

function getFullname({ firstName, lastName }) {
    const fullName = document.createElement('div');

    fullName.classList.add('fullName');
    fullName.textContent = `${firstName} ${lastName}`;

    return fullName;
}

function getProfession() {
    const professionsArray = ['Sales Manager', 'Front-End Developer', 'Back-End Developer', 'Project Manager', 'HR-manager', 'CEO', 'QA engineer'];
    const profession = document.createElement('div');

    profession.classList.add('profession');
    profession.textContent = professionsArray[getRandomInt(professionsArray.length)];

    return profession;
}

function getRandomInt(maxNumber) {
    return Math.floor(Math.random() * Math.floor(maxNumber));
}

function createButton(value, text) {
    const connectButton = document.createElement('button');

    connectButton.classList.add('connectButton');
    connectButton.textContent = text;
    connectButton.dataset.value = value;

    return connectButton;
}

function userCardHandler (event) {
    const { currentTarget } = event;
    const activeCard = document.querySelector('.activeUserCard');

    if(activeCard && activeCard !== currentTarget) {
        activeCard.classList.remove('activeUserCard');
    };

    currentTarget.classList.toggle('activeUserCard');
}