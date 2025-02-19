import React, { useState } from "react";
import { Button, Card, CardBody, Typography, Input, Checkbox } from "@material-tailwind/react";

interface AssignDepartmentModalProps {
  course: { id_course: number; title: string };
  onClose: () => void;
  departments: string[];
}

function AssignDepartmentModal({ course, onClose, departments }: AssignDepartmentModalProps) {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [users, setUsers] = useState<{ Personal: string; Nombre: string; ApellidoPaterno: string; ApellidoMaterno: string; Puesto: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const fetchUsers = async (department: string) => {
    try {
      const response = await fetch(`http://api-site-intelisis.192.168.29.40.sslip.io/api/users/by-department?department=${department}`);
      const data = await response.json();
      setUsers(data);
      setSelectedUsers(new Set(data.map((user: { Personal: string }) => user.Personal)));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    fetchUsers(e.target.value);
  };

  const handleCheckboxChange = (personalId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      newSet.has(personalId) ? newSet.delete(personalId) : newSet.add(personalId);
      return newSet;
    });
  };

  const handleAssign = async () => {
    const requestBody = {
      courseId: course.id_course,
      progress,
      start_date: startDate,
      end_date: endDate,
      employees: Array.from(selectedUsers)
    };
    console.log(requestBody);

    try {
      const response = await fetch("http://localhost:3001/api/cursoDepartamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      response.ok ? alert("Usuarios asignados correctamente") : alert("Error al asignar usuarios");
      onClose();
    } catch (error) {
      console.error("Error al asignar curso:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg overflow-y-auto max-h-[90vh]"
      onPointerLeaveCapture={() => {}}
      onPointerEnterCapture={() => {}}
      placeholder="">
        <CardBody
        onPointerLeaveCapture={() => {}}
        onPointerEnterCapture={() => {}}
        placeholder="">
          <Typography
            variant="h5"
            className="text-center text-blue-600 mb-4"
            onPointerLeaveCapture={() => {}}
            onPointerEnterCapture={() => {}}
            placeholder=""
          >
            {`Asignar Curso: ${course.title}`}
          </Typography>
          <div className="space-y-4">
            <select id="department" value={selectedDepartment} onChange={handleDepartmentChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Seleccione un departamento</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <Input 
              type="number" 
              label="Progreso" 
              value={progress} 
              onChange={(e) => setProgress(Number(e.target.value))} 
              className="w-full" 
              crossOrigin="" 
              onPointerLeaveCapture={() => {}} 
              onPointerEnterCapture={() => {}} 
            />
            <Input type="date" label="Fecha de inicio" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full" 
            crossOrigin="" 
            onPointerLeaveCapture={() => {}} 
            onPointerEnterCapture={() => {}} />
            <Input type="date" label="Fecha de finalización" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full"
            crossOrigin="" 
            onPointerLeaveCapture={() => {}} 
            onPointerEnterCapture={() => {}}  />
          </div>
          {selectedDepartment && users.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto">
              <Typography variant="h6" className="text-gray-700"
              onPointerLeaveCapture={() => {}}
              onPointerEnterCapture={() => {}}
              placeholder="">Usuarios en {selectedDepartment}:</Typography>
              {users.map(user => (
                <div key={user.Personal} className="flex items-center gap-2 mt-2">
                  <Checkbox 
                    checked={selectedUsers.has(user.Personal)} 
                    onChange={() => handleCheckboxChange(user.Personal)} 
                    onPointerEnterCapture={() => {}} 
                    onPointerLeaveCapture={() => {}} 
                    crossOrigin="" 
                  />
                  <Typography
                  onPointerLeaveCapture={() => {}}
                  onPointerEnterCapture={() => {}}
                  placeholder="">{user.Nombre} {user.ApellidoPaterno} {user.ApellidoMaterno} - {user.Puesto}</Typography>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <Button color="blue" onClick={handleAssign} className="w-full mr-2"
            onPointerLeaveCapture={() => {}}
            onPointerEnterCapture={() => {}}
            placeholder="">Asignar</Button>
            <Button color="red" onClick={onClose} className="w-full"
            onPointerLeaveCapture={() => {}}
            onPointerEnterCapture={() => {}}
            placeholder="">Cerrar</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};


const styles = {
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
    padding: "30px",
    borderRadius: "10px",
    width: "450px",
    maxHeight: "80vh",
    overflowY: "auto",
    textAlign: "center",
  },
  userList: {
    marginTop: "15px",
    textAlign: "left",
  },
  userContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

export default AssignDepartmentModal;
