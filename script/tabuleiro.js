import { carregar, salvar } from './storage.js';

import {
    STEP,
    TILE_SIZE,
    ORIGIN_X,
    ORIGIN_Y,
    TOKEN_SIZE,
    SELETOR_CARD_POR_JOGADOR,
    COR_POR_JOGADOR,
    TOKEN_IMAGEM_POR_JOGADOR,
    AVATAR_IMAGEM_POR_JOGADOR,
    ESCALA_POR_JOGADOR,
    LAYOUTS_POR_QUANTIDADE,
    CONFIG_NIVEL,
} from './tabuleiro/config.js';

import { perguntaAleatoria } from './tabuleiro/utils.js';
import { construirCelulas, renderizarTabuleiro } from './tabuleiro/board.js';
import { criarGerenciadorDeTokens } from './tabuleiro/tokens.js';
import { criarDado } from './tabuleiro/dice.js';
import { criarControleDeTurno } from './tabuleiro/turno.js';
import { criarGerenciadorDeJogadores } from './tabuleiro/players.js';
import { criarModalPergunta } from './tabuleiro/perguntaModal.js';
import { criarModalDesafio } from './tabuleiro/desafioModal.js';
import { criarModalResultado } from './tabuleiro/resultadoModal.js';

// Quantas rodadas tem uma partida. Uma rodada só termina quando TODOS os
// jogadores habilitados jogaram a vez uma vez (ver finalizarTurno()).
const MAX_RODADAS = 8;

// ---- Carrega jogadores salvos na tela anterior ----
// jogadoresSalvos já contém só os jogadores HABILITADOS (ver escolhapersonagens.js),
// então uma "rodada" corresponde a um ciclo completo de turnoAtual por essa lista.
const dadosSalvos = carregar();
const jogadoresSalvos = dadosSalvos.jogadores || [];
const desabilitadosSalvos = dadosSalvos.desabilitados || [];

// IDs das perguntas já sorteadas nesta partida, pra não repetir (ver utils.perguntaAleatoria).
const perguntasFeitas = dadosSalvos.perguntasFeitas || [];

// Histórico de respostas por jogador: { 'jogador-1': [{ questaoId, tema, nivel, pergunta,
// acertou, opcaoEscolhida, opcaoCorreta, pontos, tipo, data }, ...], ... }
// Usado pelas páginas resultadoGeral.html e resultadoIndividual.html.
const historico = dadosSalvos.historico || {};

// Estado da rodada atual: quantos jogadores já jogaram desde o início dela.
let rodadaAtual = dadosSalvos.rodadaAtual || 1;
let turnosNaRodadaAtual = dadosSalvos.turnosNaRodadaAtual || 0;
let jogoEncerrado = false;

function salvarEstado() {
    salvar({
        jogadores: jogadoresSalvos,
        desabilitados: desabilitadosSalvos,
        perguntasFeitas,
        rodadaAtual,
        turnosNaRodadaAtual,
        historico,
    });
}

function marcarPerguntaComoFeita(id) {
    if (id == null || perguntasFeitas.includes(id)) return;
    perguntasFeitas.push(id);
    salvarEstado();
}

// Registra que um jogador respondeu (certo ou errado) uma pergunta específica.
function registrarHistorico(jogadorId, entrada) {
    if (!historico[jogadorId]) historico[jogadorId] = [];
    historico[jogadorId].push({ ...entrada, data: Date.now() });
    salvarEstado();
}

// ---- Carrega o banco de perguntas (questoes.json) ----
async function carregarPerguntas() {
    const resposta = await fetch('../questoes.json');
    const dados = await resposta.json();
    return dados.questoes || [];
}
const perguntas = await carregarPerguntas();

// ---- Elementos fixos do tabuleiro ----
const boardEl = document.getElementById('board');
const centerEl = document.getElementById('center');
const turnoTextoEl = document.getElementById('turnoTexto');
const rodadaTextoEl = document.getElementById('rodadaTexto');
const diceEl = document.getElementById('dice');
const rollBtn = document.getElementById('rollBtn');

// ---- Jogadores (cards de pontuação) ----
const players = criarGerenciadorDeJogadores({
    jogadoresSalvos,
    desabilitadosSalvos,
    seletorCardPorJogador: SELETOR_CARD_POR_JOGADOR,
    corPorJogador: COR_POR_JOGADOR,
    salvar: salvarEstado,
});
players.aplicarJogadoresNosCards();

// ---- Tabuleiro (casas) ----
const { cells, casaInicialPorJogador } = construirCelulas();
const tileEls = renderizarTabuleiro(boardEl, cells, {
    origemX: ORIGIN_X,
    origemY: ORIGIN_Y,
    step: STEP,
    tileSize: TILE_SIZE,
});

