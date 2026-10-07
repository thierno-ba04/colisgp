
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import {
  FaLock,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/colis.jpeg";
import "../styles/ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ======================================================
  // VÉRIFIER QUE LE CODE A ÉTÉ VALIDÉ
  // ======================================================

  const verified =
    sessionStorage.getItem(
      "passwordResetVerified"
    );

  // Si l'utilisateur arrive directement
  // sur cette page sans vérifier le code
  if (verified !== "true") {
    navigate("/forgot-password");
    return null;
  }

  // ======================================================
  // CHANGER LE MOT DE PASSE
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Vérifier les champs
    if (
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Veuillez remplir tous les champs."
      );
      return;
    }

    // Longueur
    if (newPassword.length < 4) {
      setError(
        "Le mot de passe doit contenir au moins 4 caractères."
      );
      return;
    }

    // Correspondance
    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "Les deux mots de passe ne correspondent pas."
      );
      return;
    }

    // Récupérer credentials
    const savedCredentials =
      localStorage.getItem("credentials");

    if (!savedCredentials) {
      setError(
        "Aucun compte administrateur n'a été trouvé."
      );
      return;
    }

    let credentials;

    try {
      credentials = JSON.parse(
        savedCredentials
      );
    } catch (error) {
      setError(
        "Les informations du compte sont invalides."
      );
      return;
    }

    // ======================================================
    // ENREGISTRER LE NOUVEAU MOT DE PASSE
    // ======================================================

    const updatedCredentials = {
      ...credentials,
      password: newPassword,
    };

    localStorage.setItem(
      "credentials",
      JSON.stringify(
        updatedCredentials
      )
    );

    // ======================================================
    // NETTOYAGE
    // ======================================================

    sessionStorage.removeItem(
      "passwordResetCode"
    );

    sessionStorage.removeItem(
      "passwordResetEmail"
    );

    sessionStorage.removeItem(
      "passwordResetExpiration"
    );

    sessionStorage.removeItem(
      "passwordResetVerified"
    );

    // ======================================================
    // SUCCÈS
    // ======================================================

    toast.success(
      "Mot de passe modifié avec succès 🎉"
    );

    setNewPassword("");
    setConfirmPassword("");

    // Retour login
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="reset-password-page">

      <Container>

        <Row className="justify-content-center align-items-center vh-100">

          <Col md={7} lg={5} xl={4}>

            <Card className="reset-password-card shadow-lg">

              <Card.Body>

                {/* HEADER */}

                <div className="reset-header">

                  <img
                    src={logo}
                    alt="GP Colis"
                    className="reset-logo"
                  />

                  <div className="reset-success-icon">
                    <FaCheckCircle />
                  </div>

                  <h3>
                    Nouveau mot de passe
                  </h3>

                  <p>
                    Votre email a été vérifié.
                    Créez votre nouveau mot de passe.
                  </p>

                </div>

                {/* ERREUR */}

                {error && (
                  <Alert
                    variant="danger"
                    className="reset-alert"
                  >
                    {error}
                  </Alert>
                )}

                <Form
                  onSubmit={handleSubmit}
                >

                  {/* NOUVEAU MOT DE PASSE */}

                  <Form.Group className="mb-3">

                    <Form.Label>
                      Nouveau mot de passe
                    </Form.Label>

                    <div className="reset-input">

                      <FaLock />

                      <Form.Control
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(
                            e.target.value
                          )
                        }
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                      >
                        {showPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>

                    </div>

                  </Form.Group>

                  {/* CONFIRMATION */}

                  <Form.Group className="mb-4">

                    <Form.Label>
                      Confirmer le mot de passe
                    </Form.Label>

                    <div className="reset-input">

                      <FaKey />

                      <Form.Control
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Confirmer le mot de passe"
                        value={
                          confirmPassword
                        }
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>

                    </div>

                  </Form.Group>

                  <Button
                    type="submit"
                    className="change-password-btn w-100"
                  >
                    <FaCheckCircle />
                    {" "}Modifier le mot de passe
                  </Button>

                </Form>

              </Card.Body>

            </Card>

            <p className="reset-copyright">
              © 2026 Gestion GP Colis USA → Sénégal
            </p>

          </Col>

        </Row>

      </Container>

    </div>
  );
}

export default ResetPassword;
