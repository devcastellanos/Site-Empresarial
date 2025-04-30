"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Input,
  Progress,
  Slider,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import sweetAlert from "sweetalert2";
import { motion, useScroll, useTransform } from "framer-motion";
import Swal from "sweetalert2";
import { Combobox } from "@headlessui/react";

import { User, CursoTomado, CursosPresencialesJson } from "@/lib/interfaces";
// Ajusta la ruta según tu estructura de archivos

const Kardex = () => {
  const { isAuthenticated } = useAuth();

  const [users, setUsers] = useState<User[]>([]);

  const [newCourseId, setNewCourseId] = useState<number | "">(""); // For selected course from the dropdown
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [newProgress, setNewProgress] = useState<number>(0);

  const [dialogInfo, setDialogInfo] = useState<{
    course: CursoTomado;
    isOpen: boolean;
  }>({
    course: {
      id: 0,
      id_course: 0,
      id_usuario: 0,
      title: "",
      description: "",
      tutor: "",
      progress: "",
      status: "",
      start_date: "",
    },
    isOpen: false,
  });
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CursosPresencialesJson | null>(null);
  const [cursosTomados, setCursosTomados] = useState<CursoTomado[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CursoTomado[]>([]);
  const [query, setQuery] = useState("");
  const [cursosPresenciales, setCursosPresenciales] = useState<
    CursosPresencialesJson[]
  >([]);

  const filteredCourses =
    query === ""
      ? cursosPresenciales
      : cursosPresenciales.filter((course) =>
          course.title.toLowerCase().includes(query.toLowerCase())
        );

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://api-site-intelisis.172.16.15.30.sslip.io/api/users/all"
      );
      const data = await response.json();
      setUsers(
        data.map((user: any) => ({
          ...user,
          Personal: Number(user.Personal), // Asegurar que `Personal` es un número
        }))
      );

      const datacourse = await fetch(
        "http://api-site-cursos.172.16.15.30.sslip.io/cursostomados"
      );
      setCursosTomados(await datacourse.json());

      const fetchCursosPresenciales = await fetch(
        "http://api-site-cursos.172.16.15.30.sslip.io/cursosPresenciales"
      );
      if (!fetchCursosPresenciales.ok) {
        throw new Error("Network response was not ok");
      }
      setCursosPresenciales(await fetchCursosPresenciales.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddCourse = async () => {
    try {
      const selectedCourse = cursosPresenciales.find(
        (course) => course.id_course === newCourseId
      );      
      if ( startDate === ""){
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La fecha de impartición es requerida.",
        });
        return;
      }
      if (selectedCourse) {
        const newCourse = {
          id_course: selectedCourse.id_course,
          id_usuario: selectedUserId as number,
          progress: newProgress.toString(),
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        };

        console.log("Nuevo curso:", newCourse);

        const response = await fetch(
          "http://api-site-cursos.172.16.15.30.sslip.io/agregarCursoTomado",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newCourse),
          }
        );

        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }

        const result = await response.json();
        
        Swal.fire({
          icon: "success",
          title: "Curso agregado con éxito",
          text: `El curso ${selectedCourse.title} se ha añadido al kardex.`,
        });

        setSelectedCourses((prevCourses) => [
          ...prevCourses,
          {
            ...selectedCourse,
            id: newCourse.id_course,
            id_course: newCourse.id_course,
            id_usuario: selectedUserId as number,
            progress: newCourse.progress.toString(),
            start_date: newCourse.start_date || "",
            end_date: newCourse.end_date || "",
          },
        ]);

        const updatedCourses = await fetch(
          "http://api-site-cursos.172.16.15.30.sslip.io/cursostomados"
        );
        const coursesData = await updatedCourses.json();
        setCursosTomados(coursesData);

        const userCourses = coursesData.filter(
          (curso: CursoTomado) => curso.id_usuario === selectedUserId
        );

        const updatedCursosFaltantes = cursosPresenciales.filter(
          (curso) =>
            !userCourses.some(
              (c: CursoTomado) => c.id_course === curso.id_course
            )
        );
        setNewCourseId("");
      }
    } catch (error) {
      console.error("Error al agregar el curso:", error);
      alert("Hubo un problema al agregar el curso.");
    }
  };

  const toggleDialog = (course: CursoTomado | null) => {
    if (course) {
      setProgress(Number(course.progress)); // ✅ Actualiza el estado de progress al valor actual del curso
      setDialogInfo({
        course,
        isOpen: true,
      });
    } else {
      setDialogInfo((prevDialog) => ({
        ...prevDialog,
        isOpen: !prevDialog.isOpen,
      }));
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let userId = Number(e.target.value);
    userId = Number(userId.toString().replace(/\D/g, ""));
    userId = Number(userId.toString().slice(0, 4));

    setSelectedUserId(userId);
    const user = users.find((user) => user.Personal === userId) || null;
    setSelectedUser(user);

    const userCourses = cursosTomados.filter(
      (curso) => curso.id_usuario === userId
    );
    setSelectedCourses(userCourses);

    const cursosFaltantes = cursosPresenciales.filter(
      (curso) => !userCourses.some((c) => c.id_course === curso.id_course)
    );
    console.log(formattedUserId);
  };
  const formattedUserId = selectedUserId.toString().padStart(4, "0");

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("id", selectedUserId?.toString() || "");

      try {
        console.log("Actualizando Imagen...");
        const res = await axios.post("/api/employeesImages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 200) {
          Swal.fire({ icon: "success", title: "Imagen actualizada", text: "La imagen se ha subido correctamente." });
        } else {
          Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar la imagen." });
        }
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error en la solicitud de imagen." });
      }
    }
  };

  //Dialog modify progress

  const [progress, setProgress] = useState<number>(
    Number(dialogInfo.course.progress)
  );

  const [message, setMessage] = useState("");

  const handleProgressChange = (newValue: number) => {
    setProgress(newValue);
  };

  const updateProgress = async () => {
    try {
      const response = await fetch(
        "http://api-site-cursos.172.16.15.30.sslip.io/updateProgress",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: dialogInfo.course.id_usuario,
            id_course: dialogInfo.course.id_course,
            progress: progress,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el progreso");

      Swal.fire({
        icon: "success",
        title: "Progreso actualizado",
        text: `El progreso del curso ${dialogInfo.course.title} se ha actualizado correctamente.`,
      });

      setDialogInfo((prev) => ({
        ...prev,
        course: { ...prev.course, progress: progress.toString() }, // Convert progress back to string
      }));

      setSelectedCourses(
        selectedCourses.map((course) => {
          if (course.id_course === dialogInfo.course.id_course) {
            return { ...course, progress: progress.toString() };
          }
          return course;
        })
      );
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleDeleteCourse = async (id_course: number, id_usuario: number, start_date: string) => {
    try {
      const response = await fetch(
        "http://api-site-cursos.172.16.15.30.sslip.io/eliminarCursoTomado",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_usuario, id_course, start_date }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }


      Swal.fire({
        icon: "success",
        title: "Curso eliminado",
        text: "El curso ha sido eliminado correctamente.",
      });

      setSelectedCourses(
        selectedCourses.filter((course) => !(course.id_course === id_course && course.start_date === start_date))
      );
      const updatedCourses = await fetch(
        "http://api-site-cursos.172.16.15.30.sslip.io/cursostomados"
      );
      const coursesData = await updatedCourses.json();
      setCursosTomados(coursesData);

    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      alert("Hubo un problema al eliminar el curso.");
    }
  };
  const { scrollYProgress } = useScroll();
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <div style={{ marginTop: "150px" }}>
      <motion.video 
      autoPlay 
      loop 
      muted 
      className="fixed top-0 left-0 w-full h-full object-cover -z-20"
      style={{ opacity: videoOpacity }}
    >
      <source src="/image/background.mp4" type="video/mp4" />
      Tu navegador no soporta videos.
    </motion.video>

        <div
          style={{
            fontFamily: "Arial, sans-serif",
            maxWidth: "1000px",
            margin: "0 auto",
            border: "1px solid black",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "rgba(249, 249, 249, 0.7)", // Cambia el fondo con transparencia
            backdropFilter: "blur(0px)", // Agrega un efecto de desenfoque opcional
          }}
        >

        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center", // Centra horizontalmente
            alignItems: "center", // Centra verticalmente
            marginBottom: "20px",
            width: "100%", // Ocupa todo el ancho disponible
          }}
        >
          <Image
            width={150}
            height={150}
            style={{
              width: "180px",
              height: "auto",
              display: "block", // Evita espacios innecesarios
            }}
            src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/6088316/314367_858588.png"
            alt="Grupo Tarahumara"
          />
        </div>


        {/* i want an input that you put the Numero/user.id and after that put the infomration of the personal in the labels*/}
        <h2
          style={{
            backgroundColor: "#9A3324",
            color: "white",
            padding: "10px",
            textAlign: "center",
            borderRadius: "5px",
          }}
        >
          Información Personal
        </h2>

        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <label htmlFor="userIdInput" style={{ fontWeight: "bold" }}>
            Número Empleado:
          </label>
          <input
            type="number"
            id="userIdInput"
            onChange={handleUserChange}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100px",
              fontSize: "14px",
            }}
          />
        </div>

        {selectedUser && (
          <div
            key={selectedUser.Personal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Foto del empleado */}
            <div style={{ textAlign: "center", flexShrink: 0, width: "200px" }}>
              <Image
                width={180}
                height={180}
                src={`/api/employees/${formattedUserId}`}
                alt="Foto del empleado"
                style={{
                  borderRadius: "50%",
                  border: "3px solid #ddd",
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto",
                }}
              />
              {isAuthenticated && (
                <div style={{ marginTop: "10px" }}>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleChangeImage} 
                    crossOrigin="" 
                    onPointerEnterCapture={() => {}} 
                    onPointerLeaveCapture={() => {}} 
                  />

                </div>
              )}
            </div>

            {/* Tabla de información del empleado */}
            <div style={{ flex: 1 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <tbody>
                  {[
                    ["Nombre", selectedUser.Nombre],
                    ["Apellido Paterno", selectedUser.ApellidoPaterno],
                    ["Apellido Materno", selectedUser.ApellidoMaterno],
                    ["Estatus", selectedUser.Estatus],
                    ["Puesto", selectedUser.Puesto],
                    ["Departamento", selectedUser.Departamento],
                    ["Tipo de Pago", selectedUser.PeriodoTipo],
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: "1px solid #ddd" }}>
                      <td
                        style={{
                          padding: "8px",
                          fontWeight: "bold",
                          backgroundColor: "#f0f0f0",
                          textAlign: "left",
                          width: "40%",
                        }}
                      >
                        {label}:
                      </td>
                      <td style={{ padding: "8px", textAlign: "left" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* Courses Section */}

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #9A3324",
                  padding: "10px",
                  backgroundColor: "#9A3324",
                  color: "white",
                }}
              >
                ID
              </th>
              <th
                style={{
                  border: "1px solid #9A3324",
                  padding: "10px",
                  backgroundColor: "#9A3324",
                  color: "white",
                }}
              >
                Curso
              </th>
              <th
                style={{
                  border: "1px solid #9A3324",
                  padding: "10px",
                  backgroundColor: "#9A3324",
                  color: "white",
                }}
              >
                Progreso
              </th>
              <th
                style={{
                  border: "1px solid #9A3324",
                  padding: "10px",
                  backgroundColor: "#9A3324",
                  color: "white",
                }}
              >
                Fecha de Impartición
              </th>
              <th
                style={{
                  border: "1px solid #9A3324",
                  padding: "10px",
                  backgroundColor: "#9A3324",
                  color: "white",
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses
              .filter((course) => course.status === "true")
              .map((course) => (
                <tr key={course.id_course}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {course.id_course}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    <span
                      style={{
                        width: "100%",
                        borderRadius: "4px",
                        padding: "5px",
                      }}
                    >
                      {course.title}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div className="w-full">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <Typography
                          color="blue-gray"
                          variant="h6"
                          {...({} as any)}
                        >
                          Completado
                        </Typography>
                        <Typography
                          color="blue-gray"
                          variant="h6"
                          {...({} as any)}
                        >
                          {course.progress}%
                        </Typography>
                      </div>
                      <Progress
                        value={Number(course.progress)}
                        {...({} as any)}
                      />
                    </div>
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  <span
                      style={{
                        width: "100%",
                        borderRadius: "4px",
                        padding: "5px",
                      }}
                    >
                      {course.start_date}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: "#5A5A5A",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleDialog(course)}
                    >
                      Información
                    </button>
                    {isAuthenticated ? (
                      <button
                        style={{
                          backgroundColor: "#9A3324",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                        onClick={() =>
                          handleDeleteCourse(
                            course.id_course,
                            course.id_usuario,
                            course.start_date
                          )
                        }
                      >
                        Eliminar
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* Add New Course Section */}
        {isAuthenticated ? (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px", // Espacio entre los elementos principales
            flexWrap: "wrap", // Permite que los elementos pasen a la siguiente línea si es necesario
          }}
        >
          <div className="relative w-full max-w-md">
            <Combobox
              value={selectedCourse}
              onChange={(course: CursosPresencialesJson) => {
                setSelectedCourse(course);
                setNewCourseId(course?.id_course ?? "");
              }}
            >
              <Combobox.Input
                className="w-full border-2 border-[#9A3324] rounded-lg p-3 text-[16px] text-[#333] shadow-md focus:outline-none focus:bg-[#fdf2f2] transition-all"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(course: CursosPresencialesJson | null) =>
                  course?.title || ""
                }
                placeholder="Seleccionar Curso"
              />

              <Combobox.Options
                className="absolute bottom-full mb-2 z-50 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-xl"
              >
                {filteredCourses.length === 0 ? (
                  <div className="cursor-default select-none py-2 px-4 text-gray-500">
                    No se encontró ningún curso.
                  </div>
                ) : (
                  filteredCourses.map((course) => (
                    <Combobox.Option
                      key={course.id_course}
                      value={course}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 text-sm ${
                          active ? "bg-[#f8e1e1] text-[#9A3324]" : "text-gray-900"
                        }`
                      }
                    >
                      {course.title}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Combobox>
          </div>

            {newCourseId && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px", // Espacio entre los inputs
                }}
              >
                <Input
                  type="number"
                  label="Progreso"
                  value={newProgress}
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value < 0) value = 0;
                    if (value > 100) value = 100;
                    setNewProgress(value);
                  }}
                  crossOrigin=""
{...({} as any)}
                />

                <Input
                  type="date"
                  label="Fecha de impartición"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  crossOrigin=""
{...({} as any)}
                />

                <Input
                  type="date"
                  label="Fecha de finalización"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  crossOrigin=""
{...({} as any)}
                />
              </div>
            )}

            <button
              style={{
                backgroundColor: "#9A3324",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                cursor: "pointer",
                marginLeft: "auto", // Empuja el botón hacia la derecha
                minWidth: "120px", // Evita que el botón se encoja demasiado
              }}
              onClick={handleAddCourse}
              disabled={!selectedCourse}
            >
              Agregar Curso
            </button>
          </div>
        ) : null}

        {/* Course Information Dialog */}
        {dialogInfo.isOpen && (
          <Dialog
            open={dialogInfo.isOpen}
            handler={() => toggleDialog(null)}
{...({} as any)}
            
          >
            <DialogHeader
{...({} as any)}
            >
              Detalles del Curso
            </DialogHeader>
            <DialogBody
              {...({} as any)}
              
            >
              <p>
                <strong>Curso:</strong> {dialogInfo.course.title}
              </p>
              <p>
                <strong>Descripción:</strong> {dialogInfo.course.description}
              </p>
              <p>
                <strong>Tutor:</strong> {dialogInfo.course.tutor}
              </p>
              {dialogInfo.course.start_date && (
                <Typography
                  color="blue-gray"
                  variant="h6"
                  
{...({} as any)}
                >
                  Fecha de Impartición: {dialogInfo.course.start_date}
                </Typography>
              )}
              {dialogInfo.course.end_date && (
                <Typography
                  color="blue-gray"
                  variant="h6"
                  
{...({} as any)}
                >
                  Fecha de Vencimiento {dialogInfo.course.end_date}
                </Typography>
              )}
              {isAuthenticated ? (
                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Progreso
                  </label>
                  <Slider
                    value={progress}
                    onChange={(e) =>
                      handleProgressChange(Number(e.target.value))
                    }
                    min={0}
                    max={100}
                    step={1}
                    {...({} as any)}
                  />

                  <Input
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    type="number"
                    min="0"
                    max="100"
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                    crossOrigin={undefined}
                  />
                </div>
              ) : null}
              {message && (
                <p className="text-center text-sm text-green-600">{message}</p>
              )}
            </DialogBody>

            <DialogFooter
{...({} as any)}
            >
              <Button
                color="red"
                onClick={() => toggleDialog(null)}
                
{...({} as any)}
              >
                Cerrar
              </Button>
              {isAuthenticated ? (
                <Button
                  color="blue"
                  onClick={updateProgress}
                  {...({} as any)}
                >
                  Actualizar
                </Button>
              ) : null}
            </DialogFooter>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Kardex;
