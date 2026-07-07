export function criarControleDeTurno({ jogadoresSalvos, corPorJogador, centerEl, turnoTextoEl }) {
    let turnoAtual = 0;

    function atualizarTurno() {
        const jogador = jogadoresSalvos[turnoAtual];
        if (!jogador) return;

        const varCor = corPorJogador[jogador.id];
        centerEl.style.background = `var(${varCor})`;
        turnoTextoEl.textContent = `Sua vez: ${jogador.nome}`;
    }

    function jogadorDaVez() {
        return jogadoresSalvos[turnoAtual];
    }

    function avancarTurno() {
        turnoAtual = (turnoAtual + 1) % jogadoresSalvos.length;
        atualizarTurno();
    }

    return { atualizarTurno, jogadorDaVez, avancarTurno };
}
