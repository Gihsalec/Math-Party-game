import { carregar } from './storage.js';
import { IMAGEM_POR_JOGADOR } from './tabuleiro/config.js';

// carrega as perguntas do JSON em vez de importar de um arquivo inexistente
async function carregarPerguntas() {
    const resposta = await fetch('../questoes.json');
    const dadosJson  = await resposta.json();
    return dadosJson .questoes || [];
}
const perguntas = await carregarPerguntas();

const params = new URLSearchParams(window.location.search);
const jogadorIdParam = params.get('jogador');

const dados = carregar();
const jogadores = dados.jogadores || [];
const historico = dados.historico || {};

const jogador = jogadores.find((j) => j.id === jogadorIdParam);

// o id do jogador já vem no formato "jogador-1", que é a mesma chave usada no histórico
const respostas = historico[jogadorIdParam] || [];

// elementos do DOM
const nomeEl = document.getElementById('nomeJogador');
const avatarEl = document.getElementById('avatarJogador');
const listaAcertadasEl = document.getElementById('listaAcertadas');
const listaErradasEl = document.getElementById('listaErradas');

const overlayEl = document.getElementById('explicacaoOverlay');
const btnFecharExplicacao = document.getElementById('btnFecharExplicacao');
const explicacaoPerguntaEl = document.getElementById('explicacaoPergunta');
const explicacaoOpcoesEl = document.getElementById('explicacaoOpcoes');
const explicacaoTextoEl = document.getElementById('explicacaoTexto');
const explicacaoReferenciaEl = document.getElementById('explicacaoReferencia');

// preenche nome e avatar do jogador
if (nomeEl) {
    nomeEl.textContent = jogador?.nome ?? `Jogador ${jogadorIdParam}`;
}
if (avatarEl) {
    avatarEl.src = IMAGEM_POR_JOGADOR[jogador?.id] ?? '';
    avatarEl.alt = jogador?.nome ?? '';
}

// ordena as respostas pela ordem em que foram respondidas
const respostasOrdenadas = [...respostas].sort((a, b) => (a.data ?? 0) - (b.data ?? 0));

function montarBotaoPergunta(entrada, numero) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'pergunta-item';
    botao.innerHTML = `Pergunta ${numero} <span class="icone ${entrada.acertou ? 'certo' : 'errado'}">${entrada.acertou ? '✔' : '✕'}</span>`;

    botao.addEventListener('click', () => abrirExplicacao(entrada));

    return botao;
}

function renderizarListas() {
    if (!listaAcertadasEl || !listaErradasEl) return;

    listaAcertadasEl.innerHTML = '';
    listaErradasEl.innerHTML = '';

    respostasOrdenadas.forEach((entrada, indice) => {
        const botao = montarBotaoPergunta(entrada, indice + 1);
        if (entrada.acertou) {
            listaAcertadasEl.appendChild(botao);
        } else {
            listaErradasEl.appendChild(botao);
        }
    });
}

function abrirExplicacao(entrada) {
    const perguntaCompleta = perguntas.find((p) => p.id === entrada.questaoId);

    if (!perguntaCompleta) {
        explicacaoPerguntaEl.textContent = entrada.pergunta ?? 'Pergunta não encontrada.';
        explicacaoOpcoesEl.innerHTML = '';
        explicacaoTextoEl.textContent = '';
        explicacaoReferenciaEl.textContent = '';
    } else {
        explicacaoPerguntaEl.textContent = perguntaCompleta.pergunta;

        explicacaoOpcoesEl.innerHTML = '';
        perguntaCompleta.opcoes.forEach((opcao) => {
            const item = document.createElement('p');
            item.className = 'explicacao-opcao';

            const escolhida = opcao.texto === entrada.opcaoEscolhida;
            if (opcao.correta) item.classList.add('opcao-correta');
            if (escolhida && !opcao.correta) item.classList.add('opcao-escolhida-errada');

            let marcador = '';
            if (opcao.correta) marcador = ' ✔';
            else if (escolhida) marcador = ' ✕';

            item.textContent = `${opcao.texto}${marcador}`;
            explicacaoOpcoesEl.appendChild(item);
        });

        explicacaoTextoEl.textContent = perguntaCompleta.solucao;
        explicacaoReferenciaEl.textContent = perguntaCompleta.referencia ?? '';
    }

    overlayEl.hidden = false;
}

function fecharExplicacao() {
    overlayEl.hidden = true;
}

if (btnFecharExplicacao) {
    btnFecharExplicacao.addEventListener('click', fecharExplicacao);
}

renderizarListas();