// ---- Tokens dos jogadores ----
const tokens = criarGerenciadorDeTokens({
    boardEl,
    tileEls,
    jogadoresSalvos,
    casaInicialPorJogador,
    tokenImagemPorJogador: TOKEN_IMAGEM_POR_JOGADOR,
    escalaPorJogador: ESCALA_POR_JOGADOR,
    layoutsPorQuantidade: LAYOUTS_POR_QUANTIDADE,
    tokenSize: TOKEN_SIZE,
    tileSize: TILE_SIZE,
});

// ---- Turno e dado ----
const turno = criarControleDeTurno({
    jogadoresSalvos,
    corPorJogador: COR_POR_JOGADOR,
    centerEl,
    turnoTextoEl,
});
const dado = criarDado(diceEl);

function atualizarBadgeRodada() {
    if (rodadaTextoEl) {
        rodadaTextoEl.textContent = `Rodada ${Math.min(rodadaAtual, MAX_RODADAS)}/${MAX_RODADAS}`;
    }
}
atualizarBadgeRodada();
turno.atualizarTurno();

// ---- Modal de pergunta ----
const perguntaModal = criarModalPergunta({
    perguntaOverlay: document.getElementById('perguntaOverlay'),
    perguntaCardEl: document.querySelector('#perguntaOverlay .pergunta-card'),
    perguntaAvatarEl: document.getElementById('perguntaAvatar'),
    perguntaNivelBadgeEl: document.getElementById('perguntaNivelBadge'),
    perguntaTextoEl: document.getElementById('perguntaTexto'),
    perguntaImagemWrapEl: document.getElementById('perguntaImagemWrap'),
    perguntaImagemEl: document.getElementById('perguntaImagem'),
    perguntaOpcoesEl: document.getElementById('perguntaOpcoes'),
    perguntaRodapeEl: document.getElementById('perguntaRodape'),
    perguntaTimerEl: document.getElementById('perguntaTimer'),
});

// ---- Modal de resultado + explicação ----
const resultadoModal = criarModalResultado({
    resultadoOverlay: document.getElementById('resultadoOverlay'),
    resultadoCardEl: document.querySelector('#resultadoOverlay .resultado-card'),
    resultadoHeaderEl: document.getElementById('resultadoHeader'),
    resultadoLinhasEl: document.getElementById('resultadoLinhas'),
    btnAvancar: document.getElementById('btnAvancar'),
    btnExplicacao: document.getElementById('btnExplicacao'),
    explicacaoOverlay: document.getElementById('explicacaoOverlay'),
    explicacaoPerguntaEl: document.getElementById('explicacaoPergunta'),
    explicacaoOpcoesEl: document.getElementById('explicacaoOpcoes'),
    explicacaoTextoEl: document.getElementById('explicacaoTexto'),
    explicacaoReferenciaEl: document.getElementById('explicacaoReferencia'),
    btnFecharExplicacao: document.getElementById('btnFecharExplicacao'),
    corDoJogador: players.corDoJogador,
});

// ---- Modal de desafio (casa-bomba) ----
const desafioModal = criarModalDesafio(
    {
        decisaoOverlay: document.getElementById('decisaoOverlay'),
        decisaoCardEl: document.querySelector('#decisaoOverlay .decisao-card'),
        decisaoTemaEl: document.getElementById('decisaoTema'),
        decisaoInfoEl: document.getElementById('decisaoInfo'),
        btnAceitarDesafio: document.getElementById('btnAceitarDesafio'),
        btnTransferirDesafio: document.getElementById('btnTransferirDesafio'),
        transferOverlay: document.getElementById('transferOverlay'),
        transferCardEl: document.querySelector('#transferOverlay .decisao-card'),
        transferInfoTextoEl: document.getElementById('transferInfoTexto'),
        transferListaEl: document.getElementById('transferLista'),
    },
    {
        jogadoresSalvos,
        configDificil: CONFIG_NIVEL.dificil,
        corDoJogador: players.corDoJogador,
        avatarImagemPorJogador: AVATAR_IMAGEM_POR_JOGADOR,
        iniciarPergunta: perguntaModal.iniciarPergunta,
        adicionarPontos: (jogadorId, valor) => {
            players.adicionarPontos(jogadorId, valor);
        },
        mostrarResultado: resultadoModal.mostrarResultado,
        registrarHistorico,
        // getter, porque desafioModal é criado antes de finalizarTurno existir
        finalizarTurno: () => finalizarTurno(),
    }
);

function encerrarJogo() {
    jogoEncerrado = true;
    salvarEstado();
    window.location.href = 'resultadoGeral.html';
}

