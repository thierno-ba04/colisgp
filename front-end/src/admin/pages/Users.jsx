import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";

import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUserCheck,
  FaUserShield,
  FaSearch,
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/users.css";

const Users = () => {
  // 🔥 Charger utilisateur depuis Settings
  const [users, setUsers] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    return currentUser
      ? [{ id: 1, ...currentUser }]
      : [
          {
            id: 1,
            nom: "Admin",
            email: "admin@gmail.com",
            role: "Admin",
            statut: "Actif",
            photo: "",
          },
        ];
  });

  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    nom: "",
    email: "",
    role: "Employer", // 🔹 ici
    statut: "Actif",
    photo: "",
  });

  // 🔄 Synchronisation avec Settings
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUsers([{ id: 1, ...currentUser }]);
    }
  }, []);

  // 🔍 Filtre
  const filteredUsers = users.filter(
    (u) =>
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Stats
  const total = users.length;
  const actifs = users.filter((u) => u.statut === "Actif").length;
  const admins = users.filter((u) => u.role === "Admin").length;

  // ➕ Ajouter
  const handleShow = () => {
    setEditMode(false);
    setFormData({
      id: null,
      nom: "",
      email: "",
      role: "Employer", // 🔹 ici aussi
      statut: "Actif",
      photo: "",
    });
    setShow(true);
  };

  // ✏️ Modifier
  const handleEdit = (user) => {
    setEditMode(true);
    setFormData(user);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 Enregistrer
  const handleSubmit = () => {
    if (!formData.nom || !formData.email) {
      toast.error("Champs obligatoires !");
      return;
    }

    if (editMode) {
      const updatedUsers = users.map((u) =>
        u.id === formData.id ? formData : u
      );
      setUsers(updatedUsers);

      // 🔥 si c’est le user connecté → MAJ localStorage
      if (formData.id === 1) {
        localStorage.setItem("currentUser", JSON.stringify(formData));
      }

      toast.success("Utilisateur modifié !");
    } else {
      setUsers([...users, { ...formData, id: Date.now() }]);
      toast.success("Utilisateur ajouté !");
    }

    setShow(false);
  };

  // 🗑️ Supprimer
  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    toast.info("Utilisateur supprimé");
  };

  return (
    <Container fluid className="mt-4">
      <ToastContainer />

      {/* HEADER */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold">👥 Gestion utilisateurs</h2>
        </Col>

        <Col className="text-end">
          <Button className="rounded-pill px-4" onClick={handleShow}>
            <FaUserPlus className="me-2" />
            Ajouter
          </Button>
        </Col>
      </Row>

      {/* STATS */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card bg-primary-gradient text-center">
            <Card.Body>
              <FaUsers size={30} />
              <h6>Total</h6>
              <h2>{total}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card bg-success-gradient text-center">
            <Card.Body>
              <FaUserCheck size={30} />
              <h6>Actifs</h6>
              <h2>{actifs}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card bg-warning-gradient text-center">
            <Card.Body>
              <FaUserShield size={30} />
              <h6>Admins</h6>
              <h2>{admins}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SEARCH */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Rechercher..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {/* TABLE */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id}>
                  <td>{i + 1}</td>

                  <td className="d-flex align-items-center">
                    <div className="avatar me-2">
                      {user.photo ? (
                        <img src={user.photo} alt="" />
                      ) : (
                        user.nom.charAt(0)
                      )}
                    </div>
                    {user.nom}
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`badge ${
                        user.role === "Admin"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        user.statut === "Actif"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {user.statut}
                    </span>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MODAL */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Modifier" : "Ajouter"} utilisateur
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-3"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
            />

            <Form.Control
              className="mb-3"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <Form.Select
              className="mb-3"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option>Admin</option>
              <option>Employer</option> {/* 🔹 changé */}
            </Form.Select>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Users;