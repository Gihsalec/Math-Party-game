# 🎲 Math Party

Link para o jogo: https://gihsalec.github.io/Math-Party-game/

O **Math Party** é um jogo de tabuleiro digital pedagógico desenvolvido para estudantes do **Ensino Fundamental 2 (6º ao 9º ano)**. Inspirado em dinâmicas de *party games* clássicos (como *Mario Party* e *Pummel Party*), o projeto tem como objetivo tornar a fixação de conteúdos matemáticos uma experiência ativa, dinâmica e altamente interativa.

Este projeto foi construído como atividade de extensão da disciplina **Matemática Aplicada a Multimídia (MAMI)**, lecionada pela **Profª. Dra. Mara Franklin Bonates** no curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará (UFC).

---

## 🚀 Funcionalidades e Mecânicas Digitais

* **Lobby e Inicialização:** Suporte para 4 jogadores locais. Cada participante seleciona seu personagem. O sistema randomiza a ordem de jogada e gerencia o placar dinâmico em tempo real.
* **Movimentação Automatizada:** Interface de tabuleiro virtual com 50 casas ambientadas em um cenário escolar. O fluxo de turnos calcula o sorteio do dado (1 a 6) e desloca o avatar automaticamente.
* **Eventos Síncronos por Casas:** Cada bloco do tabuleiro engatilha uma ação na lógica do jogo (cronômetros de perguntas ou modificadores matemáticos de pontuação).
* **Painel de Revisão Pedagógica (Pós-Jogo):** A tela final de pódio permite expandir o histórico individual do aluno, exibindo quais questões ele acertou/errou e fornecendo a **resolução comentada passo a passo** de cada cálculo.

---

## 🎨 Mapeamento do Tabuleiro (UI/UX)

Para guiar a jogabilidade, as casas do tabuleiro foram divididas por cores e funções específicas:

### 📝 Casas de Desafio (Respostas no Centro da Tela)
* **🟢 Verde-Água Claro (Nível Fácil):** Cronômetro de 1 minuto (60s). Acerto: `+10 pts` | Erro/Tempo esgotado: `-5 pts`.
* **🔵 Verde-Água Médio (Nível Intermediário):** Cronômetro de 2 minutos (120s). Acerto: `+20 pts` | Erro/Tempo esgotado: `-10 pts`.
* **💣 Casa da Bomba (Nível Desafio/Difícil):** Ativa a *Janela de Decisão*. O jogador vê apenas o tema e escolhe:
  * *Aceitar Desafio:* Resolve sozinho (`+40 pts` se acertar / `-20 pts` se errar).
  * *Passar para Adversário:* Escolhe um oponente. Se o rival acertar, ganha `+30 pts` e você perde `-15 pts`; se o rival errar, você ganha `+30 pts` e ele perde `-15 pts`.

### ⚡ Casas de Efeito Estatístico Instantâneo
* **🟣 Roxo Escuro:** Multiplica os pontos atuais do jogador por 2 (`Pontos x 2`).
* **🟡 Amarelo Escuro:** Divide os pontos atuais do jogador por 2 (`Pontos / 2`).
* **🔴 Vermelho Escuro:** Adiciona bônus fixo de 10 pontos ao jogador (`+10 pts`).
* **🔵 Azul Escuro:** Subtrai penalidade fixa de 10 pontos do jogador (`-10 pts`).

### 🏁 Casas de Inicialização (Zonas Neutras)
Ponto inicial onde cada jogador começa a partida (nenhum efeito é aplicado):
* **🔴 Vermelho Claro:** Inicialização do *Jogador 1*.
* **🟡 Amarelo Claro:** Inicialização do *Jogador 2*.
* **🟣 Roxo Claro:** Inicialização do *Jogador 3*.
* **🔵 Azul Claro:** Inicialização do *Jogador 4*.

---

## 📚 Alinhamento Pedagógico (BNCC)

O jogo possui um banco de dados robusto de **254 questões** parametrizadas e referenciadas (incluindo questões adaptadas do ENEM e vestibulares), cobrindo as seguintes diretrizes da Base Nacional Comum Curricular (BNCC):

* **Eixo Números e Álgebra:** Expressões numéricas, regras de sinais, frações, porcentagens e dízimas periódicas (`EF07MA02`, `EF08MA04`, `EF08MA05`); equações de 1º e 2º grau (`EF08MA08`, `EF08MA09`); grandezas diretas e inversamente proporcionais via Regra de Três (`EF09MA06`, `EF09MA07`).
* **Eixo Geometria e Medidas:** Reconhecimento de figuras planas, perímetros e áreas (`EF05MA20`); Conversão de unidades de medida (`EF06MA24`); Teorema de Pitágoras e relações trigonométricas básicas (`EF09MA13`).
* **Eixo Probabilidade e Estatística:** Cálculo de eventos, chances e médias aritméticas/harmônicas (`EF06MA30`).

---

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido pelas alunas do curso de Sistemas e Mídias Digitais (UFC):

* **Bárbara Letícia Teixeira de Carvalho** - [LinkedIn](https://linkedin.com/in/bárbara-teixeira)
* **Cybele Chaves Cavalcante** - [LinkedIn](https://linkedin.com/in/cybele-c-chaves)
* **Giovanna Carneiro Sales** - [LinkedIn](https://linkedin.com/in/giovannacsales)
* **Iasmin Oliveira e Sena** - [LinkedIn](https://linkedin.com/in/iasminolisena)
* **Julia Flor de Sousa Campos** - [LinkedIn](https://linkedin.com/in/juliafscampos)

---

<p align="center">Curso de Sistemas e Mídias Digitais — Instituto UFC Virtual — Universidade Federal do Ceará</p>
