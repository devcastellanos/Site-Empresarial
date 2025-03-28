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

export interface User {
  Personal: number;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Nombre: string;
  Estatus: string;
  Puesto: string;
  Departamento: string;
  PeriodoTipo: string;
}

const user: User = {
  Personal: 2294,
  ApellidoPaterno: "CASTELLANOS",
  ApellidoMaterno: "CABANILLAS",
  Nombre: "JUAN FRANCISCO",
  Estatus: "ALTA",
  Puesto: "Ing Desarrollo Jr",
  Departamento: "Sistemas",
  PeriodoTipo: "Quincenal",
};

function InfoProfile() {
  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <Card className="relative rounded-3xl shadow-lg border border-muted bg-white/80 backdrop-blur-md">
        {/* Badge en la esquina superior derecha */}
        <div className="absolute top-4 right-4">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
              user.Estatus === "ALTA"
                ? "text-green-600 border-green-600"
                : "text-red-600 border-red-600"
            }`}
          >
            {user.Estatus}
          </Badge>
        </div>

        <CardHeader className="text-center space-y-3">
          <Avatar className="w-32 h-36 mx-auto shadow-md border">
            <AvatarImage src={`/api/employees/${user.Personal}`} alt="Avatar" />
            <AvatarFallback>
              {user.Nombre[0]}
              {user.ApellidoPaterno[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {user.Nombre} {user.ApellidoPaterno} {user.ApellidoMaterno}
            </CardTitle>
            <p className="text-muted-foreground text-sm">#{user.Personal}</p>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-4">
          <InfoItem label="Puesto" value={user.Puesto} />
          <InfoItem label="Departamento" value={user.Departamento} />
          <InfoItem label="Tipo de Pago" value={user.PeriodoTipo || "No especificado"} />
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
