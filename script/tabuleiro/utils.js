export function normalizarTexto(txt) {
    return (txt || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export function normalizarNivel(nivel) {
    const n = normalizarTexto(nivel);
    if (n.startsWith('facil')) return 'facil';
    if (n.startsWith('inter')) return 'intermediaria';
    if (n.startsWith('dificil')) return 'dificil';
    return n;
}

export function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    if (min <= 0) return `${seg}s`;
    if (seg === 0) return `${min}min`;
    return `${min}min${seg}s`;
}

export function textoPontos(valor) {
    return valor >= 0 ? `ganhou ${valor} pontos` : `perdeu ${Math.abs(valor)} pontos`;
}

export function caminhoImagemPergunta(imagem) {
    if (!imagem) return null;
    const nomeArquivo = imagem.split('/').pop();
    return `../images/perguntas/${nomeArquivo}`;
}

export function perguntaAleatoria(perguntas, nivelChave, idsUsados = []) {
    const candidatas = perguntas.filter((q) => normalizarNivel(q.nivel) === nivelChave);
    if (candidatas.length === 0) return null;

    const idsUsadosSet = new Set(idsUsados);
    const naoUsadas = candidatas.filter((q) => !idsUsadosSet.has(q.id));

    // Se todas as perguntas desse nível já caíram nessa partida, libera repetição
    // (evita travar o jogo em partidas muito longas ou níveis com poucas perguntas).
    const pool = naoUsadas.length > 0 ? naoUsadas : candidatas;

    return pool[Math.floor(Math.random() * pool.length)];
}