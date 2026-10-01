# Îlot de chaleur urbain - District d'Abidjan

Cartographie de la température de surface (LST) du District d'Abidjan en saison sèche, croisée avec le couvert végétal (NDVI), pour documenter et quantifier l'îlot de chaleur urbain.

## Contexte

Ce projet a été initialement conçu comme une comparaison interannuelle (2024 vs 2025) de la température de surface. Après tests, la comparaison par différence pixel-à-pixel entre deux médianes saisonnières s'est révélée **non robuste** avec les données disponibles : le signal réel d'évolution de l'îlot de chaleur était noyé dans le bruit atmosphérique et temporel d'une saison à l'autre, quel que soit le niveau de filtrage nuageux testé (voir section Limites).

Le projet a donc été recentré sur une **cartographie solide et pédagogique de l'îlot de chaleur urbain** sur une saison bien documentée, plutôt que de forcer une conclusion sur une comparaison qui ne tenait pas statistiquement.

## Méthode

- **Zone d'étude** : District d'Abidjan (rectangle englobant, `[-4.20, 5.20, -3.80, 5.55]`)
- **Période** : saison sèche, novembre 2025 - mars 2026
- **Température de surface (LST)** : Landsat 8/9 Collection 2 Level 2, bande thermique ST_B10, déjà calibrée en Kelvin par l'USGS (28 scènes utilisées, filtre nuage < 40%, couverture spatiale ~99%)
- **Végétation (NDVI)** : Sentinel-2 SR Harmonized, même période (17 scènes, filtre nuage < 20%)
- **Masquage de l'eau** : NDWI (Sentinel-2) utilisé pour exclure la lagune et l'océan de l'analyse croisée LST/NDVI, car l'eau a une température basse ET un NDVI négatif qui fausse toute comparaison si elle n'est pas isolée

## Résultats

| Indicateur | Valeur |
|---|---|
| Température de surface moyenne (zone complète) | 32,8 °C |
| Écart-type spatial | 3,99 °C |
| Surface en zone chaude (>34°C, hors eau) | 472 km² |
| NDVI moyen en zone chaude (hors eau) | 0,24 |
| NDVI moyen en zone fraîche terrestre (24-30°C, hors eau) | 0,45 |

Le résultat confirme la relation attendue : les zones les plus chaudes correspondent aux secteurs à couvert végétal réduit (bâti dense), tandis que les zones plus fraîches (hors lagune) correspondent à un couvert végétal significativement plus dense.

## Limites et honnêteté méthodologique

1. **Comparaison interannuelle abandonnée** : trois configurations de filtrage nuageux (large/intermédiaire/strict) ont toutes produit des cartes de différence 2025-2024 trop bruitées (motif "poivre et sel" sans structure spatiale cohérente) pour en tirer une conclusion fiable sur l'évolution de l'îlot de chaleur. Une vraie analyse de tendance nécessiterait soit plusieurs années de données pour lisser le bruit, soit une méthode d'anomalie standardisée plutôt qu'une différence à deux points.
2. **Trou de couverture NDVI** : la carte NDVI présente une bande sans données sur environ 30% du cadrage nord, due à un nombre plus limité de scènes Sentinel-2 sans nuage disponibles sur la période. La carte LST, elle, a une couverture quasi complète (~99%).
3. **Seuil "zone chaude"/"zone fraîche"** choisi de façon pragmatique (34°C / 24-30°C) pour illustrer le contraste, pas un seuil validé scientifiquement par une étude dédiée aux îlots de chaleur urbains d'Abidjan.

## Fichiers

- `scripts/ilot_chaleur_abidjan.js` — script Google Earth Engine complet (LST + NDVI + masquage eau + statistiques + export GeoTIFF)
- `maps/lst_ilot_chaleur_2025_2026.png` — carte température de surface, saison sèche 2025-2026
- `maps/ndvi_2025_2026.png` — carte NDVI, même période
- `maps/lst_saison_2024_2025.png` — carte température de surface, saison sèche 2024-2025 (pour référence)

## Auteur

Media Marcel Bakayoko — Géomaticien, expert SIG, GeoAI & MRV
