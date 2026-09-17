/* Tema persistente entre páginas. Carregado no <head> sem defer para
   aplicar antes da primeira pintura e não piscar. */
(function () {
  var R = document.documentElement;
  try {
    var salvo = localStorage.getItem('gdm:tema');
    if (salvo === 'claro' || salvo === 'escuro') R.dataset.tema = salvo;
  } catch (e) {}

  var ROT = { '': 'Auto', claro: 'Claro', escuro: 'Escuro' };
  var ICO = {
    '': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
    claro: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
    escuro: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5z"/></svg>'
  };

  function liga() {
    var b = document.getElementById('tema');
    if (!b) return;
    function pinta() {
      var t = R.dataset.tema || '';
      b.innerHTML = ICO[t] + '<span>' + ROT[t] + '</span>';
      b.title = 'Tema: ' + ROT[t] + ' — clique para alternar';
    }
    pinta();
    b.addEventListener('click', function () {
      var t = R.dataset.tema || '';
      var novo = t === 'escuro' ? 'claro' : t === 'claro' ? '' : 'escuro';
      if (novo) R.dataset.tema = novo; else R.removeAttribute('data-tema');
      try {
        if (novo) localStorage.setItem('gdm:tema', novo);
        else localStorage.removeItem('gdm:tema');
      } catch (e) {}
      pinta();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', liga);
  else liga();
})();
