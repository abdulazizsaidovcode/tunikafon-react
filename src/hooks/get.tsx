import axios from '../service/api';
import { useState } from 'react';

const useGet = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const get = async (url: string, page?: any, setDatas?: (data: any) => void) => {
   //  console.clear();
    setIsLoading(true);

    try {
      const api = page >= 0 ? `${url}?page=${page}&size=10` : url;
      const { data } = await axios.get(api);
      if (data.success) {
        setDatas ? setDatas(data.body) : setData(data.body);
      } else {
        setDatas ? setDatas(null) : setData(null)
      }
      return data.body
    } catch (err: any) {
      setError(err);
      if (err.response && err.response.status === 404) setDatas ? setDatas(null) : setData(null)
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, get };
};

export default useGet;
