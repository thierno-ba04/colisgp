import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaUser, FaPhone, FaMapMarkerAlt, FaMap, FaCalendarAlt, FaWeight, FaDollarSign, FaFileAlt, FaSearch } from "react-icons/fa";

function ColisLivres({ colisData }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedColis, setSelectedColis] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 🔥 recherche

  // 🔥 Filtrer uniquement les colis livrés
  const livresColis = colisData.filter(c => c.statut === "Livré");

  // 🔥 Filtrage avec recherche
  const filteredColis = livresColis.filter(c =>
    c.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.date?.includes(searchTerm)
  );

  const handleShowDetails = (colis) => {
    setSelectedColis(colis);
    setShowDetails(true);
  };

  return (
    <Container className="mt-5">
      <h2 style={{ fontWeight: "700" }}>✅ Colis Livrés</h2>

      {/* 🔍 CHAMP RECHERCHE */}
      <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
        <InputGroup.Text style={{ background: "#000", color: "#fff" }}>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="dark" onClick={() => setSearchTerm("")}>
          Reset
        </Button>
      </InputGroup>

      <Table responsive hover className="align-middle text-center shadow-sm mt-3">
        <thead>
          <tr>
            {["Client","Téléphone","Départ","Destination","Date","Poids","Montant","Description","Actions"].map((title, index) => (
              <th key={index} style={{
                backgroundColor: "#000",
                color: "#fff",
                textTransform: "uppercase",
                fontSize: "0.85rem"
              }}>
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredColis.length > 0 ? filteredColis.map(c => (
            <tr key={c.id}>
              <td>{c.client}</td>
              <td>{c.numero}</td>
              <td>{c.depart}</td>
              <td>{c.destination}</td>
              <td>{c.date}</td>
              <td>{c.poids} kg</td>
              <td>{c.montant} $</td>
              <td>{c.description.length > 50 ? c.description.substring(0,50)+"..." : c.description}</td>
              <td>
                <div style={{ display:"flex", justifyContent:"center", gap:"10px" }}>
                  <Button size="sm" variant="primary" onClick={() => handleShowDetails(c)}>
                    <FaEye />
                  </Button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="9" className="text-muted">
                Aucun colis trouvé
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL DETAILS */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton style={{ background: "#000", color: "#fff" }}>
          <Modal.Title>Détails du colis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedColis && (
            <div style={{ lineHeight: "1.6" }}>
              <p><FaUser /> <strong>Client:</strong> {selectedColis.client}</p>
              <p><FaPhone /> <strong>Téléphone:</strong> {selectedColis.numero}</p>
              <p><FaMapMarkerAlt /> <strong>Départ:</strong> {selectedColis.depart}</p>
              <p><FaMap /> <strong>Destination:</strong> {selectedColis.destination}</p>
              <p><FaCalendarAlt /> <strong>Date:</strong> {selectedColis.date}</p>
              <p><FaWeight /> <strong>Poids:</strong> {selectedColis.poids} kg</p>
              <p><FaDollarSign /> <strong>Montant:</strong> {selectedColis.montant} $</p>
              <p><FaFileAlt /> <strong>Description:</strong> {selectedColis.description}</p>
              <p><strong>Statut:</strong> {selectedColis.statut}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default ColisLivres;