import React, { useState } from "react";
import { Container, Card, Form, Button, InputGroup, Modal } from "react-bootstrap";
import { FaSearch, FaFileInvoice, FaDownload, FaPrint } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "../../assets/colis.jpeg";

function ColisParVoyage({ colisData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Filtrage
  const filteredColis = colisData.filter(c =>
    c.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.date?.includes(searchTerm)
  );

  const filteredByMonth = selectedMonth
    ? filteredColis.filter(c => new Date(c.date).toISOString().slice(0, 7) === selectedMonth)
    : filteredColis;

  // 🔹 Groupement
  const grouped = filteredByMonth.reduce((acc, colis) => {
    const key = `${colis.depart} ➜ ${colis.destination} | ${colis.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(colis);
    return acc;
  }, {});

  // 🔹 FACTURE PDF
  const createPDF = async (colis) => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = logo;
    await new Promise(res => {
      img.onload = () => {
        doc.addImage(img, "JPEG", 14, 10, 40, 40);
        doc.text("RAPIDE COLIS GP", 60, 20);
        res();
      };
      img.onerror = () => res();
    });

    doc.text("FACTURE", 150, 20);

    autoTable(doc, {
      startY: 80,
      head: [["Départ", "Destination", "Poids", "Statut", "Montant"]],
      body: [[colis.depart, colis.destination, colis.poids, colis.statut, colis.montant]],
    });

    const qr = await QRCode.toDataURL(`https://monsite.com/${colis.id}`);
    doc.addImage(qr, "PNG", 150, doc.lastAutoTable.finalY + 10, 40, 40);

    return doc;
  };

  const handlePreview = async (colis) => {
    const doc = await createPDF(colis);
    setPdfUrl(doc.output("bloburl"));
    setShowModal(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "facture.pdf";
    link.click();
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  };

  // 🔥 EXPORT EXCEL COMPLET
  const exportStatsExcel = () => {
    const statsParMois = {};

    const filtered = selectedMonth
      ? colisData.filter(c => new Date(c.date).toISOString().slice(0, 7) === selectedMonth)
      : colisData;

    // 🔹 STATISTIQUES
    filtered.forEach(c => {
      const mois = new Date(c.date).toLocaleString("default", { month: "long", year: "numeric" });

      if (!statsParMois[mois]) {
        statsParMois[mois] = { colis: 0, montant: 0, voyages: new Set() };
      }

      statsParMois[mois].colis += 1;
      statsParMois[mois].montant += parseFloat(c.montant) || 0;

      // ✅ voyage = date uniquement
      statsParMois[mois].voyages.add(c.date);
    });

    const statsData = Object.entries(statsParMois).map(([mois, data]) => ({
      Mois: mois,
      "Total Colis": data.colis,
      "Chiffre ($)": data.montant.toFixed(2),
      "Nombre Voyages": data.voyages.size
    }));

    // 🔥 DETAILS COMPLETS
    const detailsData = filtered.map(c => ({
      Client: c.client,
      Téléphone: c.numero,
      Départ: c.depart,
      Destination: c.destination,
      Date: c.date,
      Poids: c.poids + " kg",
      Montant: c.montant + " $",
      Statut: c.statut,
      Description: c.description
    }));

    const wb = XLSX.utils.book_new();

    const wsStats = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, wsStats, "Statistiques");

    const wsDetails = XLSX.utils.json_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(wb, wsDetails, "Détails Colis");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "colis_complet.xlsx");
  };

  const monthOptions = Array.from(
    new Set(colisData.map(c => new Date(c.date).toISOString().slice(0, 7)))
  );

  return (
    <Container className="mt-5">
      <h2>🛫 Colis par Voyage et Date</h2>

      <InputGroup className="mb-4" style={{ maxWidth: "500px" }}>
        <InputGroup.Text style={{ background: "#000", color: "#fff" }}>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="dark" onClick={() => setSearchTerm("")}>Reset</Button>
      </InputGroup>

      <Form.Group className="mb-3" style={{ maxWidth: "200px" }}>
        <Form.Label>📅 Filtrer par mois :</Form.Label>
        <Form.Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Tous les mois</option>
          {monthOptions.map(mois => (
            <option key={mois} value={mois}>{mois}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="mb-3">
        <Button variant="success" onClick={exportStatsExcel}>
          <FaDownload /> Exporter Excel
        </Button>
      </div>

      {Object.entries(grouped).length > 0 ? (
        Object.entries(grouped).map(([trajet, colisList], index) => (
          <Card key={index} className="mb-4 shadow rounded">
            <Card.Header style={{ background: "#000", color: "#fff" }}>{trajet}</Card.Header>
            <Card.Body>
              {colisList.map(c => (
                <div key={c.id} className="mb-3 border-bottom pb-2">
                  <p><strong>Client:</strong> {c.client}</p>
                  <p><strong>Téléphone:</strong> {c.numero}</p>
                  <p><strong>Date:</strong> {c.date}</p>
                  <p><strong>Montant:</strong> {c.montant} $</p>
                  <Button variant="dark" onClick={() => handlePreview(c)}>
                    <FaFileInvoice /> Voir Facture
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>Aucun colis trouvé</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Aperçu Facture</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh" }}>
          {pdfUrl && <iframe src={pdfUrl} width="100%" height="100%" title="PDF Preview" />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleDownload}><FaDownload /> Télécharger</Button>
          <Button variant="primary" onClick={handlePrint}><FaPrint /> Imprimer</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ColisParVoyage;