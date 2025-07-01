import { Mail, User, Smartphone } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export function FooterRH() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex justify-center p-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="w-full max-w-none bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 md:p-10 px-6 md:px-12 text-center shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-bold tracking-wide text-white">
          Contacto - Área de Capacitación
        </h3>
        <p className="text-sm mt-3 text-gray-400">
          Para consultas sobre capacitaciones, puedes contactar a:
        </p>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
          <ContactCard
            name="Mariana Pérez"
            email="mariana.perez@grupotarahumara.com.mx"
            phone="+523314179174"
            employeeId="2323"
          />
          <ContactCard
            name="Néstor Bañuelos"
            email="nestor.banuelos@grupotarahumara.com.mx"
            phone="+523334428913"
            employeeId="2324"
          />
          <ContactCard
            name="Lezly Rodriguez"
            email="lezly.rodriguez@grupotarahumara.com.mx"
            phone="+523310963475"
            employeeId="2557"
          />
        </div>

        <div className="border-t border-gray-600 mt-6 pt-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Grupo Tarahumara - Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

interface ContactCardProps {
  name: string;
  email: string;
  phone: string;
  employeeId: string;
}

function ContactCard({ name, email, phone, employeeId }: ContactCardProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-700/50 p-4 rounded-lg shadow-lg hover:bg-gray-600/50 transition-all duration-300 w-full max-w-sm md:max-w-none">
      <img
        src={`http://api-img.172.16.15.30.sslip.io/uploads/${employeeId}.jpg`}
        alt={name}
        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
      />
      <div className="text-left">
        <p className="text-lg font-medium text-white">{name}</p>
        <p className="text-sm text-gray-400 flex items-center gap-1">
          <Mail className="w-4 h-4" />
          <a href={`mailto:${email}`} className="hover:text-white transition-colors">
            {email}
          </a>
        </p>
        <p className="text-sm text-gray-400 flex items-center gap-1">
          <Smartphone className="w-4 h-4" />
          <a
            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {phone}
          </a>
        </p>
      </div>
    </div>
  );
}

export default FooterRH;
