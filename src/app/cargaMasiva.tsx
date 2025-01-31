'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Card, Typography, Input, Button } from "@material-tailwind/react";

const ExcelUploader: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
         
          // Cambiar claves con encabezados personalizados
          const customHeaders = [
            "id_usuario", 
            "puesto", 
            "departamento", 
            "curso", 
            "fecha", 
            "tutor"
          ];
  
          // Convertir a JSON y detener el mapeo si encuentra filas vacías
          const jsonData = XLSX.utils.sheet_to_json(sheet, {
            header: customHeaders, // Reemplazar claves automáticamente
            range: 1, // Ignorar la primera fila (asume que son encabezados)
            defval: null // Rellena valores vacíos con `null`
          }).filter(row => Object.values(row as { [key: string]: any }).some(value => value !== null)); // Filtrar filas vacías
  
          console.log("Datos procesados:", jsonData);
  
          response(jsonData);
          setData(jsonData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  
  const response = async (data: any[]) => {
    try {
      const res = await fetch("http://api-cursos.192.168.29.40.sslip.io/updateCargaMasiva", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(data), 
      });
  
      if (res.ok) {
        const result = await res.json();
        console.log("Datos insertados:", result);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Datos insertados correctamente',
        });
      } else {
        const errorData = await res.json();

        // Verificar si el error es de tipo "Duplicate entry"
        if (errorData.code === 'ER_DUP_ENTRY') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El usuario ya está asignado a este curso.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error en la solicitud: ${errorData.message || res.statusText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error en la solicitud: ${(error as any).message}`,
      });
    }
  };
  

  return (
  <Card 
    className="p-6 shadow-lg" 
    placeholder="" 
    onPointerEnterCapture={() => {}} 
    onPointerLeaveCapture={() => {}}
  >
      <Typography 
        variant="h2" 
        color="blue-gray" 
        className="mb-4" 
        placeholder="" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}}
      >
        Cargar archivo Excel
      </Typography>

      <div className="mb-8">
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          label="Selecciona un archivo"
          className="focus:ring-2 focus:ring-blue-500"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          crossOrigin=""
        />
      </div>

      <div>
        <Typography 
          variant="h4" 
          color="blue-gray" 
          className="mb-4" 
          placeholder="" 
          onPointerEnterCapture={() => {}} 
          onPointerLeaveCapture={() => {}}
        >
          Datos cargados:
        </Typography>

        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-gray-50">
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-blue-gray-700 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-blue-gray-50">
                    {Object.values(row).map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-blue-gray-900"
                      >
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography 
            variant="paragraph" 
            color="gray" 
            className="mt-4" 
            placeholder="" 
            onPointerEnterCapture={() => {}} 
            onPointerLeaveCapture={() => {}}
          >
            No se han cargado datos aún.
          </Typography>
        )}
      </div>
    </Card>
  );
};


export default ExcelUploader;