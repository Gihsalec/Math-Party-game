export function criarGerenciadorDeJogadores({
    jogadoresSalvos,
    desabilitadosSalvos,
    seletorCardPorJogador,
    corPorJogador,
    salvar,
}) {
    const mapaCards = {};
    Object.entries(seletorCardPorJogador).forEach(([id, seletor]) => {
        mapaCards[id] = document.querySelector(seletor);
    });

    function aplicarJogadoresNosCards() {
        jogadoresSalvos.forEach((jogador) => {
            const card = mapaCards[jogador.id];
            if (!card) return;

            const nomeEl = card.querySelector('.name');
            if (nomeEl) nomeEl.textContent = jogador.nome;

            const scoreEl = card.querySelector('.score');
            if (scoreEl) scoreEl.textContent = `${jogador.pontos ?? 0} pontos`;
        });

        desabilitadosSalvos.forEach((jogador) => {
            const card = mapaCards[jogador.id];
            if (!card) return;
            card.classList.add('bloqueado');
        });
    }

    function adicionarPontos(jogadorId, valor) {
        const jogador = jogadoresSalvos.find((j) => j.id === jogadorId);
        if (!jogador) return 0;

        const atual = jogador.pontos ?? 0;
        const novo = Math.max(0, atual + valor);
        jogador.pontos = novo;

        const card = mapaCards[jogadorId];
        if (card) {
            const scoreEl = card.querySelector('.score');
            if (scoreEl) scoreEl.textContent = `${jogador.pontos} pontos`;
        }

        salvar({ jogadores: jogadoresSalvos, desabilitados: desabilitadosSalvos });

        return novo - atual;
    }

    function corDoJogador(jogadorId) {
        const varCor = corPorJogador[jogadorId];
        return varCor ? `var(${varCor})` : '';
    }

    return { mapaCards, aplicarJogadoresNosCards, adicionarPontos, corDoJogador };
}
