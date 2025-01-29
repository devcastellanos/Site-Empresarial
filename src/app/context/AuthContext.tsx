'use client';

import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    }

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    
    const getProfile = async () => {
        try {
            const response = await axios.get('/api/auth/profile', { withCredentials: true });
            console.log('Perfil del usuario:', response.data.user);
            setIsAuthenticated(true); // Marcar como autenticado
        } catch {
         
            setIsAuthenticated(false); // Marcar como no autenticado
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
            // Recargar la página para limpiar la sesión
           

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }

      };
    
      return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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