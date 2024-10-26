import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/constants/interfaces';

const useLoadUser = () => {
  const [username, setUsername] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(true);

  const loadUser = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        setUsername(decodedToken.username);
        setIsGuest(false);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { username, isGuest, loadUser };
};

export default useLoadUser;