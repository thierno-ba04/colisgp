// import React, { useState } from "react";
// import {
//   Container,
//   Table,
//   Button,
//   Modal,
//   Form,
//   Card
// } from "react-bootstrap";
// import {
//   FaPlus,
//   FaTrash,
//   FaEdit,
//   FaPlane
// } from "react-icons/fa";
// import { toast } from "react-toastify";

// function Colis({ colisData, setColisData, onTransit }) {
//   const [showAdd, setShowAdd] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewByVoyage, setViewByVoyage] = useState(false);

//   // Formulaire ajout
//   const [formData, setFormData] = useState({
//     client: "",
//     numero: "",
//     depart: "",
//     destination: "",
//     date: "",
//     poids: "",
//     montant: "",
//     description: "",
//     statut: "En attente"
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   // =====================================================
//   // CHANGEMENT FORMULAIRE AJOUT
//   // =====================================================
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // =====================================================
//   // AJOUTER UN COLIS
//   // =====================================================
//   const handleSubmit = () => {
//     const {
//       client,
//       numero,
//       depart,
//       destination,
//       poids,
//       montant,
//       description,
//       date
//     } = formData;

//     if (
//       !client ||
//       !numero ||
//       !depart ||
//       !destination ||
//       !poids ||
//       !montant ||
//       !description ||
//       !date
//     ) {
//       toast.error("Tous les champs sont requis !");
//       return;
//     }

//     const newColis = {
//       ...formData,
//       id: Date.now(),
//       poids: parseFloat(poids),
//       montant: parseFloat(montant),
//       statut: "En attente"
//     };

//     setColisData((prevColis) => {
//       const updated = [...prevColis, newColis];

//       // Sauvegarde dans localStorage
//       localStorage.setItem("colisData", JSON.stringify(updated));

//       return updated;
//     });

//     // Réinitialisation du formulaire
//     setFormData({
//       client: "",
//       numero: "",
//       depart: "",
//       destination: "",
//       date: "",
//       poids: "",
//       montant: "",
//       description: "",
//       statut: "En attente"
//     });

//     setShowAdd(false);

//     toast.success("Colis ajouté !");
//   };

//   // =====================================================
//   // SUPPRIMER UN COLIS
//   // =====================================================
//   const handleDelete = (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce colis ?")) {
//       return;
//     }

//     setColisData((prevColis) => {
//       const updated = prevColis.filter((colis) => colis.id !== id);

//       // Mise à jour localStorage
//       localStorage.setItem("colisData", JSON.stringify(updated));

//       return updated;
//     });

//     toast.info("Colis supprimé !");
//   };

//   // =====================================================
//   // OUVRIR MODIFICATION
//   // =====================================================
//   const handleEdit = (colis) => {
//     setEditData({
//       ...colis,

//       client: colis.client ?? "",
//       numero: colis.numero ?? "",
//       depart: colis.depart ?? "",
//       destination: colis.destination ?? "",
//       date: colis.date ?? "",
//       poids: colis.poids ?? "",
//       montant: colis.montant ?? "",
//       description: colis.description ?? "",
//       statut: colis.statut ?? "En attente"
//     });

//     setShowEdit(true);
//   };

//   // =====================================================
//   // CHANGEMENT FORMULAIRE MODIFICATION
//   // =====================================================
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;

//     setEditData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // =====================================================
//   // ENREGISTRER LA MODIFICATION
//   // =====================================================
//   const handleEditSubmit = () => {
//     if (!editData || !editData.id) {
//       toast.error("Impossible de modifier ce colis.");
//       return;
//     }

//     // Création du colis modifié
//     const colisModifie = {
//       ...editData,

//       client: editData.client.trim(),
//       numero: editData.numero.trim(),
//       depart: editData.depart.trim(),
//       destination: editData.destination.trim(),
//       date: editData.date,
//       poids: parseFloat(editData.poids),
//       montant: parseFloat(editData.montant),
//       description: editData.description.trim()
//     };

//     // Vérification
//     if (
//       !colisModifie.client ||
//       !colisModifie.numero ||
//       !colisModifie.depart ||
//       !colisModifie.destination ||
//       !colisModifie.date ||
//       !colisModifie.poids ||
//       !colisModifie.montant ||
//       !colisModifie.description
//     ) {
//       toast.error("Tous les champs sont requis !");
//       return;
//     }

