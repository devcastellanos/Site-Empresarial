import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Person = {
  name: string
  role: string
  image: string
  team?: Person[]
  extraInfo?: string
}

const people: Person[] = [
  {
    name: "Jesús Rodríguez",
    role: "Gerente de CH",
    image: "/fotos/1848.jpg",
    team: [
      {
        name: "Yara Martínez",
        role: "Auxiliar CH CD México",
        image: "/fotos/yara.jpg",
      },
      {
        name: "Víctor Monroy",
        role: "Coord. Relaciones Laborales",
        image: "/fotos/2100.jpg",
      },
      {
        name: "Jesús Yánez",
        role: "Coord. Nóminas",
        image: "/fotos/1444.jpg",
        team: [
          {
            name: "Mauricio Monterde",
            role: "Auxiliar de Nóminas",
            image: "/fotos/mauricio.jpg",
          }
        ]
      },
      {
        name: "Marcela Rosas",
        role: "Coord. DO",
        image: "/fotos/1190.jpg",
        team: [
          {
            name: "Julio Rodríguez",
            role: "Auxiliar de DO",
            image: "/fotos/1985.jpg",
          }
        ]
      },
      {
        name: "Mariana Pérez",
        role: "Coord. de Capacitación",
        image: "/fotos/mariana.jpg",
        team: [
          {
            name: "Lezly Rodríguez",
            role: "Auxiliar de DO",
            image: "/fotos/lezly.jpg",
          }
        ]
      },
      {
        name: "Néstor Bañuelos",
        role: "Coord. Entrenamiento Operativo",
        image: "/fotos/nestor.jpg",
      },
      {
        name: "Edith Correa",
        role: "Coord. Atracción de Talento",
        image: "/fotos/2164.png",
        team: [
          {
            name: "Karen Arriaga",
            role: "Aux. Atracción de Talento",
            image: "/fotos/2188.jpg",
            team: [
              {
                name: "Fernanda Glez",
                role: "Aux. Atracción de Talento",
                image: "/fotos/2522.jpg",
              }
            ]
          }
        ]
      },
      {
        name: "Helio García",
        role: "Paramédico",
        image: "/fotos/helio.jpg",
      },
      {
        name: "Alberto Cardona",
        role: "CH Selectara",
        image: "/fotos/alberto.jpg",
      }
    ]
  }
]

const PersonCard = ({ person }: { person: Person }) => (
  <Popover>
    <PopoverTrigger asChild>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260 }}
        className="cursor-pointer"
      >
        <Card className="w-48 bg-gray-200/40 dark:bg-gray-800/40 border border-gray-300 dark:border-zinc-700 backdrop-blur-md shadow-md hover:shadow-xl transition-all">
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
    </PopoverTrigger>
    <PopoverContent className="w-64" side="top" align="center">
      <Card>
        <CardContent className="p-4 space-y-2 text-sm">
          <h4 className="text-lg font-bold">{person.name}</h4>
          <p className="text-muted-foreground">{person.role}</p>
          {person.extraInfo && <p>{person.extraInfo}</p>}
        </CardContent>
      </Card>
    </PopoverContent>
  </Popover>
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
  const coordinadores = jesus.team?.filter(p => !["Yara Martínez", "Helio García"].includes(p.name)) || []
  const especiales = jesus.team?.filter(p => ["Yara Martínez", "Helio García"].includes(p.name)) || []

  return (
    <div className="p-6 max-w-screen-2xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-lg border">
      <h2 className="text-center text-4xl font-bold mb-10 tracking-tight text-primary">
        Capital Humano Tarahumara
      </h2>

      <div className="mb-6 text-center">
        <span className="text-sm bg-primary text-white px-3 py-1 rounded-full shadow">Gerencia</span>
      </div>

      <div className="flex justify-center mb-12">
        <PersonCard person={jesus} />
      </div>

      <div className="mb-6 text-center">
        <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full shadow">Coordinaciones</span>
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

      {especiales.length > 0 && (
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-4">Equipo Especial</h3>
          <div className="flex justify-center gap-10 flex-wrap">
            {especiales.map((person, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <PersonCard person={person} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrgChart
