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
import { JSX } from "react";
import { useSidebarStore } from "@/lib/store/sidebar";

export function Sidebar() {
  const pathname = usePathname();
  const expanded = useSidebarStore((state) => state.expanded);

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
      const allClosed = {
        services: false,
        settings: false,
        support: false,
      };
      return {
        ...allClosed,
        [key]: !prev[key],
      };
    });
  };

  const NavItem = ({ href, icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`flex items-center gap-2 px-2 py-2 rounded text-sm ${
            isActive ? "bg-[#FAAE3A] text-black font-semibold" : "text-white hover:bg-gray-700"
          }`}
        >
          {icon}
          {expanded && <span>{label}</span>}
        </Link>
      </li>
    );
  };

  const DropdownSection = ({
    icon,
    title,
    id,
    children,
  }: {
    icon: JSX.Element;
    title: string;
    id: keyof typeof openMenus;
    children: React.ReactNode;
  }) => {
    const isOpen = openMenus[id];

    return (
      <div className="mt-4">
        <button onClick={() => toggleMenu(id)} className="flex items-center gap-2 font-semibold text-white w-full">
          {icon}
          {expanded && <span>{title}</span>}
          {expanded && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </button>
        <ul
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } ${expanded ? "pl-6" : "pl-2"} space-y-1 mt-1`}
        >
          {children}
        </ul>
      </div>
    );
  };

  return (
    <aside
      className={`bg-[#404042] text-white flex flex-col items-center transition-all duration-300 ease-in-out ${
        expanded ? "w-64" : "w-20"
      } min-h-screen pt-4`}
    >
      <div className="mb-6 flex flex-col items-center transition-opacity duration-300 ease-in-out">
        <img src="/logo.png" alt="Logo" className="w-16 h-16" />
        {expanded && <p className="mt-2 text-sm text-center">User Name</p>}
      </div>

      <nav className="w-full px-4">
        <DropdownSection icon={<Rocket size={16} />} title="Services" id="services">
          <NavItem href="/dashboard/advertisers" icon={<LayoutGrid size={14} />} label="Advertisers" />
          <NavItem href="/dashboard/campaigns" icon={<Package size={14} />} label="Campaign Builder" />
          <NavItem href="/dashboard/feeds" icon={<MenuIcon size={14} />} label="Custom Feeds" />
          <NavItem href="/dashboard/alerts" icon={<AlertTriangle size={14} />} label="Alerts" />
        </DropdownSection>

        <DropdownSection icon={<BarChart2 size={16} />} title="Settings" id="settings">
          <NavItem href="/dashboard/users" icon={<User size={14} />} label="User Admin" />
          <NavItem href="/dashboard/billing" icon={<DollarSign size={14} />} label="Billing Reports" />
          <NavItem href="/dashboard/clients" icon={<Settings size={14} />} label="Client Settings" />
        </DropdownSection>

        <DropdownSection icon={<HelpCircle size={16} />} title="Support" id="support">
          <NavItem href="/dashboard/support-guides" icon={<Ticket size={14} />} label="Support Guides" />
          <NavItem href="/dashboard/customer-service" icon={<Ticket size={14} />} label="Customer Service Portal" />
        </DropdownSection>
      </nav>
    </aside>
  );
}
