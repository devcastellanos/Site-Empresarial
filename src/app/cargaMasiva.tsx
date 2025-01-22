'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelUploader: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; 
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet); 
          response(jsonData)
          setData(jsonData); 
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const response = async (data:any[]) => {
    try {
      const res = await fetch("http://api-cursos.192.168.29.40.sslip.io/updateCargaMasiva", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(data), 
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log("Datos insertados:", data);
      } else {
        console.error("Error en la solicitud:", res.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  

  return (
    <div>
      <h1>Cargar archivo Excel</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      
      <div>
        <h2>Datos cargados:</h2>
        {data.length > 0 ? (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {/* Generar encabezados dinámicamente */}
                {Object.keys(data[0]).map((key, index) => (
                  <th key={index} style={{ padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Generar celdas dinámicamente */}
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se han cargado datos aún.</p>
        )}
      </div>
    </div>
  );
};

export default ExcelUploader;
