"use client"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

type Person = {
  name: string
  role: string
  image: string
  email?: string
  phone?: string
  extraInfo?: string
  team?: Person[]
}

const people: Person[] = [
  {
    name: "Jesús Rodríguez",
    role: "Gerente de CH",
    image: "/fotos/1848.jpg",
    email: "jesus.rodriguez@tarahumara.com",
    team: [
      {
        name: "Jesús Yánez",
        role: "Coord. Nóminas",
        image: "/fotos/1444.jpg",
        email: "jesus.yanez@tarahumara.com",
        team: [
          {
            name: "Mauricio Monterde",
            role: "Auxiliar de Nóminas",
            image: "/fotos/2525.jpg",
            email: "mauricio.monterde@tarahumara.com",
          }
        ]
      },
      {
        name: "Marcela Rosas",
        role: "Coord. DO",
        image: "/fotos/1190.jpg",
        email: "marcela.rosas@tarahumara.com",
        team: [
          {
            name: "Julio Rodríguez",
            role: "Auxiliar de DO",
            image: "/fotos/1985.jpg",
            email: "julio.rodriguez@tarahumara.com",
          }
        ]
      },
      {
        name: "Mariana Pérez",
        role: "Coord. de Capacitación",
        image: "/fotos/2323.jpg",
        email: "mariana.perez@tarahumara.com",
        team: [
          {
            name: "Lezly Rodríguez",
            role: "Auxiliar de DO",
            image: "/fotos/2557.jpg",
            email: "lezly.rodriguez@tarahumara.com",
          }
        ]
      },
      {
        name: "Néstor Bañuelos",
        role: "Coord. Entrenamiento Operativo",
        image: "/fotos/2324.jpg",
        email: "nestor.banuelos@tarahumara.com",
      },
      {
        name: "Edith Correa",
        role: "Coord. Atracción de Talento",
        image: "/fotos/2164.png",
        email: "edith.correa@tarahumara.com",
        team: [
          {
            name: "Karen Arriaga",
            role: "Aux. Atracción de Talento",
            image: "/fotos/2188.jpg",
            email: "karen.arriaga@tarahumara.com",
            team: [
              {
                name: "Fernanda Glez",
                role: "Aux. Atracción de Talento",
                image: "/fotos/2522.jpg",
                email: "fernanda.glez@tarahumara.com",
              }
            ]
          }
        ]
      },
      {
        name: "Helio García",
        role: "Paramédico",
        image: "/fotos/helio.jpg",
        phone: "523311234567",
        email: "helio.garcia@tarahumara.com",
        extraInfo: "Responsable de primeros auxilios y emergencias médicas",
      }
    ]
  }
]

const PersonCard = ({ person }: { person: Person }) => (
  <Dialog>
    <DialogTrigger asChild>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="cursor-pointer"
      >
        <Card className="w-44 bg-white/60 dark:bg-zinc-900/30 backdrop-blur border border-gray-300 dark:border-zinc-700 shadow-md hover:shadow-lg transition-all rounded-xl">
          <CardContent className="flex flex-col items-center justify-center p-4 space-y-3">
            <img
              src={person.image}
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
      <img src={person.image} alt={person.name} className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary" />
      <h2 className="text-lg font-bold">{person.name}</h2>
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
    !["Alberto Cardona", "Helio García"].includes(p.name)
  ) || []

  return (
    <div className="p-8 max-w-screen-2xl mx-auto rounded-lg">
      <h2 className="text-center text-4xl font-extrabold mb-10 tracking-tight text-white">
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

      <div className="flex justify-center gap-12 flex-wrap">
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
