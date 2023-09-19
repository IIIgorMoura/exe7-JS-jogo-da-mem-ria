const canvas = document.getElementById("canvas");
const contexto = canvas.getContext("2d");

const LarguraCarta = 150;
const cardHeight = 150;
const numLinhas = 4;
const numColunas = 4;
const cartas = [];

const margemHorizontal = 10; // Margem horizontal entre as cartas
const margemVertical = 10;   // Margem vertical entre as cartas

let flippedCards = [];
let isFlipping = false;

// Carregue a imagem da parte de trás das cartas
const backImage = new Image();
backImage.src = "fundoCarta.jpg"; // Nome da sua imagem

// Pré-carregue a imagem da parte de trás das cartas
backImage.onload = function() {
    // Quando a imagem estiver carregada, chame a função drawGame para iniciar o jogo
    drawGame();
};

// Função para embaralhar as cartas
function misturar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Crie um array com pares de cartas
const cardPairs = [
    "img1.png", "img2.png", "img3.png", "img4.png",
    "img5.png", "img6.png", "img7.png", "img8.png"
];
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
        const cardX = margemHorizontal + card.col * (LarguraCarta + margemHorizontal);
        const cardY = margemVertical + card.row * (cardHeight + margemVertical);

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
        const cardX = margemHorizontal + card.col * (LarguraCarta + margemHorizontal);
        const cardY = margemVertical + card.row * (cardHeight + margemVertical);

        contexto.fillStyle = card.isFlipped ? "#fff" : "#53ee34";
        contexto.fillRect(cardX, cardY, LarguraCarta, cardHeight);

        if (card.isFlipped) {
            const img = new Image();
            img.src = card.value;
            img.onload = function() {
                contexto.drawImage(img, cardX, cardY, LarguraCarta, cardHeight);
            };
        } else {
            // Desenhe a imagem da parte de trás das cartas
            contexto.drawImage(backImage, cardX, cardY, LarguraCarta, cardHeight);
        }
    }
}