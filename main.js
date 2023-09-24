const canvas = document.getElementById("canvas");
const contexto = canvas.getContext("2d");

// Tamanho das cartas
const LarguraCarta = 150;
const alturaCarta = 150;
// Fim do tamanho das cartas

// Quantidade de linhas e colunas
const numLinhas = 4;
const numColunas = 4;
// Fim da quantidade de linhas e colunas
const cartas = [];

// Margens
const margemHorizontal = 10;
const margemVertical = 10;
// Fim das margens

let cartasViradas = [];
let limiteCartasViradas = false;  

// Imagem de fundo
const imagemFundo = new Image();
imagemFundo.src = "fundoCarta.jpg";
// Fim da imagem de fundo

// Pré-carregamento da imagem de fundo
imagemFundo.onload = function () {
  iniciarJogo();
};
// Fim do pré-carregamento da imagem de fundo

// Função para misturar as cartas
function misturar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// Fim da função para misturar as cartas

// Array de pares de cartas
const paresCarta = [
  "img1.png", "img2.png", "img3.png", "img4.png",
  "img5.png", "img6.png", "img7.png", "img8.png"
];
const deckCartas = paresCarta.concat(paresCarta);
misturar(deckCartas);

// Criar as cartas
for (let row = 0; row < numLinhas; row++) {
  for (let col = 0; col < numColunas; col++) {
    const card = {
      row,
      col,
      value: deckCartas.pop(),
      virado: false, 
    };
    cartas.push(card);
  }
}

canvas.addEventListener("click", virarCarta);

// Função para lidar com o clique em uma carta
function virarCarta(event) {
  if (limiteCartasViradas || cartasViradas.length >= 2) {
    return;
  }

  const x = event.offsetX;
  const y = event.offsetY;

  const cartaEscolhida = pegarCartaEscolhida(x, y);

  if (!cartaEscolhida || cartaEscolhida.virado) { // "!" utilizado para inverter o valor booleano de "cartaEscolhida"
    return;
  }

  cartaEscolhida.virado = true;
  cartasViradas.push(cartaEscolhida);

  if (cartasViradas.length === 2) {
    limiteCartasViradas = true;
    setTimeout(verificarPar, 1000);
  }

  iniciarJogo();
}

// Função para verificar se as cartas combinam
function verificarPar() {
  const [carta1, carta2] = cartasViradas;

  if (carta1.value === carta2.value) {
    carta1.virado = true; 
    carta2.virado = true; 
  } else {
    carta1.virado = false; 
    carta2.virado = false; 
  }

  cartasViradas = [];
  limiteCartasViradas = false;
  iniciarJogo();
}

// Função para obter a carta clicada
function pegarCartaEscolhida(x, y) {
  for (const card of cartas) {
    const cardX = margemHorizontal + card.col * (LarguraCarta + margemHorizontal);
    const cardY = margemVertical + card.row * (alturaCarta + margemVertical);

    if (x >= cardX && x <= cardX + LarguraCarta && y >= cardY && y <= cardY + alturaCarta) {
      return card;
    }
  }
  return null;
}

// Função para desenhar o jogo
function iniciarJogo() {
  contexto.clearRect(0, 0, canvas.width, canvas.height);

  for (const card of cartas) {
    const cardX = margemHorizontal + card.col * (LarguraCarta + margemHorizontal);
    const cardY = margemVertical + card.row * (alturaCarta + margemVertical);

    if (card.virado) {
      const img = new Image();
      img.src = card.value;
      img.onload = function () {
        contexto.drawImage(img, cardX, cardY, LarguraCarta, alturaCarta);
      };
    } else {
      // Desenhe a imagem da parte de trás das cartas
      contexto.drawImage(imagemFundo, cardX, cardY, LarguraCarta, alturaCarta);
    }
  }
}
