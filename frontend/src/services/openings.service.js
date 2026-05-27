import apiClient from "./baseService";

const cache = {};

export const getLichessData = async (fen) => {
  if (cache[fen]) return cache[fen];
  const res = await apiClient.get('/openings', { params: { fen } });
  cache[fen] = res.data;
  return res.data;
};
