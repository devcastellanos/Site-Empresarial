import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon,
  DocumentIcon,
  NewspaperIcon,
  ClipboardDocumentIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

function NavItem({ children, href, className }: NavItemProps) {
  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        variant="paragraph"
        color="gray"
        className={`flex items-center gap-2 font-medium text-gray-200 ${className}`}
{...({} as any)}
        
      >
        {children}
      </Typography>
    </li>
  );
}

export function NavbarRH() {
  const [open, setOpen] = React.useState(false);
  const {  logout } = useAuth();
  const { user, isAuthenticated } = useAuth();

  const handleOpen = () => setOpen((cur) => !cur);

  const NAV_MENU = [
    { name: "Home", icon: RectangleStackIcon, href: "/" },
    // { name: "Noti-Tarahumara", icon: NewspaperIcon, href: "/Blog" },,
    ...(user?.rol === "Capacitacion" ? [{ name: "Kardex", icon: ClipboardDocumentIcon, href: "/kardex" }] : []),
    ...(isAuthenticated
      ? [
          { name: "Universidad Tarahumara", icon: UserCircleIcon, href: "/HomeUT" },
          { name: "Capital Humano", icon: UserCircleIcon, href: "/HomeCH" },
          { name: "Perfil", icon: UserCircleIcon, href: "/Perfil" },
          // { name: "Plan de Estudios", icon: BookOpenIcon, href: "/PlanEstudio" },
        ]
      : []),
  ];

  return (
    <MTNavbar
      shadow={false}
      fullWidth
      className="bg-[#818181] bg-opacity-60 backdrop-blur-md border-0 fixed top-0 left-0 right-0 z-50 transition-all duration-300 margin-bottom-4 rounded-lg px-4 py-2 lg:px-8 lg:py-4 lg:rounded-xl"
      
{...({} as any)}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Image width={150} height={100} src={"/image/logo.png"} alt={"Grupo Tarahumara"} />

        {/* Menú de navegación */}
        <ul className="ml-5 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href} className="text-white">
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
        </ul>

        {/* Botón de sesión */}
        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <Button
              onClick={logout}
              color="blue-gray"
              className="mb-0"
{...({} as any)}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <a href="/Login">
              <Button
                variant="text"
                
{...({} as any)}
              >
                Iniciar Sesión
              </Button>
            </a>
          )}
        </div>

        {/* Menú móvil */}
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
{...({} as any)}
        >
          {open ? <XMarkIcon strokeWidth={2} className="h-6 w-6" /> : <Bars3Icon strokeWidth={2} className="h-6 w-6" />}
        </IconButton>
      </div>

      {/* Menú desplegable móvil */}
      <Collapse open={open}>
        <div className="bg-[#818181] bg-opacity-90 border-t border-gray-200 px-4 py-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default NavbarRH;
