import React, { useState } from "react";
import { Button, Card, CardBody, Typography, Input, Checkbox } from "@material-tailwind/react";
import Swal from "sweetalert2";

interface AssignDepartmentModalProps {
  course: { id_course: number; title: string };
  onClose: () => void;
  onAssign: (course: { id_course: number; title: string }, department: string) => void;
  departments: string[];
}

const AssignDepartmentModal: React.FC<AssignDepartmentModalProps> = ({ course, onClose, onAssign, departments }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [users, setUsers] = useState<{ Personal: string; Nombre: string; ApellidoPaterno: string; ApellidoMaterno: string; Puesto: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set<string>());
  const [progress, setProgress] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
    const department = e.target.value;
    setSelectedDepartment(department);
    if (department) fetchUsers(department);
  };

  const handleCheckboxChange = (personalId: string) => {
    setSelectedUsers((prev) => {
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
      const response = await fetch("http://api-cursos.192.168.29.40.sslip.io/api/cursoDepartamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        Swal.fire({ icon: "success", title: "Usuarios asignados", text: "Los usuarios fueron asignados correctamente." });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "Error al asignar usuarios." });
      }
      onClose();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Hubo un problema al asignar el curso." });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg overflow-y-auto max-h-[90vh]" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        <CardBody
        placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
          <Typography variant="h5" className="text-center text-blue-600 mb-4"
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            {`Asignar Curso: ${course.title}`}
          </Typography>
          <div className="space-y-4">
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccione un departamento</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <Input
              type="number"
              label="Progreso"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full"
              crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            />
            <Input type="date" label="Fecha de inicio" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full" crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
            <Input type="date" label="Fecha de finalización" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full" crossOrigin="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
          </div>

          {selectedDepartment && users.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto">
              <Typography variant="h6" className="text-gray-700"
              placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                Usuarios en {selectedDepartment}:
              </Typography>
              {users.map((user) => (
                <div key={user.Personal} className="flex items-center gap-2 mt-2">
                  <Checkbox
                    checked={selectedUsers.has(user.Personal)}
                    onChange={() => handleCheckboxChange(user.Personal)}
                    crossOrigin=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  />
                  <Typography
                  placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                    {user.Nombre} {user.ApellidoPaterno} {user.ApellidoMaterno} - {user.Puesto}
                  </Typography>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button color="blue" onClick={handleAssign} className="w-full mr-2"
            placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
              Asignar
            </Button>
            <Button color="red" onClick={onClose} className="w-full"
            placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
              Cerrar
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AssignDepartmentModal;
