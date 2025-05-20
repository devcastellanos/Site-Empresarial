import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Layout } from "@/components";
import { AuthProvider } from "../app/context/AuthContext"; // Asegúrate de tener la ruta correcta al contexto
import "@fortawesome/fontawesome-free/css/all.min.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Site Capacitacion",
  description:
    "Sitio web para la capacitacion de los empleados de la empresa, desarrollado por el equipo de Sistemas. Grupo Tarahumara",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className={roboto.className}>
        {/* Asegúrate de envolver tu aplicación con AuthProvider */}
        <AuthProvider>
          <Layout>
            {children}

          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
