const highScoresList = document.getElementById('highScoresList');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// highScoresList.innerHTML = highScores.map((el) => {
//   return `<li class='high-score'>
//       ${el.name} - ${el.score}
//     </li>`;
// });

highScores.map((el) => {
  highScoresList.insertAdjacentHTML(
    'beforeend',
    `<li class='high-score class='high-score'>
         ${el.name} - ${el.score}
     </li>`
  );
});
