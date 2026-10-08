// // import { useState, useContext, useEffect } from "react";
// // import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
// // import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "react-toastify";
// // import { AuthContext } from "../context/AuthContext";
// // import logo from "../assets/colis.jpeg";
// // import "../styles/Login.css";

// // function Login() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [error, setError] = useState("");

// //   const { login, user, loading } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (!loading && user) {
// //       navigate("/admin/dashboard");
// //     }
// //   }, [user, loading, navigate]);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     const success = login(email, password);

// //     if (!success) {
// //       setError("Email ou mot de passe incorrect");
// //       toast.error("Email ou mot de passe incorrect ❌");
// //     } else {
// //       toast.success("Connexion réussie ✅");
// //     }
// //   };

// //   if (loading) return <div className="loading">Chargement...</div>;

// //   return (
// //     <div className="login-page">
// //       <Container>
// //         <Row className="justify-content-center align-items-center vh-100">
// //           <Col md={6} lg={4}>
// //             <Card className="login-card shadow-lg">
// //               <Card.Body>
// //                 <div className="login-header">
// //                   <img src={logo} alt="colis" className="login-logo" />
// //                   <h3>GP Colis USA → Sénégal</h3>
// //                   <p>Connectez-vous à votre espace</p>
// //                 </div>

// //                 {error && <Alert variant="danger">{error}</Alert>}

// //                 <Form onSubmit={handleSubmit}>
// //                   {/* EMAIL */}
// //                   <Form.Group className="mb-3">
// //                     <div className="input-group-custom">
// //                       <FaEnvelope className="input-icon" />
// //                       <Form.Control
// //                         type="email"
// //                         placeholder="Adresse email"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         required
// //                       />
// //                     </div>
// //                   </Form.Group>

// //                   {/* PASSWORD */}
// //                   <Form.Group className="mb-3">
// //                     <div className="input-group-custom">
// //                       <FaLock className="input-icon" />
// //                       <Form.Control
// //                         type={showPassword ? "text" : "password"}
// //                         placeholder="Mot de passe"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                         required
// //                       />
// //                       <span
// //                         className="toggle-password"
// //                         onClick={() => setShowPassword(!showPassword)}
// //                       >
// //                         {showPassword ? <FaEyeSlash /> : <FaEye />}
// //                       </span>
// //                     </div>
// //                   </Form.Group>

// //                   <Button type="submit" className="login-btn w-100">
// //                     Se connecter
// //                   </Button>
// //                 </Form>
// //               </Card.Body>
// //             </Card>

// //             <p className="copyright">
// //               © 2026 Gestion GP Colis USA → Sénégal
// //             </p>
// //           </Col>
// //         </Row>
// //       </Container>
// //     </div>
// //   );
// // }

// // export default Login;




// import { useState, useContext, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Card,
//   Alert,
// } from "react-bootstrap";
// import {
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";
// import logo from "../assets/colis.jpeg";
// import "../styles/Login.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const { login, user, loading } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && user) {
//       navigate("/admin/dashboard");
//     }
//   }, [user, loading, navigate]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const success = login(email, password);

//     if (!success) {
//       setError("Email ou mot de passe incorrect");
//       toast.error("Email ou mot de passe incorrect ❌");
//     } else {
//       setError("");
//       toast.success("Connexion réussie ✅");
//     }
//   };

//   if (loading) {
//     return <div className="loading">Chargement...</div>;
//   }

//   return (
//     <div className="login-page">
//       <Container>
//         <Row className="justify-content-center align-items-center vh-100">
//           <Col md={6} lg={4}>
//             <Card className="login-card shadow-lg">
//               <Card.Body>

//                 {/* HEADER */}
//                 <div className="login-header">
//                   <img
//                     src={logo}
//                     alt="colis"
//                     className="login-logo"
//                   />

//                   <h3>GP Colis USA → Sénégal</h3>

//                   <p>Connectez-vous à votre espace</p>
//                 </div>

//                 {/* ERREUR */}
//                 {error && (
//                   <Alert variant="danger">
//                     {error}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit}>

//                   {/* EMAIL */}
//                   <Form.Group className="mb-3">
//                     <div className="input-group-custom">
//                       <FaEnvelope className="input-icon" />

