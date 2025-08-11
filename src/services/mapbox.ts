// services/mapbox.ts
export const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FudGlhZ29weCIsImEiOiJjbWU0ZHpoY3IwZ3NvMm9wdXRwdHI2ajd6In0.XLsp5NQ8E_MfK7AwUPi5_Q"; 

export const getRoute = async (start: [], end: [] )=> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  return await res.json();
};
