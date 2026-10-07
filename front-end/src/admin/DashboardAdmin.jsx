import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer
} from "recharts";
import { FaUser, FaBox, FaTruck, FaDollarSign } from "react-icons/fa";
import { toast } from "react-toastify";

function DashboardAdmin({ colisData, setColisData }) {
  // 🟢 Calculs principaux
  const totalColisCard = colisData.length;
  const colisTransit = colisData.filter(c => c.statut === "En transit").length;
  const colisLivres = colisData.filter(c => c.statut === "Livré").length;
  const chiffreAffaires = colisData.reduce((acc, c) => acc + (parseFloat(c.montant) || 0), 0);

  // 🟢 Calcul nombre de voyages uniques par DATE seulement
  const voyagesParDate = [...new Set(colisData.map(c => c.date))]; // unique dates
  const totalVoyages = voyagesParDate.length;

  const pourcentageLivres = totalColisCard > 0 ? Math.round((colisLivres / totalColisCard) * 100) : 0;

  // 🟢 Chiffre d'affaires et nombre de colis par date + trajet
  const chiffreParVoyage = colisData.reduce((acc, c) => {
    const key = `${c.date} | ${c.depart} ➜ ${c.destination}`;
    if (!acc[key]) acc[key] = { montant: 0, colis: 0 };
    acc[key].montant += parseFloat(c.montant) || 0;
    acc[key].colis += 1;
    return acc;
  }, {});

  // 🟢 Données graphiques
  const pieData = [
    { name: "En Transit", value: colisTransit },
    { name: "Livrés", value: colisLivres }
  ];

  const barData = Object.entries(chiffreParVoyage).map(([key, value]) => ({
    trajet: key,
    montant: value.montant,
    colis: value.colis
  }));

  const CARD_BACKGROUNDS = ["#007bff", "#28a745", "#ffc107", "#17a2b8"];
  const PIE_COLORS = ["#ff6384", "#36a2eb"];
  const RADIAL_COLOR = "#28a745";

  const dataSummary = [
    { title: "Voyages", value: totalVoyages, icon: <FaUser />, background: CARD_BACKGROUNDS[0] },
    { title: "Colis", value: totalColisCard, icon: <FaBox />, background: CARD_BACKGROUNDS[1] },
    { title: "En Transit", value: colisTransit, icon: <FaTruck />, background: CARD_BACKGROUNDS[2] },
    { title: "Chiffre d'Affaires", value: `${chiffreAffaires.toFixed(2)} $`, icon: <FaDollarSign />, background: CARD_BACKGROUNDS[3] }
  ];

  // 🟢 Bouton réinitialiser toutes les données
  const handleResetColis = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser toutes les données des colis ?")) {
      setColisData([]);
      toast.success("Toutes les données des colis ont été réinitialisées !");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "30px" }}>
      <h1>Tableau de bord</h1>
      <p>GP Colis USA → Sénégal</p>

      {/* BOUTON RÉINITIALISER */}
      <div className="mb-4 text-end">
        <Button variant="danger" onClick={handleResetColis}>
          🔄 Réinitialiser tous les colis
        </Button>
      </div>

      {/* CARDS SUMMARY */}
      <Row className="mb-4">
        {dataSummary.map((item, index) => (
          <Col lg={3} md={6} sm={6} xs={12} key={index}>
            <Card className="mb-3 shadow-sm text-white" style={{ padding: "20px", backgroundColor: item.background }}>
              <div style={{ fontSize: "2rem" }}>{item.icon}</div>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{item.value}</Card.Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* GRAPHIQUES */}
      <Row>
        {/* PIE CHART - Répartition */}
        <Col lg={4} className="mb-4">
          <Card className="p-3 shadow-sm">
            <Card.Title>Répartition</Card.Title>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={80}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* BAR CHART - Chiffre par date + trajet */}
        <Col lg={4} className="mb-4">
          <Card className="p-3 shadow-sm">
            <Card.Title>Chiffre par voyage (date + trajet)</Card.Title>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="trajet" tick={{ fontSize: 10 }} interval={0} />
                <YAxis />
                <Tooltip formatter={(value) => `${value} $`} />
                <Bar dataKey="montant" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* RADIAL BAR - % Livrés */}
        <Col lg={4} className="mb-4">
          <Card className="p-3 text-center shadow-sm">
            <Card.Title>% Livrés</Card.Title>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ value: pourcentageLivres }]}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar dataKey="value" fill={RADIAL_COLOR} />
              </RadialBarChart>
            </ResponsiveContainer>
            <h3>{pourcentageLivres}%</h3>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardAdmin;