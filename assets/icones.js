/* Ícones do Guia do Mestre — todos desenhados para este projeto.
   Injeta um sprite SVG no documento; use com <use href="#ti-FIRE"/>. */
(function () {
  var S = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">'
    + '<defs>'
    // marca do projeto: losango com agulha de bússola e estrela
    + '<symbol id="gdm-logo" viewBox="0 0 32 32">'
    +   '<path d="M16 2.5 29.5 16 16 29.5 2.5 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
    +   '<path d="M16 8.5 19 16l-3 7.5L13 16z" fill="currentColor"/>'
    +   '<circle cx="16" cy="16" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/>'
    + '</symbol>'
    // 18 glifos de tipo
    + g('NORMAL','<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>')
    + g('FIRE','<path d="M12 3.5c3.5 4 5.5 6.2 5.5 9.3A5.5 5.5 0 0 1 6.5 13c0-1.8.8-3.2 2-4.4.2 1.6 1 2.4 1.8 2.6-.6-3 .6-5.6 1.7-7.7z"/>')
    + g('WATER','<path d="M12 3.5c3.4 4.3 5.5 7 5.5 9.6a5.5 5.5 0 0 1-11 0c0-2.6 2.1-5.3 5.5-9.6z"/>')
    + g('ELECTRIC','<path d="M13.5 3 6.5 13.5h4L10 21l7.5-10.5h-4z"/>')
    + g('GRASS','<path d="M20 4c0 8-4.5 13-9.5 13A5.5 5.5 0 0 1 5 11.5C5 6.5 11 4 20 4z"/><path d="M15.5 8.5C12 11 9.5 15 8.5 20"/>')
    + g('ICE','<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>')
    + g('FIGHTING','<path d="M6 10.5a2 2 0 0 1 2-2h7.5a3.5 3.5 0 0 1 3.5 3.5v2a4 4 0 0 1-4 4H9a3 3 0 0 1-3-3z"/><path d="M10 8.5V6.5M13.5 8.5v-3M17 9V7"/>')
    + g('POISON','<path d="M12 3.5c3.2 4 5 6.3 5 8.8a5 5 0 0 1-10 0c0-2.5 1.8-4.8 5-8.8z"/><circle cx="10" cy="12.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14" cy="14.5" r="1.4" fill="currentColor" stroke="none"/>')
    + g('GROUND','<path d="M3.5 18.5h17"/><path d="M5.5 14.5h13"/><path d="M8 10.5h8"/><path d="M10.5 6.5h3"/>')
    + g('FLYING','<path d="M3.5 13.5c4-1 6.5-3 8-6 1.5 3 4 5 8.5 6-4 1.5-6.5 3.5-8.5 6.5-1.5-3-4-5-8-6.5z"/>')
    + g('PSYCHIC','<path d="M12 17.5a4.5 4.5 0 1 0-4.5-4.5 6.5 6.5 0 0 0 6.5 6.5 8.5 8.5 0 0 0 8.5-8.5A9 9 0 0 0 3 5"/>')
    + g('BUG','<circle cx="12" cy="14" r="5"/><path d="M12 9V6M9 5 7 3M15 5l2-2M7 12H4M17 12h3M7.5 17l-2.5 2M16.5 17l2.5 2"/>')
    + g('ROCK','<path d="M4 13.5 8.5 6h7l4.5 7.5-4 6h-8z"/><path d="M8.5 6l3 7.5-3.5 6M15.5 6l-4 7.5 4.5 6"/>')
    + g('GHOST','<path d="M5.5 20V11a6.5 6.5 0 0 1 13 0v9l-2.2-2-2.1 2-2.2-2-2.2 2-2.1-2z"/><circle cx="10" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="11" r="1" fill="currentColor" stroke="none"/>')
    + g('DRAGON','<path d="M6 4c1.5 5 4 8 8 9.5"/><path d="M10.5 4c.5 5 2.5 8.5 6 10.5"/><path d="M15 4c-.5 5 .5 9 3 11.5"/><path d="M4.5 18.5c5 2 10 1.5 15-2"/>')
    + g('DARK','<path d="M19.5 14.5A8.5 8.5 0 1 1 9.5 4.5a6.6 6.6 0 0 0 10 10z"/>')
    + g('STEEL','<path d="M8 4h8l4 8-4 8H8l-4-8z"/><circle cx="12" cy="12" r="3"/>')
    + g('FAIRY','<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>')
    + '</defs></svg>';

  function g(id, d) {
    return '<symbol id="ti-' + id + '" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
      + ' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</symbol>';
  }

  function injeta() {
    if (document.getElementById('gdm-sprite')) return;
    var d = document.createElement('div');
    d.id = 'gdm-sprite';
    d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = S;
    document.body.insertBefore(d, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injeta);
  else injeta();
})();
