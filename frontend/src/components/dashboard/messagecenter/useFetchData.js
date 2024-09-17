import { useEffect, useState } from 'react';

export const useFetchData = (fetchFunction) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFunction();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return data;
};
