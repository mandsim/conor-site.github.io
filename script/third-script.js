function setInt(obj, rand) {
    obj.value = rand;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function createElement(type, style) {
    let element = document.createElement(type);
    element.classList.add(style);
    return element;
}

function createElementWithText(type, style, text) {
    let element = document.createElement(type);
    element.classList.add(style);
    element.textContent = text;
    return element;
}

let questions = [
    'А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.',
    'А эти слова как пишутся?',
    'Как нужно писать?',
    'Где допущена ошибка?'
]

let answers = [
    ['Пол деревни, за раз', 'Полдеревни, зараз', 'Пол-деревни, за раз'],
    ['Капуччино и эспрессо', 'Каппуччино и экспресо', 'Капучино и эспрессо'],
    ['Черезчур', 'Черес-чур', 'Чересчур'],
    ['Аккордеон', 'Белиберда', 'Эпелепсия']
];

let correctAnswers = [
    'Полдеревни, зараз', 'Капучино и эспрессо', 'Чересчур', 'Эпелепсия'
]

let correctAnswersNow = [];

let explanationsNow = [];

let explanations = [
    'Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом.',
    'Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо».',
    'Да! Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур».',
    'Верно! Это слово пишется так: «эпИлепсия».'
]

let prevInt = { value: 0 };
let body = document.body;
let main = createElement('div', 'main');
let mainSection = createElement('section', 'main-section');
let mainDiv = createElement('div', 'main-div');
body.appendChild(main);
main.appendChild(mainSection);
mainSection.appendChild(mainDiv);
let mainTitle = createElementWithText('h1', 'test-title', 'Тест на грамотность');
let testDiv = createElement('ol', 'test-div');
let nextQuestionButton = createElementWithText('button', 'button', 'Следующий вопрос');
nextQuestionButton.disabled = true;
let buttonDiv = createElement('div', 'div-button');
buttonDiv.appendChild(nextQuestionButton);
mainDiv.appendChild(mainTitle);
mainDiv.appendChild(buttonDiv);
mainDiv.appendChild(testDiv);
let currentQuestionIndex = 0;
showQuestion(currentQuestionIndex);
nextQuestionButton.addEventListener('click', () => {
    if (currentQuestionIndex < 3) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
        nextQuestionButton.disabled = true;
    }
    else {
        nextQuestionButton.disabled = false;
        let numberOfRightAnswers = createElementWithText('p', 'number-answers', 'Правильных ответов: ' + prevInt.value + ' из 4.')
        let currentQuestions = mainDiv.querySelectorAll('.question-div');
        let lastShownAnswer = null;
        currentQuestions.forEach((element, index) => {
            element.addEventListener('click', function() {
                if (lastShownAnswer) {
                    lastShownAnswer.remove();
                }
                let rightAnswer = createElement('p', 'right-answer');
                rightAnswer.innerHTML = "Правильный ответ:<br>" + correctAnswersNow[index];
                element.appendChild(rightAnswer);
                lastShownAnswer = rightAnswer;
            });
        });
        let endOverlay = createElementWithText('p', 'overlay', 'Вопросы закончились');
        mainDiv.appendChild(endOverlay);
        endOverlay.addEventListener('click', function() {
            endOverlay.remove();
            buttonDiv.appendChild(numberOfRightAnswers);
        });  
        nextQuestionButton.disabled = true;
    }
});

function showQuestion(i, rand) {
    let randIntQuestion = getRandomInt(4 - i);
    let question = createElementWithText('li', 'question', questions[randIntQuestion]);
    explanationsNow.push(explanations[randIntQuestion]);
    correctAnswersNow.push(correctAnswers[randIntQuestion]);
    let questionDiv = createElement('div', 'question-div');
    questionDiv.appendChild(question);
    let answerDiv = createElement('div', 'answer-div');
    let answerList = createElement('div', 'answer-list');
    testDiv.appendChild(answerDiv);
    answerDiv.appendChild(answerList);
    let divStep = createElement('div', 'div-step');
    divStep.appendChild(questionDiv);
    divStep.appendChild(answerDiv);
    testDiv.append(divStep);
    for (let j = 0; j < 3; j++) {
        let randIntAnswer = getRandomInt(3 - j);
        let answer = createElementWithText('p', 'answer', answers[randIntQuestion][randIntAnswer]);
        answerList.appendChild(answer);
        answers[randIntQuestion].splice(randIntAnswer, 1);
    }
    let currentAnswers = answerList.querySelectorAll('.answer');
    let activeElement = null;
    let maxWidth = 0;
    let isAnswered = false;
    currentAnswers.forEach(element => {
        if (element.textContent == correctAnswers[randIntQuestion]) {
            element.classList.add('correct');
        }
        else {
            element.classList.add('incorrect');
        }
        element.addEventListener('mouseover', () => {
            element.classList.add('answer-red');
        });
        element.addEventListener('mouseout', () => {
            element.classList.remove('answer-red');
        });
        element.addEventListener('click', () => {
            element.style.pointerEvents='none';
            event.stopPropagation();
            if (activeElement) {
                activeElement.classList.remove('answer-clicked');
            }
            if (!element.classList.contains('incorrect')) {
                question.style.backgroundColor = 'green';
                question.innerHTML = '<span style="font-size: 1.6rem;">&#10004; </span>' + question.textContent;
                let explanation = createElementWithText('p', 'explanation', explanationsNow[i]);
                element.classList.add('answer');
                element.appendChild(explanation);
                currentAnswers.forEach((wrongAns, index) => {
                    setTimeout(() => {
                        if (wrongAns != element) {
                            wrongAns.classList.add('move-down');
                            wrongAns.classList.add('bold-text');
                        }
                    }, 1000 * index);
                });
                element.after(explanation);
                setTimeout(() => {
                    element.classList.add('big-font');
                }, 0);
                setTimeout(() => {
                    explanation.classList.add('move-down');
                }, 7000);
                setTimeout(() => {
                    answerDiv.classList.add('disappear');
                }, 9000);
                setTimeout(() => {
                    answerDiv.remove();
                    nextQuestionButton.disabled = false;
                    question.style.height = '4.48rem';
                    setInt(prevInt, prevInt.value + 1);
                }, 10000);
            }
            else {
                question.style.backgroundColor = 'red';
                question.innerHTML = '<span style="font-size: 1.6rem;">&#10006; </span>' + question.textContent;
                currentAnswers.forEach((wrongAns, index) => {
                    setTimeout(() => {
                        wrongAns.classList.add('move-down');
                    }, 1000 * index);
                });
                setTimeout(() => {
                    answerDiv.classList.add('disappear');
                }, 3000);
                setTimeout(() => {
                    answerDiv.remove();
                    nextQuestionButton.disabled = false;
                    question.style.height = '4.48rem';
                }, 4000);
            }
            element.classList.add('answer-clicked');
            activeElement = element;
        }); 
    });
    answers.splice(randIntQuestion, 1);
    questions.splice(randIntQuestion, 1);
    correctAnswers.splice(randIntQuestion, 1);
    explanations.splice(randIntQuestion, 1);
}
