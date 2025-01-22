"use client";
import React, { useState } from 'react';
import { CSSProperties } from 'react';

interface Course {
  id_course:string,
  title: string;
  description: string;
  area: string;
  tutor: string;
  start_date: string; 
  end_date: string;  
}
interface Props {
  onAddCourse: (course: Course) => void; // Callback para enviar datos al padre
}

function CourseCatalog({ onAddCourse }: Props) {
  // El estado debe estar dentro del componente
  const [newCourse, setNewCourse] = useState<Course>({
    id_course:'',
    title: '',
    description: '',
    area: '',
    tutor: '',
    start_date: '',
    end_date: '',  
  });

  const handleAddMoodle = async (newCourse: Course) => {
    try {

      console.log('Fecha de inicio:', newCourse.start_date);
      console.log('Fecha de fin:', newCourse.end_date);

     
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
      console.log('Curso agregado con éxito', result);
      return newCourse;
    } catch (error) {
      console.error('Error al agregar curso:', error);
    }
  };

  const handleAddCourse = () => {
    handleAddMoodle(newCourse);
    console.log(newCourse)
    onAddCourse(newCourse); 
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
            type="date"
            placeholder="Fecha de inicio"
            value={newCourse.start_date}
            onChange={(e) => setNewCourse({ ...newCourse, start_date: e.target.value })}
            style={styles.input}
          />
          <input
            type="date"
            placeholder="Fecha de término"
            value={newCourse.end_date}
            onChange={(e) => setNewCourse({ ...newCourse, end_date: e.target.value })}
            style={styles.input}
          />
          <select
            value={newCourse.area}
            onChange={(e) => setNewCourse({ ...newCourse, area: e.target.value })}
            style={styles.select}
          >
            <option value="">Selecciona un área</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Finanzas">Finanzas</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input
            type="text" 
            placeholder="Impartido"
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