//                       <Form.Control
//                         type="email"
//                         placeholder="Adresse email"
//                         value={email}
//                         onChange={(e) =>
//                           setEmail(e.target.value)
//                         }
//                         required
//                       />
//                     </div>
//                   </Form.Group>

//                   {/* PASSWORD */}
//                   <Form.Group className="mb-2">
//                     <div className="input-group-custom">
//                       <FaLock className="input-icon" />

//                       <Form.Control
//                         type={
//                           showPassword
//                             ? "text"
//                             : "password"
//                         }
//                         placeholder="Mot de passe"
//                         value={password}
//                         onChange={(e) =>
//                           setPassword(e.target.value)
//                         }
//                         required
//                       />

//                       <span
//                         className="toggle-password"
//                         onClick={() =>
//                           setShowPassword(!showPassword)
//                         }
//                       >
//                         {showPassword ? (
//                           <FaEyeSlash />
//                         ) : (
//                           <FaEye />
//                         )}
//                       </span>
//                     </div>
//                   </Form.Group>

//                   {/* MOT DE PASSE OUBLIE */}
//                   <div className="forgot-password">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         navigate("/forgot-password")
//                       }
//                     >
//                       Mot de passe oublié ?
//                     </button>
//                   </div>

//                   {/* BOUTON CONNEXION */}
//                   <Button
//                     type="submit"
//                     className="login-btn w-100"
//                   >
//                     Se connecter
//                   </Button>
//                 </Form>
//               </Card.Body>
//             </Card>

//             {/* COPYRIGHT */}
//             <p className="copyright">
//               © 2026 Gestion GP Colis USA → Sénégal
//             </p>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Login;




import { useState, useContext, useEffect } from "react";
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
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/colis.jpeg";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirection si déjà connecté
  useEffect(() => {
    if (!loading && user) {
      navigate("/admin/dashboard");
    }
  }, [user, loading, navigate]);

  // Connexion
  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const success = login(email.trim(), password);

    if (!success) {
      setError("Email ou mot de passe incorrect");
      toast.error("Email ou mot de passe incorrect ❌");
      return;
    }

    toast.success("Connexion réussie ✅");
  };

  // Chargement
  if (loading) {
    return (
      <div className="loading">
        Chargement...
      </div>
    );
  }

  return (
    <div className="login-page">

      <Container>

        <Row className="justify-content-center align-items-center vh-100">

          <Col md={6} lg={4}>

            <Card className="login-card shadow-lg">

              <Card.Body>

                {/* ================================
                    HEADER
                ================================= */}

                <div className="login-header">

                  <img
                    src={logo}
                    alt="GP Colis"
                    className="login-logo"
                  />

                  <h3>
                    GP Colis USA → Sénégal
                  </h3>

                  <p>
                    Connectez-vous à votre espace
                  </p>

                </div>

                {/* ================================
                    ERREUR
                ================================= */}

                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>

                  {/* ================================
                      EMAIL
                  ================================= */}

                  <Form.Group className="mb-3">

                    <div className="input-group-custom">

                      <FaEnvelope className="input-icon" />

                      <Form.Control
                        type="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        required
                      />

                    </div>

                  </Form.Group>

                  {/* ================================
                      MOT DE PASSE
                  ================================= */}

                  <Form.Group className="mb-2">

                    <div className="input-group-custom">

                      <FaLock className="input-icon" />

                      <Form.Control
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        required
                      />

                      <span
                        className="toggle-password"
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
                      </span>

                    </div>

                  </Form.Group>

                  {/* ================================
                      MOT DE PASSE OUBLIÉ
                  ================================= */}

                  {/* <div className="forgot-password">

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/forgot-password")
                      }
                    >
                      Mot de passe oublié ?
                    </button>

                  </div> */}

                  {/* ================================
                      BOUTON
                  ================================= */}

                  <Button
                    type="submit"
                    className="login-btn w-100"
                  >
                    Se connecter
                  </Button>

                </Form>

              </Card.Body>

            </Card>

            {/* COPYRIGHT */}

            <p className="copyright">
              © 2026 Gestion GP Colis USA → Sénégal
            </p>

          </Col>

        </Row>

      </Container>

    </div>
  );
}

export default Login;
