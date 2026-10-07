
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// ==========================================
// PAGES
// ==========================================

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

import DashboardAdmin from "./admin/DashboardAdmin";
import Users from "./admin/pages/Users";
import Colis from "./admin/pages/Colis";
import ColisTransit from "./admin/pages/ColisTransit";
import ColisLivres from "./admin/pages/ColisLivres";
import Statistiques from "./admin/pages/ColisParVoyage";
import Notifications from "./admin/pages/Notifications";
import Settings from "./admin/pages/Settings";

// ==========================================
// LAYOUT + SÉCURITÉ
// ==========================================

import AdminLayout from "./admin/layout/AdminLayout";
import PrivateRoute from "./routes/PrivateRoute";

function App() {

  // ==========================================
  // DONNÉES DES COLIS
  // ==========================================

  const [colisData, setColisData] = useState(() => {

    const saved =
      localStorage.getItem("colisData");

    if (!saved) {
      return [];
    }

    try {

      const parsed = JSON.parse(saved);

      return parsed.map((c) => ({
        ...c,

        date: c.date
          ? new Date(c.date)
              .toISOString()
              .split("T")[0]
          : "",
      }));

    } catch (error) {

      console.error(
        "Erreur chargement colis :",
        error
      );

      return [];
    }
  });

  // ==========================================
  // SAUVEGARDE AUTOMATIQUE
  // ==========================================

  useEffect(() => {

    localStorage.setItem(
      "colisData",
      JSON.stringify(colisData)
    );

  }, [colisData]);

  // ==========================================
  // PASSER EN TRANSIT
  // ==========================================

  const handleTransit = (id) => {

    setColisData((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              statut: "En transit",
            }
          : c
      )
    );

  };

  // ==========================================
  // PASSER EN LIVRÉ
  // ==========================================

  const handleLivrer = (id) => {

    setColisData((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              statut: "Livré",
            }
          : c
      )
    );

  };

  return (

    <AuthProvider>

      <BrowserRouter>

        {/* ======================================
            TOAST
        ======================================= */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />

        <Routes>

          {/* ======================================
              LOGIN
          ======================================= */}

          <Route
            path="/"
            element={<Login />}
          />

          {/* ======================================
              MOT DE PASSE OUBLIÉ
          ======================================= */}

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* ======================================
              DASHBOARD
          ======================================= */}

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <DashboardAdmin
                    colisData={colisData}
                    setColisData={
                      setColisData
                    }
                  />

                </AdminLayout>

              </PrivateRoute>
            }
          />

          {/* ======================================
              USERS
          ======================================= */}

          <Route
            path="/admin/users"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <Users />

                </AdminLayout>

              </PrivateRoute>
            }
          />

          {/* ======================================
              COLIS
          ======================================= */}

          <Route
            path="/admin/colis"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <Colis
                    colisData={colisData}
                    setColisData={
                      setColisData
                    }
                    onTransit={
                      handleTransit
                    }
                  />

                </AdminLayout>

              </PrivateRoute>
            }
          />

          {/* ======================================
              COLIS TRANSIT
          ======================================= */}

          <Route
            path="/admin/colis-transit"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <ColisTransit
                    colisData={colisData}
                    setColisData={
                      setColisData
                    }
                    onLivrer={
                      handleLivrer
                    }
                  />

                </AdminLayout>

              </PrivateRoute>
            }
          />

          {/* ======================================
              COLIS LIVRÉS
          ======================================= */}

          <Route
            path="/admin/colis-livres"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <ColisLivres
                    colisData={colisData}
                    setColisData={
                      setColisData
                    }
                  />

                </AdminLayout>

              </PrivateRoute>
            }
          />

          {/* ======================================
              STATISTIQUES
          ======================================= */}

          <Route
            path="/admin/statistiques"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <Statistiques
                    colisData={colisData}
                  />

                </AdminLayout>

              </PrivateRoute>
            }
          />

          {/* ======================================
              NOTIFICATIONS
          ======================================= */}

          <Route
            path="/admin/notifications"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <Notifications />

                </AdminLayout>

              </PrivateRoute>
            }
          />

          {/* ======================================
              PARAMÈTRES
          ======================================= */}

          <Route
            path="/admin/settings"
            element={
              <PrivateRoute>

                <AdminLayout>

                  <Settings />

                </AdminLayout>

              </PrivateRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;

