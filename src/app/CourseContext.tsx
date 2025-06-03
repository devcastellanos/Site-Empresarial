import React, { createContext, useContext, useState } from 'react';
import { Course } from '@/lib/interfaces';

// Crear un contexto para los cursos
const CourseContext = createContext<{
  courses: Course[];
  addCourse: (course: Course) => void;
}>({
  courses: [],
  addCourse: () => {},
});

interface CourseProviderProps {
  children: React.ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  const addCourse = (course: Course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

// Hook para usar el contexto en cualquier parte de la app
export const useCourses = () => useContext(CourseContext);
