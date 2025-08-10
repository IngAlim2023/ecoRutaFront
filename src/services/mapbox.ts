export const MAPBOX_TOKEN = "TU_TOKEN_DE_MAPBOX";

export const getRoute = async (start: string, end: string) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  return res.json();
};
