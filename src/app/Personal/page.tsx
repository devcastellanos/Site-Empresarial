"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as XLSX from "xlsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@mui/material"; // Asegúrate de importar esto
import { Chip, TablePagination } from "@mui/material"; // Asegúrate de tener estos imports
import { TablaPersonal } from "./TablaPersonal";

type Personal = {
  Personal: string;
  Nombre: string;
  ApellidoPaterno?: string;
  ApellidoMaterno?: string;
  Sexo?: string | null;
  Puesto?: string | null;
  Departamento?: string | null;
  Estatus?: string;
  CURP?: string;
  Tipo?: string;
  eMail?: string;
  Telefono?: string;
};

export default function PersonalPage() {
  const [rows, setRows] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Partial<Personal> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({ nombre: "", Personal: "", departamento: "", estatus: "ALTA" });
  const router = useRouter();
  const theme = useTheme();
  const rowsPerPage = 10;
  const [page, setPage] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fotoSrc, setFotoSrc] = useState("/image/user.jpg");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>({});
  const disabledFields = [
    "Cuenta Bancaria",
    "Forma de Pago",
    "Sucursal",
    "Cuenta Nómina",
    "NSS",
    "RFC",
    "CURP",
    "Fecha Alta",
    "Personal",
  ];

  const fieldMaxLengths: Record<string, number> = {
    Personal: 10,
    ApellidoPaterno: 30,
    ApellidoMaterno: 30,
    Nombre: 30,
    Tipo: 20,
    Direccion: 100,
    DireccionNumero: 20,
    DireccionNumeroInt: 20,
    Colonia: 100,
    Delegacion: 100,
    Poblacion: 100,
    Estado: 30,
    Pais: 30,
    CodigoPostal: 15,
    Telefono: 50,
    eMail: 50,
    ZonaEconomica: 30,
    CURP: 30, // Registro
    RFC: 30,  // Registro2
    NSS: 30,  // Registro3
    FormaPago: 50,
    CtaDinero: 10,
    PersonalSucursal: 50,
    PersonalCuenta: 20,
    LugarNacimiento: 50,
    Nacionalidad: 30,
    Beneficiario: 50,
    BeneficiarioParentesco: 20,
    PorcentajeBeneficiario: 10, // convertiremos float a string limitado si se requiere
    Beneficiario2: 50,
    Parentesco2: 20,
    Madre: 50,
    Padre: 50,
    ReportaA: 10,
    Estatus: 15,
    Sexo: 10,
    EstadoCivil: 20,
    PeriodoTipo: 20,
    TipoContrato: 50,
    Jornada: 20,
    TipoSueldo: 10,
    Situacion: 50
  };


  const personalMolde: Partial<Personal> & Record<string, any> = {
    Personal: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    Nombre: "",
    Sexo: "",
    Estatus: "",
    Puesto: "",
    Departamento: "",
    PeriodoTipo: "",
    TipoContrato: "",
    Jornada: "",
    TipoSueldo: "",
    FechaAntiguedad: "",
    Situacion: "",
    CURP: "",
    EstadoCivil: "",
    RFC: "",
    NSS: "",
    Tipo: "",
    Direccion: "",
    DireccionNumero: "",
    DireccionNumeroInt: "",
    Colonia: "",
    Delegacion: "",
    Poblacion: "",
    Estado: "",
    Pais: "",
    CodigoPostal: "",
    Telefono: "",
    eMail: "",
    ZonaEconomica: "",
    FormaPago: "",
    CtaDinero: "",
    PersonalSucursal: "",
    PersonalCuenta: "",
    FechaNacimiento: "",
    LugarNacimiento: "",
    Nacionalidad: "",
    Beneficiario: "",
    BeneficiarioParentesco: "",
    PorcentajeBeneficiario: "",
    Beneficiario2: "",
    Parentesco2: "",
    Madre: "",
    Padre: "",
    ReportaA: "",
  };

  useEffect(() => {
      fetch("http://localhost:3041/api/personal")
        .then((res) => res.json())
        .then((data) => setRows(data))
        .catch((err) => console.error("Error loading data:", err))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
    if (!selectedRow?.Personal) return;

    const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${selectedRow.Personal}.jpg`;

    fetch(imageUrl, { method: "HEAD" })
      .then((res) => {
        setFotoSrc(res.ok ? imageUrl : "/image/user.jpg");
      })
      .catch(() => setFotoSrc("/image/user.jpg"));
  }, [selectedRow?.Personal]);


  const handleReturn = () => {
    router.push("/Perfil");
  };

  const handleFieldChange = (field: string, value: string) => {
    setSelectedRow((prev) => {
      const updated = { ...prev!, [field]: value };

      setChangedFields((prevChanges) => ({
        ...prevChanges,
        [field]: true,
      }));

      return updated;
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus.toUpperCase()) {
      case "ALTA":
        return "success";
      case "BAJA":
        return "error";
      case "ASPIRANTE":
        return "warning";
      default:
        return "default";
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personal");
    XLSX.writeFile(workbook, `Personal_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleRowClick = (row: Personal) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!selectedRow) return;

    const requiredFields = ["Personal", "Estatus", "Nombre", "ApellidoPaterno", "ApellidoMaterno"];

    const cleanedData = Object.fromEntries(
      Object.entries(selectedRow).filter(
        ([key]) => changedFields[key] || requiredFields.includes(key)
      )
    );

    try {
      const endpoint = isNew
        ? "http://localhost:3041/api/personal"
        : `http://localhost:3041/api/personal/${selectedRow.Personal}`;

      const response = await fetch(endpoint, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error:", response.status, errorText);
        throw new Error(`Error al guardar: ${response.statusText}`);
      }

      const updated = await response.json();

      setRows((prev) => {
        if (isNew) return [...prev, updated];
        return prev.map((row) => (row.Personal === updated.Personal ? { ...row, ...updated } : row));
      });

      setSelectedRow((prev) => ({ ...prev, ...updated }));
      setChangedFields({});
      // No cerramos el diálogo
    } catch (error: any) {
      alert("Error al guardar: " + (error.message || "Error desconocido"));
    }
  };


  const filteredRows = rows.filter((r) => {
    const fullName = `${r.Nombre} ${r.ApellidoPaterno || ""} ${r.ApellidoMaterno || ""}`.toLowerCase();
    return (
      r.Personal?.toLowerCase().includes(filters.Personal.toLowerCase()) &&
      fullName.includes(filters.nombre.toLowerCase()) &&
      (r.Departamento || "").toLowerCase().includes(filters.departamento.toLowerCase()) &&
      (r.Estatus || "").toLowerCase().includes(filters.estatus.toLowerCase())
    );
  });

  // Nuevo orden aplicado
  const sortedRows = [...filteredRows].sort(
    (a, b) => parseInt(b.Personal) - parseInt(a.Personal)
  );

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const EmpleadoImage = ({ id, size = 50 }: { id: string; size?: number }) => {
    const [src, setSrc] = useState(`/image/user.jpg`);

    useEffect(() => {
      const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${id}.jpg`;

      fetch(imageUrl, { method: "HEAD" })
        .then((res) => {
          if (res.ok) setSrc(imageUrl);
        })
        .catch(() => {
          // ya está en default
        });
    }, [id]);

    const handleFieldChange = (field: string, value: string) => {
      setSelectedRow((prev) => {
        const updated = { ...prev!, [field]: value };
        setChangedFields((prevChanges) => ({
          ...prevChanges,
          [field]: true,
        }));
        return updated;
      });
    };

    return (
       <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid #ccc",
      }}
    >
      <Image
        src={src}
        alt={`Empleado ${id}`}
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
      />
    </Box>
    );
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#FAF4F2", p: { xs: 2, sm: 3, md: 6.5 } }}>
      {/* Encabezado */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image src="/image/logo.png" alt="Logo" width={120} height={80} />
          <IconButton onClick={handleReturn} sx={{ color: "#9A3324" }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" textAlign="center" sx={{ color: "#9A3324", flexGrow: 1 }}>
          Personal
        </Typography>

        <Button variant="contained" onClick={exportToExcel} startIcon={<DownloadIcon />} sx={{ backgroundColor: "#9A3324", "&:hover": { backgroundColor: "#7A281C" } }}>
          Exportar a Excel
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            const maxId = rows.reduce((max, row) => {
              const num = parseInt(row.Personal);
              return !isNaN(num) && num > max ? num : max;
            }, 0);

            const nextId = (maxId + 1).toString();

            setSelectedRow({ ...personalMolde, Personal: nextId });
            setChangedFields({ Personal: true });
            setFotoSrc("/image/user.jpg");
            setIsNew(true); // ✅ Marca que es nuevo
            setOpenDialog(true);
          }}
          sx={{
            borderColor: "#9A3324",
            color: "#9A3324",
            "&:hover": {
              borderColor: "#7A281C",
              backgroundColor: "#F8EDEB",
            },
          }}
        >
          Nuevo registro
        </Button>
      </Box>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Autocomplete
          options={[...new Set(rows.map((r) => r.Personal))]}
          value={filters.Personal}
          onChange={(_, value) => setFilters({ ...filters, Personal: value || "" })}
          renderInput={(params) => <TextField {...params} label="Número de empleado" size="small" />}
          sx={{ minWidth: 180 }}
          freeSolo
        />
        <Autocomplete
          options={[
            ...new Set(
              rows.map((r) =>
                [r.Nombre, r.ApellidoPaterno, r.ApellidoMaterno]
                  .filter(Boolean)
                  .join(" ")
                  .trim()
              )
            ),
          ]}
          value={filters.nombre}
          onChange={(_, value) => setFilters({ ...filters, nombre: value || "" })}
          renderInput={(params) => (
            <TextField {...params} label="Nombre completo" size="small" />
          )}
          sx={{ minWidth: 200 }}
          freeSolo
        />
        <Autocomplete
          options={[...new Set(rows.map((r) => r.Departamento || ""))]}
          value={filters.departamento}
          onChange={(_, value) => setFilters({ ...filters, departamento: value || "" })}
          renderInput={(params) => <TextField {...params} label="Departamento" size="small" />}
          sx={{ minWidth: 180 }}
          freeSolo
        />
        <Autocomplete
          options={[...new Set(rows.map((r) => r.Estatus || ""))]}
          value={filters.estatus}
          onChange={(_, value) => setFilters({ ...filters, estatus: value || "" })}
          renderInput={(params) => <TextField {...params} label="Estatus" size="small" />}
          sx={{ minWidth: 150 }}
          freeSolo
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, flex: 1 }}>
          <CircularProgress sx={{ color: "#9A3324" }} />
        </Box>
      ) : (
        <TablaPersonal
          rows={paginatedRows}
          onEdit={(row) => {
            setSelectedRow({ ...personalMolde, ...row });
            setChangedFields({});
            setFotoSrc(`${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${row.Personal}.jpg`);
            setOpenDialog(true);
          }}
        />
      )}

      {/* Diálogo */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullScreen>
        <DialogTitle
          sx={{
            backgroundColor: "#9A3324",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
            {selectedRow?.Nombre
              ? `Editar a ${selectedRow?.Nombre} ${selectedRow?.ApellidoPaterno ?? ""}`
              : "Nuevo registro"}
          </span>

          <Button onClick={handleDialogClose} sx={{ color: "white" }}>
            Cerrar
          </Button>
        </DialogTitle>


        <DialogContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            backgroundColor: "#FFF8F6",
            p: 3,
            height: "100%",
            gap: 4,
          }} 
        >
          <Box
            sx={{
              flex: "0 0 300px",
              textAlign: "center",
              background: "linear-gradient(145deg, #f2e8e6, #ffffff)",
              p: 3,
              borderRadius: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                overflow: "hidden",
                mx: "auto",
                border: "5px solid #9A3324",
              }}
            >
              {fotoSrc && (
                <Image
                  src={fotoSrc}
                  alt="Foto del empleado"
                  width={200}
                  height={200}
                  onError={() => setFotoSrc("")} // Limpia si hay 404
                />
              )}
            </Box>

            <Typography variant="h6" sx={{ mt: 2, color: "#9A3324", fontWeight: 600 }}>
              {selectedRow?.Nombre} {selectedRow?.ApellidoPaterno}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              {selectedRow?.Puesto || "Puesto no especificado"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              {selectedRow?.Departamento || "Departamento no especificado"}
            </Typography>
          </Box>


          {/* Formulario */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              backgroundColor: "#FFFFFF",
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              {selectedRow &&
                Object.keys(selectedRow).map((key) => {
                  const isDateField = [
                    "FechaNacimiento",
                    "FechaAlta",
                    "FechaAntiguedad",
                    "FechaBaja",
                    "AspiraFecha"
                  ].includes(key);

                  const value = (selectedRow as Record<string, any>)[key]

                  if (isDateField) {
                    // Convierte "DD/MM/YYYY" -> "YYYY-MM-DD"
                    const parts = typeof value === "string" ? value.split("/") : [];
                    const isoDate =
                      parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";

                    return (
                      <TextField
                        key={key}
                        label={key}
                        type="date"
                        value={isoDate}
                        onChange={(e) => {
                          const newValue = e.target.value; // "YYYY-MM-DD"
                          const formatted =
                            newValue && newValue !== ""
                              ? `${newValue.split("-")[2]}/${newValue.split("-")[1]}/${newValue.split("-")[0]}`
                              : "";
                          handleFieldChange(key, formatted);
                        }}
                        fullWidth
                        size="small"
                        disabled={!isNew && disabledFields.includes(key)}
                        InputLabelProps={{ shrink: true }}
                      />
                    );
                  }

                  return (
                    <TextField
                      key={key}
                      label={key}
                      value={value ?? ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      fullWidth
                      size="small"
                      disabled={!isNew && disabledFields.includes(key)}
                      inputProps={{ maxLength: fieldMaxLengths[key] || undefined }}
                      sx={{
                        "& .MuiInputBase-root": changedFields[key]
                          ? { backgroundColor: "#FFF0EC", border: "1px solid #9A3324" }
                          : {},
                      }}
                    />
                  );
                })}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: "#FFF8F6",
            justifyContent: "flex-end",
            p: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "0.95rem",
              textTransform: "none",
              borderColor: "#B7422B",
              color: "#B7422B",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "#FDECEA",
                borderColor: "#9A3324",
                color: "#9A3324",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={() => {
              if (Object.keys(changedFields).length === 0) {
                alert("No hay cambios para guardar.");
                return;
              }
              setPendingSave(true);
              setConfirmOpen(true);
            }}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "0.95rem",
              textTransform: "none",
              backgroundColor: "#B7422B",
              color: "white",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "#9A3324",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "#FFF8F6",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: 500,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#9A3324",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.25rem",
            p: 2,
          }}
        >
          Confirmar cambios
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            Los siguientes campos han sido modificados:
          </Typography>

          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            {Object.entries(changedFields).map(([field]) => (
              <li key={field}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{field}:</strong>{" "}
                  {String(selectedRow?.[field as keyof Personal] ?? "—")}
                </Typography>
              </li>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#F3E8E5" }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#9A3324",
              color: "#9A3324",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                borderColor: "#7A281C",
                backgroundColor: "#FBE9E7",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              if (pendingSave) {
                setPendingSave(false);
                handleSave();
              }
            }}
            variant="contained"
            sx={{
              backgroundColor: "#B7422B",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#9A3324",
              },
            }}
          >
            Confirmar y guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
