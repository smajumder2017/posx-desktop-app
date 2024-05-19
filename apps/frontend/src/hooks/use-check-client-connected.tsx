import axios from "axios";
import { useEffect, useState } from "react"

export const useCheckClientConnected = () => {
  const [connected, setConnected] = useState(false);
  const checkConnection = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api');
      if (res.status === 200) {
        setConnected(true);
      }
    } catch (error) {
      setConnected(false);
      console.log('client not connected');
    }

  }
  useEffect(()=>{
    checkConnection();
  }, []);

  return connected;
}