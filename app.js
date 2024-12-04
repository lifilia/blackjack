// Variablen für das Spiel
let playerChips = 1000;
let playerCards = [];
let dealerCards = [];
let playerHandValue = 0;
let dealerHandValue = 0;
let playerHasSplit = false;

// Kartenstapel 
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];

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

// Funktion, um die Karten anzuzeigen
function updateCardDisplay() {
  playerCardsElement.innerHTML = playerCards.map(card => `<span>${card.value} of ${card.suit}</span>`).join('<br>');
  dealerCardsElement.innerHTML = dealerCards.map(card => `<span>${card.value} of ${card.suit}</span>`).join('<br>');
  chipCountElement.textContent = playerChips;
}

// Funktion, um das Spiel zu starten
function startGame() {
  playerCards = [];
  dealerCards = [];
  playerHandValue = 0;
  dealerHandValue = 0;
  playerHasSplit = false;

  createDeck();
  playerChips = 1000;
  chipCountElement.textContent = playerChips;
  gameResultElement.style.display = 'none';

  // Initiale Karten ziehen
  playerCards.push(drawCard(), drawCard());
  dealerCards.push(drawCard(), drawCard());

  playerHandValue = calculateHandValue(playerCards);
  dealerHandValue = calculateHandValue(dealerCards);

  updateCardDisplay();

  // Button-Status zurücksetzen
  hitButton.disabled = false;
  standButton.disabled = false;
  doubleButton.disabled = false;
  splitButton.disabled = false;
}

// Funktion, um den Gewinner zu ermitteln
function determineWinner() {
  if (playerHandValue > 21) {
    return 'Du hast verloren! Überzogen!';
  } else if (dealerHandValue > 21) {
    return 'Dealer hat verloren! Du gewinnst!';
  } else if (playerHandValue > dealerHandValue) {
    return 'Du gewinnst!';
  } else if (playerHandValue < dealerHandValue) {
    return 'Du hast verloren!';
  } else {
    return 'Unentschieden!';
  }
}

// Event-Listener für den "Hit"-Button
hitButton.addEventListener('click', () => {
  if (playerChips >= 100) {
    playerCards.push(drawCard());
    playerHandValue = calculateHandValue(playerCards);
    updateCardDisplay();

    if (playerHandValue > 21) {
      resultMessageElement.textContent = 'Du hast verloren! Überzogen!';
      gameResultElement.style.display = 'block';
    }
  }
});

// Event-Listener für den "Stand"-Button
standButton.addEventListener('click', () => {
  while (dealerHandValue < 17) {
    dealerCards.push(drawCard());
    dealerHandValue = calculateHandValue(dealerCards);
  }

  const resultMessage = determineWinner();
  resultMessageElement.textContent = resultMessage;
  gameResultElement.style.display = 'block';

  hitButton.disabled = true;
  standButton.disabled = true;
  doubleButton.disabled = true;
  splitButton.disabled = true;
});

// Event-Listener für den "Double"-Button
doubleButton.addEventListener('click', () => {
  if (playerChips >= 200) {
    playerChips -= 100;
    playerCards.push(drawCard());
    playerHandValue = calculateHandValue(playerCards);
    updateCardDisplay();

    if (playerHandValue > 21) {
      resultMessageElement.textContent = 'Du hast verloren! Überzogen!';
      gameResultElement.style.display = 'block';
    } else {
      standButton.click();
    }
  }
});

// Event-Listener für den "Split"-Button
splitButton.addEventListener('click', () => {
  if (playerCards[0].value === playerCards[1].value) {
    // Splitting logic
    playerHasSplit = true;
    playerCards.push(drawCard());
    playerHandValue = calculateHandValue(playerCards);
    updateCardDisplay();
  }
});

// Event-Listener für den "Neustart"-Button
restartButton.addEventListener('click', startGame);

// Das Spiel beim Laden der Seite starten
startGame();
