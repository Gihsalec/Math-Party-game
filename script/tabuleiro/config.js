export const STEP = 80;
export const GAP = 4;
export const TILE_SIZE = STEP - GAP;
export const ORIGIN_X = 0;
export const ORIGIN_Y = 0;

export const COLS = 15;
export const ROWS = 9;

export const TOKEN_SIZE = 45;

export const SELETOR_CARD_POR_JOGADOR = {
    'jogador-1': '.player-card.p1',
    'jogador-2': '.player-card.p2',
    'jogador-3': '.player-card.p3',
    'jogador-4': '.player-card.p4',
};

export const COR_POR_JOGADOR = {
    'jogador-1': '--card1-bg',
    'jogador-2': '--card2-bg',
    'jogador-3': '--card3-bg',
    'jogador-4': '--card4-bg',
};

export const TOKEN_IMAGEM_POR_JOGADOR = {
    'jogador-1': '../images/adicaoToken.png',
    'jogador-2': '../images/divisaoToken.png',
    'jogador-3': '../images/subtracaoToken.png',
    'jogador-4': '../images/multiplicacaoToken.png',
};

export const AVATAR_IMAGEM_POR_JOGADOR = {
    'jogador-1': '../images/adicaoExpressao.png',
    'jogador-2': '../images/divisaoExpressao.png',
    'jogador-3': '../images/subtracaoExpressao.png',
    'jogador-4': '../images/multiplicacaoExpressao.png',
};

export const IMAGEM_POR_JOGADOR = {
    'jogador-1': '../images/adicao.png',
    'jogador-2': '../images/divisao.png',
    'jogador-3': '../images/subtracao.png',
    'jogador-4': '../images/multiplicacao.png',
};

export const ESCALA_POR_JOGADOR = {
    'jogador-1': 1,
    'jogador-2': 1,
    'jogador-3': 1,
    'jogador-4': 1.2,
};

export const LAYOUTS_POR_QUANTIDADE = {
    1: [{ x: 0, y: 0 }],
    2: [{ x: -13, y: 0 }, { x: 13, y: 0 }],
    3: [{ x: -13, y: -10 }, { x: 13, y: -10 }, { x: 0, y: 14 }],
    4: [{ x: -13, y: -13 }, { x: 13, y: -13 }, { x: -13, y: 13 }, { x: 13, y: 13 }],
};

export const CONFIG_NIVEL = {
    facil: { label: 'Nível Fácil', tempo: 90, acerto: 10, erro: -5 },
    intermediaria: { label: 'Nível Intermediário', tempo: 150, acerto: 20, erro: -10 },
    dificil: { label: 'Nível Difícil', tempo: 210, acerto: 40, erro: -20 },
};
