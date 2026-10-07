import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./pages/Login";
import DashboardAdmin from "./admin/DashboardAdmin";
import Users from "./admin/pages/Users";
import Colis from "./admin/pages/Colis";
import ColisTransit from "./admin/pages/ColisTransit";
import ColisLivres from "./admin/pages/ColisLivres";
import Statistiques from "./admin/pages/ColisParVoyage";
import Notifications from "./admin/pages/Notifications";
import Settings from "./admin/pages/Settings";

// Layout + sécurité
import AdminLayout from "./admin/layout/AdminLayout";
import PrivateRoute from "./routes/PrivateRoute";

function App() {

  // ✅ localStorage intégré pour les colis avec normalisation des dates
  const [colisData, setColisData] = useState(() => {
    const saved = localStorage.getItem("colisData");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // 🔹 normalisation des dates
    return parsed.map(c => ({
      ...c,
      date: c.date ? new Date(c.date).toISOString().split("T")[0] : ""
    }));
  });

  // sauvegarde automatique
  useEffect(() => {
    localStorage.setItem("colisData", JSON.stringify(colisData));
  }, [colisData]);

  // Passer un colis en transit
  const handleTransit = (id) => {
    setColisData(prev =>
      prev.map(c => c.id === id ? { ...c, statut: "En transit" } : c)
    );
  };

  // Passer un colis en livré
  const handleLivrer = (id) => {
    setColisData(prev =>
      prev.map(c => c.id === id ? { ...c, statut: "Livré" } : c)
    );
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <AdminLayout>
                <DashboardAdmin
                  colisData={colisData}
                  setColisData={setColisData}
                />
              </AdminLayout>
            </PrivateRoute>
          }/>

          <Route path="/admin/users" element={
            <PrivateRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </PrivateRoute>
          }/>

          <Route path="/admin/colis" element={
            <PrivateRoute>
              <AdminLayout>
                <Colis
                  colisData={colisData}
                  setColisData={setColisData}
                  onTransit={handleTransit}
                />
              </AdminLayout>
            </PrivateRoute>
          }/>

          <Route path="/admin/colis-transit" element={
            <PrivateRoute>
              <AdminLayout>
                <ColisTransit
                  colisData={colisData}
                  setColisData={setColisData}
                  onLivrer={handleLivrer}
                />
              </AdminLayout>
            </PrivateRoute>
          }/>

          <Route path="/admin/colis-livres" element={
            <PrivateRoute>
              <AdminLayout>
                <ColisLivres
                  colisData={colisData}
                  setColisData={setColisData}
                />
              </AdminLayout>
            </PrivateRoute>
          }/>

          <Route path="/admin/statistiques" element={
            <PrivateRoute>
              <AdminLayout>
                <Statistiques colisData={colisData} />
              </AdminLayout>
            </PrivateRoute>
          }/>

          <Route path="/admin/notifications" element={
            <PrivateRoute>
              <AdminLayout>
                <Notifications />
              </AdminLayout>
            </PrivateRoute>
          }/>

          <Route path="/admin/settings" element={
            <PrivateRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </PrivateRoute>
          }/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;