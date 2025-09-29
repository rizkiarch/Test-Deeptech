import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    name?: string; // Computed property
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('auth_token');

        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                localStorage.removeItem('user');
                localStorage.removeItem('auth_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);

            // Call the actual login API through KrakenD Gateway
            const response = await fetch('http://localhost:8080/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (response.ok) {
                const apiResponse = await response.json();
                console.log('API Response:', apiResponse); // Debug log

                if (apiResponse.status === 'success' && apiResponse.data.token && apiResponse.data.user) {
                    const userData = apiResponse.data.user;
                    const user: User = {
                        id: userData.id,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        name: `${userData.first_name} ${userData.last_name}` // Computed name
                    };

                    setUser(user);
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('auth_token', apiResponse.data.token);

                    console.log('Token stored:', apiResponse.data.token); // Debug log
                    console.log('User stored:', user); // Debug log

                    return true;
                }
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');

        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};