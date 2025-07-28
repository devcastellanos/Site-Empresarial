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
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as XLSX from "xlsx";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Personal = {
  Personal: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fotoSrc, setFotoSrc] = useState("/image/user.jpg");

  useEffect(() => {
    fetch("http://localhost:3041/api/personal")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((err) => console.error("Error loading data:", err))
      .finally(() => setLoading(false));
  }, []);

    useEffect(() => {
    if (selectedRow?.Personal) {
      setFotoSrc(`${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${selectedRow.Personal}.jpg`);
    }
  }, [selectedRow]);

  const handleReturn = () => {
    router.push("/Perfil");
  };

  const handleFieldChange = (field: string, value: string) => {
    setSelectedRow((prev) => ({ ...prev!, [field]: value }));
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

    try {
      const isNew = !selectedRow.Personal;

      const endpoint = isNew
        ? "http://localhost:3041/api/personal"
        : `http://localhost:3041/api/personal/${selectedRow.Personal}`;

      const response = await fetch(endpoint, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedRow),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error:", response.status, errorText);
        throw new Error(`Error al guardar: ${response.statusText}`);
      }

      const updated = await response.json();

      setRows((prev) => {
        if (isNew) return [...prev, updated];
        return prev.map((row) =>
          row.Personal === updated.Personal ? { ...row, ...updated } : row
        );
      });

      handleDialogClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      console.error("❌ Error al guardar:", msg);
      alert("Error al guardar: " + msg);
    }
  };

  const filteredRows = rows.filter((r) =>
  r.Personal?.toLowerCase().includes(filters.Personal.toLowerCase()) &&
  r.Nombre?.toLowerCase().includes(filters.nombre.toLowerCase()) &&
  r.Departamento?.toLowerCase().includes(filters.departamento.toLowerCase()) &&
  r.Estatus?.toLowerCase().includes(filters.estatus.toLowerCase())
);

  // Nuevo orden aplicado
  const sortedRows = [...filteredRows].sort(
    (a, b) => parseInt(b.Personal) - parseInt(a.Personal)
  );

  const EmpleadoImage = ({ id, size = 50 }: { id: string; size?: number }) => {
    const [src, setSrc] = useState("");

    useEffect(() => {
      const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${id}.jpg`;
      fetch(url, { method: "HEAD" })
        .then((res) => {
          if (res.ok) setSrc(url);
          else setSrc("/image/user.jpg");
        })
        .catch(() => setSrc("/image/user.jpg"));
    }, [id]);

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
        <img
          src={src}
          alt={`Empleado ${id}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
    );
  };


  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#FAF4F2", p: { xs: 2, sm: 3, md: 4 } }}>
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

        <Button variant="outlined" onClick={() => { setSelectedRow({}); setOpenDialog(true); }} sx={{ borderColor: "#9A3324", color: "#9A3324", "&:hover": { borderColor: "#7A281C", backgroundColor: "#F8EDEB" } }}>
          Nuevo registro
        </Button>
      </Box>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Número de empleado"
          value={filters.Personal || ""}
          onChange={(e) => setFilters({ ...filters, Personal: e.target.value })}
          size="small"
        />
        <TextField
          label="Buscar por nombre"
          value={filters.nombre}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          size="small"
        />
        <TextField
          label="Departamento"
          value={filters.departamento}
          onChange={(e) => setFilters({ ...filters, departamento: e.target.value })}
          size="small"
        />
        <TextField
          label="Estatus"
          value={filters.estatus}
          onChange={(e) => setFilters({ ...filters, estatus: e.target.value })}
          size="small"
        />
      </Box>


      {/* Tabla */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#9A3324" }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Foto</TableCell>
                <TableCell>Número Empleado</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Puesto</TableCell>
                <TableCell>Estatus</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row) => (
                <TableRow key={row.Personal} hover onClick={() => handleRowClick(row)}>
                  <TableCell>
                    <EmpleadoImage id={row.Personal} />
                  </TableCell>
                  <TableCell>{row.Personal}</TableCell>
                  <TableCell>{row.Nombre} {row.ApellidoPaterno}</TableCell>
                  <TableCell>{row.Departamento}</TableCell>
                  <TableCell>{row.Puesto}</TableCell>
                  <TableCell>{row.Estatus}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRow(row);
                        setFotoSrc(`${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${row.Personal}.jpg`);
                        setOpenDialog(true);
                      }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          <Typography variant="h6">
            {selectedRow?.Nombre
              ? `Editar a ${selectedRow?.Nombre} ${selectedRow?.ApellidoPaterno ?? ""}`
              : "Nuevo registro"}
          </Typography>
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
          {/* Tarjeta del empleado */}
          <Box
            sx={{
              flex: "0 0 300px",
              textAlign: "center",
              backgroundColor: "#FFFFFF",
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Image
              src={fotoSrc}
              alt="Foto del empleado"
              width={200}
              height={200}
              style={{ borderRadius: "50%", border: "4px solid #ccc", objectFit: "cover" }}
              onError={() => setFotoSrc("/image/user.jpg")}
            />

            <Typography variant="h6" sx={{ mt: 2, color: "#333" }}>
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
                Object.keys(selectedRow).map((key) => (
                  <TextField
                    key={key}
                    label={key}
                    value={selectedRow[key as keyof Personal] ?? ""}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    fullWidth
                    size="small"
                    disabled={key === "Personal"}
                  />
                ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ backgroundColor: "#FFF8F6", justifyContent: "flex-end", p: 3 }}>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#B7422B",
              color: "#fff",
              "&:hover": { backgroundColor: "#9A3324" },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
