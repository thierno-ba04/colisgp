
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
  FaKey,
  FaArrowLeft,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/colis.jpeg";
import "../styles/VerifyCode.css";

function VerifyCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const email =
    sessionStorage.getItem(
      "passwordResetEmail"
    );

  // ======================================================
  // VÉRIFIER LE CODE
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const savedCode =
      sessionStorage.getItem(
        "passwordResetCode"
      );

    const expiration =
      sessionStorage.getItem(
        "passwordResetExpiration"
      );

    if (!email || !savedCode || !expiration) {
      setError(
        "Aucune demande de réinitialisation n'a été trouvée."
      );
      return;
    }

    // Vérifier expiration
    if (Date.now() > Number(expiration)) {

      sessionStorage.removeItem(
        "passwordResetCode"
      );

      sessionStorage.removeItem(
        "passwordResetEmail"
      );

      sessionStorage.removeItem(
        "passwordResetExpiration"
      );

      setError(
        "Le code a expiré. Veuillez recommencer."
      );

      return;
    }

    // Vérifier code
    if (code.trim() !== savedCode) {
      setError(
        "Code incorrect. Vérifiez le code reçu par email."
      );
      return;
    }

    toast.success(
      "Code confirmé avec succès ✅"
    );

    // Marquer l'email comme vérifié
    sessionStorage.setItem(
      "passwordResetVerified",
      "true"
    );

    navigate("/reset-password");
  };

  return (
    <div className="verify-code-page">

      <Container>

        <Row className="justify-content-center align-items-center vh-100">

          <Col md={7} lg={5} xl={4}>

            <Card className="verify-code-card shadow-lg">

              <Card.Body>

                {/* HEADER */}

                <div className="verify-header">

                  <img
                    src={logo}
                    alt="GP Colis"
                    className="verify-logo"
                  />

                  <div className="verify-icon">
                    <FaEnvelope />
                  </div>

                  <h3>
                    Vérification
                  </h3>

                  <p>
                    Entrez le code reçu par email.
                  </p>

                </div>

                {/* EMAIL */}

                {email && (
                  <div className="verify-email">
                    <span>
                      Code envoyé à :
                    </span>

                    <strong>
                      {email}
                    </strong>
                  </div>
                )}

                {/* ERREUR */}

                {error && (
                  <Alert
                    variant="danger"
                    className="verify-alert"
                  >
                    {error}
                  </Alert>
                )}

                {/* FORMULAIRE */}

                <Form onSubmit={handleSubmit}>

                  <Form.Group className="mb-4">

                    <Form.Label>
                      Code de confirmation
                    </Form.Label>

                    <div className="code-input">

                      <FaKey />

                      <Form.Control
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={code}
                        onChange={(e) =>
                          setCode(
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        required
                      />

                    </div>

                  </Form.Group>

                  <Button
                    type="submit"
                    className="verify-btn w-100"
                  >
                    Vérifier le code
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    className="back-verify-btn"
                    onClick={() =>
                      navigate(
                        "/forgot-password"
                      )
                    }
                  >
                    <FaArrowLeft />
                    {" "}Modifier l'email
                  </Button>

                </Form>

              </Card.Body>

            </Card>

            <p className="verify-copyright">
              © 2026 Gestion GP Colis USA → Sénégal
            </p>

          </Col>

        </Row>

      </Container>

    </div>
  );
}

export default VerifyCode;
