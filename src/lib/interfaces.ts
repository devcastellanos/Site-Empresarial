
export interface User {
  Personal: number;
  num_empleado?: number;
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
  vacaciones_acumuladas: number;
  vacaciones_ley: number;
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
  category?: string;
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

//posts interfaces
export interface Post {
  idBlog: number;
  img: string[];
  tag: string;
  title: string;
  desc: string;
  date: string;
  img_author: string;
  name_author: string;
  num_empleado: number;
  likes: number;
  videoUrl?: string;
  impact: "bajo" | "medio" | "alto";
}

export interface Comentarios {
  idComentario: number;
  idBlog: number;
  num_empleado: number;
  contenido: string;
  fecha: string;
  editado: boolean;
}

export interface Course {
  id_course:number,
  title: string;
  description: string;
  area: string;
  tutor: string;
  start_date: string; 
  end_date: string;  
  status: string;
  noEndDate?: boolean;
  category?: string;
}
