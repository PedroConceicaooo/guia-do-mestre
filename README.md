# Guia do Mestre

Guia não oficial do PokeWG, organizado nos três sistemas que decidem o jogo: **codex**, **hunt** e **profissões**.

Feito por **PHMESTRE** · guilda **NUOT**.

---

## Subir na Vercel

O site é estático — sem build, sem dependência, sem backend. São quatro páginas HTML, uma folha de estilo e três arquivos de dados.

```bash
git init
git add .
git commit -m "Guia do Mestre: codex, hunt e profissões"
git remote add origin git@github.com:SEU-USUARIO/guia-do-mestre.git
git push -u origin main
```

Depois, em vercel.com: **Add New → Project**, importe o repositório e mande deploy. Não mexa em nada nas configurações — a Vercel detecta site estático sozinha. Todo `git push` na branch principal republica.

Para rodar local, não abra o `index.html` com duplo clique: a página busca `data/codex-kanto.json` por `fetch`, e o navegador bloqueia isso em `file://`. Use um servidor:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

---

## Estrutura

```
index.html          Início — os três pilares e o "primeiro passo"
codex.html          Pilar I — o analisador de codex
hunt.html           Pilar II — tabela de hunts + índice de drops
profissoes.html     Pilar III — Minerador e Engenheiro
assets/style.css    Tokens de cor, tipografia e componentes (tema claro e escuro)
data/hunts.json     Os 517 mapas de hunt (de /api/game/map-markers)
data/drops.json     Índice item -> slugs de hunt (274 itens)
data/codex-kanto.json   44 grupos do codex de Kanto, com nível/raridade/valor
data/especies.json  443 fichas da Poképedia: tipos, stats, XP, evolução e 3.416 golpes
data/pedras.json    27 pedras de evolução e as 55 evoluções que elas destravam
tools/converter.py  Converte a resposta de /api/game/codex no formato do site
```

## Dados de hunt

`data/hunts.json` e `data/drops.json` vêm de uma única requisição a **`/api/game/map-markers`**, que o jogo faz ao abrir a tela de Mapa. São 517 hunts (mais 2 cidades, descartadas) com `slug`, `name`, `level`, `area`, `speciesId`, `type1`, `type2`, `rarity`, `sellValue` e `drops`.

| Área | Hunts |
|---|---|
| Kanto | 139 |
| Johto | 89 |
| Orre (Hoenn) | 87 |
| Sinnoh | 70 |
| Outland Plus | 60 |
| Outland | 50 |
| Safari | 22 |

Níveis de hunt existentes: **1, 10, 20, 30, 40, 50, 60, 80, 100, 150, 300, 450, 550, 700**.

São 364 espécies distintas, e **132 delas aparecem em mais de um mapa**, em níveis diferentes — para registro de codex, vale sempre o mapa de menor nível.

O índice de drops cobre **274 itens**. O `Strange Pheromone` cai de 511 dos 517 hunts, então é universal e está marcado como tal.

### O que é `hl` e o que é `level`

São coisas distintas e confundi-las gera erro grosseiro. O **`level`** do `map-markers` é o nível do mapa — é ele que diz se você consegue entrar. O **`hl`** da Poképedia é um atributo da espécie que determina o **XP concedido**. Chikorita tem `hl` 20 e só existe num mapa de nível 300.

A consequência prática é grande: em Kanto todo alvo do mesmo degrau dá o mesmo XP (nível 30 dá 548, nível 80 dá 3.848), mas a partir do nível 150 um mesmo mapa mistura espécies que dão de **248 a 6.008**. No fim de jogo, escolher o alvo certo dentro do degrau vale mais que qualquer bônus percentual.

### Para atualizar quando o jogo mudar

Mesmo método do codex: abra a tela de **Mapa**, F12 → Network → filtro `map-markers` → Response → salve como `map-markers.json`. Depois rode o gerador (veja `tools/`) para reescrever `hunts.json` e `drops.json`.

---

## Os dados do codex

`data/codex-kanto.json` traz a estrutura real da região, lida de **`/api/game/codex?region=kanto`**: **44 grupos, 131 espécies, 524 registros** (43 grupos de três membros e um de dois). Cada espécie vem enriquecida com nível, área, raridade e valor de venda vindos de `map-markers` — as 131 acharam hunt correspondente.

O arquivo **não contém progresso de ninguém**. Cada visitante marca os tiers no próprio navegador.

Para carregar o seu progresso sem remarcar 131 espécies na mão, abra `codex.html` e clique em *Importar do jogo*: F12 → Network → filtro `codex` → Response → copiar → colar. Fica salvo só no seu navegador.

