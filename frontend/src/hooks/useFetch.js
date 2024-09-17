// hooks/useFetch.js
import { useQuery } from 'react-query';
import api from '../utils/api';

export const useFetch = (url) => {
  return useQuery(url, () => api.get(url).then((res) => res.data));
};