//     // =================================================
//     // IMPORTANT :
//     // On utilise la valeur précédente de colisData
//     // afin d'éviter qu'une ancienne valeur écrase
//     // la modification.
//     // =================================================
//     setColisData((prevColis) => {
//       const updatedColis = prevColis.map((colis) => {
//         if (colis.id === colisModifie.id) {
//           return colisModifie;
//         }

//         return colis;
//       });

//       // Sauvegarde immédiate
//       localStorage.setItem(
//         "colisData",
//         JSON.stringify(updatedColis)
//       );

//       return updatedColis;
//     });

//     // Fermer la fenêtre
//     setShowEdit(false);

//     // Nettoyer les données d'édition
//     setEditData(null);

//     toast.success("Colis modifié avec succès !");
//   };

//   // =====================================================
//   // FILTRAGE
//   // =====================================================
//   const filteredColis = colisData.filter((c) =>
//     c.statut === "En attente" &&
//     (
//       String(c.client || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||

//       String(c.numero || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||

//       String(c.destination || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     )
//   );

//   // =====================================================
//   // PAGINATION
//   // =====================================================
//   const totalPages = Math.ceil(
//     filteredColis.length / itemsPerPage
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;

//   const indexOfFirstItem =
//     indexOfLastItem - itemsPerPage;

//   const currentItems = filteredColis.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // =====================================================
//   // VUE PAR TRAJET
//   // =====================================================
//   const grouped = colisData
//     .filter((c) => c.statut === "En attente")
//     .reduce((acc, colis) => {
//       const key = `${colis.depart} ➜ ${colis.destination}`;

//       if (!acc[key]) {
//         acc[key] = [];
//       }

//       acc[key].push(colis);

//       return acc;
//     }, {});

//   // =====================================================
//   // AFFICHAGE
//   // =====================================================
//   return (
//     <Container className="mt-5">

//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-3">

//         <h2 style={{ fontWeight: "700" }}>
//           📦 Gestion des Colis
//         </h2>

//         <div
//           style={{
//             display: "flex",
//             gap: "10px"
//           }}
//         >
//           {!viewByVoyage && (
//             <Button
//               variant="success"
//               onClick={() => setShowAdd(true)}
//             >
//               <FaPlus className="me-1" />
//               Ajouter
//             </Button>
//           )}
//         </div>

//       </div>

//       {!viewByVoyage ? (
//         <>
//           {/* RECHERCHE */}
//           <Form className="mb-3">
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px"
//               }}
//             >
//               <Form.Control
//                 placeholder="Rechercher par client, téléphone ou destination..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//           </Form>

//           {/* TABLE */}
//           <Table
//             responsive
//             hover
//             className="align-middle text-center shadow-sm"
//           >
//             <thead>
//               <tr>
//                 {[
//                   "Client",
//                   "Téléphone",
//                   "Départ",
//                   "Destination",
//                   "Date",
//                   "Poids",
//                   "Montant",
//                   "Description",
//                   "Actions"
//                 ].map((title, index) => (
//                   <th
//                     key={index}
//                     style={{
//                       backgroundColor: "#000",
//                       color: "#fff"
//                     }}
//                   >
//                     {title}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {currentItems.length > 0 ? (
//                 currentItems.map((c) => (
//                   <tr key={c.id}>

//                     <td>{c.client}</td>

//                     <td>{c.numero}</td>

//                     <td>{c.depart}</td>

//                     <td>{c.destination}</td>

//                     <td>{c.date}</td>

//                     <td>{c.poids} kg</td>

//                     <td>{c.montant} $</td>

//                     <td>
//                       {String(c.description || "").length > 30
//                         ? String(c.description).substring(0, 30) + "..."
//                         : c.description}
//                     </td>

//                     <td>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "center",
//                           gap: "10px"
//                         }}
//                       >

//                         {/* MODIFIER */}
//                         <Button
//                           size="sm"
//                           variant="warning"
//                           onClick={() => handleEdit(c)}
//                           title="Modifier"
//                         >
//                           <FaEdit />
//                         </Button>

//                         {/* TRANSIT */}
//                         <Button
//                           size="sm"
//                           variant="success"
//                           onClick={() => onTransit(c.id)}
//                           title="Mettre en transit"
//                         >
//                           <FaPlane />
//                         </Button>

//                         {/* SUPPRIMER */}
//                         <Button
//                           size="sm"
//                           variant="danger"
//                           onClick={() => handleDelete(c.id)}
//                           title="Supprimer"
//                         >
//                           <FaTrash />
//                         </Button>

