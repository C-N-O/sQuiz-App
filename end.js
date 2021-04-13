const username = document.getElementById('username');
const saveScoreButton = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');

const MAAX_HIGH = 5;
//get most recent score from local storage
const mostRecentScore = localStorage.getItem('mostRecentScore');

//get high scores from local storage
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

finalScore.innerText = mostRecentScore + ' Points';

//enabled the save score button if there is content in the input
username.addEventListener('keyup', () => {
  console.log(username.value);
  saveScoreButton.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  //create a score and username object
  const score = {
    score: mostRecentScore,
    name: username.value,
  };

  //push the new score to the hiog scores data
  highScores.push(score);

  //sorting the highScores arrays. If b is higher than a, put b before a
  highScores.sort((a, b) => b.score - a.score);

  //remove items after number 5
  highScores.splice(5);

  //update the high scores in local storage
  localStorage.setItem('highScores', JSON.stringify(highScores));

  //go back to the home page
  window.location.assign('/') / console.log(highScores);
};
