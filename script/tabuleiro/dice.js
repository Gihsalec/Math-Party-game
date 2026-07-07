const ROTACAO_POR_VALOR = {
    1: { x: 0, y: 0 },
    2: { x: -90, y: 0 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: 90, y: 0 },
    6: { x: 0, y: 180 },
};

export function criarDado(diceEl) {
    let totalX = 0;
    let totalY = 0;

    function proximaRotacao(atual, alvoMod) {
        const base = atual - (atual % 360);
        const voltasExtras = 360 * (2 + Math.floor(Math.random() * 2)); // 2 ou 3 voltas
        let alvo = base + voltasExtras + alvoMod;
        if (alvo <= atual) alvo += 360;
        return alvo;
    }

    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function girarPara(valor) {
        const rot = ROTACAO_POR_VALOR[valor];
        totalX = proximaRotacao(totalX, rot.x);
        totalY = proximaRotacao(totalY, rot.y);
        diceEl.style.transform = `rotateX(${totalX}deg) rotateY(${totalY}deg)`;
    }

    return { rollDice, girarPara };
}
