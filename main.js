
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

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';
  gameState.isGameActive = true;
  showRandomNumber();
  startRoundTimer();
}

function showHelp() {
  document.getElementById('helpModal').style.display = 'flex';
}

function hideHelp() {
  document.getElementById('helpModal').style.display = 'none';
}

function showRandomNumber() {
  if (!gameState.isGameActive) return;
  timeoutIds.forEach(clearTimeout);
  timeoutIds = [];
  let maxScore = Math.max(gameState.player1Score, gameState.player2Score);
  let delay;
  if (gameState.player1Score === 4 && gameState.player2Score === 4) {
    delay = Math.random() * 100 + 300;
  } else if (maxScore >= 4) {
    delay = Math.random() * 200 + 400;
  } else if (maxScore >= 3) {
    delay = Math.random() * 200 + 600;
  } else {
    delay = Math.random() * 500 + 1000;
  }
  let timer = setTimeout(() => {
    gameState.currentNumber = Math.floor(Math.random() * 6);
    numberEl.textContent = gameState.currentNumber;
    numberEl.style.color = colors[Math.floor(Math.random() * colors.length)];
    numberEl.style.top = Math.random() * 70 + 10 + '%';
    numberEl.style.left = Math.random() * 70 + 10 + '%';
    numberEl.style.display = 'block';
    numberEl.style.transform = 'scale(1.2)';
    numberEl.style.transition = 'transform 0.1s ease';
    setTimeout(() => numberEl.style.transform = 'scale(1)', 100);
    let hideDuration;
    if (gameState.currentNumber === 1 && gameState.player1Score === 4) {
      hideDuration = Math.random() * 100 + 300;
    } else if (gameState.currentNumber === 2 && gameState.player2Score === 4) {
      hideDuration = Math.random() * 100 + 300;
    } else {
      hideDuration = Math.random() * 1000 + 1500;
    }
    let hideTimer = setTimeout(hideNumber, hideDuration);
    timeoutIds.push(hideTimer);
  }, delay);
  timeoutIds.push(timer);
}

function hideNumber() {
  gameState.currentNumber = null;
  numberEl.style.display = 'none';
  showRandomNumber();
}

function handlePlayerAction(player) {
  if (!gameState.isGameActive) return;
  let correct = false;
  if (gameState.currentNumber === 0) {
    endGame(player === 1 ? 2 : 1, 'другой игрок нажал на 0');
    return;
  }
  if (player === 1 && gameState.currentNumber === 1) {
    if (!correct && gameState.isMobile && navigator.vibrate) navigator.vibrate(100);
    gameState.player1Score++;
    correct = true;
  } else if (player === 2 && gameState.currentNumber === 2) {
    gameState.player2Score++;
    correct = true;
  } else {
    if (player === 1) gameState.player1Score--;
    else gameState.player2Score--;
  }
  updateScore();
  playSound(correct);
  flashPlayerZone(player, correct);
  numberEl.style.display = 'none';
  gameState.currentNumber = null;
  if (gameState.player1Score >= 5) endGame(1, 'набрал 5 очков');
  else if (gameState.player2Score >= 5) endGame(2, 'набрал 5 очков');
  else showRandomNumber();
}

function updateScore() {
  const score1 = document.getElementById('score1');
  const score2 = document.getElementById('score2');
  const dots1 = document.getElementById('dots1');
  const dots2 = document.getElementById('dots2');

  const p1 = '█ '.repeat(Math.max(0, gameState.player1Score)).padEnd(10, '░ ').trim();
  const p2 = '█ '.repeat(Math.max(0, gameState.player2Score)).padEnd(10, '░ ').trim();
  dots1.textContent = p1;
  dots2.textContent = p2;

  
}

function endGame(winner, reason) {
  gameState.isGameActive = false;
  timeoutIds.forEach(clearTimeout);
  clearInterval(roundTimer);
  const winMsg = document.getElementById('winMessage');
  winMsg.textContent = `🏆 Победил Игрок ${winner}!\nПричина: ${reason}`;
  winMsg.style.fontSize = '2em';
  winMsg.style.textAlign = 'center';
  winMsg.style.padding = '1em';
  document.getElementById('winModal').style.display = 'flex';
  winMsg.style.animation = 'winnerPulse 1s ease infinite alternate';
  playFanfare();
}

function startRoundTimer() {
  const timerEl = document.createElement('div');
  timerEl.id = 'roundTimer';
  timerEl.style.position = 'absolute';
  timerEl.style.top = '50%';
  timerEl.style.left = '50%';
  timerEl.style.transform = 'translate(-50%, -50%)';
  timerEl.style.fontSize = '2em';
  timerEl.style.border = '2px solid rgba(255,255,255,0.5)';
  timerEl.style.padding = '0.5em 1em';
  timerEl.style.borderRadius = '48px';
  timerEl.style.background = 'rgba(0,0,0,0.5)';
  timerEl.style.color = 'rgba(255,255,255,0.5)';
  timerEl.style.zIndex = '0';
  document.getElementById('gameScreen').appendChild(timerEl);

  let timeLeft = 60;
  timerEl.textContent = `Осталось: ${timeLeft}`;
  roundTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Осталось: ${timeLeft}`;
    if (timeLeft <= 5 && gameState.soundEnabled) playMetronome();
    if (timeLeft <= 0) {
      clearInterval(roundTimer);
      const winner = gameState.player1Score > gameState.player2Score ? 1 : 2;
      endGame(winner, 'по таймеру');
    }
  }, 1000);
}

function restartGame() {
  gameState.player1Score = 0;
  gameState.player2Score = 0;
  updateScore();
  gameState.isGameActive = true;
  gameState.currentNumber = null;
  numberEl.style.display = 'none';
  timeoutIds.forEach(clearTimeout);
  timeoutIds = [];
  document.getElementById('winModal').style.display = 'none';
  showRandomNumber();
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  document.getElementById('soundBtn').textContent = gameState.soundEnabled ? '🔊' : '🔇';
}

function playSound(success) {
  if (!gameState.soundEnabled) return;
  if (!window.sharedAudioCtx) window.sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let ctx = window.sharedAudioCtx;
  let osc = ctx.createOscillator();
  let gain = ctx.createGain();
  osc.connect(gain).connect(ctx.destination);
  if (success) {
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);
  } else {
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
  }
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

window.addEventListener('keydown', e => {
  if (!gameState.isMobile) {
    if (e.key.toLowerCase() === 'z') handlePlayerAction(1);
    if (e.key.toLowerCase() === 'm') handlePlayerAction(2);
  }
});

if (gameState.isMobile) {
  document.getElementById('topZone').addEventListener('touchstart', () => handlePlayerAction(1));
  document.getElementById('bottomZone').addEventListener('touchstart', () => handlePlayerAction(2));
}

function flashPlayerZone(player, success) {
  const zone = document.getElementById(player === 1 ? 'topZone' : 'bottomZone');
  const originalOpacity = zone.style.opacity;
  zone.style.opacity = success ? 0.4 : 0.6;
  setTimeout(() => zone.style.opacity = originalOpacity, 150);
}

function playFanfare() {
  if (!gameState.soundEnabled) return;
  const ctx = window.sharedAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const freqs = [523, 659, 783, 1046];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(ctx.destination);
    osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.18);
    osc.start(ctx.currentTime + i * 0.2);
    osc.stop(ctx.currentTime + i * 0.2 + 0.2);
  });
}
function playMetronome() {
  const ctx = window.sharedAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain).connect(ctx.destination);
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}
/*﻿let gameState = {
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
let roundTimer;*/
