/* Imagens dos Pokémon via repositório público da PokéAPI (hotlink — nada é
   copiado para este repositório). Arte © Nintendo, Game Freak, Creatures. */
(function () {
  var BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
  // formas do Rotom: id do jogo -> id de forma na PokéAPI
  var ROTOM = { 11001: 10008, 11002: 10009, 11003: 10011, 11004: 10010, 11005: 10012 };
  function dex(id) {
    id = +id;
    if (!id) return null;
    if (ROTOM[id]) return ROTOM[id];
    if (id > 13000 && id < 14100) return id - 13000;   // ids do jogo = 13000 + pokédex
    if (id > 1025 && id < 10000) return null;          // id custom sem equivalente
    return id;
  }
  var FALHA = "this.onerror=null;this.classList.add('sem')";
  window.SPR = {
    dex: dex,
    // sprite pequeno, para tabela e chips
    mini: function (id, nome) {
      var d = dex(id);
      return d ? '<img class="spr" src="' + BASE + d + '.png" alt="" loading="lazy" width="32" height="32" onerror="' + FALHA + '">'
               : '<span class="spr sem"></span>';
    },
    // arte oficial, para cartões
    arte: function (id, nome) {
      var d = dex(id);
      return d ? '<img class="arte" src="' + BASE + 'other/official-artwork/' + d + '.png" alt="' + (nome || '') + '" loading="lazy" width="96" height="96" onerror="' + FALHA + '">'
               : '<span class="arte sem"></span>';
    }
  };
})();
