import React, { useState } from "react";

interface AssignDepartmentModalProps {
  course: { title: string };
  onClose: () => void;
  onAssign: (course: { title: string }, department: string) => void;
  departments: string[];
}

const AssignDepartmentModal: React.FC<AssignDepartmentModalProps> = ({ course, onClose, onAssign, departments }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [users, setUsers] = useState<any[]>([]); // Asegurar que es un array

  // Obtener usuarios del departamento seleccionado
  const fetchUsers = async (department: string) => {
    try {
      const response = await fetch(
        `http://api-site-intelisis.192.168.29.40.sslip.io/api/users/by-department?department=${department}`
      );
      const data = await response.json();
      console.log(`Usuarios en ${department}:`, data); // Verifica los datos en la consola

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]); // Si no es un array, establecer vacío
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  // Manejar el cambio de departamento
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    fetchUsers(department);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Asignar Curso: {course.title}</h2>

        {/* Select para elegir un departamento */}
        <label htmlFor="department">Selecciona un Departamento:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          style={styles.select}
        >
          <option value="">Seleccione un departamento</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Mostrar usuarios del departamento seleccionado */}
        {selectedDepartment && users.length > 0 ? (
          <div style={styles.userList}>
            <h3>Usuarios en {selectedDepartment}:</h3>
            <ul>
              {users.map((user) => (
                <li key={user.Personal}>
                  {user.Nombre} {user.ApellidoPaterno} {user.ApellidoMaterno} - {user.Puesto}
                </li>
              ))}
            </ul>
          </div>
        ) : selectedDepartment ? (
          <p>No hay usuarios en este departamento.</p>
        ) : null}

        <button onClick={() => onAssign(course, selectedDepartment)} style={styles.assignButton}>
          Asignar
        </button>
        <button onClick={onClose} style={styles.closeButton}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

// Definir estilos en la misma página
const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  userList: {
    marginTop: "15px",
    textAlign: "left",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "5px",
  },
  assignButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  closeButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
};

export default AssignDepartmentModal;
