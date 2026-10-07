import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { 
  FaEye, FaUser, FaPhone, FaMapMarkerAlt, FaMap, 
  FaCalendarAlt, FaWeight, FaDollarSign, FaFileAlt, FaPlane 
} from "react-icons/fa";
import { toast } from "react-toastify";

function ColisTransit({ colisData, setColisData, onLivrer }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedColis, setSelectedColis] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔥 Debounce pour la recherche
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // 300ms après la dernière frappe

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // 🔥 Filtrer uniquement les colis en transit
  let transitColis = colisData.filter(c => c.statut === "En transit");

  // 🔥 Filtrer selon le champ de recherche (après debounce)
  if (debouncedSearch) {
    transitColis = transitColis.filter(c =>
      c.client.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.depart.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.destination.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }

  const handleShowDetails = (colis) => {
    setSelectedColis(colis);
    setShowDetails(true);
  };

  const handleLivrer = (id) => {
    onLivrer(id);
    toast.success("Colis livré !");
  };

  return (
    <Container className="mt-5">
      <h2 style={{ fontWeight: "700" }}>✈️ Colis en Transit</h2>

      {/* 🔥 Champ de recherche */}
      <Form className="mb-3">
        <InputGroup>
          <Form.Control 
            type="text" 
            placeholder="Rechercher par client, départ ou destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Form>

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
          {transitColis.length > 0 ? transitColis.map(c => (
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
                  {/* 🔥 Bouton livraison avec icône avion */}
                  <Button size="sm" variant="success" onClick={() => handleLivrer(c.id)}>
                    <FaPlane className="me-1" />
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => handleShowDetails(c)}>
                    <FaEye />
                  </Button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="9" className="text-muted">Aucun colis en transit</td>
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

export default ColisTransit;