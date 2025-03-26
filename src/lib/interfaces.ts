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

export interface CursoTomado {
  id: number;
  id_course: number;
  id_usuario: number;
  title: string;
  description: string;
  tutor: string;
  progress: string;
  status: string;
  start_date: string;
  end_date?: string;
}

export interface CursosPresencialesJson {
  id_course: number;
  title: string;
  description: string;
  tutor: string;
  progress: string;
  status: string;
  start_date: string;
  end_date?: string;
}