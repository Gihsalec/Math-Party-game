export function criarModalResultado(elements) {
    const {
        resultadoOverlay,
        resultadoCardEl,
        resultadoLinhasEl,
        btnAvancar,
        btnExplicacao,
        explicacaoOverlay,
        explicacaoPerguntaEl,
        explicacaoOpcoesEl,
        explicacaoTextoEl,
        explicacaoReferenciaEl,
        btnFecharExplicacao,
        corDoJogador,
    } = elements;

    let explicacaoAtual = null;

    function criarLinhaResultado({ avatarSrc, nomeJogador, pontosTexto, statusTipo, statusTexto, opcaoEscolhida, opcaoCorreta }) {
        const linha = document.createElement('div');
        linha.className = 'resultado-linha';

        const esquerda = document.createElement('div');
        esquerda.className = 'resultado-esquerda';

        const avatar = document.createElement('img');
        avatar.className = 'resultado-avatar';
        avatar.src = avatarSrc ?? '';
        avatar.alt = nomeJogador;

        const nome = document.createElement('div');
        nome.className = 'resultado-nome';
        nome.textContent = nomeJogador;

        const pontos = document.createElement('div');
        pontos.className = 'resultado-pontos';
        pontos.textContent = pontosTexto;

        esquerda.append(avatar, nome, pontos);

        const direita = document.createElement('div');
        direita.className = 'resultado-direita';

        const status = document.createElement('div');
        status.className = 'resultado-status-texto';
        status.textContent = statusTexto;
        direita.appendChild(status);

        if (statusTipo === 'certa') {
            const pill = document.createElement('span');
            pill.className = 'resultado-opcao correta';
            pill.textContent = opcaoCorreta ?? '';
            direita.appendChild(pill);
        } else if (statusTipo === 'errada') {
            const wrap = document.createElement('div');
            wrap.className = 'resultado-opcoes-wrap';

            const pillErrada = document.createElement('span');
            pillErrada.className = 'resultado-opcao errada';
            pillErrada.textContent = opcaoEscolhida ?? '—';

            const pillCorreta = document.createElement('span');
            pillCorreta.className = 'resultado-opcao correta';
            pillCorreta.textContent = opcaoCorreta ?? '';

            wrap.append(pillErrada, pillCorreta);
            direita.appendChild(wrap);
        }

        linha.append(esquerda, direita);
        return linha;
    }

    function mostrarResultado({ tema, linhas, questao, aoAvancar, jogadorId }) {
        resultadoOverlay.classList.remove('tema-normal', 'tema-desafio');
        resultadoOverlay.classList.add(tema === 'desafio' ? 'tema-desafio' : 'tema-normal');
        if (resultadoCardEl) {
            resultadoCardEl.style.background = jogadorId && corDoJogador ? corDoJogador(jogadorId) : '';
        }

        resultadoLinhasEl.innerHTML = '';
        linhas.forEach((linha) => resultadoLinhasEl.appendChild(criarLinhaResultado(linha)));

        explicacaoAtual = questao;

        function aoClicarAvancar() {
            resultadoOverlay.classList.remove('ativo');
            btnAvancar.removeEventListener('click', aoClicarAvancar);
            aoAvancar();
        }
        btnAvancar.addEventListener('click', aoClicarAvancar);

        resultadoOverlay.classList.add('ativo');
    }

    btnExplicacao.addEventListener('click', () => {
        if (!explicacaoAtual) return;
        const questao = explicacaoAtual;

        explicacaoPerguntaEl.textContent = questao.pergunta || '';
        explicacaoTextoEl.textContent = questao.solucao || 'Explicação não disponível.';

        explicacaoOpcoesEl.innerHTML = '';
        (questao.opcoes || []).forEach((opcao) => {
            const el = document.createElement('div');
            el.className = 'explicacao-opcao' + (opcao.correta ? ' correta' : '');
            el.textContent = opcao.texto;
            explicacaoOpcoesEl.appendChild(el);
        });

        const partesMeta = [];
        if (questao.tema) partesMeta.push(`Tema: ${questao.tema}`);
        if (questao.nivel) partesMeta.push(`Nível: ${questao.nivel}`);
        if (questao.referencia) partesMeta.push(`Referência: ${questao.referencia}`);
        explicacaoReferenciaEl.textContent = partesMeta.length ? `(${partesMeta.join(', ')})` : '';

        explicacaoOverlay.classList.add('ativo');
    });

    btnFecharExplicacao.addEventListener('click', () => {
        explicacaoOverlay.classList.remove('ativo');
    });

    return { mostrarResultado };
}
