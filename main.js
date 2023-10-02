// obter e interpretar CANVAS
const canvas = document.getElementById("canvas");
const contexto = canvas.getContext("2d");

// Tamanho das cartas
const LarguraCarta = 150;
const alturaCarta = 150;

// Quantidade de linhas e colunas
const numLinhas = 4;
const numColunas = 4;

const cartas = [];

// Margens
const margemHorizontal = 10;
const margemVertical = 10;

let cartasViradas = [];
let limiteCartasViradas = false;  

// Imagem de fundo
const imagemFundo = new Image();
imagemFundo.src = "fundoCarta.jpg";

// Pré-carregamento da imagem de fundo
imagemFundo.onload = function () {
  iniciarJogo();
};

// Função para misturar as cartas
function misturar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// criação e mistura de pares de cartas
const paresCarta = [
  "img1.png", "img2.png", "img3.png", "img4.png",
  "img5.png", "img6.png", "img7.png", "img8.png"
];

//concatena o paresCarta, criando pares ex: "img1.png" "img1.png"
const deckCartas = paresCarta.concat(paresCarta);
misturar(deckCartas);

// Cria cartas e atribui ao array cartas
for (let linha = 0; linha < numLinhas; linha++) {
  for (let col = 0; col < numColunas; col++) {
    const carta = {
      linha,
      col,
      value: deckCartas.pop(),
      virado: false, 
    };
    cartas.push(carta);
  }
}

canvas.addEventListener("click", virarCarta);

function virarCarta(pos) {
    
// se o limite de 2 cartas for alcançado, encerra a função
  if (limiteCartasViradas || cartasViradas.length >= 2) {
    return;
  }

  // le as coordenadas da carta escolhida pelo jogador
  const x = pos.offsetX;
  const y = pos.offsetY;

  const cartaEscolhida = pegarCartaEscolhida(x, y);

// se o jogador clicar em uma carta já escolhida ou fora do jogo, encerra a função
  if (!cartaEscolhida || cartaEscolhida.virado) { // "!" utilizado para inverter o valor boolean de "cartaEscolhida"
    return;
  }

  // envia a carta escolhida para "cartas viradas"
  cartaEscolhida.virado = true;
  cartasViradas.push(cartaEscolhida);

  if (cartasViradas.length === 2) {
    limiteCartasViradas = true;

    // aciona um temporizador que ativa a função verificarPar em 1s
    setTimeout(verificarPar, 1000);
  }

  iniciarJogo();
}

// verificar se as cartas combinam
function verificarPar() {
  const [carta1, carta2] = cartasViradas;

  if (carta1.value === carta2.value) {
    carta1.virado = true; 
    carta2.virado = true; 
  } else {
    carta1.virado = false; 
    carta2.virado = false; 
  }

  //esvazia o cartasViradas e reseta o limiteCartasViradas
  cartasViradas = [];
  limiteCartasViradas = false;

  iniciarJogo();
}

// obter a carta escolhida
function pegarCartaEscolhida(x, y) {
  for (const carta of cartas) {
    // obtem os valor de coordenada da carta
    const cardX = margemHorizontal + carta.col * (LarguraCarta + margemHorizontal);
    const cardY = margemVertical + carta.linha * (alturaCarta + margemVertical);

    // se o clique do jogador for dentro das coordenadas da carta, ele retorna a carta
    if (x >= cardX && x <= cardX + LarguraCarta && y >= cardY && y <= cardY + alturaCarta) {
      return carta;
    }
  }
  return null;
}

// iniciar jogo
function iniciarJogo() {

//limpa o conteudo do canvas
  contexto.clearRect(0, 0, canvas.width, canvas.height);

  for (const carta of cartas) {
    // atribui a posição das cartas dentro do canvas
    const cardX = margemHorizontal + carta.col * (LarguraCarta + margemHorizontal);
    const cardY = margemVertical + carta.linha * (alturaCarta + margemVertical);

    
    if (carta.virado) {
      const img = new Image();
      img.src = carta.value;
      img.onload = function () {
        contexto.drawImage(img, cardX, cardY, LarguraCarta, alturaCarta);
      };
    } else {
      contexto.drawImage(imagemFundo, cardX, cardY, LarguraCarta, alturaCarta);
    }
  }
}
