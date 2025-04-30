  "use client";

  import React, { useState } from "react";
  import * as XLSX from "xlsx";
  import Swal from "sweetalert2";
  import { Card, Typography, Input, Button } from "@material-tailwind/react";
  import { da } from "date-fns/locale";
  import { motion } from "framer-motion";
  import { Download } from "lucide-react";

  const ExcelUploader: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [expirationDate, setExpirationDate] = useState<string>("");
    const videoOpacity = 0.5;
    
    const DownloadTemplate = () => {
      const templateData = [
        ["Numero de Empleado", "Puesto", "Departamento", "Nombre del curso", "Impartido por", "Progreso"],
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registro Masivo");
      XLSX.writeFile(workbook, "Registro_Masivo.xlsx");
    };

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

            const customHeaders = [
              "id_usuario",
              "puesto",
              "departamento",
              "curso",
              "tutor",
              "progress",
            ];

            const jsonData = XLSX.utils
              .sheet_to_json(sheet, {
                header: customHeaders,
                range: 1,
                defval: null,
              })
              .filter((row) =>
                Object.values(row as { [key: string]: any }).some(
                  (value) => value !== null
                )
              );

            console.log("Datos procesados:", jsonData);
            setData(jsonData);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const handleUpload = async () => {
      if (!data.length) {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "No hay datos para cargar.",
        });
        return;
      }

      //swal fire estas seguro de cargar esta informacion?
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas cargar esta información?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cargar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }

      console.log("Datos a cargar:", data);

      try {
        const res = await fetch(
          "https://api-site-cursos.in.grupotarahumara.com.mx/updateCargaMasiva",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Datos insertados correctamente",
          });
        } else {
          const errorData = await res.json();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Error en la solicitud: ${errorData.message || res.statusText}`,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error en la solicitud: ${(error as any).message}`,
        });
      }
    };

    return (
      <div className="relative w-full h-auto flex items-top justify-center mt-40">
      <motion.video
          autoPlay
          loop
          muted
          className="fixed top-0 left-0 w-full h-full object-cover -z-20"
          style={{ opacity: videoOpacity }}
        >
          <source src="/image/background.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </motion.video>
      <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl w-3/4"
        {...({} as any)}
      >
        <Typography
          variant="h2"
          color="blue-gray"
          className="mb-4"
          {...({} as any)}
        >
          Cargar archivo Excel
        </Typography>

        <div className="flex flex-row ">
          <div className="mb-8 w-44">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Selecciona archivo Excel
            </label>
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="focus:ring-2 focus:ring-blue-500 "
{...({} as any)}
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
              Fecha de Asignación
            </label>
            <Input
              type="date"
              placeholder="Fecha de expiración del curso"
              className="focus:ring-2 focus:ring-blue-500 "
              onChange={(e) => {
                setExpirationDate(e.target.value);
                setData((prevData) =>
                  prevData.map((item) => ({
                    ...item,
                    start_date: e.target.value,
                  }))
                );
              }}
{...({} as any)}
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
              Fecha de Expiración
            </label>
            <Input
              type="date"
              placeholder="Fecha de expiración del curso"
              className="focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setExpirationDate(e.target.value);
                setData((prevData) =>
                  prevData.map((item) => ({ ...item, end_date: e.target.value }))
                );
              }}
{...({} as any)}
            />

            <Button
              color="blue"
              className="mt-4"
              onClick={handleUpload}
{...({} as any)}
            >
              Cargar datos
            </Button>

            <Button
              color="red"
              className="mt-4"
              onClick={DownloadTemplate}
{...({} as any)}
            >
              Descargar plantilla
            </Button>
          </div>
          <div className="flex-1 ml-8">
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-4 text-center"
            
{...({} as any)}
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
                        className="px-6 py-3 text-left text-xs font-medium text-blue-gray-700 uppercase"
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
{...({} as any)}
            >
              No se han cargado datos aún.
            </Typography>
          )}
        </div>
        </div>

        
      </Card>
      </div>
    );
  };

  export default ExcelUploader;
