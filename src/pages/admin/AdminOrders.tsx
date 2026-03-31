import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

interface Order {
  id: string;
  painting_id: string;
  painting_title: string;
  painting_image: string;
  painting_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_photo_url: string | null;
  status: string;
  created_at: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprove = async (order: Order) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "approved" })
      .eq("id", order.id);

    if (error) {
      toast.error("Failed to approve order");
      return;
    }

    // Mark painting as sold
    await supabase
      .from("paintings")
      .update({ sold: true })
      .eq("id", order.painting_id);

    toast.success(`Order approved! Confirmation will be sent to ${order.customer_email}`);
    fetchOrders();
  };

  const handleReject = (order: Order) => {
    setSelectedOrder(order);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedOrder) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "rejected" })
      .eq("id", selectedOrder.id);

    if (error) {
      toast.error("Failed to reject order");
      return;
    }

    toast.success(`Order rejected. Reason sent to ${selectedOrder.customer_email}: "${rejectionReason}"`);
    setShowRejectModal(false);
    setSelectedOrder(null);
    fetchOrders();
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
    };
    return (
      <span className={`px-3 py-1 rounded-sm text-xs font-sans font-semibold tracking-wider uppercase ${styles[status] || ""}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-serif text-gradient-gold mb-2">Order Management</h1>
      <p className="text-muted-foreground font-sans text-sm mb-6 md:mb-8">Review and manage customer orders</p>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-sans tracking-wider uppercase rounded-sm transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {f} ({f === "all" ? orders.length : orders.filter((o) => o.status === f).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-sans">No orders found</div>
        )}
        {filteredOrders.map((order) => (
          <div key={order.id} className="glass-card rounded-lg p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Painting Info */}
              <div className="flex gap-4 flex-1">
                <img
                  src={order.painting_image}
                  alt={order.painting_title}
                  className="w-20 h-24 object-cover rounded-sm border border-border"
                />
                <div>
                  <h3 className="font-serif text-lg text-foreground">{order.painting_title}</h3>
                  <p className="font-serif text-primary text-lg">{formatPrice(order.painting_price)}</p>
                  <p className="text-xs text-muted-foreground font-sans mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-sans text-foreground font-medium">{order.customer_name}</p>
                <p className="text-xs text-muted-foreground font-sans">{order.customer_email}</p>
                <p className="text-xs text-muted-foreground font-sans">{order.customer_phone}</p>
                <p className="text-xs text-muted-foreground font-sans">{order.customer_address}</p>
                {order.customer_photo_url && (
                  <img
                    src={order.customer_photo_url}
                    alt="Customer"
                    className="w-10 h-10 rounded-full object-cover border border-border mt-2"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {statusBadge(order.status)}
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 text-xs font-sans tracking-wider uppercase rounded-sm hover:bg-green-600/30 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 text-xs font-sans tracking-wider uppercase rounded-sm hover:bg-red-600/30 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-lg p-8 max-w-md w-full border border-border">
            <h2 className="font-serif text-xl text-foreground mb-2">Reject Order</h2>
            <p className="text-sm text-muted-foreground font-sans mb-6">
              Provide a reason for rejection. This will be sent to <strong>{selectedOrder.customer_email}</strong>.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-sans text-muted-foreground border border-border rounded-sm hover:text-foreground transition-colors tracking-wider uppercase"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 text-xs font-sans bg-destructive text-destructive-foreground rounded-sm hover:bg-destructive/80 transition-colors tracking-wider uppercase disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
