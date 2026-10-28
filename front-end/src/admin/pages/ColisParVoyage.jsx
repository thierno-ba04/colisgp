
import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Modal
} from "react-bootstrap";

import {
  FaSearch,
  FaFileInvoice,
  FaDownload,
  FaPrint
} from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "../../assets/colis.jpeg";

function ColisParVoyage({ colisData = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [colisSelectionne, setColisSelectionne] = useState(null);

  // 🔹 Vérifier et formater la date
  const getMonth = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  // 🔹 Filtrage par recherche
  const filteredColis = colisData.filter((c) => {
    const recherche = searchTerm.toLowerCase();

    return (
      (c.client || "").toLowerCase().includes(recherche) ||
      (c.numero || "").toLowerCase().includes(recherche) ||
      (c.destination || "").toLowerCase().includes(recherche) ||
      (c.depart || "").toLowerCase().includes(recherche) ||
      String(c.date || "").toLowerCase().includes(recherche)
    );
  });

  // 🔹 Filtrage par mois
  const filteredByMonth = selectedMonth
    ? filteredColis.filter((c) => getMonth(c.date) === selectedMonth)
    : filteredColis;

  // 🔹 Groupement par trajet et date
  const grouped = filteredByMonth.reduce((acc, colis) => {
    const key = `${colis.depart || "Non précisé"} ➜ ${
      colis.destination || "Non précisée"
    } | ${colis.date || "Date non précisée"}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(colis);

    return acc;
  }, {});

  // 🔹 CRÉATION DE LA FACTURE PDF AVEC LE NOM DU CLIENT
  const createPDF = async (colis) => {
    const doc = new jsPDF();

    // Logo
    const img = new Image();
    img.src = logo;

    await new Promise((resolve) => {
      img.onload = () => {
        try {
          doc.addImage(img, "JPEG", 14, 10, 40, 40);
        } catch (error) {
          console.error("Erreur lors de l'ajout du logo :", error);
        }
        resolve();
      };

      img.onerror = () => resolve();
    });

    // En-tête
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RAPIDE COLIS GP", 60, 20);

    doc.setFontSize(16);
    doc.text("FACTURE", 150, 20);

    // Numéro de facture
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Référence : ${colis.id || colis.numero || "N/A"}`, 60, 29);

    // ✅ NOM DU CLIENT SUR LA FACTURE
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS DU CLIENT", 14, 62);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Nom du client : ${colis.client || "Client non renseigné"}`, 14, 72);
    doc.text(`Téléphone : ${colis.numero || "Non renseigné"}`, 14, 80);
    doc.text(`Date : ${colis.date || "Non renseignée"}`, 14, 88);

    // Tableau des informations du colis
    autoTable(doc, {
      startY: 98,
      head: [[
        "Départ",
        "Destination",
        "Poids",
        "Statut",
        "Montant"
      ]],
      body: [[
        colis.depart || "",
        colis.destination || "",
        `${colis.poids ?? 0} kg`,
        colis.statut || "",
        `${colis.montant ?? 0} $`
      ]],
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255]
      },
      theme: "grid"
    });

    // Description du colis
    let finalY = doc.lastAutoTable.finalY + 10;

    if (colis.description) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Description :", 14, finalY);

      doc.setFont("helvetica", "normal");
      const description = doc.splitTextToSize(
        String(colis.description),
        175
      );

      doc.text(description, 14, finalY + 7);
      finalY += 7 + description.length * 6;
    }

    // QR code
    try {
      const qrData = await QRCode.toDataURL(
        `https://colisgp.vercel.app/`
      );

      if (finalY + 45 > 280) {
        doc.addPage();
        finalY = 20;
      }

      doc.addImage(qrData, "PNG", 150, finalY, 35, 35);
    } catch (error) {
      console.error("Erreur lors de la création du QR code :", error);
    }

    return doc;
  };

  // 🔹 APERÇU DE LA FACTURE
  const handlePreview = async (colis) => {
    try {
      setColisSelectionne(colis);

      const doc = await createPDF(colis);
      const blob = doc.output("blob");

      // Libérer l'ancien aperçu
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de la génération de la facture :", error);
      alert("Impossible de générer la facture.");
    }
  };

  // 🔹 TÉLÉCHARGER LA FACTURE
  const handleDownload = async () => {
    if (!colisSelectionne) return;

    try {
      const doc = await createPDF(colisSelectionne);

      const nomClient = (colisSelectionne.client || "Client")
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      doc.save(`Facture_${nomClient}.pdf`);
    } catch (error) {
      console.error("Erreur de téléchargement :", error);
      alert("Impossible de télécharger la facture.");
    }
  };

  // 🔹 IMPRIMER LA FACTURE
  const handlePrint = () => {
    if (!pdfUrl) return;

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = pdfUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };
  };

  // 🔹 EXPORT EXCEL COMPLET
  const exportStatsExcel = () => {
    const filtered = selectedMonth
      ? colisData.filter((c) => getMonth(c.date) === selectedMonth)
      : colisData;

    const statsParMois = {};

    filtered.forEach((c) => {
      const mois = getMonth(c.date) || "Date inconnue";

      if (!statsParMois[mois]) {
        statsParMois[mois] = {
          colis: 0,
          montant: 0,
          voyages: new Set()
        };
      }

      statsParMois[mois].colis += 1;
      statsParMois[mois].montant += Number(c.montant) || 0;

      // Un voyage correspond à une date unique
      if (c.date) {
        statsParMois[mois].voyages.add(c.date);
      }
    });

    const statsData = Object.entries(statsParMois).map(
      ([mois, data]) => ({
        Mois: mois,
        "Total Colis": data.colis,
        "Chiffre ($)": Number(data.montant.toFixed(2)),
        "Nombre Voyages": data.voyages.size
      })
    );

    // Détails complets des colis
    const detailsData = filtered.map((c) => ({
      Client: c.client || "",
      Téléphone: c.numero || "",
      Départ: c.depart || "",
      Destination: c.destination || "",
      Date: c.date || "",
      Poids: `${c.poids ?? 0} kg`,
      Montant: `${c.montant ?? 0} $`,
      Statut: c.statut || "",
      Description: c.description || ""
    }));

    const wb = XLSX.utils.book_new();

    const wsStats = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, wsStats, "Statistiques");

    const wsDetails = XLSX.utils.json_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(wb, wsDetails, "Détails Colis");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }),
      "colis_complet.xlsx"
    );
  };

  // 🔹 Liste des mois disponibles
  const monthOptions = [
    ...new Set(
      colisData
        .map((c) => getMonth(c.date))
        .filter(Boolean)
    )
  ].sort().reverse();

  // 🔹 Fermer l'aperçu
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="mt-5">
      <h2>🛫 Colis par Voyage et Date</h2>

      {/* Recherche */}
      <InputGroup className="mb-4" style={{ maxWidth: "500px" }}>
        <InputGroup.Text
          style={{ background: "#000", color: "#fff" }}
        >
          <FaSearch />
        </InputGroup.Text>

        <Form.Control
          placeholder="Rechercher un client, téléphone, trajet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button
          variant="dark"
          onClick={() => setSearchTerm("")}
        >
          Reset
        </Button>
      </InputGroup>

      {/* Filtre par mois */}
      <Form.Group className="mb-3" style={{ maxWidth: "250px" }}>
        <Form.Label>📅 Filtrer par mois :</Form.Label>

        <Form.Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Tous les mois</option>

          {monthOptions.map((mois) => (
            <option key={mois} value={mois}>
              {mois}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Export Excel */}
      <div className="mb-3">
        <Button
          variant="success"
          onClick={exportStatsExcel}
        >
          <FaDownload className="me-2" />
          Exporter Excel
        </Button>
      </div>

      {/* Liste des colis groupés */}
      {Object.entries(grouped).length > 0 ? (
        Object.entries(grouped).map(([trajet, colisList]) => (
          <Card
            key={trajet}
            className="mb-4 shadow rounded"
          >
            <Card.Header
              style={{ background: "#000", color: "#fff" }}
            >
              {trajet}
            </Card.Header>

            <Card.Body>
              {colisList.map((c, index) => (
                <div
                  key={c.id || `${trajet}-${index}`}
                  className="mb-3 border-bottom pb-3"
                >
                  <p>
                    <strong>Client :</strong>{" "}
                    {c.client || "Non renseigné"}
                  </p>

                  <p>
                    <strong>Téléphone :</strong>{" "}
                    {c.numero || "Non renseigné"}
                  </p>

                  <p>
                    <strong>Date :</strong>{" "}
                    {c.date || "Non renseignée"}
                  </p>

                  <p>
                    <strong>Montant :</strong>{" "}
                    {c.montant ?? 0} $
                  </p>

                  <Button
                    variant="dark"
                    onClick={() => handlePreview(c)}
                  >
                    <FaFileInvoice className="me-2" />
                    Voir Facture
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>Aucun colis trouvé.</p>
      )}

      {/* MODAL APERÇU FACTURE */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileInvoice className="me-2" />

            Facture de{" "}
            {colisSelectionne?.client || "Client"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: "80vh" }}>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              title={`Facture de ${
                colisSelectionne?.client || "Client"
              }`}
              style={{ border: "none" }}
            />
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleDownload}
            disabled={!colisSelectionne}
          >
            <FaDownload className="me-2" />
            Télécharger
          </Button>

          <Button
            variant="primary"
            onClick={handlePrint}
            disabled={!pdfUrl}
          >
            <FaPrint className="me-2" />
            Imprimer
          </Button>

          <Button
            variant="secondary"
            onClick={handleCloseModal}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ColisParVoyage;
