import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FolderTree,
  LayoutDashboard,
  Package,
  User,
  UserCog,
  Warehouse,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "Barang", path: "/items" },
  { icon: FolderTree, label: "Kategori", path: "/categories" },
  { icon: Building2, label: "Supplier", path: "/suppliers" },
  { icon: Warehouse, label: "Gudang", path: "/warehouses" },
  { icon: ArrowDownToLine, label: "Barang Masuk", path: "/stock/in" },
  { icon: ArrowUpFromLine, label: "Barang Keluar", path: "/stock/out" },
  { icon: ArrowLeftRight, label: "Transfer", path: "/stock/transfer" },
  { icon: AlertTriangle, label: "Adjustment", path: "/stock/adjustment" },
  { icon: ClipboardCheck, label: "Manajemen Stock", path: "/stock/opname" },
  { icon: Calendar, label: "Barang Expired", path: "/expired-items" },
  { icon: FileText, label: "Laporan", path: "/reports" },
  { icon: Activity, label: "Aktivitas Log", path: "/activity" },
  { icon: UserCog, label: "Pengguna", path: "/users" },
  { icon: User, label: "Profil", path: "/profile" },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } =
    useUIStore();
  const { user } = useAuthStore();

  const isAdmin = user?.role === "ADMIN";

  const visibleMenuItems = menuItems.filter((item) => {
    if (isAdmin) return true;

    // STAFF_GUDANG tidak boleh lihat Users & Activity Log
    if (item.path === "/users" || item.path === "/activity") {
      return false;
    }

    return true;
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        "lg:translate-x-0",
        sidebarCollapsed ? "w-16" : "w-64",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center">
                {/* Logo untuk light mode */}
                <img
                  src="/fav.png"
                  alt="Sopia Bangkit Logo"
                  className="block h-full w-full object-contain dark:hidden"
                />
                {/* Logo untuk dark mode */}
                <img
                  src="/fav1.png"
                  alt="Sopia Bangkit Logo Dark"
                  className="hidden h-full w-full object-contain dark:block"
                />
              </div>

              <span className="text-lg font-bold leading-4 tracking-widest text-sidebar-foreground">
                Sopia <br />
                Bangkit
              </span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="hidden lg:block rounded-lg p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground",
                  sidebarCollapsed && "lg:justify-center"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
