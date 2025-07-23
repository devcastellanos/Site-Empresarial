"use client"
import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"
import { useState } from "react"
import { UserCircle } from "lucide-react"

type Person = {
  name: string
  role: string
  employeeId: string
  email?: string
  phone?: string
  extraInfo?: string
  team?: Person[]
}

const people: Person[] = [
  {
    name: "Jesús Rodríguez",
    role: "Gerente de CH",
    employeeId: "1848",
    email: "jesus.rodriguez@tarahumara.com",
    phone: "3322563398",
    team: [
      {
        name: "Jesús Yánez",
        role: "Coord. Nóminas",
        employeeId: "1444",
        email: "jesus.yanez@grupotarahumara.com.mx",
        phone: "3313331464",
        team: [
          {
            name: "Mauricio Monterde",
            role: "Auxiliar de Nóminas",
            employeeId: "2525",
            email: "mauricio.monterde@grupotarahumara.com.mx",
            phone:"3336628849",
          }
        ]
      },
      {
        name: "Marcela Rosas",
        role: "Coord. DO",
        employeeId: "1190",
        email: "marcela.rosas@grupotarahumara.com.mx ",
        phone:"3334961512",
        team: [
          {
            name: "Julio Rodríguez",
            role: "Auxiliar de DO",
            employeeId: "1985",
            email: "julio.rodriguez@grupotarahumara.com.mx",
            phone:"3310112308",
          }
        ]
      },
      {
        name: "Mariana Pérez",
        role: "Coord. de Capacitación",
        employeeId: "2323",
        email: "mariana.perez@grupotarahumara.com.mx" ,
        phone: "3314179174",
        team: [
          {
            name: "Lezly Rodríguez",
            role: "Auxiliar de DO",
            employeeId: "2557",
            email: "lezly.rodriguez@grupotarahumara.com.mx",
            phone: "3310963475",
          }
        ]
      },
      {
        name: "Néstor Bañuelos",
        role: "Coord. Entrenamiento Operativo",
        employeeId: "2324",
        email: "nestor.banuelos@grupotarahumara.com.mx",
        phone: "3334428913",
      },
      {
        name: "Edith Correa",
        role: "Coord. Atracción de Talento",
        employeeId: "2164",
        email: "edith.correa@grupotarahumara.com.mx",
        phone: "3323893410",
        team: [
          {
            name: "Karen Arriaga",
            role: "Aux. Atracción de Talento",
            employeeId: "2188",
            email: "karen.arriaga@grupotarahumara.com.mx",
            phone: "3339473454",
            team: [
              {
                name: "Fernanda Gonzalez",
                role: "Aux. Atracción de Talento",
                employeeId: "2522",
                email: "fernanda.gonzalez@grupotarahumara.com.mx",
                phone: "3315644772",
              }
            ]
          }
        ]
      },
      {
        name: "Liliana Arana",
        role: "Coord. Relaciones",
        employeeId: "2640",
        email: "liliana.arana@grupotarahumara.com.mx",
        phone: "3326377507",
      },
      {
        name: "Helio García",
        role: "Paramédico",
        employeeId: "1856",
        phone: "3320809592",
        email: "helio.garcia@grupotarahumara.com.mx",
        extraInfo: "Responsable de primeros auxilios y emergencias médicas",
      }
    ]
  }
]

const PersonImage = ({
  employeeId,
  alt,
  className,
}: {
  employeeId: string
  alt: string
  className: string
}) => {
  const [hasError, setHasError] = useState(false)
  const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/${employeeId}.jpg`;

  if (hasError) {
    return <UserCircle className={`${className} text-zinc-400 bg-white`} />
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={96}
      height={96}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}

const PersonCard = ({ person }: { person: Person }) => (
  <Dialog>
    <DialogTrigger asChild>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="cursor-pointer"
      >
        <Card className="w-44 bg-white/60 backdrop-blur border border-gray-300 dark:border-zinc-700 shadow-md hover:shadow-lg transition-all rounded-xl">
          <CardContent className="flex flex-col items-center justify-center p-4 space-y-3">
            <PersonImage
              employeeId={person.employeeId}
              alt={person.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />
            <Badge variant="outline" className="text-center px-2 text-xs bg-primary text-white rounded-md">
              {person.name}
            </Badge>
            <Badge variant="secondary" className="text-center px-2 text-[11px] text-muted-foreground rounded-md">
              {person.role}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </DialogTrigger>

    <DialogContent className="max-w-md text-center">
        
      <PersonImage
        employeeId={person.employeeId}
        alt={person.name}
        className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary"
      />
      <DialogTitle>{person.name}</DialogTitle>
      <p className="text-muted-foreground text-sm mb-2">{person.role}</p>
      {person.extraInfo && <p className="mb-4 text-sm text-zinc-700">{person.extraInfo}</p>}
      <div className="flex justify-center gap-4">
        {person.phone && (
          <a href={`https://wa.me/${person.phone}`} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="border border-primary text-primary hover:bg-primary/10">
              <Phone className="w-4 h-4 mr-1" /> WhatsApp
            </Button>
          </a>
        )}
        {person.email && (
          <a href={`mailto:${person.email}`}>
            <Button variant="ghost" size="sm" className="border border-primary text-primary hover:bg-primary/10">
              <Mail className="w-4 h-4 mr-1" /> Correo
            </Button>
          </a>
        )}
      </div>
    </DialogContent>
  </Dialog>
)

const renderTree = (team: Person[], level = 0) => (
  <div className="flex flex-col items-center">
    <div className="flex justify-center gap-12 flex-wrap mt-6">
      {team.map((person, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <PersonCard person={person} />
          {person.team && (
            <>
              <div className="h-6 w-0.5 bg-gray-400" />
              <div className="flex justify-center gap-10 mt-4">
                {renderTree(person.team, level + 1)}
              </div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  </div>
)

const OrgChart = () => {
  const jesus = people[0]
  const helio = jesus.team?.find(p => p.name === "Helio García")
  const coordinadores = jesus.team?.filter(p =>
    !["Helio García"].includes(p.name)
  ) || []

  return (
    <div className="p-8 max-w-screen-2xl mx-auto rounded-lg">
      <h2 className="text-center text-4xl font-extrabold mb-10 tracking-tight text-black">
        Capital Humano Tarahumara
      </h2>

      <div className="mb-6 text-center">
        <span className="text-sm bg-primary text-white px-4 py-1 rounded-full shadow">Gerencia</span>
      </div>

      <div className="flex justify-center mb-12 relative">
        <div className="flex flex-col items-center">
          <PersonCard person={jesus} />
          <div className="w-0.5 h-6 bg-gray-400 my-1" />
          <div className="w-32 h-0.5 bg-gray-400" />
        </div>
        {helio && (
          <div className="absolute left-[70%] top-12 flex flex-col items-center">
            <div className="h-0.5 w-4 bg-gray-400" />
            <PersonCard person={helio} />
          </div>
        )}
      </div>

      <div className="mb-6 text-center">
        <span className="text-sm bg-green-600 text-white px-4 py-1 rounded-full shadow">Coordinaciones</span>
      </div>

      <div className="flex justify-center gap-6 flex-wrap">
        {coordinadores.map((coord, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <PersonCard person={coord} />
            {coord.team && (
              <>
                <div className="h-6 w-0.5 bg-gray-400" />
                <div className="flex justify-center gap-10 mt-4">
                  {renderTree(coord.team, 1)}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default OrgChart
