'use strict';

/*3. Доделать "fetch users practice" . Асинхронно подгружать информацию о пользователях из users.json и рендерить
карточки пользователей. Файл users.json не менять. Профессию каждого пользователя сделать рандомной по вашему массиву.
Вёрстка должна быть сделана адаптивно. Все карточки размещать в ряд, как на card_pattern.png. Карточку, на которую
кликнули выделять соответствующими стилями(как на шаблоне). */

const root = document.getElementById('root');

fetch('../../users.json')
.then(responce => responce.json())
.then(createUsersList)

fetch('http://192.168.1.148:3000/auth')
.then(res => res.json())
.then(renderAuthUser)

function renderAuthUser(user) {
    console.log(user);
    const { firstName, lastName, position, profilePicture } = user;
    const header = document.getElementById('header');
    const userInfo = document.createElement('div');
    const fullname = document.createElement('div');
    const userPosition = document.createElement('div');
    const iconWrapper = document.createElement('div');
    const userPhoto = document.createElement('img');

    userInfo.classList.add('userInfo');
    fullname.classList.add('fullnameAuthUser');
    userPosition.classList.add('positionAuthUser');
    iconWrapper.classList.add('iconWrapperAuthUser');

    fullname.textContent = `${firstName} ${lastName}`;
    userPosition.textContent = position;
    userPhoto.src = profilePicture;

    iconWrapper.append(userPhoto);
    userInfo.append(fullname, userPosition);
    header.append(userInfo, iconWrapper);
}

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