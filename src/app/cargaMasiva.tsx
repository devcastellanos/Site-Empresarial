'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { da } from 'date-fns/locale';

const ExcelUploader: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [expirationDate, setExpirationDate] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    data.length = 0;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const customHeaders = ["id_usuario", "puesto", "departamento", "curso", "fecha", "tutor", "progress"];

          const jsonData = XLSX.utils.sheet_to_json(sheet, {
            header: customHeaders,
            range: 1,
            defval: null,
          }).filter(row => Object.values(row as { [key: string]: any }).some(value => value !== null));

          // Agregar la fecha de expiración a cada curso
          const updatedData = jsonData.map((row) => {
            if (typeof row === 'object' && row !== null) {
              return {
                ...row,
                end_date: expirationDate || null, // Si no hay fecha seleccionada, asigna null
              };
            }
            return row;
          });

          console.log("Datos procesados:", updatedData);
          setData(updatedData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = async () => {
    if (!data.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'No hay datos para cargar.',
      });
      return;
    }

   //swal fire estas seguro de cargar esta informacion?
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cargar esta información?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cargar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return;
    }


    try {
      const res = await fetch("http://api-cursos.192.168.29.40.sslip.io/updateCargaMasiva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Datos insertados correctamente',
        });
      } else {
        const errorData = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error en la solicitud: ${errorData.message || res.statusText}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error en la solicitud: ${(error as any).message}`,
      });
    }
  };

  return (
    <Card className="p-6 shadow-lg" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
      <Typography 
        variant="h2" 
        color="blue-gray" 
        className="mb-4" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}} 
        placeholder=""
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
          crossOrigin=""
          onPointerLeaveCapture={() => {}}
          onPointerEnterCapture={() => {}}
        />

        <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">Fecha de expiración</label>
        <Input
          type="date"
          placeholder="Fecha de expiración del curso"
          className="focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            
            setExpirationDate(e.target.value);
            setData(prevData => prevData.map(item => ({ ...item, end_date: e.target.value })))
          }}
          crossOrigin=""
          onPointerLeaveCapture={() => {}}
          onPointerEnterCapture={() => {}}
        />

        <Button color="blue" className="mt-4" onClick={handleUpload} placeholder=""
        onPointerLeaveCapture={() => {}}
        onPointerEnterCapture={() => {}}>
          Cargar datos
        </Button>
      </div>

      <div>
        <Typography variant="h4" color="blue-gray" className="mb-4" placeholder=""
          onPointerLeaveCapture={() => {}}
          onPointerEnterCapture={() => {}}>
          Datos cargados:
        </Typography>

        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-gray-50">
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-blue-gray-700 uppercase">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-blue-gray-50">
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-blue-gray-900">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography variant="paragraph" color="gray" className="mt-4" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            No se han cargado datos aún.
          </Typography>
        )}
      </div>
    </Card>
  );
};

export default ExcelUploader;
