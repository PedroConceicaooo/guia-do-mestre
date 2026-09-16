#!/usr/bin/env python3
"""Converte a resposta crua de /api/game/codex no formato de dados do site.

Uso:
    python3 tools/converter.py codex-bruto.json data/codex-kanto.json

Como obter o codex-bruto.json, sem tocar em token nenhum:
  1. abra o jogo logado, no seu proprio navegador
  2. F12 -> aba Network -> filtro "codex"
  3. clique na requisicao /api/game/codex
  4. aba Response -> copiar tudo -> salvar num arquivo .json

Nunca peca esse arquivo a outra pessoa: ele descreve a conta dela.
"""
import json, sys

def converter(bruto):
    if "groups" not in bruto:
        raise SystemExit("Nao encontrei a chave 'groups'. Esse arquivo e a resposta de /api/game/codex?")
    return {
        "_fonte": "Convertido de /api/game/codex",
        "_confiavel": True,
        "regiao": bruto.get("region", "kanto"),
        "label": bruto.get("regionLabel", "Kanto"),
        "maxTier": bruto.get("maxTier", 4),
        "grupos": [
            {
                "id": g["id"],
                "atributo": g["attribute"],
                "especies": [
                    {
                        "nome": e["name"],
                        "id": e.get("speciesId"),
                        "nv": None,
                        "mapa": None,
                        "tierJogo": e.get("tier", 0),
                    }
                    for e in g.get("species", [])
                ],
            }
            for g in bruto["groups"]
        ],
    }

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    entrada, saida = sys.argv[1], sys.argv[2]
    doc = converter(json.load(open(entrada, encoding="utf-8")))
    json.dump(doc, open(saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    esp = sum(len(g["especies"]) for g in doc["grupos"])
    print(f"{saida}: {len(doc['grupos'])} grupos, {esp} especies, {esp * doc['maxTier']} registros")
