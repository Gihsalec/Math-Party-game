export function criarGerenciadorDeTokens({
    boardEl,
    tileEls,
    jogadoresSalvos,
    casaInicialPorJogador,
    tokenImagemPorJogador,
    escalaPorJogador,
    layoutsPorQuantidade,
    tokenSize,
    tileSize,
}) {
    const tokensPorJogador = {};

    jogadoresSalvos.forEach((jogador) => {
        const img = document.createElement('img');
        img.src = tokenImagemPorJogador[jogador.id];
        img.className = 'player-token';
        boardEl.appendChild(img);

        tokensPorJogador[jogador.id] = {
            el: img,
            currentIndex: casaInicialPorJogador[jogador.id] ?? 0,
        };
    });


    function atualizarLayoutTokens() {
        const grupos = {};

        jogadoresSalvos.forEach((jogador) => {
            const info = tokensPorJogador[jogador.id];
            if (!grupos[info.currentIndex]) grupos[info.currentIndex] = [];
            grupos[info.currentIndex].push(jogador.id);
        });

        Object.entries(grupos).forEach(([indexStr, jogadorIds]) => {
            const index = Number(indexStr);
            const tile = tileEls[index];
            const qtd = jogadorIds.length;

            const tamanhoBase = qtd === 1 ? tokenSize : tokenSize / (qtd >= 3 ? 2.2 : 1.7);
            const layout = layoutsPorQuantidade[Math.min(qtd, 4)];

            const centroX = parseFloat(tile.style.left) + tileSize / 2;
            const centroY = parseFloat(tile.style.top) + tileSize / 2;

            jogadorIds.forEach((jogadorId, i) => {
                const info = tokensPorJogador[jogadorId];
                const offset = layout[i] || { x: 0, y: 0 };

                const escalaCorrecao = escalaPorJogador[jogadorId] ?? 1;
                const tamanho = tamanhoBase * escalaCorrecao;

                const escalaPosicao = tamanhoBase / tokenSize;

                info.el.style.width = tamanho + 'px';
                info.el.style.left = (centroX + offset.x * escalaPosicao - tamanho / 2) + 'px';
                info.el.style.top = (centroY + offset.y * escalaPosicao - tamanho / 2) + 'px';
            });
        });
    }

    function placeTokenAt(jogadorId, index) {
        const info = tokensPorJogador[jogadorId];
        if (!info) return;

        info.currentIndex = index;
        atualizarLayoutTokens();
    }

    jogadoresSalvos.forEach((jogador) => {
        placeTokenAt(jogador.id, casaInicialPorJogador[jogador.id] ?? 0);
    });

    return { tokensPorJogador, placeTokenAt, atualizarLayoutTokens };
}