//                       </div>
//                     </td>

//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="9">
//                     Aucun colis trouvé
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>

//           {/* PAGINATION */}
//           {totalPages > 1 && (
//             <div className="d-flex justify-content-center gap-2 my-3">

//               {Array.from(
//                 { length: totalPages },
//                 (_, i) => i + 1
//               ).map((page) => (
//                 <Button
//                   key={page}
//                   size="sm"
//                   variant={
//                     currentPage === page
//                       ? "dark"
//                       : "outline-dark"
//                   }
//                   onClick={() =>
//                     handlePageChange(page)
//                   }
//                 >
//                   {page}
//                 </Button>
//               ))}

//             </div>
//           )}
//         </>
//       ) : (

//         /* =================================================
//            VUE PAR TRAJET
//         ================================================= */
//         Object.entries(grouped).map(
//           ([trajet, list], i) => (
//             <Card
//               key={i}
//               className="mb-4 shadow-sm"
//             >

//               <Card.Header
//                 style={{
//                   background: "#000",
//                   color: "#fff"
//                 }}
//               >
//                 <strong>
//                   {trajet} ({list.length})
//                 </strong>
//               </Card.Header>

//               <Card.Body>

//                 {list.map((c) => (
//                   <div
//                     key={c.id}
//                     style={{
//                       borderBottom: "1px solid #eee",
//                       padding: "10px 0"
//                     }}
//                   >

//                     <p>
//                       <strong>Client:</strong>{" "}
//                       {c.client}
//                     </p>

//                     <p>
//                       <strong>Téléphone:</strong>{" "}
//                       {c.numero}
//                     </p>

//                     <p>
//                       <strong>Date:</strong>{" "}
//                       {c.date}
//                     </p>

//                     <p>
//                       <strong>Poids:</strong>{" "}
//                       {c.poids} kg
//                     </p>

//                     <p>
//                       <strong>Montant:</strong>{" "}
//                       {c.montant} $
//                     </p>

//                     <p>
//                       <strong>Statut:</strong>{" "}
//                       {c.statut}
//                     </p>

//                   </div>
//                 ))}

//               </Card.Body>

//             </Card>
//           )
//         )
//       )}

//       {/* =================================================
//           MODAL AJOUT
//       ================================================= */}
//       <Modal
//         show={showAdd}
//         onHide={() => setShowAdd(false)}
//         centered
//       >

//         <Modal.Header
//           closeButton
//           style={{
//             background: "#000",
//             color: "#fff"
//           }}
//         >
//           <Modal.Title>
//             Ajouter un colis
//           </Modal.Title>
//         </Modal.Header>

//         <Modal.Body>

//           <Form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubmit();
//             }}
//           >

//             {[
//               "client",
//               "numero",
//               "depart",
//               "destination",
//               "date",
//               "poids",
//               "montant",
//               "description"
//             ].map((field, i) => (

//               <Form.Group
//                 className="mb-3"
//                 key={i}
//               >

//                 <Form.Label>
//                   {field.charAt(0).toUpperCase() +
//                     field.slice(1)}
//                 </Form.Label>

//                 <Form.Control
//                   type={
//                     field === "date"
//                       ? "date"
//                       : field === "poids" ||
//                         field === "montant"
//                       ? "number"
//                       : "text"
//                   }
//                   placeholder={`Entrer ${field}`}
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   required
//                   as={
//                     field === "description"
//                       ? "textarea"
//                       : undefined
//                   }
//                   rows={
//                     field === "description"
//                       ? 3
//                       : undefined
//                   }
//                 />

//               </Form.Group>

//             ))}

//             <div className="text-end">

//               <Button
//                 type="submit"
//                 variant="success"
//               >
//                 Ajouter
//               </Button>

//             </div>

//           </Form>

//         </Modal.Body>

//       </Modal>

//       {/* =================================================
//           MODAL MODIFICATION
//       ================================================= */}
//       <Modal
//         show={showEdit}
//         onHide={() => {
//           setShowEdit(false);
//           setEditData(null);
//         }}
//         centered
//       >

//         <Modal.Header
//           closeButton
//           style={{
//             background: "#000",
//             color: "#fff"
//           }}
//         >
//           <Modal.Title>
//             Modifier le colis
//           </Modal.Title>
//         </Modal.Header>

//         <Modal.Body>

//           {editData && (
//             <Form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleEditSubmit();
//               }}
//             >

