"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";


export interface User {
  Personal: number;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Nombre: string;
  Estatus: string;
  Puesto: string;
  Departamento: string;
  PeriodoTipo: string;
  RFC: string;
  NSS: string;
  FechaAntiguedad: string;
  FechaAlta: string;
}
function InfoProfile() {
  const { user } = useAuth();

const [empleado, setEmpleado] = React.useState<User | null>(null);


React.useEffect(() => {
  const fetchData = async () => {
      if (!user) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/all`
      );
      const data = await response.json();
      const employeeData = data.find((u: any) => Number(u.Personal) === Number(user.num_empleado));
      setEmpleado(employeeData);
    };
  
    if (user) {
      fetchData();
  };
}, [user]);


  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <Card className="relative rounded-3xl shadow-lg border border-muted bg-white/80 backdrop-blur-md">
        {/* Badge en la esquina superior derecha */}
        <div className="absolute top-4 right-4">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
              empleado?.Estatus === "ALTA"
                ? "text-green-600 border-green-600"
                : "text-red-600 border-red-600"
            }`}
          >
            {empleado?.Estatus || "Desconocido"}
          </Badge>
        </div>

        <CardHeader className="text-center space-y-3">
          <Avatar className="w-32 h-36 mx-auto shadow-md border">
            <AvatarImage src={`/api/employees/${empleado?.Personal || "default"}`} alt="Avatar" />
            <AvatarFallback>
              {empleado?.Nombre?.[0] || ""}
              {empleado?.ApellidoPaterno?.[0] || ""}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {empleado?.Nombre || "N/A"} {empleado?.ApellidoPaterno || "N/A"} {empleado?.ApellidoMaterno || "N/A"}
            </CardTitle>
            <p className="text-muted-foreground text-sm">#{empleado?.Personal}</p>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-4">
          <InfoItem label="Puesto" value={empleado?.Puesto || "N/A"} />
          <InfoItem label="Departamento" value={empleado?.Departamento || "N/A"} />
          <InfoItem label="Tipo de Pago" value={empleado?.PeriodoTipo || "No especificado"} />
        </CardContent>
      </Card>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-base font-medium">{value}</span>
  </div>
);

export default InfoProfile;