function abrirPergunta(jogador, nivelChave) {
    const questao = perguntaAleatoria(perguntas, nivelChave, perguntasFeitas);
    const config = CONFIG_NIVEL[nivelChave];

    if (!questao || !config) {
        finalizarTurno();
        return;
    }

    perguntaModal.iniciarPergunta({
        jogador,
        questao,
        config,
        corDoJogador: players.corDoJogador,
        avatarImagemPorJogador: AVATAR_IMAGEM_POR_JOGADOR,
        aoResponder: (acertou, opcaoEscolhida) => {
            const valor = acertou ? config.acerto : config.erro;
            players.adicionarPontos(jogador.id, valor);
            marcarPerguntaComoFeita(questao.id);

            const opcaoCorreta = questao.opcoes.find((o) => o.correta)?.texto;

            registrarHistorico(jogador.id, {
                questaoId: questao.id,
                tema: questao.tema,
                nivel: questao.nivel,
                pergunta: questao.pergunta,
                acertou,
                opcaoEscolhida,
                opcaoCorreta,
                pontos: valor,
                tipo: 'normal',
            });

            resultadoModal.mostrarResultado({
                tema: 'normal',
                linhas: [{
                    avatarSrc: AVATAR_IMAGEM_POR_JOGADOR[jogador.id],
                    nomeJogador: jogador.nome,
                    pontosTexto: acertou ? `ganhou ${valor} pontos` : `perdeu ${Math.abs(valor)} pontos`,
                    statusTipo: acertou ? 'certa' : 'errada',
                    statusTexto: acertou ? 'Resposta certa!' : 'Resposta errada',
                    opcaoEscolhida,
                    opcaoCorreta,
                }],
                questao,
                jogadorId: jogador.id,
                aoAvancar: finalizarTurno,
            });
        },
    });
}

function abrirJanelaDecisao(jogador) {
    const questao = perguntaAleatoria(perguntas, 'dificil', perguntasFeitas);

    if (!questao) {
        finalizarTurno();
        return;
    }

    marcarPerguntaComoFeita(questao.id);
    desafioModal.abrirJanelaDecisao(jogador, questao);
}

function resolverCasa(jogador) {
    const info = tokens.tokensPorJogador[jogador.id];
    const casa = cells[info.currentIndex];
    const cls = casa.cls;

    switch (cls) {
        case 'roxo2': {
            players.adicionarPontos(jogador.id, jogador.pontos ?? 0);
            finalizarTurno();
            break;
        }
        case 'laranja2': {
            const atual = jogador.pontos ?? 0;
            const metade = Math.floor(atual / 2);
            players.adicionarPontos(jogador.id, metade - atual);
            finalizarTurno();
            break;
        }
        case 'vermelho': {
            players.adicionarPontos(jogador.id, 10);
            finalizarTurno();
            break;
        }
        case 'azul2': {
            players.adicionarPontos(jogador.id, -10);
            finalizarTurno();
            break;
        }
        case 'teal-claro':
            abrirPergunta(jogador, 'facil');
            break;
        case 'teal':
            abrirPergunta(jogador, 'intermediaria');
            break;
        case 'bomba':
            abrirJanelaDecisao(jogador);
            break;
        default:
            // casas especiais dos jogadores (pink/orange/blue/purple): sem efeito
            finalizarTurno();
    }
}

// ---- Fim de turno: controla a contagem de rodadas (8 rodadas no total) ----
function finalizarTurno() {
    turnosNaRodadaAtual += 1;

    if (turnosNaRodadaAtual >= jogadoresSalvos.length) {
        turnosNaRodadaAtual = 0;
        rodadaAtual += 1;
    }

    salvarEstado();

    if (rodadaAtual > MAX_RODADAS) {
        encerrarJogo();
        return;
    }

    atualizarBadgeRodada();
    rollBtn.disabled = false;
    turno.avancarTurno();
}

// ---- Movimento do peão casa a casa ----
function walkToken(steps) {
    const jogador = turno.jogadorDaVez();

    if (steps <= 0) {
        resolverCasa(jogador);
        return;
    }

    const info = tokens.tokensPorJogador[jogador.id];
    const proximoIndex = (info.currentIndex + 1) % tileEls.length;
    tokens.placeTokenAt(jogador.id, proximoIndex);

    setTimeout(() => walkToken(steps - 1), 400);
}

rollBtn.addEventListener('click', () => {
    if (jogoEncerrado) return;

    rollBtn.disabled = true;
    const value = dado.rollDice();
    dado.girarPara(value);

    // espera a animação do dado (1.1s) antes de andar a peça
    setTimeout(() => walkToken(value), 1100);
});