import { formatarTempo, textoPontos } from './utils.js';

export function criarModalDesafio(elements, deps) {
    const {
        decisaoOverlay,
        decisaoCardEl,
        decisaoTemaEl,
        decisaoInfoEl,
        btnAceitarDesafio,
        btnTransferirDesafio,
        transferOverlay,
        transferCardEl,
        transferInfoTextoEl,
        transferListaEl,
    } = elements;

    const {
        jogadoresSalvos,
        configDificil,
        corDoJogador,
        avatarImagemPorJogador,
        iniciarPergunta,
        adicionarPontos,
        mostrarResultado,
        registrarHistorico,
        finalizarTurno,
    } = deps;

    function abrirPerguntaDesafio(jogadorQueResponde, questao, jogadorOriginal) {
        iniciarPergunta({
            jogador: jogadorQueResponde,
            questao,
            config: configDificil,
            corDoJogador,
            avatarImagemPorJogador,
            aoResponder: (acertou, opcaoEscolhida) => {
                const desafioProprio = jogadorQueResponde.id === jogadorOriginal.id;
                const opcaoCorreta = questao.opcoes.find((o) => o.correta)?.texto;

                function registrarRespostaDesafio(pontos) {
                    registrarHistorico(jogadorQueResponde.id, {
                        questaoId: questao.id,
                        tema: questao.tema,
                        nivel: questao.nivel,
                        pergunta: questao.pergunta,
                        acertou,
                        opcaoEscolhida,
                        opcaoCorreta,
                        pontos,
                        tipo: desafioProprio ? 'desafio' : 'desafio-transferido',
                    });
                }

                const linhaResponder = {
                    avatarSrc: avatarImagemPorJogador[jogadorQueResponde.id],
                    nomeJogador: jogadorQueResponde.nome,
                    statusTipo: acertou ? 'certa' : 'errada',
                    statusTexto: acertou ? 'Resposta certa!' : 'Resposta errada',
                    opcaoEscolhida,
                    opcaoCorreta,
                };

                if (desafioProprio) {
                    const valor = acertou ? configDificil.acerto : configDificil.erro;
                    adicionarPontos(jogadorQueResponde.id, valor);
                    linhaResponder.pontosTexto = textoPontos(valor);
                    registrarRespostaDesafio(valor);

                    mostrarResultado({
                        tema: 'desafio',
                        linhas: [linhaResponder],
                        questao,
                        jogadorId: jogadorQueResponde.id,
                        aoAvancar: finalizarTurno,
                    });
                } else {
                    const valorResponder = acertou ? 30 : -15;
                    const valorOriginal = acertou ? -15 : 30;

                    adicionarPontos(jogadorQueResponde.id, valorResponder);
                    adicionarPontos(jogadorOriginal.id, valorOriginal);

                    linhaResponder.pontosTexto = textoPontos(valorResponder);
                    registrarRespostaDesafio(valorResponder);

                    const linhaOriginal = {
                        avatarSrc: avatarImagemPorJogador[jogadorOriginal.id],
                        nomeJogador: jogadorOriginal.nome,
                        statusTipo: 'transferido',
                        statusTexto: 'Desafio transferido',
                        pontosTexto: textoPontos(valorOriginal),
                    };

                    mostrarResultado({
                        tema: 'desafio',
                        linhas: [linhaOriginal, linhaResponder],
                        questao,
                        // mantém a cor do dono do turno (mesma cor do card central/dado),
                        // mesmo quando o desafio foi transferido para outro jogador responder
                        jogadorId: jogadorOriginal.id,
                        aoAvancar: finalizarTurno,
                    });
                }
            },
        });
    }

    function abrirSelecaoTransferencia(jogadorOriginal, questao) {
        const outros = jogadoresSalvos.filter((j) => j.id !== jogadorOriginal.id);

        if (outros.length === 0) {
            abrirPerguntaDesafio(jogadorOriginal, questao, jogadorOriginal);
            return;
        }

        transferInfoTextoEl.textContent = `Tema da pergunta: ${questao.tema || 'Nível difícil'}`;
        transferCardEl.style.background = corDoJogador(jogadorOriginal.id);
        transferListaEl.innerHTML = '';

        outros.forEach((alvo) => {
            const item = document.createElement('div');
            item.className = 'transfer-item';

            const img = document.createElement('img');
            img.className = 'transfer-avatar';
            img.src = avatarImagemPorJogador[alvo.id] ?? '';
            img.alt = alvo.nome;

            const nome = document.createElement('span');
            nome.className = 'transfer-nome';
            nome.textContent = alvo.nome;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'transfer-btn';
            btn.textContent = 'Escolher';
            btn.addEventListener('click', () => {
                transferOverlay.classList.remove('ativo');
                abrirPerguntaDesafio(alvo, questao, jogadorOriginal);
            });

            item.appendChild(img);
            item.appendChild(nome);
            item.appendChild(btn);
            transferListaEl.appendChild(item);
        });

        transferOverlay.classList.add('ativo');
    }

    function abrirJanelaDecisao(jogador, questao) {
        decisaoCardEl.style.background = corDoJogador(jogador.id);
        decisaoTemaEl.textContent = questao.tema || 'Nível difícil';
        decisaoInfoEl.textContent =
            `⏱ ${formatarTempo(configDificil.tempo)} • Acerto: +${configDificil.acerto} pontos • Erro/tempo esgotado: ${configDificil.erro} pontos`;

        function limparBotoes() {
            btnAceitarDesafio.removeEventListener('click', aoAceitar);
            btnTransferirDesafio.removeEventListener('click', aoTransferir);
        }

        function aoAceitar() {
            limparBotoes();
            decisaoOverlay.classList.remove('ativo');
            abrirPerguntaDesafio(jogador, questao, jogador);
        }

        function aoTransferir() {
            limparBotoes();
            decisaoOverlay.classList.remove('ativo');
            abrirSelecaoTransferencia(jogador, questao);
        }

        btnAceitarDesafio.addEventListener('click', aoAceitar);
        btnTransferirDesafio.addEventListener('click', aoTransferir);

        decisaoOverlay.classList.add('ativo');
    }

    return { abrirJanelaDecisao };
}