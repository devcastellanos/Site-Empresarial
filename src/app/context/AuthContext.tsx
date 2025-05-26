'use client';

import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  email: string;
  user: string;
  num_empleado: number;
  rol: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: () => void;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    
    const getProfile = async () => {
      try {
        const response = await axios.get('/api/auth/profile', { withCredentials: true });
        console.log('Perfil del usuario:', response.data.user); // Verifica la respuesta del perfil
        setUser(response.data.user); // guarda todo el objeto
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    useEffect(() => {
        console.log('Verificando autenticación...');
        getProfile();
      }, []);
    
      const login = async () => {
        try {
            await getProfile();
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };
    
      const logout = async () => {
        try {
            await axios.post('/api/auth/logout', {});
          
            setIsAuthenticated(false); // Marcar como no autenticado
            setUser(null); // Limpiar el perfil del usuario
            window.location.href = '/Login'; // Redirigir al usuario a la página de inicio de sesión

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }

      };
    
      return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        {children}
      </AuthContext.Provider>
      );
    };
    
    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };