"use client";

import React, { useState, useEffect } from "react";
import { CSSProperties } from "react";
import { FaEye, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
// import NuevoCurso from "./CrearCurso";
import CourseCatalog2 from "./createCourse";
import AssignDepartmentModal from "./courseByDepartment"; // Asegúrate de que la ruta es correcta
import { motion } from "framer-motion";
import { Card, Dialog } from "@material-tailwind/react";

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



function CourseCatalog() {
  const [formatJson, setFormatJson] = useState<CourseJson[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<CourseJson | null>(null);
  const [editCourse, setEditCourse] = useState<CourseJson | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);


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
          "http://api-site-cursos.172.16.15.30.sslip.io/cursosPresenciales"
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
        "http://api-site-intelisis.172.16.15.30.sslip.io/api/departments"
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
        "http://api-site-cursos.172.16.15.30.sslip.io/actualizarCurso",
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
        "http://api-site-cursos.172.16.15.30.sslip.io/eliminarCurso",
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
        
{...({} as any)}
      >
        <div style={styles.container}>
          <h1
            style={styles.heading}
            className="text-3xl font-bold text-center mb-6 "
          >
            Cursos
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por título o descripción"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full md:w-2/3 px-4 py-2 rounded-lg bg-white/70 backdrop-blur border border-gray-300 text-blue-gray-800 placeholder:text-blue-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              onClick={handleAddCourse}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
              title="Agregar nuevo curso"
            >
              <FaPlus />
              <span className="hidden sm:inline">Agregar Curso</span>
            </button>
          </div>

          {/* Tabla de cursos */}
          <div className="mt-6 w-full space-y-4">
            <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/60 rounded-lg font-semibold text-blue-gray-900 backdrop-blur-md shadow">
              <span>Título</span>
              <span>Descripción</span>
              <span>Impartido por</span>
              <span className="text-center">Acciones</span>
            </div>

            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.id_course}
                  className="grid grid-cols-4 gap-4 items-center px-4 py-3 bg-white/40 rounded-lg text-blue-gray-800 backdrop-blur-lg hover:bg-white/60 transition-all"
                >
                  <span>{course.title}</span>
                  <span>{course.description}</span>
                  <span>{course.tutor}</span>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenDialog(course)}
                      className="p-2 rounded-full bg-white/30 hover:bg-white/70 transition border border-black/10"
                      title="Ver curso"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenEditDialog(course)}
                      className="p-2 rounded-full bg-white/30 hover:bg-white/70 transition border border-black/10"
                      title="Editar curso"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course)}
                      className="p-2 rounded-full bg-white/30 hover:bg-white/70 transition border border-black/10"
                      title="Eliminar curso"
                    >
                      <FaTrash size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenAssignModal(course)}
                      className="p-2 rounded-full bg-green-500/80 hover:bg-green-600 text-white transition"
                      title="Asignar Departamento"
                    >
                      <FaPlus size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 mt-4">No se encontraron cursos.</div>
            )}
          </div>


          {/* Fondo borroso y diálogo para ver la información del curso */}
          <Dialog
            open={isDialogOpen}
            handler={handleCloseDialog}
            size="md"
{...({} as any)}
          >
            <div className="p-6 bg-white rounded-xl  w-full ">
              <h2 className="text-xl font-bold text-gray-800">
                Detalles del Curso
              </h2>

              <p className="mt-4">
                <strong>Título:</strong> {selectedCourse?.title}
              </p>
              <p className="mt-2">
                <strong>Descripción:</strong> {selectedCourse?.description}
              </p>
              <p className="mt-2">
                <strong>Impartido por:</strong> {selectedCourse?.tutor}
              </p>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleCloseDialog}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Dialog>

          <Dialog
            open={isEditDialogOpen}
            handler={handleCloseEditDialog}
            size="md"
{...({} as any)}
          >
            <div className="p-6 bg-white rounded-xl shadow-lg w-full ">
              <h2 className="text-xl font-bold text-gray-800">Editar Curso</h2>

              <div className="space-y-3 mt-4">
                <div>
                  <label className="block text-gray-700">Título</label>
                  <input
                    type="text"
                    value={editCourse?.title}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse!,
                        title: e.target.value,
                      } as CourseJson)
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Descripción</label>
                  <textarea
                    value={editCourse?.description}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse!,
                        description: e.target.value,
                      } as CourseJson)
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Tutor</label>
                  <input
                    type="text"
                    value={editCourse?.tutor}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse!,
                        tutor: e.target.value,
                      } as CourseJson)
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
          </Dialog>
        </div>
        <Dialog
          open={isModalOpen}
          handler={handleCloseModal}
          size="lg"
          {...({} as any)}
        >
          <div style={styles.modalContainer}>
            <div style={styles.modal}>
              <CourseCatalog2 onAddCourse={handleNewCourse} onClose={handleCloseModal}/>
              <button onClick={handleCloseModal} style={styles.closeButton}>
                Cerrar
              </button>
            </div>
            <div style={styles.overlay}></div>
          </div>
        </Dialog>

        <Dialog
          open={isAssignModalOpen}
          handler={handleCloseAssignModal}
          size="lg"
{...({} as any)}
        >
          <AssignDepartmentModal
            course={{
              id_course: selectedCourse?.id_course || 0,
              title: selectedCourse?.title || "",
            }}
            onClose={handleCloseAssignModal}
            onAssign={(course, department) =>
              handleAssignDepartment(
                {
                  id_course: selectedCourse?.id_course || 0,
                  title: selectedCourse?.title || "",
                  description: selectedCourse?.description || "",
                  tutor: selectedCourse?.tutor || "",
                  status: selectedCourse?.status || "",
                },
                department
              )
            }
            departments={departments} // 🔹 PASAMOS LOS DEPARTAMENTOS
          />
        </Dialog>
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
    borderCollapse: "separate",
    borderSpacing: "0 12px",
  },
  th: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "12px",
    borderBottom: "1px solid #ccc",
    textAlign: "left",
    fontWeight: 600,
    color: "#333",
    backdropFilter: "blur(6px)",
  },
  td: {
    padding: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(4px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "8px",
    color: "#333",
  },
  noResults: {
    textAlign: "center",
    padding: "20px",
    color: "#888",
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "50%",
    padding: "8px",
    margin: "0 4px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(4px)",
    color: "#333",
  },
  actionButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    transform: "scale(1.1)",
  },
  
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
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
};

export default CourseCatalog;
