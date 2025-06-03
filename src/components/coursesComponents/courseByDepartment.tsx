import React, { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/by-department?department=${department}`);
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
      employees: Array.from(selectedUsers),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cursoDepartamento`, {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <Card className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Asignar Curso: {course.title}</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="department">Departamento</Label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccione un departamento</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Progreso</Label>
            <Input
              type="number"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Fecha de inicio</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Fecha de finalización</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {selectedDepartment && users.length > 0 && (
            <ScrollArea className="max-h-40 border p-2 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Usuarios en {selectedDepartment}:</h3>
              {users.map((user) => (
                <div key={user.Personal} className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id={user.Personal}
                    checked={selectedUsers.has(user.Personal)}
                    onCheckedChange={() => handleCheckboxChange(user.Personal)}
                  />
                  <Label htmlFor={user.Personal} className="text-sm font-normal">
                    {user.Nombre} {user.ApellidoPaterno} {user.ApellidoMaterno} - {user.Puesto}
                  </Label>
                </div>
              ))}
            </ScrollArea>
          )}

          <div className="flex justify-between gap-4 mt-6">
            <Button className="w-full" onClick={handleAssign}>Asignar</Button>
            <Button className="w-full" variant="destructive" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssignDepartmentModal;
