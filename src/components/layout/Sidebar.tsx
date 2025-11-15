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
  UserCog
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Items', path: '/items' },
  { icon: FolderTree, label: 'Categories', path: '/categories' },
  { icon: Building2, label: 'Suppliers', path: '/suppliers' },
  { icon: Warehouse, label: 'Warehouses', path: '/warehouses' },
  { icon: ArrowDownToLine, label: 'Stock In', path: '/stock/in' },
  { icon: ArrowUpFromLine, label: 'Stock Out', path: '/stock/out' },
  { icon: ArrowLeftRight, label: 'Transfer', path: '/stock/transfer' },
  { icon: AlertTriangle, label: 'Adjustment', path: '/stock/adjustment' },
  { icon: ClipboardCheck, label: 'Opname', path: '/stock/opname' },
  { icon: Calendar, label: 'Expired Items', path: '/expired-items' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Activity, label: 'Activity Log', path: '/activity' },
  { icon: UserCog, label: 'Users', path: '/users' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUIStore();

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
              <Box className="h-6 w-6 text-sidebar-primary" />
              <span className="text-lg font-bold text-sidebar-foreground">NGS</span>
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
