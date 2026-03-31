import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  painting_title: string;
  painting_price: number;
  customer_name: string;
  customer_email: string;
  status: string;
  created_at: string;
}

const AdminSales = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
    };
    fetchOrders();
  }, []);

  const approved = orders.filter((o) => o.status === "approved");
  const totalRevenue = approved.reduce((sum, o) => sum + Number(o.painting_price), 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-gradient-gold mb-2">Sales Report</h1>
      <p className="text-muted-foreground font-sans text-sm mb-8">Track your painting sales performance</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-lg p-6">
          <p className="text-xs font-sans text-muted-foreground tracking-wider uppercase mb-2">Total Revenue</p>
          <p className="text-3xl font-serif text-green-400">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="glass-card rounded-lg p-6">
          <p className="text-xs font-sans text-muted-foreground tracking-wider uppercase mb-2">Total Sales</p>
          <p className="text-3xl font-serif text-primary">{approved.length}</p>
        </div>
        <div className="glass-card rounded-lg p-6">
          <p className="text-xs font-sans text-muted-foreground tracking-wider uppercase mb-2">Avg. Sale Value</p>
          <p className="text-3xl font-serif text-foreground">
            {approved.length > 0 ? formatPrice(totalRevenue / approved.length) : "₹0"}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-serif text-lg text-foreground">Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-sans text-muted-foreground tracking-wider uppercase">Date</th>
                <th className="text-left p-4 text-xs font-sans text-muted-foreground tracking-wider uppercase">Painting</th>
                <th className="text-left p-4 text-xs font-sans text-muted-foreground tracking-wider uppercase">Customer</th>
                <th className="text-left p-4 text-xs font-sans text-muted-foreground tracking-wider uppercase">Amount</th>
                <th className="text-left p-4 text-xs font-sans text-muted-foreground tracking-wider uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground font-sans">No orders yet</td>
                </tr>
              )}
              {orders.map((order) => {
                const statusColors: Record<string, string> = {
                  pending: "text-yellow-400",
                  approved: "text-green-400",
                  rejected: "text-red-400",
                };
                return (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-sans text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-4 text-sm font-sans text-foreground">{order.painting_title}</td>
                    <td className="p-4">
                      <p className="text-sm font-sans text-foreground">{order.customer_name}</p>
                      <p className="text-xs font-sans text-muted-foreground">{order.customer_email}</p>
                    </td>
                    <td className="p-4 text-sm font-serif text-primary">{formatPrice(order.painting_price)}</td>
                    <td className="p-4">
                      <span className={`text-xs font-sans font-semibold tracking-wider uppercase ${statusColors[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
