"use client";

import React, { useState, useEffect } from "react";
import { CSSProperties } from "react";
import { FaEye, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
// import NuevoCurso from "./CrearCurso";
import CourseCatalog2 from "./CrearCurso";
import AssignDepartmentModal from "./Department"; // Asegúrate de que la ruta es correcta
import { motion } from "framer-motion";
import { Card } from "@material-tailwind/react";

interface CourseJson {
  id_course: number;
  title: string;
  description: string;
  tutor: string;
  status: String;
}

interface Course {
  id_course: number;
  title: string;
  description: string;
  tutor: string;
  status: string;
}

interface AssignDepartmentModalProps {
  course: { id_course: number; title: string };
  onClose: () => void;
  onAssign: (course: { id_course: number; title: string }, department: string) => void;
  departments: string[];
}

function CourseCatalog() {
  const [formatJson, setFormatJson] = useState<CourseJson[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<CourseJson | null>(null);
  const [editCourse, setEditCourse] = useState<CourseJson | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [usersByDepartment, setUsersByDepartment] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCourse = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = async () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchCursosPresenciales = await fetch(
          "http://api-cursos.192.168.29.40.sslip.io/cursosPresenciales"
        );

        if (!fetchCursosPresenciales.ok) {
          throw new Error("Error al obtener los cursos");
        }
        const cursosPresenciales: CourseJson[] =
          await fetchCursosPresenciales.json();

        setFormatJson(cursosPresenciales);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        "http://api-site-intelisis.192.168.29.40.sslip.io/api/departments"
      );
      const data = await response.json();

      console.log("Departamentos obtenidos:", data); // Verifica en la consola

      if (Array.isArray(data)) {
        setDepartments(data);
      } else {
        console.error("La API no devolvió un array:", data);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // const fetchUsersByDepartment = async (department: string) => {
  //   try {
  //       const response = await fetch(`http://tu-api.com/api/users/by-department?department=${department}`); // Ajusta la URL
  //       const data = await response.json();
  //       setUsersByDepartment(data[department] || []); // Accede al array del departamento específico
  //   } catch (error) {
  //       console.error("Error al obtener usuarios del departamento:", error);
  //   }
  // };

  // Cargar departamentos al montar el componente

  const handleAssignDepartment = (course: CourseJson, department: string) => {
    console.log(
      `Asignado curso: ${course.title} al departamento: ${department}`
    );
  };

  const filteredCourses = formatJson.filter((course) => {
    // Asegúrate de que `fullname` y `description` sean cadenas de texto
    const fullname = course.title || ""; // Si no existe, asigna una cadena vacía
    const description = course.description || ""; // Si no existe, asigna una cadena vacía

    // Asegúrate de que `searchTerm` sea una cadena válida
    const term = searchTerm || ""; // Si searchTerm es undefined, usa una cadena vacía

    const matchesSearchTerm =
      fullname.toLowerCase().includes(term.toLowerCase()) ||
      description.toLowerCase().includes(term.toLowerCase());

    return matchesSearchTerm;
  });

  const handleOpenDialog = (course: CourseJson) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleOpenEditDialog = (course: CourseJson) => {
    console.log("los datos que llegan son", course);
    setEditCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditCourse(null);
  };

  const sendDatabase = async (edit: CourseJson) => {
    console.log(
      "Datos enviados:",
      edit.id_course,
      edit.title,
      edit.description,
      edit.tutor
    );

    try {
      const response = await fetch(
        "http://api-cursos.192.168.29.40.sslip.io/actualizarCurso",
        {
          method: "POST", // Método HTTP
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit),
        }
      );

      if (!response.ok) {
        // Manejar errores del servidor
        const error = await response.text();
        console.error("Error en la solicitud:", error);
        return;
      }

      const data = await response.json(); // Convertir respuesta a JSON
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error en el POST:", error); // Manejar errores de red u otros
    }
  };

  const handleSaveEdit = () => {
    if (editCourse) {
      console.log("edit course", editCourse);

      console.log("id", editCourse.id_course);

      setFormatJson((prevCourses) =>
        prevCourses.map((course) =>
          course.id_course === editCourse.id_course ? editCourse : course
        )
      );

      sendDatabase(editCourse);
    }
    handleCloseEditDialog();
  };

  const handleDeleteDatabase = async (delet: CourseJson) => {
    try {
      const response = await fetch(
        "http://api-cursos.192.168.29.40.sslip.io/eliminarCurso",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(delet),
        }
      );
      if (!response.ok) {
        // Manejar errores del servidor
        const error = await response.text();
        console.error("Error en la solicitud:", error);
        return;
      }

      const data = await response.json(); // Convertir respuesta a JSON
      console.log("Respuesta del servidor:", data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleNewCourse = (course: CourseJson) => {
    // Aquí maneja la lógica para agregar el nuevo curso
    console.log("Nuevo curso recibido:", course);

    setFormatJson((prevCourses) => [...prevCourses, course]);
  };

  const handleDeleteCourse = (course: CourseJson) => {
    console.log(course.id_course);
    setFormatJson((prevCourses) =>
      prevCourses.filter((c) => c.id_course !== course.id_course)
    );
    handleDeleteDatabase(course);
  };

  const handleOpenAssignModal = (course: CourseJson) => {
    setSelectedCourse(course);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedCourse(null);
    setUsersByDepartment([]); 
  };

  const getStatusStyle = (endDate: string) => {
    const today = new Date();
    const expirationDate = new Date(endDate);
    const timeDiff = expirationDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return styles.expired; // Curso expirado
    } else if (daysDiff <= 7 && daysDiff >= 0) {
      return styles.aboutToExpire; // Curso próximo a expirar (en 7 días o menos)
    } else {
      return styles.active; // Curso vigente
    }
  };

  return (
    <div className="relative w-full h-auto flex items-top justify-center mt-40">
      <motion.video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        style={{ opacity: 0.5 }} // Ajusta el valor según sea necesario
      >
        <source src="/image/background.mp4" type="video/mp4" />
      </motion.video>

      <Card 
        className="p-8 shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl w-3/4" 
        placeholder="" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}}>
      <div style={styles.container}>
        <h1 style={styles.heading} className="text-3xl font-bold text-center mb-6 ">Cursos</h1>
        <div style={styles.addButtonContainer}>
          <button
            onClick={handleAddCourse}
            style={{ ...styles.addButton, marginRight: "20px" }}
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Agregar Curso
          </button>
          <div style={{ display: "flex", width: "100%" }}>
            <input
              type="text"
              placeholder="Buscar por título o descripción"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ ...styles.input, marginRight: "20px" }}
            />
          </div>
        </div>
        {/* Barra de búsqueda */}

        {/* Tabla de cursos */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>impartido por</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <tr
                  key={
                    course.id_course
                      ? course.id_course
                      : `${index}-${course.id_course}`
                  }
                >
                  <td style={styles.td}>{course.title}</td>
                  <td style={styles.td}>{course.description}</td>
                  <td style={styles.td}>{course.tutor}</td>
                  <td style={{ ...styles.td, width: "240px" }}>
                    <button
                      onClick={() => handleOpenDialog(course)}
                      style={styles.viewButton}
                    >
                      <FaEye /> Ver
                    </button>
                    <button
                      onClick={() => handleOpenEditDialog(course)}
                      style={styles.editButton}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course)}
                      style={styles.button}
                    >
                      <FaTrash /> Eliminar
                    </button>
                    <button
                      onClick={() => handleOpenAssignModal(course)}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Asignar Departamento
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={styles.noResults}>
                  No se encontraron cursos.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Fondo borroso y diálogo para ver la información del curso */}
        {selectedCourse && isDialogOpen && (
          <div>
            <div style={styles.blurBackground}></div>
            <div style={styles.dialog}>
              <h2>Detalles del Curso</h2>
              <p>
                <strong>Título:</strong> {selectedCourse.title}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedCourse.description}
              </p>
              <p>
                <strong>Impartido por:</strong>
                {selectedCourse.tutor}
              </p>

              <button onClick={handleCloseDialog} style={styles.closeButton}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Fondo borroso y diálogo para editar la información del curso */}
        {editCourse && isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Editar Curso</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700">Título</label>
                  <input
                    type="text"
                    value={editCourse.title}
                    onChange={(e) =>
                      setEditCourse({ ...editCourse, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Descripción</label>
                  <textarea
                    value={editCourse.description}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Tutor</label>
                  <input
                    type="text"
                    value={editCourse.tutor}
                    onChange={(e) =>
                      setEditCourse({ ...editCourse, tutor: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={handleCloseEditDialog}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div style={styles.modalContainer}>
          <div style={styles.modal}>
            <CourseCatalog2 onAddCourse={handleNewCourse} />
            <button onClick={handleCloseModal} style={styles.closeButton}>
              Cerrar
            </button>
          </div>
          <div style={styles.overlay}></div>
        </div>
      )}

      {isAssignModalOpen && selectedCourse && (
        <AssignDepartmentModal
          course={{
            id_course: selectedCourse.id_course,
            title: selectedCourse.title,
          }} 
          onClose={handleCloseAssignModal}
          onAssign={(course, department) =>
            handleAssignDepartment(
              { 
                id_course: selectedCourse.id_course, 
                title: selectedCourse.title, 
                description: selectedCourse.description, 
                tutor: selectedCourse.tutor, 
                status: selectedCourse.status 
              },
              department
            )
          }
          departments={departments} // 🔹 PASAMOS LOS DEPARTAMENTOS
        />
      )}
      </Card>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    width: "90%",
    margin: "auto",
    fontFamily: "Roboto, sans-serif",
    color: "#333",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  addButtonContainer: {
    display: "flex",
    marginBottom: "20px",
  },
  addButton: {
    display: "flex", // Flexbox dentro del botón para alinear el icono y texto
    alignItems: "center", // Centra el icono y el texto verticalmente
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  input: {
    width: "70%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  select: {
    width: "25%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontWeight: "bold",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  noResults: {
    textAlign: "center",
    padding: "20px",
    color: "#888",
  },
  viewButton: {
    margin: "0 5px",
    padding: "5px 10px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editButton: {
    margin: "0 5px",
    padding: "5px 10px",
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  button: {
    margin: "0 5px",
    padding: "5px 10px",

    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  dialog: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    zIndex: 1000,
  },
  blurBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(5px)", // Aplicamos el filtro de desenfoque aquí
    zIndex: 999, // Asegura que el fondo borroso esté detrás del diálogo
  },
  closeButton: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    marginTop: "10px",
  },
  modalContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "60%",
    textAlign: "center",
  },
  expired: { backgroundColor: "#ffcccc" }, // Estilo para cursos expirados
  aboutToExpire: { backgroundColor: "#fff3cd" }, // Estilo para cursos próximos a expirar
  active: { backgroundColor: "#ccffcc" }, // Estilo para cursos vigentes
};

export default CourseCatalog;
