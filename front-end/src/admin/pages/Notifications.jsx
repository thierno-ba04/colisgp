import React from "react";
import AdminLayout from "../layout/AdminLayout";
import { ListGroup } from "react-bootstrap";

const Notifications = () => {
  const notifications = [
    { id: 1, message: "Colis #123 a été livré avec succès", date: "2026-03-13" },
    { id: 2, message: "Nouvelle demande de suivi pour Colis #124", date: "2026-03-12" },
    { id: 3, message: "Colis #125 en retard", date: "2026-03-11" },
  ];

  return (
    <div>
      <h1>Notifications</h1>
      <p>Dernières alertes et notifications pour l'admin.</p>

      <ListGroup>
        {notifications.map((note) => (
          <ListGroup.Item key={note.id}>
            <strong>{note.date}:</strong> {note.message}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Notifications;