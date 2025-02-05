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
  CommandLineIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import Hero from "@/app/hero";
import Image from "next/image";
import axios from "axios";

import { useAuth }  from '../app/hooks/useAuth';
import { is } from "date-fns/locale";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        variant="paragraph"
        color="gray"
        className="flex items-center gap-2 font-medium text-gray-900"
        placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated, login, logout } = useAuth();
  const handleOpen = () => setOpen((cur) => !cur);
  const NAV_MENU = [
    {
      name: "Home",
      icon: RectangleStackIcon,
      href: "/",
    },
    {
      name: "Noti-Tarahumara",
      icon: UserCircleIcon,
      href: "/Blog",
    },
    {name: "Kardex",
      icon: UserCircleIcon,
      href: "/kardex",
    },
    ...(isAuthenticated? [
  
    {
      name: "Cursos"  ,
      icon: UserCircleIcon,
      href: "/Cursos",
    },
    {
      name:"Cargar Archivos excel",
      icon: UserCircleIcon,
      href:"/cargaMasiva"
    },
    ]: []),
  
  ];
  React.useEffect(() => { 
    console.log('isAuthenticated', isAuthenticated);
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

    


  return (
    <MTNavbar 
      placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
      shadow={false} 
      fullWidth 
      className="border-0 sticky top-0 z-50" 
    >
      <div className="container mx-auto flex items-center justify-between">
        <Image
            width={200}
            height={100}
            src={"/image/logo.png"}
            alt={"Grupo Tarahumara"}
          />

        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">

          {isAuthenticated ? (
            <Button 
              onClick={logout} color="blue-gray" className="mb-4" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} >
              Cerrar Sesión
            </Button>
          ) : (
            <a href="/Login">
              <Button 
                variant="text" 
                placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
              >
                Iniciar Sesión
              </Button>
            </a>
          )}
          
        </div>
        <IconButton
        placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, icon: Icon }) => (
              <NavItem key={name}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            <Button 
              variant="text" 
              placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            >
              Iniciar Sesión
            </Button>
            <a href="https://www.material-tailwind.com/blocks" target="_blank">
              <Button 
                color="gray" 
                placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
              >
                blocks
              </Button>
            </a>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