//               {[
//                 "client",
//                 "numero",
//                 "depart",
//                 "destination",
//                 "date",
//                 "poids",
//                 "montant",
//                 "description"
//               ].map((field, i) => (

//                 <Form.Group
//                   className="mb-3"
//                   key={i}
//                 >

//                   <Form.Label>
//                     {field.charAt(0).toUpperCase() +
//                       field.slice(1)}
//                   </Form.Label>

//                   <Form.Control
//                     type={
//                       field === "date"
//                         ? "date"
//                         : field === "poids" ||
//                           field === "montant"
//                         ? "number"
//                         : "text"
//                     }
//                     placeholder={`Entrer ${field}`}
//                     name={field}

//                     /* IMPORTANT :
//                        La valeur vient directement
//                        de editData
//                     */
//                     value={editData[field] ?? ""}

//                     onChange={handleEditChange}

//                     required

//                     as={
//                       field === "description"
//                         ? "textarea"
//                         : undefined
//                     }

//                     rows={
//                       field === "description"
//                         ? 3
//                         : undefined
//                     }
//                   />

//                 </Form.Group>

//               ))}

//               <div className="text-end">

//                 <Button
//                   type="submit"
//                   variant="warning"
//                 >
//                   Enregistrer
//                 </Button>

//               </div>

//             </Form>
//           )}

//         </Modal.Body>

//       </Modal>

//     </Container>
//   );
// }

// export default Colis;


import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Card
} from "react-bootstrap";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaPlane
} from "react-icons/fa";
import { toast } from "react-toastify";

