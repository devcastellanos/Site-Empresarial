"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Image from "next/image";

type Personal = {
  Personal: string;
  Nombre: string;
  ApellidoPaterno?: string;
  ApellidoMaterno?: string;
  Sexo?: string | null;
  Puesto?: string | null;
  Departamento?: string | null;
  Estatus?: string;
};

interface Props {
  rows: Personal[];
  onEdit: (row: Personal) => void;
}

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

const EmpleadoImage = ({ id, size = 50 }: { id: string; size?: number }) => {
  const [src, setSrc] = useState("/image/user.jpg");

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${id}.jpg`;

    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (res.ok) setSrc(`${url}?v=${Date.now()}`); // cache-busting
      })
      .catch(() => {
        // usar imagen por defecto
        setSrc("/image/user.jpg");
      });
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
      <Image
        src={src}
        alt={`Empleado ${id}`}
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
        onError={() => setSrc("/image/user.jpg")}
      />
    </Box>
  );
};

export const TablaPersonal = React.memo(({ rows, onEdit }: Props) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ flex: 1, overflow: "hidden" }}>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F3E8E5" }}>
              <TableCell><strong>Foto</strong></TableCell>
              <TableCell><strong>Número Empleado</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Departamento</strong></TableCell>
              <TableCell><strong>Puesto</strong></TableCell>
              <TableCell><strong>Estatus</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row.Personal} hover>
                <TableCell><EmpleadoImage id={row.Personal} /></TableCell>
                <TableCell>{row.Personal}</TableCell>
                <TableCell>{[row.Nombre, row.ApellidoPaterno, row.ApellidoMaterno].filter(Boolean).join(" ")}</TableCell>
                <TableCell>{row.Departamento}</TableCell>
                <TableCell>{row.Puesto}</TableCell>
                <TableCell>
                  <Chip
                    label={row.Estatus}
                    color={getEstatusColor(row.Estatus || "")}
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEdit(row)}
                    sx={{
                      textTransform: "none",
                      borderColor: "#9A3324",
                      color: "#9A3324",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#FBE9E7",
                        borderColor: "#7A281C",
                        color: "#7A281C",
                      },
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

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        sx={{
          mt: 1,
          backgroundColor: "#FFF8F6",
          borderRadius: 2,
          ".MuiTablePagination-toolbar": { justifyContent: "flex-end" },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-input": {
            display: "none",
          },
        }}
      />
    </Box>
  );
});

TablaPersonal.displayName = "TablaPersonal";

