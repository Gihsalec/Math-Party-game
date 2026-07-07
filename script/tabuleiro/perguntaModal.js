import { formatarTempo, caminhoImagemPergunta } from './utils.js';

export function criarModalPergunta(elements) {
    const {
        perguntaOverlay,
        perguntaCardEl,
        perguntaAvatarEl,
        perguntaNivelBadgeEl,
        perguntaTextoEl,
        perguntaImagemWrapEl,
        perguntaImagemEl,
        perguntaOpcoesEl,
        perguntaRodapeEl,
        perguntaTimerEl,
    } = elements;

    let perguntaIntervalo = null;

    function pararTimerPergunta() {
        if (perguntaIntervalo) {
            clearInterval(perguntaIntervalo);
            perguntaIntervalo = null;
        }
    }

    function iniciarPergunta({ jogador, questao, config, corDoJogador, avatarImagemPorJogador, aoResponder }) {
        perguntaCardEl.style.background = corDoJogador(jogador.id);
        perguntaAvatarEl.src = avatarImagemPorJogador[jogador.id] ?? '';
        perguntaTextoEl.textContent = questao.pergunta;

        const caminhoImagem = caminhoImagemPergunta(questao.imagem);
        if (caminhoImagem) {
            perguntaImagemEl.onerror = () => {
                perguntaImagemWrapEl.classList.remove('visivel');
            };
            perguntaImagemEl.src = caminhoImagem;
            perguntaImagemEl.alt = `Imagem de apoio: ${questao.tema || 'pergunta'}`;
            perguntaImagemWrapEl.classList.add('visivel');
        } else {
            perguntaImagemWrapEl.classList.remove('visivel');
            perguntaImagemEl.removeAttribute('src');
        }

        perguntaNivelBadgeEl.textContent =
            `${config.label} • ⏱ ${formatarTempo(config.tempo)} • Acerto +${config.acerto} • Erro/tempo ${config.erro}`;
        perguntaRodapeEl.textContent = `(Tema: ${questao.tema || '—'}, Referência: ${questao.referencia})`;

        perguntaOpcoesEl.innerHTML = '';
        questao.opcoes.forEach((opcao) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pergunta-opcao';
            btn.textContent = opcao.texto;

            btn.addEventListener('click', () => {
                const botoes = perguntaOpcoesEl.querySelectorAll('.pergunta-opcao');
                botoes.forEach((b) => (b.disabled = true));

                if (opcao.correta) {
                    btn.classList.add('correta');
                } else {
                    btn.classList.add('errada');
                    botoes.forEach((b) => {
                        if (b.textContent === questao.opcoes.find((o) => o.correta)?.texto) {
                            b.classList.add('correta');
                        }
                    });
                }

                pararTimerPergunta();
                setTimeout(() => {
                    perguntaOverlay.classList.remove('ativo');
                    aoResponder(opcao.correta, opcao.texto);
                }, 900);
            });

            perguntaOpcoesEl.appendChild(btn);
        });

        let tempoRestante = config.tempo;
        perguntaTimerEl.textContent = tempoRestante;
        pararTimerPergunta();
        perguntaIntervalo = setInterval(() => {
            tempoRestante -= 1;
            perguntaTimerEl.textContent = Math.max(tempoRestante, 0);

            if (tempoRestante <= 0) {
                const botoes = perguntaOpcoesEl.querySelectorAll('.pergunta-opcao');
                botoes.forEach((b) => {
                    b.disabled = true;
                    if (b.textContent === questao.opcoes.find((o) => o.correta)?.texto) {
                        b.classList.add('correta');
                    }
                });

                pararTimerPergunta();
                setTimeout(() => {
                    perguntaOverlay.classList.remove('ativo');
                    aoResponder(false, null);
                }, 900);
            }
        }, 1000);

        perguntaOverlay.classList.add('ativo');
    }

    return { iniciarPergunta };
}
