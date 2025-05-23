"use client";

import { usePathname } from "next/navigation";
import {
  Rocket,
  LayoutGrid,
  Package,
  Menu as MenuIcon,
  AlertTriangle,
  BarChart2,
  User,
  DollarSign,
  Settings,
  HelpCircle,
  Ticket,
  ChevronDown,
  ChevronRight,
  X as CloseIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import React from "react";
import Image from "next/image";
import { useSidebarStore } from "@/lib/store/sidebar";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

interface DropdownSectionProps {
  icon: React.ReactNode;
  title: string;
  id: string;
  children: React.ReactNode;
  collapsed: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const { expanded, setExpanded } = useSidebarStore();

  const [openMenus, setOpenMenus] = useState({
    services: false,
    settings: false,
    support: false,
  });

  useEffect(() => {
    setOpenMenus({
      services: ["/dashboard/advertisers", "/dashboard/campaigns", "/dashboard/feeds", "/dashboard/alerts"].some((p) => pathname.includes(p)),
      settings: ["/dashboard/users", "/dashboard/clients"].some((p) => pathname.includes(p)),
      support: ["/dashboard/support-guides", "/dashboard/customer-service"].some((p) => pathname.includes(p)),
    });
  }, [pathname]);

  const toggleMenu = (key: keyof typeof openMenus) => {
    setOpenMenus((prev) => {
      const newState = { services: false, settings: false, support: false };
      newState[key] = !prev[key];
      return newState;
    });
  };

  const NavItem = ({ href, icon, label, collapsed }: NavItemProps) => {
    const isActive = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-semibold
            ${isActive
              ? "bg-[#FAAE3A] text-[#404042] shadow-md"
              : "text-gray-200 hover:bg-[#FFF3D1] hover:text-[#404042]"}
            ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <span className="flex-shrink-0">{icon}</span>
          {!collapsed && <span className="flex-grow">{label}</span>}
        </Link>
      </li>
    );
  };

  const DropdownSection = ({ icon, title, id, children, collapsed }: DropdownSectionProps) => {
    const isOpen = openMenus[id as keyof typeof openMenus];
    return (
      <div className="mb-2 relative">
        <button
          onClick={() => toggleMenu(id as keyof typeof openMenus)}
          className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-semibold
            ${isOpen ? "text-[#FAAE3A] bg-white/5" : "text-gray-200 hover:text-[#FAAE3A] hover:bg-white/5"}
            ${collapsed ? 'justify-center px-0' : ''}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0">{icon}</span>
            {!collapsed && <span>{title}</span>}
          </div>
          {!collapsed && (
            <span className="flex-shrink-0 transition-transform duration-200">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>
        {/* Submenú clásico si expandido, vertical solo íconos si retraído */}
        {isOpen && !collapsed && (
          <ul className="mt-2 space-y-1 pl-4 border-l-2 border-[#FAAE3A]">
            {children}
          </ul>
        )}
        {isOpen && collapsed && (
          <ul className="flex flex-col items-center gap-1 mt-2">
            {React.Children.map(children, (child: any, idx: number) => (
              <li key={idx}>
                <Link
                  href={child.props.href}
                  className="flex items-center justify-center w-10 h-10 text-gray-200 hover:bg-[#FAAE3A] hover:text-[#404042] rounded-lg transition-all duration-200"
                >
                  <span className="flex-shrink-0">{child.props.icon}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Overlay y sidebar en móvil
  const MobileSidebar = (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setExpanded(false)}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#404042] text-white border-r border-[#FAAE3A]/20 shadow-xl transform transition-transform duration-200 ${expanded ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-auto md:w-64 md:block`}
      >
        <div className="p-6 flex flex-col items-center border-b border-[#FAAE3A]/20 relative">
          <button
            className="absolute top-2 right-2 md:hidden text-[#FAAE3A] hover:text-[#F17625]"
            onClick={() => setExpanded(false)}
            aria-label="Close sidebar"
          >
            <CloseIcon size={28} />
          </button>
          <div className="relative w-14 h-14 mb-3">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-[#FAAE3A]">Fountain Forward</p>
            <p className="text-xs text-gray-300">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <DropdownSection icon={<Rocket size={18} />} title="Services" id="services" collapsed={!expanded}>
            <NavItem href="/dashboard/advertisers" icon={<LayoutGrid size={16} />} label="Advertisers" collapsed={!expanded} />
            <NavItem href="/dashboard/campaigns" icon={<Package size={16} />} label="Campaign Builder" collapsed={!expanded} />
            <NavItem href="/dashboard/feeds" icon={<MenuIcon size={16} />} label="Custom Feeds" collapsed={!expanded} />
            <NavItem href="/dashboard/alerts" icon={<AlertTriangle size={16} />} label="Alerts" collapsed={!expanded} />
          </DropdownSection>
          <div className="border-b border-[#FAAE3A]/10 my-2" />
          <DropdownSection icon={<BarChart2 size={18} />} title="Settings" id="settings" collapsed={!expanded}>
            <NavItem href="/dashboard/users" icon={<User size={16} />} label="User Admin" collapsed={!expanded} />
            <NavItem href="/dashboard/clients" icon={<Settings size={16} />} label="Client Settings" collapsed={!expanded} />
          </DropdownSection>
          <div className="border-b border-[#FAAE3A]/10 my-2" />
          <DropdownSection icon={<HelpCircle size={18} />} title="Support" id="support" collapsed={!expanded}>
            <NavItem href="/dashboard/support-guides" icon={<Ticket size={16} />} label="Support Guides" collapsed={!expanded} />
            <NavItem href="/dashboard/customer-service" icon={<Ticket size={16} />} label="Customer Service" collapsed={!expanded} />
          </DropdownSection>
        </nav>

        <div className="p-4 border-t border-[#FAAE3A]/20 bg-[#39393B]">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg group relative">
            <div className="w-9 h-9 rounded-full bg-[#FAAE3A] flex items-center justify-center shadow-md">
              <User size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Admin User</p>
              <p className="text-xs text-gray-300 truncate">admin@fountain.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {/* Sidebar y overlay en móvil, sidebar normal en desktop */}
      <div className="md:block">
        {/* Solo renderizar sidebar móvil en pantallas pequeñas */}
        <div className="md:hidden">{MobileSidebar}</div>
        {/* Sidebar normal en desktop, ahora soporta modo retraído */}
        <aside className={`hidden md:flex bg-[#404042] text-white flex-col min-h-screen border-r border-[#FAAE3A]/20 relative shadow-xl transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
          <div className={`flex flex-col items-center border-b border-[#FAAE3A]/20 transition-all duration-300 ${expanded ? 'p-6' : 'py-6 px-2'}`}>
            <div className={`relative ${expanded ? 'w-14 h-14 mb-3' : 'w-10 h-10 mb-1'}`}>
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            {expanded && (
              <div className="text-center">
                <p className="text-base font-bold text-[#FAAE3A]">Fountain Forward</p>
                <p className="text-xs text-gray-300">Admin Dashboard</p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-2 overflow-y-auto">
            {/* Menú principal: solo íconos si retraído */}
            <DropdownSection icon={<Rocket size={18} />} title="Services" id="services" collapsed={!expanded}>
              <NavItem href="/dashboard/advertisers" icon={<LayoutGrid size={16} />} label="Advertisers" collapsed={!expanded} />
              <NavItem href="/dashboard/campaigns" icon={<Package size={16} />} label="Campaign Builder" collapsed={!expanded} />
              <NavItem href="/dashboard/feeds" icon={<MenuIcon size={16} />} label="Custom Feeds" collapsed={!expanded} />
              <NavItem href="/dashboard/alerts" icon={<AlertTriangle size={16} />} label="Alerts" collapsed={!expanded} />
            </DropdownSection>
            <div className="border-b border-[#FAAE3A]/10 my-2" />
            <DropdownSection icon={<BarChart2 size={18} />} title="Settings" id="settings" collapsed={!expanded}>
              <NavItem href="/dashboard/users" icon={<User size={16} />} label="User Admin" collapsed={!expanded} />
              <NavItem href="/dashboard/clients" icon={<Settings size={16} />} label="Client Settings" collapsed={!expanded} />
            </DropdownSection>
            <div className="border-b border-[#FAAE3A]/10 my-2" />
            <DropdownSection icon={<HelpCircle size={18} />} title="Support" id="support" collapsed={!expanded}>
              <NavItem href="/dashboard/support-guides" icon={<Ticket size={16} />} label="Support Guides" collapsed={!expanded} />
              <NavItem href="/dashboard/customer-service" icon={<Ticket size={16} />} label="Customer Service" collapsed={!expanded} />
            </DropdownSection>
          </nav>

          <div className={`p-4 border-t border-[#FAAE3A]/20 bg-[#39393B] ${expanded ? '' : 'flex flex-col items-center'}`}>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg group relative">
              <div className="w-9 h-9 rounded-full bg-[#FAAE3A] flex items-center justify-center shadow-md">
                <User size={18} className="text-white" />
              </div>
              {expanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">Admin User</p>
                  <p className="text-xs text-gray-300 truncate">admin@fountain.com</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
