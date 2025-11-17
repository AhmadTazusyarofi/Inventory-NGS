import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Building2, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  FileText,
  Activity,
  User,
  ChevronLeft,
  ChevronRight,
  Box,
  Warehouse,
  ArrowLeftRight,
  AlertTriangle,
  ClipboardCheck,
  Calendar,
  UserCog,
  Settings
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dasbor', path: '/dashboard' },
  { icon: Package, label: 'Barang', path: '/items' },
  { icon: FolderTree, label: 'Kategori', path: '/categories' },
  { icon: Building2, label: 'Pemasok', path: '/suppliers' },
  { icon: Warehouse, label: 'Gudang', path: '/warehouses' },
  { icon: ArrowDownToLine, label: 'Stok Masuk', path: '/stock/in' },
  { icon: ArrowUpFromLine, label: 'Stok Keluar', path: '/stock/out' },
  { icon: ArrowLeftRight, label: 'Transfer Stok', path: '/stock/transfer' },
  { icon: AlertTriangle, label: 'Penyesuaian', path: '/stock/adjustment' },
  { icon: ClipboardCheck, label: 'Stok Opname', path: '/stock/opname' },
  { icon: Calendar, label: 'Barang Kadaluarsa', path: '/expired-items' },
  { icon: FileText, label: 'Laporan', path: '/reports' },
  { icon: Activity, label: 'Log Aktivitas', path: '/activity' },
  { icon: UserCog, label: 'Pengguna', path: '/users' },
  { icon: Settings, label: 'Pengaturan', path: '/settings' },
  { icon: User, label: 'Profil', path: '/profile' },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { appName, appLogo } = useSettingsStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        'lg:translate-x-0',
        sidebarCollapsed ? 'w-16' : 'w-64',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              {appLogo ? (
                <img src={appLogo} alt="Logo" className="h-6 w-6 object-contain" />
              ) : (
                <Box className="h-6 w-6 text-sidebar-primary" />
              )}
              <span className="text-lg font-bold text-sidebar-foreground">{appName}</span>
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
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground',
                  sidebarCollapsed && 'lg:justify-center'
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
