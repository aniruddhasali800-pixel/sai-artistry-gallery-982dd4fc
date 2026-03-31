import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IndianRupee, ShoppingCart, Package, CheckCircle } from "lucide-react";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    rejectedOrders: 0,
    totalRevenue: 0,
    totalPaintings: 0,
    soldPaintings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, paintingsRes] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("paintings").select("*"),
      ]);

      const orders = ordersRes.data || [];
      const paintings = paintingsRes.data || [];

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        approvedOrders: orders.filter((o) => o.status === "approved").length,
        rejectedOrders: orders.filter((o) => o.status === "rejected").length,
        totalRevenue: orders
          .filter((o) => o.status === "approved")
          .reduce((sum, o) => sum + Number(o.painting_price), 0),
        totalPaintings: paintings.length,
        soldPaintings: paintings.filter((p) => p.sold).length,
      });
    };
    fetchStats();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const statCards = [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: "text-green-400" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-primary" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: ShoppingCart, color: "text-yellow-400" },
    { label: "Approved Orders", value: stats.approvedOrders, icon: CheckCircle, color: "text-green-400" },
    { label: "Total Paintings", value: stats.totalPaintings, icon: Package, color: "text-primary" },
    { label: "Sold Paintings", value: stats.soldPaintings, icon: Package, color: "text-destructive" },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-serif text-gradient-gold mb-2">Dashboard Overview</h1>
      <p className="text-muted-foreground font-sans text-sm mb-6 md:mb-8">Welcome back, Admin</p>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-sans text-muted-foreground tracking-wider uppercase">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-serif text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
