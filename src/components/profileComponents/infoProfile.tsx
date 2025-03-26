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
  Personal: 12345,
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
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user.Nombre}+${user.ApellidoPaterno}`}
              alt="Avatar"
            />
            <AvatarFallback>
              {user.Nombre[0]}
              {user.ApellidoPaterno[0]}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">
            {user.Nombre} {user.ApellidoPaterno} {user.ApellidoMaterno}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            #{user.Personal}
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoItem label="Estatus" value={user.Estatus} />
          <InfoItem label="Puesto" value={user.Puesto} />
          <InfoItem label="Departamento" value={user.Departamento} />
          <InfoItem
            label="Tipo de Pago"
            value={user.PeriodoTipo || "No especificado"}
          />
        </CardContent>
      </Card>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default InfoProfile;
