'use strict';

/*3. Доделать "fetch users practice" . Асинхронно подгружать информацию о пользователях из users.json и рендерить
карточки пользователей. Файл users.json не менять. Профессию каждого пользователя сделать рандомной по вашему массиву.
Вёрстка должна быть сделана адаптивно. Все карточки размещать в ряд, как на card_pattern.png. Карточку, на которую
кликнули выделять соответствующими стилями(как на шаблоне). */

const root = document.getElementById('root');

render();

async function render() {
    try {
        const authUser = await fetchAuthUser();
        const users = await fetchUsers();

        renderAuthUser(authUser);
        renderUsers(users);
    } catch (e) {
        renderError(e);
    }

}

async function fetchAuthUser() {
    try {
        const localAuthUser = localStorage.getItem('user');
        if (localAuthUser) {
            return JSON.parse(localAuthUser);
        } else {
            const responseAuthUser = await fetch('../../auth.json');
            const authUser = await responseAuthUser.json();
            localStorage.setItem('user', JSON.stringify(authUser));
            return authUser;
        }
    } catch (e) {
        throw new Error('Authorisation Error');
    }
}

async function fetchUsers() {
    const responseUsers = await fetch('../../users.json');
    return responseUsers.json();
}

function renderError(msg) {
    const root = document.getElementById('root');
    root.textContent = msg;
}

function renderAuthUser(authUser) {
    renderHeader({
        children: [
            getAuthUserInfo({
                children: [
                    getFullName(authUser),
                    getAuthUserPosition(authUser),
                ]
            }),
            getUserPhoto(authUser),
        ]
    });
}

function renderUsers(users) {
    const userCardsWrapper = document.createElement('ul');
    userCardsWrapper.classList.add('userCardsWrapper', 'displayFlex');


    const divWithSelectedUser = document.createElement('div');
    divWithSelectedUser.classList.add('selectedUser');

    root.append(divWithSelectedUser, userCardsWrapper);

    const userCards = users.map((user) => createUserCard({
            onClick: userCardHandler,
            renderActiveUser: renderNameOfActiveUser,
            addQueryParam: addQueryParam,
            children: [
                getUserPhoto(user),
                getFullName(user),
                getProfession(),
                createButton(user.id, 'Connect'),
            ]
        })
    );

    userCardsWrapper.append(...userCards);
}

function renderHeader({ children }) {
    const header = document.createElement('header');
    const root = document.getElementById('root');

    header.classList.add('displayFlex');
    root.prepend(header);
    header.append(...children);

    return header;
}

function getAuthUserInfo({ children }) {
    const userInfo = document.createElement('div');

    userInfo.classList.add('authUserInfo', 'displayFlex');
    userInfo.append(...children);

    return userInfo;
}

function getAuthUserPosition({ position }) {
    const userPosition = document.createElement('div');

    userPosition.classList.add('positionAuthUser');
    userPosition.textContent = position;

    return userPosition;
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

function createUserCard({ onClick = () => {}, renderActiveUser = () => {}, children }) {
    const userCard = document.createElement('li');

    userCard.classList.add('userCard', 'displayFlex');
    userCard.append(...children);
    userCard.onclick = (e) => {

        onClick(e);
        renderActiveUser(e);
        addQueryParam(e);
    };

    return userCard;
}

function imageOnErrorHandler(userPhotoWrapper, lastName, firstName) {
    userPhotoWrapper.textContent = firstName.charAt(0) + lastName.charAt(0) || '?';
    userPhotoWrapper.classList.add('userIconWithInitials', 'displayFlex');
}

function getFullName({ firstName, lastName }) {
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
    connectButton.dataset.id = value;

    return connectButton;
}

function userCardHandler(event) {
    const { currentTarget } = event;
    const activeCard = document.querySelector('.activeUserCard');

    if (activeCard && activeCard !== currentTarget) {
        activeCard.classList.remove('activeUserCard');
    }

    currentTarget.classList.toggle('activeUserCard');
}

function renderNameOfActiveUser(e) {
    const activeUserFullName = document.querySelector('.activeUserCard .fullName');
    const selectedUser = document.querySelector('.selectedUser');

    (selectedUser.textContent && !activeUserFullName)
        ? selectedUser.textContent = ''
        : selectedUser.textContent = activeUserFullName.textContent;
}

function addQueryParam(e) {
    const button = document.querySelector('.activeUserCard .connectButton');
    if (button) {
        const id = button.dataset.id;
        history.pushState(null, null, `?id=${id}`);
    } else history.pushState(null, null, '/');
}