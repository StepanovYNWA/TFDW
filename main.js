let gameState = {
  player1Score: 0,
  player2Score: 0,
  currentNumber: null,
  isGameActive: false,
  soundEnabled: true,
  isMobile: /Mobi|Android/i.test(navigator.userAgent)
};

let numberEl = document.getElementById('numberDisplay');
let timeoutIds = [];
const colors = ['white', 'yellow', 'lightgreen', 'lightblue', 'pink'];
let roundTimer;