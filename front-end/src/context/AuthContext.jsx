// import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Charger l'utilisateur connecté
//     const savedUser = sessionStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }

//     // Initialiser credentials si inexistants
//     const credentials = localStorage.getItem("credentials");
//     if (!credentials) {
//       localStorage.setItem(
//         "credentials",
//         JSON.stringify({ email: "admin@gmail.com", password: "1234" })
//       );
//     }

//     setLoading(false);
//   }, []);

//   // Login dynamique selon credentials
//   const login = (email, password) => {
//     const credentials = JSON.parse(localStorage.getItem("credentials"));
//     if (email === credentials.email && password === credentials.password) {
//       const userData = { email };
//       setUser(userData);
//       sessionStorage.setItem("user", JSON.stringify(userData));
//       return true;
//     }
//     return false;
//   };

//   // Logout
//   const logout = () => {
//     setUser(null);
//     sessionStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }




import {
  createContext,
  useState,
  useEffect,
} from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // INITIALISATION
  // ==========================================

  useEffect(() => {

    // Charger l'utilisateur connecté
    const savedUser =
      sessionStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(
          "Erreur utilisateur session :",
          error
        );

        sessionStorage.removeItem("user");
      }
    }

    // ==========================================
    // INITIALISER LES IDENTIFIANTS
    // ==========================================

    const credentials =
      localStorage.getItem("credentials");

    if (!credentials) {

      localStorage.setItem(
        "credentials",
        JSON.stringify({
          email: "admin@gmail.com",
          password: "1234",
        })
      );
    }

    setLoading(false);

  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = (email, password) => {

    const savedCredentials =
      localStorage.getItem("credentials");

    if (!savedCredentials) {
      return false;
    }

    let credentials;

    try {
      credentials = JSON.parse(
        savedCredentials
      );
    } catch (error) {
      console.error(
        "Erreur credentials :",
        error
      );

      return false;
    }

    // Comparaison de l'email sans tenir compte
    // des majuscules/minuscules
    const emailCorrect =
      email.trim().toLowerCase() ===
      credentials.email.trim().toLowerCase();

    const passwordCorrect =
      password === credentials.password;

    if (
      emailCorrect &&
      passwordCorrect
    ) {

      const userData = {
        email: credentials.email,
      };

      setUser(userData);

      sessionStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      return true;
    }

    return false;
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    setUser(null);

    sessionStorage.removeItem("user");
  };

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


