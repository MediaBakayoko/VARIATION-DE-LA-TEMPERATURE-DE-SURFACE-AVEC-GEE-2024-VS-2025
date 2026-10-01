/**
 * ============================================================================
 * ILOT DE CHALEUR URBAIN - DISTRICT D'ABIDJAN
 * Cartographie de la temperature de surface (LST) en saison seche
 * et croisement avec le couvert vegetal (NDVI) pour expliquer le phenomene.
 *
 * Source : Landsat 8/9 Collection 2 Level 2 (bande thermique, 30m,
 * temperature de surface calibree en Kelvin par USGS) + Sentinel-2 (NDVI).
 * ============================================================================
 */

// 1. ZONE D'ETUDE - District d'Abidjan
var abidjan = ee.Geometry.Rectangle([-4.20, 5.20, -3.80, 5.55]);
Map.centerObject(abidjan, 10);

// ============================================================================
// 2. TEMPERATURE DE SURFACE (LST) - SAISON SECHE 2025-2026
// ============================================================================
function maskLandsat(image) {
  var qa = image.select('QA_PIXEL');
  var cloudMask = qa.bitwiseAnd(1 << 3).eq(0).and(qa.bitwiseAnd(1 << 4).eq(0));
  return image.updateMask(cloudMask);
}

var landsat = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .merge(ee.ImageCollection('LANDSAT/LC08/C02/T1_L2'))
  .filterBounds(abidjan)
  .filterDate('2025-11-01', '2026-03-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 40))
  .map(maskLandsat);

print('Nombre images Landsat (saison seche 2025-2026):', landsat.size());

var lst = landsat.map(function(img) {
  var lstKelvin = img.select('ST_B10').multiply(0.00341802).add(149.0);
  return lstKelvin.subtract(273.15).rename('LST_C').copyProperties(img, ['system:time_start']);
}).median().clip(abidjan);

// ============================================================================
// 3. NDVI (Sentinel-2) - meme periode, pour expliquer le phenomene
// ============================================================================
function maskS2clouds(image) {
  var qa = image.select('QA60');
  var mask = qa.bitwiseAnd(1 << 10).eq(0).and(qa.bitwiseAnd(1 << 11).eq(0));
  return image.updateMask(mask).divide(10000).copyProperties(image, ['system:time_start']);
}

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(abidjan)
  .filterDate('2025-11-01', '2026-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

var ndvi = s2.median().normalizedDifference(['B8', 'B4']).rename('NDVI').clip(abidjan);

// ============================================================================
// 4. VISUALISATION
// ============================================================================
var lstPalette = ['040274', '2c99f5', '66dca4', 'ffde33', 'ff8c33', 'ff0000'];
Map.addLayer(lst, {min: 24, max: 38, palette: lstPalette}, 'Temperature de surface (LST, °C)');

var ndviPalette = ['d73027', 'fee08b', '1a9850'];
Map.addLayer(ndvi, {min: -0.1, max: 0.6, palette: ndviPalette}, 'NDVI (couvert vegetal)', false);

// ============================================================================
// 5. PANNEAU LEGENDE
// ============================================================================
var legend = ui.Panel({style: {position: 'bottom-left', padding: '8px 15px'}});
legend.add(ui.Label('Ilot de chaleur urbain', {fontWeight: 'bold', fontSize: '14px'}));
legend.add(ui.Label('District d\'Abidjan - saison seche nov. 2025 - mars 2026', {fontSize: '11px', color: '666666'}));
var makeRow = function(color, label) {
  var colorBox = ui.Label('', {backgroundColor: color, padding: '8px', margin: '0 4px 4px 0'});
  var description = ui.Label(label, {margin: '0 0 4px 6px'});
  return ui.Panel([colorBox, description], ui.Panel.Layout.Flow('horizontal'));
};
var lstSteps = [
  ['#040274', '24-27°C (frais - lagune, vegetation dense)'],
  ['#2c99f5', '27-30°C'],
  ['#66dca4', '30-32°C'],
  ['#ffde33', '32-34°C'],
  ['#ff8c33', '34-36°C'],
  ['#ff0000', '36-38°C (ilot de chaleur - zones batardes denses)']
];
lstSteps.forEach(function(item) { legend.add(makeRow(item[0], item[1])); });
Map.add(legend);

// ============================================================================
// 6. STATISTIQUES ET CORRELATION LST / NDVI
// ============================================================================
var statsLST = lst.reduceRegion({
  reducer: ee.Reducer.mean().combine(ee.Reducer.minMax(), '', true).combine(ee.Reducer.stdDev(), '', true),
  geometry: abidjan, scale: 30, maxPixels: 1e9
});
print('Statistiques LST (saison seche 2025-2026):', statsLST);

// IMPORTANT : l'eau (lagune/ocean) a un NDVI negatif ET une LST basse -
// elle fausse la comparaison si on ne l'exclut pas. On la masque via NDWI.
var ndwi = s2.median().normalizedDifference(['B3', 'B8']).rename('NDWI').clip(abidjan);
var waterMask = ndwi.lt(0.1);

// Zones chaudes (>34C, proxy ilot de chaleur) vs zones fraiches TERRESTRES (hors eau)
var zoneChaude = lst.gt(34).and(waterMask);
var zoneFraicheTerrestre = lst.lt(30).and(lst.gt(24)).and(waterMask);

var surfaceChaude = zoneChaude.multiply(ee.Image.pixelArea()).divide(1e6).reduceRegion({
  reducer: ee.Reducer.sum(), geometry: abidjan, scale: 30, maxPixels: 1e9
});
print('Surface en zone chaude hors eau (>34°C, km2):', surfaceChaude);

var ndviZoneChaude = ndvi.updateMask(zoneChaude).reduceRegion({
  reducer: ee.Reducer.mean(), geometry: abidjan, scale: 30, maxPixels: 1e9
});
print('NDVI moyen en zone chaude (hors eau):', ndviZoneChaude);

var ndviZoneFraiche = ndvi.updateMask(zoneFraicheTerrestre).reduceRegion({
  reducer: ee.Reducer.mean(), geometry: abidjan, scale: 30, maxPixels: 1e9
});
print('NDVI moyen en zone fraiche terrestre (24-30°C, hors eau):', ndviZoneFraiche);

// ============================================================================
// 7. EXPORTS
// ============================================================================
Export.image.toDrive({
  image: lst, description: 'Abidjan_LST_saison_seche_2025_2026',
  folder: 'GEE_Exports_Abidjan_LST', region: abidjan, scale: 30, maxPixels: 1e9, fileFormat: 'GeoTIFF'
});
Export.image.toDrive({
  image: ndvi, description: 'Abidjan_NDVI_saison_seche_2025_2026',
  folder: 'GEE_Exports_Abidjan_LST', region: abidjan, scale: 10, maxPixels: 1e9, fileFormat: 'GeoTIFF'
});

print('Miniature LST:', lst.getThumbURL({min: 24, max: 38, palette: lstPalette, dimensions: 1024, region: abidjan}));
print('Miniature NDVI:', ndvi.getThumbURL({min: -0.1, max: 0.6, palette: ndviPalette, dimensions: 1024, region: abidjan}));
