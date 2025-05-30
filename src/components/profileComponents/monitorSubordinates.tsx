"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import { useAuth } from "@/app/context/AuthContext"
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useMemo } from "react"

type Asistencia = {
    INC: string
    FECHA: string
    DIA_SEM: string
    ENTRADA_PROGRAMADA: string
    SALIDA_PROGRAMADA: string
    TIPO_ASISTENCIA: string
    NOMBRE_INCIDENCIA: string | null
}

type Empleado = {
    Personal: string
    Nombre: string
    ApellidoPaterno: string
    ApellidoMaterno: string
    Departamento: string
    Puesto: string
    asistencia?: Asistencia[]
}

type Resumen = {
    total: number
    faltas: number
    retardos: number
    noCheco: number
}

export default function MonitorSubordinates() {
    const [empleados, setEmpleados] = useState<Empleado[]>([])
    const [loading, setLoading] = useState(true)
    const [openDialog, setOpenDialog] = useState<Empleado | null>(null)
    const { user } = useAuth()
    const [openResumen, setOpenResumen] = useState(false)

    useEffect(() => {
        if (!user?.num_empleado) return

        axios
            .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/monitoreo-subordinados?num_empleado=${user.num_empleado}`)
            .then((res) => {
                const data = res.data?.data ?? []
                setEmpleados(data)
            })
            .catch((err) => console.error("Error:", err))
            .finally(() => setLoading(false))
    }, [user?.num_empleado])

    const resumenGlobal = useMemo(() => {
        const resumen = {
            empleados: empleados.length,
            dias: 0,
            faltas: 0,
            retardos: 0,
            noCheco: 0,
        }

        empleados.forEach(emp => {
            emp.asistencia?.forEach(a => {
                if (
                    a.TIPO_ASISTENCIA.toLowerCase().includes("descanso") ||
                    a.TIPO_ASISTENCIA.toLowerCase().includes("séptimo")
                ) return

                resumen.dias++
                if (a.TIPO_ASISTENCIA.toLowerCase().includes("falta")) resumen.faltas++
                else if (a.INC === "RET" || a.NOMBRE_INCIDENCIA?.toLowerCase().includes("retardo")) resumen.retardos++
                else if (
                    a.TIPO_ASISTENCIA.toLowerCase().includes("no chec") ||
                    a.NOMBRE_INCIDENCIA?.toLowerCase().includes("no chec")
                ) resumen.noCheco++
            })
        })

        return resumen
    }, [empleados])

    const dataChart = [
        { name: 'Faltas', value: resumenGlobal.faltas },
        { name: 'Retardos', value: resumenGlobal.retardos },
        { name: 'No checó salida', value: resumenGlobal.noCheco },
        { name: 'Asistencias', value: resumenGlobal.dias - resumenGlobal.faltas - resumenGlobal.retardos - resumenGlobal.noCheco }
    ]

    const COLORS = ['#EF4444', '#FBBF24', '#3B82F6', '#10B981']


    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-56 rounded-xl" />
                ))}
            </div>
        )
    }

    if (!empleados.length) {
        return (
            <div className="text-center text-muted-foreground mt-10">
                No se encontraron subordinados con registros de asistencia.
            </div>
        )
    }

    return (
        <>
                    <div className="flex justify-center mb-4">
                <Button onClick={() => setOpenResumen(true)}>
                    📊 Ver resumen general
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {empleados.map((emp) => (
                    <Card key={emp.Personal} className="shadow-md">
                        <CardHeader className="bg-[#9A3324] text-white rounded-t-xl">
                            <CardTitle className="text-lg">
                                {emp.Nombre} {emp.ApellidoPaterno} {emp.ApellidoMaterno}
                            </CardTitle>
                            <CardDescription className="text-white/80">
                                {emp.Puesto} • {emp.Departamento}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                            {emp.asistencia && emp.asistencia.length > 0 ? (
                                emp.asistencia
                                    .filter(a => !a.TIPO_ASISTENCIA.toLowerCase().includes("descanso") &&
                                        !a.TIPO_ASISTENCIA.toLowerCase().includes("séptimo"))
                                    .slice(-7)
                                    .map((a) => {
                                        let badgeColor = "border-green-600 text-green-600"
                                        let badgeText = a.TIPO_ASISTENCIA

                                        if (a.TIPO_ASISTENCIA.toLowerCase().includes("falta")) {
                                            badgeColor = "border-red-500 text-red-500"
                                            badgeText = "Falta"
                                        } else if (a.NOMBRE_INCIDENCIA?.toLowerCase().includes("retardo") || a.INC === "RET") {
                                            badgeColor = "border-yellow-500 text-yellow-500"
                                            badgeText = "Retardo"
                                        } else if (a.TIPO_ASISTENCIA.toLowerCase().includes("no chec") ||
                                            a.NOMBRE_INCIDENCIA?.toLowerCase().includes("no chec")) {
                                            badgeColor = "border-blue-500 text-blue-500"
                                            badgeText = "No checó salida"
                                        }

                                        return (
                                            <div key={a.FECHA} className="flex justify-between items-start border-b pb-2">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {format(new Date(a.FECHA), "dd/MM/yyyy")} • {a.DIA_SEM}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {a.ENTRADA_PROGRAMADA} - {a.SALIDA_PROGRAMADA}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className={badgeColor}>
                                                    {badgeText}
                                                </Badge>
                                            </div>
                                        )
                                    })
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Sin registros recientes de asistencia.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={openResumen} onOpenChange={setOpenResumen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Resumen general de asistencia</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm space-y-2 mt-2">
                        <p><strong>Empleados:</strong> {resumenGlobal.empleados}</p>
                        <p><strong>Días registrados:</strong> {resumenGlobal.dias}</p>
                        <p><strong>Faltas:</strong> {resumenGlobal.faltas}</p>
                        <p><strong>Retardos:</strong> {resumenGlobal.retardos}</p>
                        <p><strong>No checó salida:</strong> {resumenGlobal.noCheco}</p>
                    </div>
                    <div className="mt-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={dataChart}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="value"
                                    paddingAngle={5}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(1)}%`
                                    }
                                >
                                    {dataChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "0.5rem",
                                        border: "1px solid #ccc",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: "0.85rem" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
