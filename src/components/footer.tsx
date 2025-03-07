const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="flex justify-center items-center p-8 bg-gray-900 text-gray-300">
      {/* Tarjeta elegante y extendida */}
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 md:p-8 text-center shadow-xl">
        <h3 className="text-xl font-semibold tracking-wide text-white">
          Contacto - Área de Capacitación
        </h3>
        <p className="text-sm mt-2 text-gray-400">
          Para consultas sobre capacitaciones, puedes contactar a:
        </p>

        <div className="mt-4">
          <p className="text-lg font-medium text-white">Mariana Pérez</p>
          <p className="text-sm text-gray-400">📧 mariana.perez@grupotarahumara.com.mx</p>
        </div>

        <div className="mt-4">
          <p className="text-lg font-medium text-white">Néstor Bañuelos</p>
          <p className="text-sm text-gray-400">📧 nestor.bañuelos@grupotarahumara.com.mx</p>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4">
          <p className="text-xs text-gray-500">
            &copy; {CURRENT_YEAR} Grupo Tarahumara - Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
