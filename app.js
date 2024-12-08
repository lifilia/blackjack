// Variablen für das Spiel
let playerChips = 1000;
let playerCards = [];
let dealerCards = [];
let playerHandValue = 0;
let dealerHandValue = 0;
let playerHasSplit = false;
let currentBet = 100;

// Kartenstapel 
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];

let gameLog = [];

function updateGameLog(message) {
  gameLog.push(message);
  const gameLogElement = document.getElementById('game-log');
  gameLogElement.innerHTML = gameLog.map(log => `<p>${log}</p>`).join('');
}

// HTML-Elemente
const chipCountElement = document.getElementById('chip-count');
const playerCardsElement = document.getElementById('player-cards');
const dealerCardsElement = document.getElementById('dealer-cards');
const hitButton = document.getElementById('hit-btn');
const standButton = document.getElementById('stand-btn');
const doubleButton = document.getElementById('double-btn');
const splitButton = document.getElementById('split-btn');
const gameResultElement = document.getElementById('game-result');
const resultMessageElement = document.getElementById('result-message');
const restartButton = document.getElementById('restart-btn');
const betInput = document.getElementById('bet-input');
const setBetButton = document.getElementById('set-bet-btn');

// Funktion, um das Deck zu erstellen
function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit: suit, value: value });
    }
  }
  shuffleDeck();
}

// Funktion, um das Deck zu mischen
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Funktion, um den Wert einer Karte zu berechnen
function getCardValue(card) {
  if (card.value === 'A') {
    return 11;
  } else if (['K', 'Q', 'J'].includes(card.value)) {
    return 10;
  } else {
    return parseInt(card.value);
  }
}

// Funktion, um eine Karte zu ziehen
function drawCard() {
  return deck.pop();
}

// Funktion, um die Hand des Spielers und des Dealers zu berechnen
function calculateHandValue(cards) {
  let totalValue = 0;
  let aceCount = 0;

  for (let card of cards) {
    totalValue += getCardValue(card);
    if (card.value === 'A') aceCount++;
  }

  while (totalValue > 21 && aceCount > 0) {
    totalValue -= 10;
    aceCount--;
  }

  return totalValue;
}

// Funktion, um die Karten und Chips anzuzeigen
function updateCardDisplay() {
  playerCardsElement.innerHTML = playerCards.map(card => `<span>${card.value} of ${card.suit}</span>`).join('<br>');
  dealerCardsElement.innerHTML = dealerCards.map(card => `<span>${card.value} of ${card.suit}</span>`).join('<br>');
  chipCountElement.textContent = playerChips;
}

// Funktion, um das Spiel zu starten oder zurückzusetzen
function resetGame() {
  playerCards = [];
  dealerCards = [];
  playerHandValue = 0;
  dealerHandValue = 0;
  playerHasSplit = false;

  createDeck();

  gameResultElement.style.display = 'none';
  hitButton.disabled = false;
  standButton.disabled = false;
  doubleButton.disabled = false;
  splitButton.disabled = false;

  // Initiale Karten ziehen
  playerCards.push(drawCard(), drawCard());
  dealerCards.push(drawCard(), drawCard());

  playerHandValue = calculateHandValue(playerCards);
  dealerHandValue = calculateHandValue(dealerCards);

  updateCardDisplay();
}

// Funktion, um den Spielstatus zu prüfen
function checkGameStatus() {
  if (playerChips < 100) {
    alert('Du hast weniger als 100 Chips. Das Spiel wird zurückgesetzt!');
    playerChips = 1000; // Chips auf Standardwert zurücksetzen
    resetGame();
  } else if (playerChips >= 10000) {
    alert('Herzlichen Glückwunsch! Du hast 10.000 Chips erreicht!');
    restartButton.style.display = 'block';
  }
}

// Setzen des Einsatzes
setBetButton.addEventListener('click', () => {
  const betValue = parseInt(betInput.value);
  if (betValue >= 100 && betValue <= playerChips) {
    currentBet = betValue;
    alert(`Einsatz gesetzt: ${currentBet} Chips`);
  } else {
    alert('Ungültiger Einsatz. Bitte mindestens 100 Chips setzen und nicht mehr als du besitzt.');
  }
});

// Event-Listener für den "Hit"-Button
hitButton.addEventListener('click', () => {
  playerCards.push(drawCard());
  playerHandValue = calculateHandValue(playerCards);
  updateCardDisplay();

  if (playerHandValue > 21) {
    playerChips -= currentBet;
    resultMessageElement.textContent = 'Du hast verloren! Überzogen!';
    gameResultElement.style.display = 'block';
    resetGame();
    checkGameStatus();
  }
});

// Event-Listener für den "Stand"-Button
standButton.addEventListener('click', () => {
  while (dealerHandValue < 17 || (dealerHandValue === 17 && dealerCards.some(card => card.value === 'A'))) {
    dealerCards.push(drawCard());
    dealerHandValue = calculateHandValue(dealerCards);
  }

  if (playerHandValue > dealerHandValue || dealerHandValue > 21) {
    endRound('win');
  } else if (playerHandValue < dealerHandValue) {
    endRound('lose');
  } else {
    endRound('draw');
  }
});


// Neustart
restartButton.addEventListener('click', resetGame);

// Beendet Spiel
resetGame();

function endRound(result) {
  if (result === 'win') {
    playerChips += currentBet;
    updateGameLog(`Du hast gewonnen und ${currentBet * 2} Chips erhalten!`);
    resultMessageElement.textContent = 'Du gewinnst!';
  } else if (result === 'lose') {
    playerChips -= currentBet;
    updateGameLog(`Du hast verloren und ${currentBet} Chips verloren.`);
    resultMessageElement.textContent = 'Du hast verloren!';
  } else {
    updateGameLog(`Unentschieden, dein Einsatz wurde zurückerstattet.`);
    resultMessageElement.textContent = 'Unentschieden!';
  }

  gameResultElement.style.display = 'block';
  resetGame();
  checkGameStatus();
}
