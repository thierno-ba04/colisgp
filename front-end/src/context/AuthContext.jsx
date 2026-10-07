import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur connecté
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Initialiser credentials si inexistants
    const credentials = localStorage.getItem("credentials");
    if (!credentials) {
      localStorage.setItem(
        "credentials",
        JSON.stringify({ email: "admin@gmail.com", password: "1234" })
      );
    }

    setLoading(false);
  }, []);

  // Login dynamique selon credentials
  const login = (email, password) => {
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    if (email === credentials.email && password === credentials.password) {
      const userData = { email };
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // Logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}