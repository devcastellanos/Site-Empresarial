
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from './hooks/useAuth';
import { Button, Dialog, DialogBody, DialogHeader, DialogFooter, Input, Progress, Slider, Typography } from '@material-tailwind/react';
import axios from 'axios';
// Ajusta la ruta según tu estructura de archivos

interface CursoTomado {
  id: number;
  id_course: number;
  id_usuario: number;
  title: string;
  description: string;
  tutor: string;
  progress: string;
  status: string;
}

interface CursosPresencialesJson {
  id_course: number;
  title: string;
  description: string;
  tutor: string;
  progress: string;
  status: string;
}

interface User {
  Personal: number;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Nombre: string;
  Estatus: string;
  Puesto: string;
  Departamento: string;
  PeriodoTipo: string;
}

const Kardex = () => {
  const { isAuthenticated } = useAuth();

  const [users, setUsers] = useState<User[]>([]);

  const [newCourseId, setNewCourseId] = useState<number | ''>(''); // For selected course from the dropdown

  const [dialogInfo, setDialogInfo] = useState<{course: CursoTomado, isOpen: boolean}>({ course: { id: 0, id_course: 0, id_usuario: 0, title: '', description: '', tutor: '', progress: '', status: '' }, isOpen: false });
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [cursosTomados, setCursosTomados] = useState<CursoTomado[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CursoTomado[]>([]);

  const [cursosPresenciales, setCursosPresenciales] = useState<CursosPresencialesJson[]>([]);
  const [cursosFaltantes, setCursosFaltantes] = useState<CursosPresencialesJson[]>([]);
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://api-site-intelisis.192.168.29.40.sslip.io/api/users');
      const data = await response.json();
      setUsers(data.map((user: any) => ({
        ...user,
        Personal: Number(user.Personal), // Asegurar que `Personal` es un número
      })));

      const datacourse = await fetch('http://api-cursos.192.168.29.40.sslip.io/cursostomados');
      setCursosTomados(await datacourse.json());

      const fetchCursosPresenciales = await fetch("http://api-cursos.192.168.29.40.sslip.io/cursosPresenciales");
      if (!fetchCursosPresenciales.ok) {
        throw new Error('Network response was not ok');
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
      const selectedCourse = cursosFaltantes.find(course => course.id_course === newCourseId);
      if (selectedCourse) {
        const newCourse = {
          id_course: selectedCourse.id_course,
          id_usuario: selectedUserId as number,
        };

        const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/agregarCursoTomado', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCourse),
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        const result = await response.json();
        console.log('Curso agregado con éxito:', result);

        console.log("el id del curso es", newCourse.id_course)

        //se actualizan los cursos tomados
        setSelectedCourses([...selectedCourses,{...selectedCourse,id: newCourse.id_course,id_course:newCourse.id_course, id_usuario: selectedUserId as number, progress: '0' },]);

        const updatedCourses = await fetch('http://api-cursos.192.168.29.40.sslip.io/cursostomados');
        const coursesData = await updatedCourses.json();
        setCursosTomados(coursesData);

        //se actualizan los cursos
        const userCourses = coursesData.filter((curso: CursoTomado) => curso.id_usuario === selectedUserId);
        const updatedCursosFaltantes = cursosPresenciales.filter(curso => !userCourses.some((c: CursoTomado) => c.id_course === curso.id_course));
        setCursosFaltantes(updatedCursosFaltantes);

        setNewCourseId('');

      };

    } catch (error) {
      console.error('Error al agregar el curso:', error);
      alert('Hubo un problema al agregar el curso.');
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
      setDialogInfo(prevDialog => ({
        ...prevDialog,
        isOpen: !prevDialog.isOpen,
      }));
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let userId = Number(e.target.value);
    userId = Number(userId.toString().replace(/\D/g, ''));
    userId = Number(userId.toString().slice(0, 4));

    setSelectedUserId(userId);
    const user = users.find(user => user.Personal === userId) || null;
    setSelectedUser(user);

    const userCourses = cursosTomados.filter(curso => curso.id_usuario === userId);
    setSelectedCourses(userCourses);

    const cursosFaltantes = cursosPresenciales.filter(curso => !userCourses.some(c => c.id_course === curso.id_course));
    setCursosFaltantes(cursosFaltantes);
    console.log(formattedUserId);
  };
  const formattedUserId = selectedUserId.toString().padStart(4, '0');
  
  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('id', selectedUserId?.toString() || '');
  
      try {
        console.log("Actualizando Imagen...");
        const res = await axios.post("/api/employeesImages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        if (res.status === 200) {
          console.log("Imagen actualizada correctamente:", res.data.imageUrl);
        } else {
          console.error("Error al actualizar la imagen:", res.data.message);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }
  };

  //Dialog modify progress

  const [progress, setProgress] = useState<number>(Number(dialogInfo.course.progress));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleProgressChange = (newValue: number) => {
    setProgress(newValue);
  };

  const updateProgress = async () => {
    try {
      const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/updateProgress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: dialogInfo.course.id_usuario,
          id_course: dialogInfo.course.id_course,
          progress: progress,
        }),
      });
  
      const data = await response.json();
      console.log("Respuesta:", data);

      setDialogInfo((prev) => ({
        ...prev,
        course: { ...prev.course, progress: progress.toString() }, // Convert progress back to string
      }));

      setSelectedCourses(selectedCourses.map((course) => {
        if (course.id_course === dialogInfo.course.id_course) {
          return { ...course, progress: progress.toString() };
        }
        return course;
      }));
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleDeleteCourse = async (id_course: number, id_usuario: number) => {
    try {
      const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/eliminarCursoTomado', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_usuario, id_course }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const result = await response.json();
      console.log('Curso eliminado con éxito:', result);

      setSelectedCourses(selectedCourses.filter(course => course.id_course !== id_course));
      const updatedCourses = await fetch('http://api-cursos.192.168.29.40.sslip.io/cursostomados');
      const coursesData = await updatedCourses.json();
      setCursosTomados(coursesData);

      const userCourses = coursesData.filter((curso: CursoTomado) => curso.id_usuario === selectedUserId);
      const updatedCursosFaltantes = cursosPresenciales.filter(curso => !userCourses.some((c: CursoTomado) => c.id_course === curso.id_course));
      setCursosFaltantes(updatedCursosFaltantes);
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
      alert('Hubo un problema al eliminar el curso.');
    }
  };
  

  return (
    <div>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', border: '1px solid black', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <img src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/6088316/314367_858588.png" alt="Grupo Tarahumara" style={{ width: '180px', height: 'auto' }} />
          <div style={{ textAlign: 'right', fontSize: '16px' }}>
            <p> Grupo Tarahumara</p>
            <p> 2025</p>
          </div>
        </div>

        {/* i want an input that you put the Numero/user.id and after that put the infomration of the personal in the labels*/}
        <h2 style={{ backgroundColor: '#9A3324', color: 'white', padding: '10px', textAlign: 'center', borderRadius: '5px' }}>Información Personal</h2>

        <div style={{ marginBottom: '20px', padding: '10px', borderRadius: '5px' }}>
          <label htmlFor="userIdInput"><strong>Número Empleado:</strong></label>
          <input
            type="number"
            id="userIdInput"
            onChange={handleUserChange}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        {selectedUser && (
          <div key={selectedUser.Personal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Nombre:</strong> {selectedUser.Nombre}</p>
              <p><strong>Apellido Paterno:</strong> {selectedUser.ApellidoPaterno}</p>
              <p><strong>Apellido Materno:</strong> {selectedUser.ApellidoMaterno}</p>
              <p><strong>Estatus:</strong> {selectedUser.Estatus}</p>
              <p><strong>Puesto:</strong> {selectedUser.Puesto}</p>
              <p><strong>Departamento:</strong> {selectedUser.Departamento}</p>
              <p><strong>Tipo de Pago:</strong> {selectedUser.PeriodoTipo}</p>
            </div>

            <div>
              <Image
                width={150}
                height={150}
                src={`/fotos/${formattedUserId}.jpg`}
                alt="Foto del empleado"
              >
              </Image>
              { isAuthenticated ? (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Input
                type="file"
                placeholder="Imagen"
                accept="image/*"
                multiple
                crossOrigin={''}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
                onChange={handleChangeImage}
                />
              </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Courses Section */}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #9A3324', padding: '10px', backgroundColor: '#9A3324', color: 'white' }}>ID</th>
              <th style={{ border: '1px solid #9A3324', padding: '10px', backgroundColor: '#9A3324', color: 'white' }}>Curso</th>
              <th style={{ border: '1px solid #9A3324', padding: '10px', backgroundColor: '#9A3324', color: 'white' }}>Progreso</th>
              <th style={{ border: '1px solid #9A3324', padding: '10px', backgroundColor: '#9A3324', color: 'white' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses
              .filter(course => course.status === 'true')
              .map(course => (
                <tr key={course.id_course}>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{course.id_course}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <span style={{ width: '100%', borderRadius: '4px', padding: '5px' }}>
                      {course.title}
                    </span>
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                    <div className="w-full">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <Typography color="blue-gray" variant="h6" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                          Completado
                        </Typography>
                        <Typography color="blue-gray" variant="h6" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                          {course.progress}%
                        </Typography>
                      </div>
                      <Progress 
                        value={Number(course.progress)} 
                        placeholder="" 
                        onPointerEnterCapture={() => {}} 
                        onPointerLeaveCapture={() => {}} 
                      />
                    </div>
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                    <button
                      style={{ backgroundColor: '#5A5A5A', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}
                      onClick={() => toggleDialog(course)}
                    >
                      Información
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* Add New Course Section */}
        { isAuthenticated ? (
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <select
            value={newCourseId}
            onChange={e => setNewCourseId(Number(e.target.value))}
            style={{ width: '75%', border: '1px solid #9A3324', borderRadius: '5px', padding: '10px', marginRight: '10px' }}
          >
            <option value="">Seleccionar Curso</option>
            {cursosFaltantes.map(course => (
              <option key={course.id_course} value={course.id_course}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            style={{ backgroundColor: '#9A3324', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer' }}
            onClick={handleAddCourse}
            disabled={!newCourseId} // Disable if no course is selected
          >
            Agregar Curso
          </button>
        </div>
        ): null
        }      

        {/* Course Information Dialog */}
        {dialogInfo.isOpen && (
          <Dialog 
            open={dialogInfo.isOpen} 
            handler={() => toggleDialog(null)} 
            onPointerLeaveCapture={() => {}} 
            onPointerEnterCapture={() => {}} 
            placeholder=""
          >
          <DialogHeader placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Detalles del Curso</DialogHeader>
          <DialogBody onPointerLeaveCapture={() => {}} onPointerEnterCapture={() => {}} placeholder="">
            <p><strong>Curso:</strong> {dialogInfo.course.title}</p>
            <p><strong>Descripción:</strong> {dialogInfo.course.description}</p>
            <p><strong>Tutor:</strong> {dialogInfo.course.tutor}</p>
            { isAuthenticated ? (
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">Progreso</label>
              <Slider 
                value={progress} 
                onChange={(e) => handleProgressChange(Number(e.target.value))} 
                min={0} 
                max={100} 
                step={1} 
                placeholder="" 
                onPointerEnterCapture={() => {}} 
                onPointerLeaveCapture={() => {}} 
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
            {message && <p className="text-center text-sm text-green-600">{message}</p>}
          </DialogBody>
    
          <DialogFooter 
            placeholder="" 
            onPointerEnterCapture={() => {}} 
            onPointerLeaveCapture={() => {}}>
            <Button 
              color="red" 
              onClick={() => toggleDialog(null)} 
              placeholder="" 
              onPointerEnterCapture={() => {}} 
              onPointerLeaveCapture={() => {}}
            >
              Cerrar
            </Button>
            {isAuthenticated ? (
            <Button 
              color="blue" 
              onClick={updateProgress} 
              onPointerLeaveCapture={() => {}} 
              onPointerEnterCapture={() => {}} 
              placeholder=""
            >
              Actualizar
            </Button>
            ):null}
          </DialogFooter>
        </Dialog>
        )}
      </div>
    </div>
  );
};

export default Kardex;
