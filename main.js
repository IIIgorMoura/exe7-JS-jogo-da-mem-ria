
const canvas = document.getElementById("memory-game");
const contexto = canvas.getContext("2d");

const LarguraCarta = 100;
const cardHeight = 150;
const numLinhas = 4;
const numColunas = 4;
const cartas = [];

let flippedCards = [];
let isFlipping = false;

// Função para embaralhar as cartas
function misturar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Crie um array com pares de cartas
// Crie um array com 10 pares de cartas
const cardPairs = ["A", "B", "C", "D", "E", "F", "G", "H",];
const cardDeck = cardPairs.concat(cardPairs);
misturar(cardDeck);


// Crie as cartas
for (let row = 0; row < numLinhas; row++) {
    for (let col = 0; col < numColunas; col++) {
        const card = {
            row,
            col,
            value: cardDeck.pop(),
            isFlipped: false,
        };
        cartas.push(card);
    }
}

// Adicione os eventos de clique
canvas.addEventListener("click", handleCardClick);

// Função para lidar com o clique em uma carta
function handleCardClick(event) {
    if (isFlipping || flippedCards.length >= 2) {
        return;
    }

    const x = event.offsetX;
    const y = event.offsetY;

    const clickedCard = getClickedCard(x, y);

    if (!clickedCard || clickedCard.isFlipped) {
        return;
    }

    clickedCard.isFlipped = true;
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        isFlipping = true;
        setTimeout(checkForMatch, 1000);
    }

    drawGame();
}

// Função para verificar se as cartas combinam
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.value === card2.value) {
        card1.isFlipped = true;
        card2.isFlipped = true;
    } else {
        card1.isFlipped = false;
        card2.isFlipped = false;
    }

    flippedCards = [];
    isFlipping = false;
    drawGame();
}

// Função para obter a carta clicada
function getClickedCard(x, y) {
    for (const card of cartas) {
        const cardX = card.col * LarguraCarta;
        const cardY = card.row * cardHeight;

        if (x >= cardX && x <= cardX + LarguraCarta && y >= cardY && y <= cardY + cardHeight) {
            return card;
        }
    }
    return null;
}

// Função para desenhar o jogo
function drawGame() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    for (const card of cartas) {
        const cardX = card.col * LarguraCarta;
        const cardY = card.row * cardHeight;

        contexto.fillStyle = card.isFlipped ? "#fff" : "#000";
        contexto.fillRect(cardX, cardY, LarguraCarta, cardHeight);

        if (card.isFlipped) {
            contexto.fillStyle = "#000";
            contexto.font = "24px Arial";
            contexto.fillText(card.value, cardX + LarguraCarta / 2 - 12, cardY + cardHeight / 2 + 10);
        }
    }
}