Para regenerar a estrutura quando o jogo mudar (ou para as outras regiões, conforme desbloquearem), salve a mesma resposta num arquivo e rode:

```bash
python3 tools/converter.py codex-bruto.json data/codex-kanto.json
```

Depois `git push`. A estrutura (grupos, espécies, atributos) é igual para todos os jogadores. O campo `tierJogo`, que é progresso pessoal, é usado só como ponto de partida na importação pelo navegador — **zere ou remova antes de comitar**.

### Segurança, e isso não é negociável

Nunca peça a resposta da API, o token ou o login de outro jogador. A ferramenta funciona inteira com o visitante marcando os tiers na mão, e o progresso fica no `localStorage` do navegador dele — sem conta, sem servidor, sem dado de ninguém passando por você. Qualquer ferramenta da comunidade que peça credencial de conta é um problema, inclusive esta se algum dia passar a pedir.

---

## A matemática do codex, conferida

Reproduzida a partir da resposta de `/api/game/codex` e batendo com os números do servidor:

| Grandeza | Fórmula |
|---|---|
| Nível de um grupo | média dos tiers dos membros (aceita fração) |
| Níveis da região | soma dos níveis dos grupos — máximo `grupos × 4` |
| Registros | soma de todos os tiers — máximo `espécies × 4` |
| Fração concluída | `níveis ÷ (grupos × 4)` |
| Bônus de XP | `15 × fração` (máximo **+15%**) |
| Bônus de loot | `10 × fração` (máximo **+10%**) |
| Bônus de shiny | `10 × fração` (máximo **+10%**) |
| Taxa de shiny | `300 ÷ (1 + bônus/100)` — base 1/300, com região completa ≈ **1/273** |
| Teto de atributo | +50 por atributo |

Os pontos de atributo de cada grupo vão para o atributo daquele grupo, no valor do nível do grupo.

### Uma regra inferida, não confirmada

Na resposta da API apareceu um membro em tier 1 marcado como `blocked` enquanto os outros dois do grupo estavam em zero. A leitura disso é que **um membro não pode ficar mais de um tier à frente do mais atrasado do grupo**. É um caso único e está marcado como suposição no site. Se o comportamento no jogo for outro, o ajuste é na função `minTier` do `codex.html`.

---

## Regiões

| Região | Grupos | Registros | Níveis | Abre com |
|---|---|---|---|---|
| Kanto | 44 | 524 | 176 | — |
| Johto | 24 | 348 | 96 | Kanto 100% |
| Hoenn | 26 | 316 | 104 | Johto 100% |
| Sinnoh | 16 | 192 | 64 | Hoenn 100% |

Internamente o jogo chama Hoenn de `orre`. Se um dia o site ler mais de uma região, é essa a chave a usar.

---

## Próximas etapas

1. **Dados das outras três regiões** (Johto, Hoenn, Sinnoh), que só respondem na API conforme desbloqueiam.
2. **Cruzar hunt com mercado**: comparar o custo de farmar contra o preço de comprar pronto. Precisa de coleta de preço ao longo do tempo, logo precisa de banco — é a primeira parte do projeto que sai do estático.
3. **Peso da espécie na captura**: o jogo calcula captura como base de mundo (`world.catchPct`, 10%) vezes os bônus do jogador (`totals.catchMult`). Falta saber se a espécie entra nessa conta. Sem isso, a pontuação de esforço da rota é aproximada.
4. **Profissões**: responder as dúvidas listadas no fim da página, começando por se o nível de mineração aumenta a quantidade ou a qualidade da pedra.

---

## Créditos

Todos os dados deste site são lidos dos endpoints do próprio jogo — nenhum dataset de terceiro é redistribuído aqui.

As fichas de espécie, golpes e pedras vêm da **Poképedia oficial** (`pokewg.com/pokepedia`), material publicado pelos próprios desenvolvedores. A tabela de hunts vem de `/api/game/map-markers`. Ambas são fontes primárias — nenhum dataset de terceiro é redistribuído aqui.

O [Guia de Hunts](https://pokewg-hunts.vercel.app/), de outro jogador da comunidade, foi a inspiração para o pilar de hunt e segue linkado no site.

**Correção registrada:** uma versão anterior deste README afirmava que a compilação dele estava desatualizada, porque os níveis não batiam com o servidor. Estava errado. Os números dele vêm do campo `hl` da Poképedia, que **não é** o nível do mapa — é um atributo da espécie que governa o XP que ela concede. São campos diferentes medindo coisas diferentes, não versões diferentes do mesmo dado.

Guia não oficial, sem vínculo com PokeWG, Nintendo ou Game Freak. Todas as marcas pertencem aos seus donos.
