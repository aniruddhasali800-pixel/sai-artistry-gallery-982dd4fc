import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, BarChart3 } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Inventory", path: "/admin/inventory", icon: Package },
  { label: "Sales Report", path: "/admin/sales", icon: BarChart3 },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-serif text-xl text-gradient-gold">Sai Arts</Link>
          <p className="text-xs text-muted-foreground font-sans mt-1 tracking-wider uppercase">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-sans text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-sans tracking-wider uppercase transition-colors"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
