#!/usr/bin/env python3
"""Gera data/hunts.json e data/drops.json a partir de /api/game/map-markers.

Uso:
    python3 tools/gerar-hunts.py map-markers.json data/

Como obter o map-markers.json, sem tocar em token nenhum:
  1. abra o jogo logado, no seu proprio navegador
  2. F12 -> aba Network -> filtro "map-markers"
  3. abra a tela de Mapa no jogo (e o request que aparece)
  4. aba Response -> copiar tudo -> salvar num arquivo .json
"""
import collections, json, os, sys

def gerar(bruto, destino):
    if "hunts" not in bruto:
        raise SystemExit("Nao encontrei a chave 'hunts'. Esse arquivo e a resposta de /api/game/map-markers?")
    hunts = [x for x in bruto["hunts"] if not x.get("city")]

    tabela = [
        {
            "slug": x["slug"], "nome": x["name"], "nivel": x["level"], "area": x["area"],
            "speciesId": x.get("speciesId"), "t1": x.get("type1"), "t2": x.get("type2"),
            "raridade": x.get("rarity"), "valor": x.get("sellValue"), "drops": x.get("drops") or [],
        }
        for x in hunts
    ]
    json.dump(
        {"_fonte": "/api/game/map-markers", "_confiavel": True, "qtd": len(tabela), "hunts": tabela},
        open(os.path.join(destino, "hunts.json"), "w", encoding="utf-8"),
        ensure_ascii=False, separators=(",", ":"),
    )

    idx = collections.defaultdict(list)
    for x in hunts:
        for item in x.get("drops") or []:
            idx[item].append(x["slug"])
    itens = {k: sorted(set(v)) for k, v in sorted(idx.items())}
    json.dump(
        {"_fonte": "/api/game/map-markers", "qtd": len(itens),
         "_nota": "item -> slugs de hunt. Cruze com hunts.json pelo slug.", "itens": itens},
        open(os.path.join(destino, "drops.json"), "w", encoding="utf-8"),
        ensure_ascii=False, separators=(",", ":"),
    )

    areas = collections.Counter(x["area"] for x in hunts)
    print(f"hunts.json: {len(tabela)} hunts   drops.json: {len(itens)} itens")
    print("por area:", dict(areas))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    gerar(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2])
