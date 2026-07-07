import { carregar, remover } from './storage.js';
import { AVATAR_IMAGEM_POR_JOGADOR, COR_POR_JOGADOR } from './tabuleiro/config.js';

const ORDINAL = ['Primeiro Lugar', 'Segundo Lugar', 'Terceiro Lugar', 'Quarto Lugar'];

const dados = carregar();
const jogadores = dados.jogadores || [];

const cardsEl = document.getElementById('cardsContainer');
const vazioEl = document.getElementById('semResultado');

function montarCard(jogador, posicao) {
    const card = document.createElement('div');
    card.className = 'card';
    // cor fixa por jogador (identidade), não pela posição:
    // aplicada via style inline porque COR_POR_JOGADOR guarda o nome da
    // custom property (ex: "--card1-bg"), não uma classe CSS.
    const varCor = COR_POR_JOGADOR[jogador.id];
    if (varCor) card.style.background = `var(${varCor})`;

    const nome = document.createElement('h2');
    nome.textContent = jogador.nome ?? `Jogador ${posicao}`;

    const avatar = document.createElement('img');
    avatar.src = AVATAR_IMAGEM_POR_JOGADOR[jogador.id] ?? '';
    avatar.alt = jogador.nome ?? '';

    const colocacao = document.createElement('h2');
    colocacao.textContent = ORDINAL[posicao - 1] ?? `${posicao}º lugar`;

    const pontos = document.createElement('h2');
    pontos.textContent = `${jogador.pontos ?? 0} pontos`;

    const link = document.createElement('a');
    link.href = `resultadoIndividual.html?jogador=${encodeURIComponent(jogador.id)}`;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'result';
    botao.textContent = 'Ver resultados';
    link.appendChild(botao);

    card.append(nome, avatar, colocacao, pontos, link);
    return card;
}

if (!cardsEl) {
    // segurança: se o markup não tiver o container esperado, não faz nada
} else if (jogadores.length === 0) {
    cardsEl.hidden = true;
    if (vazioEl) vazioEl.hidden = false;
} else {
    // ordena por pontuação (desc) para definir a ORDEM de exibição (esquerda->direita)
    const ranking = [...jogadores].sort((a, b) => (b.pontos ?? 0) - (a.pontos ?? 0));
    ranking.forEach((jogador, indice) => {
        // "indice + 1" é a POSIÇÃO (1º, 2º...), mas a cor vem do id do jogador, não da posição
        cardsEl.appendChild(montarCard(jogador, indice + 1));
    });
}

const btnMenu = document.querySelector('.menu');

if (btnMenu) {
    btnMenu.addEventListener('click', (e) => {
        e.preventDefault();
        remover();
        window.location.href = '../index.html';
    });
}