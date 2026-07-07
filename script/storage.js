const KEY = 'jogo-app';

export function salvar(jogadores) {
    localStorage.setItem(KEY, JSON.stringify(jogadores));
}

export function carregar() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function remover() {
    localStorage.removeItem(KEY);
}

export function limparTudo() {
    localStorage.clear();
}