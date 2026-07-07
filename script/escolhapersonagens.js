import { salvar } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const btnJogar = document.querySelector('.jogar');

    const MINIMO_JOGADORES = 2;

    function atualizarBotaoJogar() {
        const habilitados = document.querySelectorAll('.card.habilitado').length;
        btnJogar.disabled = habilitados < MINIMO_JOGADORES;
    }

    function embaralhar(array) {
        const copia = [...array];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    cards.forEach((card, index) => {
        const botao = card.querySelector('button');
        const input = card.querySelector('input[type="text"]');

        card.dataset.id = card.dataset.id || `jogador-${index + 1}`;

        botao.classList.add('habilitar-btn');

        botao.addEventListener('click', () => {
            const habilitado = card.classList.toggle('habilitado');

            if (habilitado) {
                botao.textContent = 'Desabilitar';
                botao.classList.remove('habilitar-btn');
                botao.classList.add('desabilitar-btn');
                input.disabled = false;
            } else {
                botao.textContent = 'Habilitar';
                botao.classList.remove('desabilitar-btn');
                botao.classList.add('habilitar-btn');
                input.disabled = true;
                input.value = '';
            }

            atualizarBotaoJogar();
        });

        input.disabled = true;
    });

    btnJogar.addEventListener('click', () => {
        const todosCards = Array.from(cards);

        let jogadores = todosCards
            .filter((card) => card.classList.contains('habilitado'))
            .map((card) => {
                const input = card.querySelector('input[type="text"]');
                return {
                    id: card.dataset.id,
                    nome: input.value.trim() || card.dataset.id
                };
            });

        jogadores = embaralhar(jogadores).map((jogador, index) => ({
            ...jogador,
            ordem: index + 1
        }));

        const desabilitados = todosCards
            .filter((card) => !card.classList.contains('habilitado'))
            .map((card) => ({ id: card.dataset.id }));

        salvar({ jogadores, desabilitados });

        window.location.href = 'tabuleiro.html';
    });

    atualizarBotaoJogar();
});