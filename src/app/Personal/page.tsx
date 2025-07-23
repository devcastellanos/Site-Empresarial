"use client";

import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridRowParams,
  useGridApiRef,
  GridRowId,
} from "@mui/x-data-grid";
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
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as XLSX from "xlsx";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Personal = {
  Personal: string; // será el identificador
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
  // puedes seguir agregando campos según lo que devuelva la API
};

export default function PersonalPage() {
  const [rows, setRows] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Partial<Personal> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const apiRef = useGridApiRef();

  useEffect(() => {
    fetch("http://localhost:3041/api/personal")
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
      })
      .catch((err) => console.error("Error loading data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = () => {
    router.push("/Perfil");
  };

  const handleFieldChange = (field: string, value: string) => {
    setSelectedRow((prev) => ({ ...prev!, [field]: value }));
  };

  const exportToExcel = () => {
    if (!apiRef.current) return;

    const dataToExport =
      selectedIds.length > 0
        ? selectedIds.map((id) => apiRef.current!.getRow(id))
        : rows;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personal");
    XLSX.writeFile(workbook, `Personal_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRow(params.row);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleSave = async () => {
    try {
      const isNew = !selectedRow?.Personal;

      const response = await fetch(`http://localhost:3041/api/personal${isNew ? '' : `/${selectedRow.Personal}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRow),
      });

      if (!response.ok) throw new Error("Error al guardar el registro");

      const updated = await response.json();

      if (isNew) {
        setRows((prev) => [...prev, updated]);
      } else {
        setRows((prev) =>
          prev.map((row) => (row.Personal === updated.Personal ? updated : row))
        );
      }

      setOpenDialog(false);
      setSelectedRow(null);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const columns = rows.length
    ? Object.keys(rows[0]).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        flex: 1,
        minWidth: 120,
        filterable: true,
      }))
    : [];

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#FAF4F2", overflow: "hidden", minHeight: "100%", p: { xs: 2, sm: 3, md: 4 } }}>
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

      {/* Tabla */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#9A3324" }} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: "100%", minHeight: "70vh" }}>
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            getRowId={(row) => row.Personal}
            checkboxSelection
            onRowClick={handleRowClick}
            onRowSelectionModelChange={(ids) =>
              setSelectedIds(Array.isArray(ids) ? ids : [])
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: 20, page: 0 },
              },
            }}
            pageSizeOptions={[20, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            density="compact"
            disableColumnMenu={false}
            autoHeight={false}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 3,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#E7C5BD",
                color: "#2E2E2E",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                color: "#2E2E2E",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#F0E0DA",
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: "#F7EAE5",
              },
            }}
          />
        </Box>
      )}

      {/* Diálogo de edición */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#9A3324", color: "white" }}>
          Editar Registro
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#FFF8F6" }}>
          {selectedRow &&
            Object.keys(selectedRow).map((key) => (
              <TextField
                key={key}
                label={key}
                value={selectedRow[key as keyof Personal] ?? ""}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                fullWidth
                margin="dense"
                disabled={key === "Personal"}
              />
            ))}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#FFF8F6" }}>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: "#B7422B", color: "#fff", "&:hover": { backgroundColor: "#9A3324" } }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
