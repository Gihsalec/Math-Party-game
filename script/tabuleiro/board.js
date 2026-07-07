const RIGHT_STAIR = [
    [10, 11],
    [11, 12, 13],
    [13, 14],
    [14],
    [14, 13],
    [13, 12, 11],
    [11, 10],
];

const LEFT_STAIR = [
    [4, 3],
    [3, 2, 1],
    [1, 0],
    [0],
    [0, 1],
    [1, 2, 3],
    [3, 4],
];

const CORES_CASAS = [
    'teal', 'bomba', 'teal', 'azul2', 'teal', 'teal-claro', 'vermelho',
    'teal-claro', null, 'teal-claro', 'bomba', 'roxo2',
    'teal', 'teal-claro', 'teal', 'teal-claro', 'teal', 'azul2', 'teal', 'teal-claro',
    null, 'teal-claro',
    'teal', 'teal-claro', 'bomba', 'laranja2', 'teal', 'teal-claro', 'vermelho',
    'teal-claro', null, 'teal-claro',
    'teal', 'bomba', 'teal', 'teal-claro', 'roxo2', 'teal-claro', 'teal', 'laranja2', 'teal', 'teal-claro',
    null, 'teal-claro',
];

const CASAS_ESPECIAIS = [
    { r: 1, c: 3, cls: 'pink' },    // perto do Jogador 1 (topo-esquerda)
    { r: 1, c: 11, cls: 'orange' }, // perto do Jogador 2 (topo-direita)
    { r: 7, c: 11, cls: 'purple' }, // perto do Jogador 4 (base-direita)
    { r: 7, c: 3, cls: 'blue' },    // perto do Jogador 3 (base-esquerda)
];

function findIndex(cells, r, c) {
    return cells.findIndex((cell) => cell.r === r && cell.c === c);
}

function findIndexByCls(cells, cls) {
    return cells.findIndex((cell) => cell.cls === cls);
}

export function construirCelulas() {
    const cells = [];

    for (let c = 4; c <= 10; c++) cells.push({ c, r: 0 });

    RIGHT_STAIR.forEach((cols, i) => {
        const r = i + 1;
        cols.forEach((c) => cells.push({ c, r }));
    });

    for (let c = 10; c >= 4; c--) cells.push({ c, r: 8 });

    LEFT_STAIR.forEach((cols, i) => {
        const r = 7 - i;
        cols.forEach((c) => cells.push({ c, r }));
    });

    CORES_CASAS.forEach((cor, i) => {
        if (cor) cells[i].cls = cor;
    });

    CASAS_ESPECIAIS.forEach(({ r, c, cls }) => {
        cells[findIndex(cells, r, c)].cls = cls;
    });

    const casaInicialPorJogador = {
        'jogador-1': findIndexByCls(cells, 'pink'),
        'jogador-2': findIndexByCls(cells, 'orange'),
        'jogador-3': findIndexByCls(cells, 'blue'),
        'jogador-4': findIndexByCls(cells, 'purple'),
    };

    return { cells, casaInicialPorJogador };
}

export function renderizarTabuleiro(boardEl, cells, { origemX = 0, origemY = 0, step, tileSize }) {
    const tileEls = [];

    cells.forEach((cell, i) => {
        const tile = document.createElement('div');
        tile.className = 'tile' + (cell.cls ? ' ' + cell.cls : '');
        tile.style.left = (origemX + cell.c * step) + 'px';
        tile.style.top = (origemY + cell.r * step) + 'px';
        tile.style.width = tileSize + 'px';
        tile.style.height = tileSize + 'px';
        tile.dataset.index = i;
        tile.title = 'Casa ' + (i + 1);
        boardEl.appendChild(tile);
        tileEls.push(tile);
    });

    return tileEls;
}
