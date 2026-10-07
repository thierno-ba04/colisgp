import React, { useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { FaSave, FaCamera } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/settings.css";

function Settings() {
  const [form, setForm] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    const credentials = JSON.parse(localStorage.getItem("credentials"));

    return {
      nom: savedUser?.nom || "",
      email: savedUser?.email || credentials?.email || "",
      telephone: savedUser?.telephone || "",
      photo: savedUser?.photo || "",
      ancien: "",
      nouveau: "",
      confirmer: "",
    };
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        photo: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nom || !form.email || !form.telephone) {
      toast.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    if (form.nouveau && form.nouveau !== form.confirmer) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    // 🔥 Profil
    const userData = {
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      photo: form.photo,
      role: "Admin",
      statut: "Actif",
    };

    localStorage.setItem("currentUser", JSON.stringify(userData));

    // 🔐 Credentials
    const oldCredentials =
      JSON.parse(localStorage.getItem("credentials")) || {};

    const newCredentials = {
      email: form.email,
      password: form.nouveau
        ? form.nouveau
        : oldCredentials.password || "1234",
    };

    localStorage.setItem("credentials", JSON.stringify(newCredentials));

    toast.success("Profil et mot de passe mis à jour !");
  };

  return (
    <Container className="settings-container">
      <ToastContainer />
      <Card className="settings-modern-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="align-items-center">
              {/* PHOTO */}
              <Col md={4} className="text-center mb-4">
                <div className="profile-pic-wrapper">
                  <img
                    src={form.photo || "https://ui-avatars.com/api/?name=User"}
                    alt="profil"
                    className="profile-pic"
                  />

                  <label className="upload-btn">
                    <FaCamera />
                    <input type="file" hidden onChange={handleImage} />
                  </label>
                </div>
              </Col>

              {/* FORM */}
              <Col md={8}>
                <h5>Profil</h5>

                <Form.Control
                  className="mb-3"
                  name="nom"
                  placeholder="Nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />

                <Form.Control
                  className="mb-3"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <Form.Control
                  className="mb-3"
                  name="telephone"
                  placeholder="Téléphone"
                  value={form.telephone}
                  onChange={handleChange}
                  required
                />

                <h5>Sécurité</h5>

                <Row>
                  <Col md={4}>
                    <Form.Control
                      type="password"
                      name="ancien"
                      placeholder="Ancien"
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Control
                      type="password"
                      name="nouveau"
                      placeholder="Nouveau"
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Control
                      type="password"
                      name="confirmer"
                      placeholder="Confirmer"
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Button type="submit" className="save-btn mt-4 w-100">
                  <FaSave /> Enregistrer
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Settings;