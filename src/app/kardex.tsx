
"use client";
import React, { useState , useEffect} from 'react';
import Image from 'next/image';
// Ajusta la ruta según tu estructura de archivos

interface CursoTomado {
  id: number;
  id_course: number;
  id_usuario: number;
  title: string;
  description: string;
  area: string;
  tutor: string;
}

interface CursosPresencialesJson {
  id_course: number;
  title: string;
  description: string;
  area: string;
  tutor: string;
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
    const [users, setUsers] = useState<User[]>([]);

    const [newCourseId, setNewCourseId] = useState<number | ''>(''); // For selected course from the dropdown
  
    const [dialogInfo, setDialogInfo] = useState<{ id: number; isOpen: boolean }>({ id: 0, isOpen: false });
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
    const [cursosTomados, setCursosTomados] = useState<CursoTomado[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<CursoTomado[]>([]);
  
    const [cursosPresenciales, setCursosPresenciales] = useState<CursosPresencialesJson[]>([]);
    const [cursosFaltantes, setCursosFaltantes] = useState<CursosPresencialesJson[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://api-site-intelisis.192.168.29.40.sslip.io/api/users');
        const data = await response.json();
        const formattedData = data.map((user: any) => ({
          ...user,
          Personal: Number(user.Personal), // Convierte Personal a número
        }));
        setUsers(formattedData);

        const datacourse = await fetch('http://api-cursos.192.168.29.40.sslip.io/cursostomados');
        const coursesData = await datacourse.json();
   
        setCursosTomados(coursesData);


        const fetchCursosPresenciales = await fetch("http://api-cursos.192.168.29.40.sslip.io/cursosPresenciales");
        if (!fetchCursosPresenciales.ok) {
          throw new Error('Network response was not ok');
        }
        const cursos: CursoTomado[] = await fetchCursosPresenciales.json();
        
        setCursosPresenciales(cursos);

      } catch (error) {
        console.error(error);
      }
    };

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

        console.log("el id del curso es",newCourse.id_course)
  

          
        // en esta parte actualizp 
        setSelectedCourses([...selectedCourses,{...selectedCourse,id: newCourse.id_course,id_course:newCourse.id_course, id_usuario: selectedUserId as number, },]);
        
        const updatedCourses = await fetch('http://api-cursos.192.168.29.40.sslip.io/cursostomados');
        const coursesData = await updatedCourses.json();
        setCursosTomados(coursesData);
  
        //se actualiza}n los cursos
        const userCourses = coursesData.filter(curso => curso.id_usuario === selectedUserId);
        const updatedCursosFaltantes = cursosPresenciales.filter(curso => !userCourses.some(c => c.id_course === curso.id_course));
        setCursosFaltantes(updatedCursosFaltantes);
  
        setNewCourseId('');
      };

    } catch (error) {
        console.error('Error al agregar el curso:', error);
        alert('Hubo un problema al agregar el curso.');
      }
  };

  const toggleDialog = (id: number) => {
    setDialogInfo({ id, isOpen: !dialogInfo.isOpen });
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

  return (
    <div>     
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', border: '1px solid black', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <img src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/6088316/314367_858588.png" alt="Grupo Tarahumara" style={{ width: '180px', height: 'auto' }} />
          <div style={{ textAlign: 'right', fontSize: '16px' }}>
            <p><strong>Avance:</strong> %</p>
            <p><strong>Estatus:</strong> ALTA</p>
          </div>
        </div>

        {/* i want an input that you put the Numero/user.id and after that put the infomration of the personal in the labels*/}
        <h2 style={{ backgroundColor: '#9A3324', color: 'white', padding: '10px', textAlign: 'center', borderRadius: '5px' }}>Información Personal</h2>
    
            <div style={{ marginBottom: '20px' ,padding: '10px', borderRadius: '5px' }}>
              <label htmlFor="userIdInput"><strong>Número Empleado:</strong></label>
              <input
                type="number"
                id="userIdInput"
                value={selectedUserId}
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
                <Image
                  width={150}
                  height={150}
                  
                  src={selectedUser ? `/fotos/${formattedUserId}.jpg` : 'https://img.freepik.com/vector-premium/avatar-hombre-barba-foto-perfil-masculina-generica_53562-20202.jpg'}
                  alt="Foto del empleado"
                >

                </Image>

              </div>
            )}

        {/* Courses Section */}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #9A3324', padding: '10px', backgroundColor: '#9A3324', color: 'white' }}>ID</th>
              <th style={{ border: '1px solid #9A3324', padding: '10px', backgroundColor: '#9A3324', color: 'white' }}>Curso</th>
              <th style={{ border: '1px solid #9A3324', padding: '10px', backgroundColor: '#9A3324', color: 'white' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map(course => (
              <tr key={course.id_course}>
                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{course.id_course}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                <span style={{ width: '100%', borderRadius: '4px', padding: '5px' }}>
  {course.title}
</span>

                 
                </td>
                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
               
                  <button
                    style={{ backgroundColor: '#5A5A5A', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}
                    onClick={() => toggleDialog(course.id_course)}
                  >
                    Información
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add New Course Section */}
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

        {/* Course Information Dialog */}
        {dialogInfo.isOpen && (
          <div style={{
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{
              backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '500px', width: '100%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Detalles del Curso</h3>
              <p><strong>ID:</strong> {dialogInfo.id}</p>
              {/* <p><strong>Nombre:</strong> {courses.find(c => c.id === dialogInfo.id)?.name}</p>
              <p><strong>Descripción:</strong> {courses.find(c => c.id === dialogInfo.id)?.description}</p>
              <p><strong>Fecha:</strong> {courses.find(c => c.id === dialogInfo.id)?.date}</p> */}
              <button
                style={{ backgroundColor: '#9A3324', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
                onClick={() => toggleDialog(dialogInfo.id)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kardex;