function Colis({ colisData, setColisData, onTransit }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewByVoyage, setViewByVoyage] = useState(false);

  // =====================================================
  // FORMULAIRE AJOUT
  // =====================================================
  const [formData, setFormData] = useState({
    client: "",
    numero: "",
    depart: "",
    destination: "",
    date: "",
    poids: "",
    montant: "",
    description: "",
    statut: "En attente"
  });

  // =====================================================
  // PAGINATION
  // =====================================================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // =====================================================
  // CHANGEMENT FORMULAIRE AJOUT
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =====================================================
  // AJOUTER UN COLIS
  // =====================================================
  const handleSubmit = () => {
    const {
      client,
      numero,
      depart,
      destination,
      poids,
      montant,
      description,
      date
    } = formData;

    if (
      !client ||
      !numero ||
      !depart ||
      !destination ||
      !poids ||
      !montant ||
      !description ||
      !date
    ) {
      toast.error("Tous les champs sont requis !");
      return;
    }

    const newColis = {
      ...formData,
      id: Date.now(),
      poids: parseFloat(poids),
      montant: parseFloat(montant),
      statut: "En attente"
    };

    setColisData((prevColis) => {
      const updated = [...prevColis, newColis];

      localStorage.setItem(
        "colisData",
        JSON.stringify(updated)
      );

      return updated;
    });

    // Réinitialiser le formulaire
    setFormData({
      client: "",
      numero: "",
      depart: "",
      destination: "",
      date: "",
      poids: "",
      montant: "",
      description: "",
      statut: "En attente"
    });

    setShowAdd(false);

    toast.success("Colis ajouté !");
  };

  // =====================================================
  // SUPPRIMER UN COLIS
  // =====================================================
  const handleDelete = (id) => {
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer ce colis ?"
      )
    ) {
      return;
    }

    setColisData((prevColis) => {
      const updated = prevColis.filter(
        (colis) => colis.id !== id
      );

      localStorage.setItem(
        "colisData",
        JSON.stringify(updated)
      );

      return updated;
    });

    toast.info("Colis supprimé !");
  };

  // =====================================================
  // OUVRIR MODIFICATION
  // =====================================================
  const handleEdit = (colis) => {
    setEditData({
      ...colis,
      client: colis.client ?? "",
      numero: colis.numero ?? "",
      depart: colis.depart ?? "",
      destination: colis.destination ?? "",
      date: colis.date ?? "",
      poids: colis.poids ?? "",
      montant: colis.montant ?? "",
      description: colis.description ?? "",
      statut: colis.statut ?? "En attente"
    });

    setShowEdit(true);
  };

  // =====================================================
  // CHANGEMENT FORMULAIRE MODIFICATION
  // =====================================================
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =====================================================
  // ENREGISTRER LA MODIFICATION
  // =====================================================
  const handleEditSubmit = () => {
    if (!editData || !editData.id) {
      toast.error("Impossible de modifier ce colis !");
      return;
    }

    const colisModifie = {
      ...editData,

      client: editData.client.trim(),
      numero: editData.numero.trim(),
      depart: editData.depart.trim(),
      destination: editData.destination.trim(),
      date: editData.date,
      poids: parseFloat(editData.poids),
      montant: parseFloat(editData.montant),
      description: editData.description.trim()
    };

    // Vérification des champs
    if (
      !colisModifie.client ||
      !colisModifie.numero ||
      !colisModifie.depart ||
      !colisModifie.destination ||
      !colisModifie.date ||
      !colisModifie.poids ||
      !colisModifie.montant ||
      !colisModifie.description
    ) {
      toast.error("Tous les champs sont requis !");
      return;
    }

    // Mise à jour du colis
    setColisData((prevColis) => {
      const updatedColis = prevColis.map((colis) =>
        colis.id === colisModifie.id
          ? colisModifie
          : colis
      );

      // Sauvegarde dans localStorage
      localStorage.setItem(
        "colisData",
        JSON.stringify(updatedColis)
      );

      return updatedColis;
    });

    // Fermer le modal
    setShowEdit(false);
    setEditData(null);

    // =================================================
    // TOAST
    // Après 2 secondes, lorsque le toast disparaît,
    // les données sont relues automatiquement.
    // =================================================
    toast.success("Colis modifié avec succès !", {
      autoClose: 2000,

      onClose: () => {
        const data = localStorage.getItem("colisData");

        if (data) {
          try {
            const updatedData = JSON.parse(data);

            setColisData(updatedData);
          } catch (error) {
            console.error(
              "Erreur lors du rechargement des colis :",
              error
            );
          }
        }
      }
    });
  };

  // =====================================================
  // RECHERCHE
  // =====================================================
  const filteredColis = colisData.filter((c) => {
    const client = String(c.client || "").toLowerCase();
    const numero = String(c.numero || "").toLowerCase();
    const destination = String(
      c.destination || ""
    ).toLowerCase();

    const search = searchTerm.toLowerCase();

    return (
      c.statut === "En attente" &&
      (
        client.includes(search) ||
        numero.includes(search) ||
        destination.includes(search)
      )
    );
  });

  // =====================================================
  // PAGINATION
  // =====================================================
  const totalPages = Math.ceil(
    filteredColis.length / itemsPerPage
  );

  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentItems = filteredColis.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =====================================================
  // VUE PAR TRAJET
  // =====================================================
  const grouped = colisData
    .filter((c) => c.statut === "En attente")
    .reduce((acc, colis) => {
      const key = `${colis.depart} ➜ ${colis.destination}`;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(colis);

      return acc;
    }, {});

  // =====================================================
  // AFFICHAGE
  // =====================================================
  return (
    <Container className="mt-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <h2 style={{ fontWeight: "700" }}>
          📦 Gestion des Colis
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >
          {!viewByVoyage && (
            <Button
              variant="success"
              onClick={() => setShowAdd(true)}
            >
              <FaPlus className="me-1" />
              Ajouter
            </Button>
          )}
        </div>

      </div>

      {!viewByVoyage ? (
        <>
          {/* RECHERCHE */}
          <Form className="mb-3">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <Form.Control
                placeholder="Rechercher par client, téléphone ou destination..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </Form>

          {/* TABLE */}
          <Table
            responsive
            hover
            className="align-middle text-center shadow-sm"
          >
            <thead>
              <tr>
                {[
                  "Client",
                  "Téléphone",
                  "Départ",
                  "Destination",
                  "Date",
                  "Poids",
                  "Montant",
                  "Description",
                  "Actions"
                ].map((title, index) => (
                  <th
                    key={index}
                    style={{
                      backgroundColor: "#000",
                      color: "#fff"
                    }}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((c) => (
                  <tr key={c.id}>

                    <td>{c.client}</td>

                    <td>{c.numero}</td>

                    <td>{c.depart}</td>

                    <td>{c.destination}</td>

                    <td>{c.date}</td>

                    <td>{c.poids} kg</td>

                    <td>{c.montant} $</td>

                    <td>
                      {String(c.description || "").length > 30
                        ? String(c.description).substring(0, 30) + "..."
                        : c.description}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px"
                        }}
                      >

                        {/* MODIFIER */}
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleEdit(c)}
                          title="Modifier"
                        >
                          <FaEdit />
                        </Button>

                        {/* TRANSIT */}
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => onTransit(c.id)}
                          title="Mettre en transit"
                        >
                          <FaPlane />
                        </Button>

                        {/* SUPPRIMER */}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            handleDelete(c.id)
                          }
                          title="Supprimer"
                        >
                          <FaTrash />
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    Aucun colis trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 my-3">

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={
                    currentPage === page
                      ? "dark"
                      : "outline-dark"
                  }
                  onClick={() =>
                    handlePageChange(page)
                  }
                >
                  {page}
                </Button>
              ))}

            </div>
          )}
        </>
      ) : (

        /* =================================================
           VUE PAR TRAJET
        ================================================= */
        Object.entries(grouped).map(
          ([trajet, list], i) => (
            <Card
              key={i}
              className="mb-4 shadow-sm"
            >

              <Card.Header
                style={{
                  background: "#000",
                  color: "#fff"
                }}
              >
                <strong>
                  {trajet} ({list.length})
                </strong>
              </Card.Header>

              <Card.Body>

                {list.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "10px 0"
                    }}
                  >

                    <p>
                      <strong>Client:</strong>{" "}
                      {c.client}
                    </p>

                    <p>
                      <strong>Téléphone:</strong>{" "}
                      {c.numero}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {c.date}
                    </p>

                    <p>
                      <strong>Poids:</strong>{" "}
                      {c.poids} kg
                    </p>

                    <p>
                      <strong>Montant:</strong>{" "}
                      {c.montant} $
                    </p>

                    <p>
                      <strong>Statut:</strong>{" "}
                      {c.statut}
                    </p>

                  </div>
                ))}

              </Card.Body>

            </Card>
          )
        )
      )}

      {/* =================================================
          MODAL AJOUT
      ================================================= */}
      <Modal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        centered
      >

        <Modal.Header
          closeButton
          style={{
            background: "#000",
            color: "#fff"
          }}
        >
          <Modal.Title>
            Ajouter un colis
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >

            {[
              "client",
              "numero",
              "depart",
              "destination",
              "date",
              "poids",
              "montant",
              "description"
            ].map((field, i) => (

              <Form.Group
                className="mb-3"
                key={i}
              >

                <Form.Label>
                  {field.charAt(0).toUpperCase() +
                    field.slice(1)}
                </Form.Label>

                <Form.Control
                  type={
                    field === "date"
                      ? "date"
                      : field === "poids" ||
                        field === "montant"
                      ? "number"
                      : "text"
                  }
                  placeholder={`Entrer ${field}`}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  as={
                    field === "description"
                      ? "textarea"
                      : undefined
                  }
                  rows={
                    field === "description"
                      ? 3
                      : undefined
                  }
                />

              </Form.Group>

            ))}

            <div className="text-end">

              <Button
                type="submit"
                variant="success"
              >
                Ajouter
              </Button>

            </div>

          </Form>

        </Modal.Body>

      </Modal>

      {/* =================================================
          MODAL MODIFICATION
      ================================================= */}
      <Modal
        show={showEdit}
        onHide={() => {
          setShowEdit(false);
          setEditData(null);
        }}
        centered
      >

        <Modal.Header
          closeButton
          style={{
            background: "#000",
            color: "#fff"
          }}
        >
          <Modal.Title>
            Modifier le colis
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {editData && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >

              {[
                "client",
                "numero",
                "depart",
                "destination",
                "date",
                "poids",
                "montant",
                "description"
              ].map((field, i) => (

                <Form.Group
                  className="mb-3"
                  key={i}
                >

                  <Form.Label>
                    {field.charAt(0).toUpperCase() +
                      field.slice(1)}
                  </Form.Label>

                  <Form.Control
                    type={
                      field === "date"
                        ? "date"
                        : field === "poids" ||
                          field === "montant"
                        ? "number"
                        : "text"
                    }
                    placeholder={`Entrer ${field}`}
                    name={field}
                    value={editData[field] ?? ""}
                    onChange={handleEditChange}
                    required
                    as={
                      field === "description"
                        ? "textarea"
                        : undefined
                    }
                    rows={
                      field === "description"
                        ? 3
                        : undefined
                    }
                  />

                </Form.Group>

              ))}

              <div className="text-end">

                <Button
                  type="submit"
                  variant="warning"
                >
                  Enregistrer
                </Button>

              </div>

            </Form>
          )}

        </Modal.Body>

      </Modal>

    </Container>
  );
}

export default Colis;