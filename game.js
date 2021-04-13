const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText = document.getElementById('questionCounterText');
const scoreText = document.getElementById('scoreText');
const progressBar = document.querySelector('.progress-bar');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// let questions = [
//   {
//     question: 'Inside which HTML element do we put the JavaScript??',
//     choice1: '<script>',
//     choice2: '<javascript>',
//     choice3: '<js>',
//     choice4: '<scripting>',
//     answer: 1,
//   },
//   {
//     question:
//       "What is the correct syntax for referring to an external script called 'xxx.js'?",
//     choice1: "<script href='xxx.js'>",
//     choice2: "<script name='xxx.js'>",
//     choice3: "<script src='xxx.js'>",
//     choice4: "<script file='xxx.js'>",
//     answer: 3,
//   },
//   {
//     question: " How do you write 'Hello World' in an alert box?",
//     choice1: "msgBox('Hello World');",
//     choice2: "alertBox('Hello World');",
//     choice3: "msg('Hello World');",
//     choice4: "alert('Hello World');",
//     answer: 4,
//   },
// ];

fetchQuestions = async () => {
  const response = await fetch(
    'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple'
  );

  const data = await response.json();

  questions = data.results.map((el) => {
    const incorrectAnswers = el.incorrect_answers; //wrong answers from api
    const answer = el.correct_answer; //correct answer from api

    //question from api
    const formattedQuestion = {
      question: el.question,
    };

    // new array of questions
    const allAnswers = [...incorrectAnswers];

    //a random number between 1 and 4 and insert that as the answer in the formattedQuestion Object
    formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

    //insert the correct answer at the random index in the new array
    allAnswers.splice(formattedQuestion.answer - 1, 0, answer);

    //loop through the array and add the choices to the formattedQuestion object
    allAnswers.forEach((choice, index) => {
      formattedQuestion['choice' + (index + 1)] = choice;
    });

    return formattedQuestion;
  });

  startGame();
};

//CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

getChoices = (currentQuestion, index) => {
  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });

  availableQuestions.splice(index, 1);

  acceptingAnswers = true;
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    //save recent score to local storage
    localStorage.setItem('mostRecentScore', score);

    //Redirect to the Quiz Over Page
    return window.location.assign('/end.html');
  }
  questionCounter++;
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  //update the progress bar
  progressBar.style.width = (questionCounter / MAX_QUESTIONS) * 100 + '%';

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;
  getChoices(currentQuestion, questionIndex);
};

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  //disable the loader and enable the game
  game.classList.remove('hidden');
  loader.classList.add('hidden');
};

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

fetchQuestions();

choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = Number(selectedChoice.dataset['number']);

    const classToApply =
      selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect';

    //update the score
    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});
