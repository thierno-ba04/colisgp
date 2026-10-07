
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
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import logo from "../assets/colis.jpeg";
import "../styles/ForgotPassword.css";

// ======================================================
// CONFIGURATION EMAILJS
// ======================================================

const EMAILJS_SERVICE_ID = "TON_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TON_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "TON_PUBLIC_KEY";

// Code valable pendant 10 minutes
const CODE_EXPIRATION = 10 * 60 * 1000;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ======================================================
  // GÉNÉRER UN CODE DE 6 CHIFFRES
  // ======================================================

  const generateCode = () => {
    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  };

  // ======================================================
  // ENVOYER LE CODE
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Veuillez saisir votre adresse email."
      );
      return;
    }

    // Récupérer le compte
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

    // Vérifier l'email
    if (
      cleanEmail !==
      credentials.email.trim().toLowerCase()
    ) {
      setError(
        "Cette adresse email ne correspond pas au compte administrateur."
      );
      return;
    }

    setLoading(true);

    try {
      // Générer le code
      const code = generateCode();

      // Sauvegarder temporairement le code
      sessionStorage.setItem(
        "passwordResetCode",
        code
      );

      sessionStorage.setItem(
        "passwordResetEmail",
        cleanEmail
      );

      sessionStorage.setItem(
        "passwordResetExpiration",
        (
          Date.now() + CODE_EXPIRATION
        ).toString()
      );

      // Paramètres EmailJS
      const templateParams = {
        to_email: cleanEmail,
        email: cleanEmail,
        verification_code: code,
        code: code,
        app_name: "GP Colis USA → Sénégal",
      };

      // Envoi de l'email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      toast.success(
        "Code de confirmation envoyé par email 📧"
      );

      // Aller vers la page de vérification
      navigate("/verify-code");

    } catch (error) {
      console.error(
        "Erreur EmailJS :",
        error
      );

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
        "Impossible d'envoyer le code. Vérifiez votre configuration EmailJS."
      );

      toast.error(
        "Échec de l'envoi du code ❌"
      );
    }

    setLoading(false);
  };

  return (
    <div className="forgot-password-page">

      <Container>

        <Row className="justify-content-center align-items-center vh-100">

          <Col md={7} lg={5} xl={4}>

            <Card className="forgot-password-card shadow-lg">

              <Card.Body>

                {/* HEADER */}

                <div className="forgot-header">

                  <img
                    src={logo}
                    alt="GP Colis"
                    className="forgot-logo"
                  />

                  <h3>
                    Mot de passe oublié ?
                  </h3>

                  <p>
                    Entrez votre adresse email
                    pour recevoir un code de confirmation.
                  </p>

                </div>

                {/* ERREUR */}

                {error && (
                  <Alert
                    variant="danger"
                    className="forgot-alert"
                  >
                    {error}
                  </Alert>
                )}

                {/* FORMULAIRE */}

                <Form onSubmit={handleSubmit}>

                  <Form.Group className="mb-4">

                    <Form.Label>
                      Adresse email
                    </Form.Label>

                    <div className="forgot-input">

                      <FaEnvelope />

                      <Form.Control
                        type="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) =>
                          setEmail(
                            e.target.value
                          )
                        }
                        required
                      />

                    </div>

                  </Form.Group>

                  <Button
                    type="submit"
                    className="reset-password-btn w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Envoi du code..."
                      : "Envoyer le code de confirmation"}
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    className="back-login-btn"
                    onClick={() =>
                      navigate("/")
                    }
                  >
                    <FaArrowLeft />
                    {" "}Retour à la connexion
                  </Button>

                </Form>

              </Card.Body>

            </Card>

            <p className="forgot-copyright">
              © 2026 Gestion GP Colis USA → Sénégal
            </p>

          </Col>

        </Row>

      </Container>

    </div>
  );
}

export default ForgotPassword;

