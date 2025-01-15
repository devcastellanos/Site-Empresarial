"use client"
import React, { useState } from 'react';
import { CSSProperties } from 'react';

interface Course {
  title: string;
  description: string;
  area: string;
  tutor:string;
}

function CourseCatalog (){
  const [newCourse, setNewCourse] = useState<Course>({
    title: '',
    description: '',
    area: '',
    tutor:'',
  });

  const handleAddMoodle = async () => {
    try {

      // Enviar la solicitud POST con los datos
      const response = await fetch('http://api-cursos.192.168.29.40.sslip.io/agregarCurso', {
        method: 'POST', // Asegúrate de usar el método POST
        headers: {
          'Content-Type': 'application/json', // Indica que los datos son en formato JSON
        },
        body: JSON.stringify(newCourse), // Convierte el objeto courseData en una cadena JSON
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const result = await response.json();
      console.log('Curso agregado con éxito', result);
    } catch (error) {
      console.error('Error al agregar curso:', error);
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
            type="autor"
            placeholder="Impartido"
            value={newCourse.tutor}
            onChange={(e) => setNewCourse({ ...newCourse, tutor: e.target.value })}
            style={styles.input}
          />

          <button onClick={handleAddMoodle} style={styles.addButton}>
            Agregar Curso
          </button>
        </div>

      </div>
    </div>
  );
};

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
  courseList: {
    marginTop: '30px',
  },
  courseCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  employeeSection: {
    marginTop: '20px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  searchButton: {
    marginLeft: '10px',
    padding: '10px 15px',
    backgroundColor: '#333',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
  },
  employeeList: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  employeeItem: {
    padding: '5px 0',
  },
  addEmployeeButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#9A3324',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default CourseCatalog;
