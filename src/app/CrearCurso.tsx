"use client";
import React, { useState } from 'react';
import { CSSProperties } from 'react';
import Swal from 'sweetalert2';

interface Course {
  id_course:number,
  title: string;
  description: string;
  area: string;
  tutor: string;
  start_date: string; 
  end_date: string;  
  status: string;
  noEndDate?: boolean;
}
interface Props {
  onAddCourse: (course: Course) => void; // Callback para enviar datos al padre
}

function CourseCatalog({ onAddCourse }: Props) {
  // El estado debe estar dentro del componente
  const [newCourse, setNewCourse] = useState<Course>({
    id_course: 0,
    title: '',
    description: '',
    area: '',
    tutor: '',
    start_date: '',
    end_date: '',  
    status: 'Activo',
  });

  const handleAddMoodle = async (newCourse: Course) => {
    try {
      const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/agregarCurso', {
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
      Swal.fire('Curso agregado', `El curso ${result.title} ha sido agregado correctamente`, 'success');
      return newCourse;
    } catch (error) {
      console.error('Error al agregar el curso:', error);
      Swal.fire('Error', 'No se pudo agregar el curso', 'error');
    }
  };

  const handleAddCourse =async () => {
    try{
       const status=await handleAddMoodle(newCourse);
       if(!status){
        console.log("no se pudo agregar el curso")
        return;
       }
      onAddCourse(newCourse); 
    }catch(e){
      console.log("no se pudo agregar el curso ")
    }  
  };

  return (
    <div>
  <div style={styles.container}>
    <h1 style={styles.heading}>Capacitación Tarahumara</h1>
    <div style={styles.formContainer}>
      <h2 style={styles.subHeading}>Registrar Nuevo Curso</h2>
      
      <input
        type="text"
        placeholder="Título del curso"
        value={newCourse.title}
        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        style={styles.input}
      />
      
      <textarea
        placeholder="Descripción del curso"
        value={newCourse.description}
        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
        style={styles.textarea}
      />      
      <input
        type="text" 
        placeholder="Impartido por:"
        value={newCourse.tutor}
        onChange={(e) => setNewCourse({ ...newCourse, tutor: e.target.value })}
        style={styles.input}
      />

      <button onClick={handleAddCourse} style={styles.addButton}>
        Agregar Curso
      </button>
    </div>
  </div>
</div>

  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    width: '90%',
    margin: '0 auto',
    fontFamily: 'Roboto, sans-serif',
    color: '#333',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '20px',
    marginBottom: '15px',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  addButton: {
    backgroundColor: '#9A3324',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default CourseCatalog;
