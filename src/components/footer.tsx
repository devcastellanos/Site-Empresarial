import { Mail, User } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="flex justify-center p-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Tarjeta extendida con Glassmorphism */}
      <div className="w-full max-w-none bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 md:p-10 px-6 md:px-12 text-center shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-bold tracking-wide text-white">
          Contacto - Área de Capacitación
        </h3>
        <p className="text-sm mt-3 text-gray-400">
          Para consultas sobre capacitaciones, puedes contactar a:
        </p>

        {/* Contactos en fila para pantallas grandes */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
          <ContactCard name="Mariana Pérez" email="mariana.perez@grupotarahumara.com.mx" />
          <ContactCard name="Néstor Bañuelos" email="nestor.banuelos@grupotarahumara.com.mx" />
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-600 mt-6 pt-4">
          <p className="text-xs text-gray-500">
            &copy; {CURRENT_YEAR} Grupo Tarahumara - Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Componente reutilizable para contactos
interface ContactCardProps {
  name: string;
  email: string;
}

function ContactCard({ name, email }: ContactCardProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-700/50 p-4 rounded-lg shadow-lg hover:bg-gray-600/50 transition-all duration-300 w-full max-w-sm md:max-w-none">
      <User className="w-8 h-8 text-gray-300" />
      <div className="text-left">
        <p className="text-lg font-medium text-white">{name}</p>
        <p className="text-sm text-gray-400 flex items-center gap-1">
          <Mail className="w-4 h-4 text-gray-400" />
          <a href={`mailto:${email}`} className="hover:text-white transition-colors">
            {email}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
