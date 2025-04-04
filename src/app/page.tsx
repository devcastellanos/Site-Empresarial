"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <motion.section
        className="w-full min-h-screen flex items-center justify-center flex-col text-center px-6 relative overflow-hidden text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="z-10 max-w-5xl mx-auto py-24">
          <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-tinto-700 mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Grupo Tarahumara
          </motion.h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8">
            Impulsando el crecimiento, la innovación y el desarrollo humano en el corazón de México.
          </p>

          <div className="mt-12">
            <Image
              src="/image/logo.png"
              width={300}
              height={300}
              alt="Logo"
              className="mx-auto shadow-md"
            />
          </div>
        </div>
      </motion.section>

      {/* NUESTRA ESENCIA */}
      <section className="py-24 text-center text-gray-800 bg-white">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Nuestra Esencia</h2>
          <p className="text-lg sm:text-xl leading-relaxed">
            Por más de <strong>70 años</strong> y <strong>3 generaciones</strong>, Grupo Tarahumara se ha consolidado como líder nacional en la comercialización de frutas y vegetales.
            Nuestra pasión por el campo y la gente impulsa todo lo que hacemos.
          </p>
        </motion.div>
      </section>

      {/* LO QUE OFRECEMOS */}
      <section className="bg-gradient-to-r from-white to-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl sm:text-4xl font-semibold text-center mb-12">Lo que ofrecemos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Capacitación", desc: "Programas diseñados para el crecimiento profesional." },
              { title: "Bienestar", desc: "Un entorno saludable y humano para todos." },
              { title: "Innovación", desc: "Tecnología y mejora continua." },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={title}
                className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-transform"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold text-xl mb-2 text-tinto-700">{title}</h4>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN EXPLORA */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl sm:text-4xl font-semibold mb-12">Explora</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sucursales", href: "/sucursales", img: "/image/sucursales.png" },
              { name: "Exportaciones", href: "/exportaciones", img: "/image/exportaciones.png" },
              { name: "Huertas", href: "/huertas", img: "/image/huertas.png" },
              { name: "Alitara", href: "https://www.alitara.mx", img: "/image/alitara.png", target: "_blank" },
            ].map(({ name, href, img, target }) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={href}
                  target={target || "_self"}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  <Image
                    src={img}
                    alt={name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h4 className="text-white text-2xl font-bold">{name}</h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="bg-gray-100 py-20">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h3 className="text-3xl sm:text-4xl font-bold mb-10 text-tinto-700">Nuestra Huella</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {[ { label: "+10 países", desc: "Con presencia exportadora" },
        { label: "+5,000", desc: "Empleos generados" },
        { label: "+70 años", desc: "De experiencia en el campo" },
        { label: "+100 mil toneladas", desc: "De productos frescos anuales" }, ].map(({ label, desc }, i) => (
        <motion.div
          key={label}
          className="bg-white rounded-xl shadow p-6 border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="text-3xl font-bold text-tinto-700">{label}</h4>
          <p className="text-gray-600 mt-2">{desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* CONTACTO + FORMULARIO */}
<section className="bg-white py-24">
  <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* Card contacto */}
    <motion.div
      className="bg-gray-100 rounded-xl shadow-md p-6 space-y-4"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold text-tinto-700">Contáctanos</h3>
      <p className="text-gray-700"><strong>Dirección:</strong> Calle Frutas 123, Chihuahua, México</p>
      <p className="text-gray-700"><strong>Teléfono:</strong> +52 614 123 4567</p>
      <p className="text-gray-700"><strong>Email:</strong> contacto@grupotarahumara.com.mx</p>
    </motion.div>

    {/* Formulario */}
    <motion.form
      className="bg-gray-50 rounded-xl p-6 shadow space-y-4"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h4 className="text-2xl font-semibold text-gray-800">Solicita productos frescos</h4>
      <input
        type="text"
        placeholder="Nombre"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-tinto-600 focus:outline-none"
        required
      />
      <input
        type="email"
        placeholder="Correo"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-tinto-600 focus:outline-none"
        required
      />
      <textarea
        placeholder="Mensaje o solicitud"
        className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-tinto-600 focus:outline-none"
        required
      />
      <Button className="bg-tinto-700 hover:bg-tinto-800 w-full">Enviar</Button>
    </motion.form>
  </div>
</section>


      <Footer />
    </>
  );
}
