# Cartographie de l'îlot de chaleur urbain du District d'Abidjan par télédétection satellite

**Auteur :** Media Marcel Bakayoko — Géomaticien, expert SIG, GeoAI & MRV
**Date :** Octobre 2026
**Données et code source :** [github.com/MediaBakayoko/VARIATION-DE-LA-TEMPERATURE-DE-SURFACE-AVEC-GEE-2024-VS-2025](https://github.com/MediaBakayoko/VARIATION-DE-LA-TEMPERATURE-DE-SURFACE-AVEC-GEE-2024-VS-2025)

---

## Résumé

Cette étude cartographie l'îlot de chaleur urbain du District d'Abidjan à partir d'imagerie satellite Landsat 8/9 et Sentinel-2, sur la saison sèche de novembre 2025 à mars 2026. Elle croise la température de surface (LST) avec l'indice de végétation (NDVI) pour quantifier la relation entre couvert végétal et accumulation de chaleur en milieu urbain dense. Les résultats confirment un contraste thermique marqué entre le cœur urbain bâti (température de surface moyenne 34-38°C) et les zones végétalisées périphériques, avec un indice de végétation moyen de 0,24 en zone chaude contre 0,45 en zone fraîche terrestre comparable. Une tentative initiale de comparaison interannuelle (2024 vs 2025) s'est révélée méthodologiquement non robuste et a été abandonnée au profit d'une analyse monosaisonnière rigoureuse — ce choix et ses raisons sont documentés en détail dans la section Limites.

---

## 1. Contexte et enjeu

Le District d'Abidjan connaît une croissance urbaine rapide, documentée par ailleurs dans nos travaux sur la qualité du logement et l'étalement urbain du Grand Abidjan (104 km² d'urbanisation récente depuis 2020). Cette densification du bâti s'accompagne généralement d'un phénomène bien documenté dans la littérature scientifique : l'îlot de chaleur urbain, c'est-à-dire l'élévation locale de la température liée à la substitution de surfaces végétalisées par des surfaces minérales (bitume, béton, toitures), qui stockent et restituent davantage de chaleur.

Comprendre la répartition spatiale de ce phénomène a une utilité directe pour la planification urbaine : cibler les zones prioritaires de végétalisation, anticiper les besoins en espaces verts dans les nouveaux quartiers, et documenter un enjeu de santé publique lié au confort thermique.

## 2. Méthode

### 2.1 Zone d'étude

Le District d'Abidjan a été délimité par une emprise rectangulaire englobante (coordonnées : -4.20° à -3.80° de longitude, 5.20° à 5.55° de latitude), couvrant le cœur urbain dense, la lagune Ébrié et les zones périurbaines.

### 2.2 Température de surface (LST)

La température de surface a été calculée à partir de la bande thermique ST_B10 des collections Landsat 8 et Landsat 9 Collection 2 Level 2 (résolution 30m), déjà calibrée en Kelvin par l'USGS via les coefficients officiels (facteur multiplicatif 0,00341802 + offset 149,0 K). 28 scènes ont été utilisées sur la période novembre 2025 - mars 2026, filtrées à moins de 40% de couverture nuageuse, puis masquées pixel par pixel via les bits qualité (nuages et ombres de nuages) avant calcul de la médiane temporelle. Cette combinaison a permis d'obtenir une couverture spatiale quasi complète (environ 99% de la zone d'étude).

### 2.3 Indice de végétation (NDVI)

Le NDVI a été calculé à partir de 17 scènes Sentinel-2 SR Harmonized (résolution 10m) sur la même période, filtrées à moins de 20% de nébulosité, avec masquage des nuages et cirrus via la bande qualité QA60.

### 2.4 Masquage de l'eau

La lagune Ébrié et le littoral occupent une part significative de la zone d'étude (289 km² sur l'emprise totale). L'eau présente à la fois une température de surface basse et un indice de végétation négatif, ce qui fausse toute comparaison directe entre "zones chaudes" et "zones fraîches" si elle n'est pas isolée du calcul. Un indice de différence normalisée de l'eau (NDWI, basé sur les bandes verte et proche infrarouge de Sentinel-2) a donc été utilisé pour exclure les surfaces en eau de l'analyse croisée LST/NDVI.

### 2.5 Classification

Deux classes ont été définies à des fins de comparaison, hors surfaces en eau :
- **Zone chaude** : température de surface supérieure à 34°C
- **Zone fraîche terrestre** : température de surface comprise entre 24°C et 30°C

## 3. Résultats

| Indicateur | Valeur |
|---|---|
| Température de surface moyenne (zone complète) | 32,75 °C |
| Température de surface maximale observée | 49,1 °C |
| Écart-type spatial de la LST | 3,99 °C |
| Surface en zone chaude, hors eau (>34°C) | 472,1 km² |
| Surface en eau (lagune et littoral) | 289,2 km² |
| NDVI moyen en zone chaude (hors eau) | 0,24 |
| NDVI moyen en zone fraîche terrestre (hors eau) | 0,45 |

La cartographie de la température de surface révèle un cœur urbain dense nettement identifiable en zone chaude (34 à 38°C), correspondant aux communes centrales à forte densité bâtie. La lagune Ébrié et le littoral se distinguent par des températures sensiblement plus basses, cohérentes avec l'inertie thermique de l'eau.

Le croisement avec le NDVI confirme statistiquement la relation attendue entre déficit de végétation et accumulation de chaleur : l'indice de végétation moyen est quasiment deux fois plus faible dans les zones chaudes (0,24) que dans les zones fraîches terrestres comparables (0,45). Ce résultat, obtenu après exclusion rigoureuse des plans d'eau du calcul, est cohérent avec la littérature internationale sur les îlots de chaleur urbains.

## 4. Discussion

Le contraste observé invite à une lecture opérationnelle plutôt que purement descriptive : les secteurs identifiés en zone chaude avec un déficit marqué de couvert végétal constituent des cibles prioritaires pour des politiques de végétalisation urbaine (plantation d'alignement, espaces verts de proximité, toitures végétalisées), dont l'effet attendu sur le confort thermique local est directement mesurable par la même méthode dans le temps, à condition de disposer de séries de données suffisamment longues pour s'affranchir du bruit interannuel (voir section suivante).

## 5. Limites méthodologiques

Cette section documente explicitement les choix et les renoncements faits au cours de l'étude, par souci de rigueur scientifique.

**Comparaison interannuelle abandonnée.** L'objectif initial du projet était de comparer l'évolution de la température de surface entre les saisons sèches 2024-2025 et 2025-2026, afin de documenter une éventuelle intensification de l'îlot de chaleur dans le temps. Trois configurations ont été testées :

1. Fenêtre temporelle resserrée (décembre-février), filtre nuage strict à 20% : couverture spatiale incomplète (bordures de passage satellite non couvertes par le nombre réduit de scènes disponibles)
2. Fenêtre élargie (novembre-mars), filtre nuage permissif à 50% : couverture quasi complète (99%+), mais carte de différence dominée par un bruit spatial sans structure cohérente ("effet poivre et sel")
3. Fenêtre élargie avec filtre nuage très strict à 10% : réduction du nombre d'images utilisables à 3 et 6 scènes respectivement, dégradant à nouveau la couverture spatiale sans réduire le bruit sur la carte de différence

Dans les trois cas, le signal d'intérêt (évolution réelle de la température liée à l'urbanisation) reste indiscernable du bruit introduit par la variabilité météorologique et atmosphérique d'une saison à l'autre (humidité résiduelle, nébulosité partielle non filtrée, conditions d'illumination). Une différence pixel à pixel entre deux médianes saisonnières à un an d'intervalle n'est pas une méthode statistiquement robuste dans ce contexte. Une analyse de tendance fiable nécessiterait soit une série pluriannuelle plus longue permettant un lissage statistique du bruit interannuel, soit une méthode d'anomalie standardisée par rapport à une climatologie de référence, plutôt qu'une simple différence à deux points temporels. Ce volet a donc été écarté plutôt que publié sous une forme qui aurait suggéré une conclusion non étayée.

**Couverture incomplète du NDVI.** La carte NDVI présente une zone sans données sur environ 30% du cadrage nord de la zone d'étude, en raison d'un nombre plus restreint de scènes Sentinel-2 exploitables sans nuage sur la période considérée. La carte de température de surface, en revanche, bénéficie d'une couverture quasi complète grâce au nombre plus élevé de scènes Landsat disponibles.

**Seuils de classification pragmatiques.** Les seuils de 34°C et 24-30°C utilisés pour distinguer zones chaudes et zones fraîches ont été choisis empiriquement pour illustrer le contraste observé sur cette zone d'étude précise, et non à partir d'une calibration validée par une étude dédiée aux seuils d'îlot de chaleur spécifiques au climat ivoirien.

**Absence de validation terrain.** Comme pour nos travaux précédents sur le carbone et le cropland, cette étude repose exclusivement sur des données satellite ; aucune mesure de température au sol n'a été collectée pour valider indépendamment les valeurs de température de surface dérivées de l'imagerie thermique.

## 6. Conclusion

Cette étude démontre, à partir de données satellite librement accessibles et d'une méthode reproductible, l'existence d'un îlot de chaleur urbain marqué dans le District d'Abidjan, statistiquement associé à un déficit de couvert végétal. Elle illustre également un principe méthodologique central dans nos travaux de télédétection : lorsqu'une analyse ne tient pas face aux tests de robustesse, la documenter honnêtement et la recentrer sur ce qui est statistiquement défendable vaut mieux qu'un résultat visuellement convaincant mais non fondé.

## Reproductibilité

L'intégralité du script Google Earth Engine (JavaScript), des cartes exportées et des statistiques présentées dans cet article est disponible en open source dans ce dépôt, sous `scripts/ilot_chaleur_abidjan.js` et `maps/`.
