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
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState({
    services: false,
    settings: false,
    support: false,
  });

  useEffect(() => {
    setOpenMenus({
      services: ["/dashboard/advertisers", "/dashboard/campaigns", "/dashboard/feeds", "/dashboard/alerts"].some((p) => pathname.includes(p)),
      settings: ["/dashboard/users", "/dashboard/billing", "/dashboard/clients"].some((p) => pathname.includes(p)),
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

  const NavItem = ({ href, icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-semibold
            ${isActive
              ? "bg-[#FAAE3A] text-[#404042] shadow-md"
              : "text-gray-200 hover:bg-[#FFF3D1] hover:text-[#404042]"}
          `}
        >
          <span className="flex-shrink-0">{icon}</span>
          <span className="flex-grow">{label}</span>
        </Link>
      </li>
    );
  };

  const DropdownSection = ({ icon, title, id, children }: any) => {
    const isOpen = openMenus[id as keyof typeof openMenus];
    const items = React.Children.toArray(children).map((child: any) => ({
      href: child.props.href,
      icon: child.props.icon,
      label: child.props.label,
    }));
    return (
      <div className="mb-6 relative">
        <button
          onClick={() => toggleMenu(id as keyof typeof openMenus)}
          className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-semibold
            ${isOpen ? "text-[#FAAE3A] bg-white/5" : "text-gray-200 hover:text-[#FAAE3A] hover:bg-white/5"}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0">{icon}</span>
            <span>{title}</span>
          </div>
          <span className="flex-shrink-0 transition-transform duration-200">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </button>
        {isOpen && (
          <ul className="mt-2 space-y-1 pl-4 border-l-2 border-[#FAAE3A]">
            {children}
          </ul>
        )}
      </div>
    );
  };

  return (
    <aside
      className="bg-[#404042] text-white flex flex-col w-64 min-h-screen border-r border-[#FAAE3A]/20 relative shadow-xl"
    >
      <div className="p-6 flex flex-col items-center border-b border-[#FAAE3A]/20">
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
        <DropdownSection icon={<Rocket size={18} />} title="Services" id="services">
          <NavItem href="/dashboard/advertisers" icon={<LayoutGrid size={16} />} label="Advertisers" />
          <NavItem href="/dashboard/campaigns" icon={<Package size={16} />} label="Campaign Builder" />
          <NavItem href="/dashboard/feeds" icon={<MenuIcon size={16} />} label="Custom Feeds" />
          <NavItem href="/dashboard/alerts" icon={<AlertTriangle size={16} />} label="Alerts" />
        </DropdownSection>
        <div className="border-b border-[#FAAE3A]/10 my-2" />
        <DropdownSection icon={<BarChart2 size={18} />} title="Settings" id="settings">
          <NavItem href="/dashboard/users" icon={<User size={16} />} label="User Admin" />
          <NavItem href="/dashboard/billing" icon={<DollarSign size={16} />} label="Billing Reports" />
          <NavItem href="/dashboard/clients" icon={<Settings size={16} />} label="Client Settings" />
        </DropdownSection>
        <div className="border-b border-[#FAAE3A]/10 my-2" />
        <DropdownSection icon={<HelpCircle size={18} />} title="Support" id="support">
          <NavItem href="/dashboard/support-guides" icon={<Ticket size={16} />} label="Support Guides" />
          <NavItem href="/dashboard/customer-service" icon={<Ticket size={16} />} label="Customer Service" />
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
  );
}
