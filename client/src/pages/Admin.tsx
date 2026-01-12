import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);

  const ordersQuery = trpc.orders.list.useQuery(undefined, {
    enabled: isLoggedIn && isAuthenticated,
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث حالة الطلب بنجاح");
      ordersQuery.refetch();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    },
  });

  useEffect(() => {
    if (ordersQuery.data) {
      setOrders(ordersQuery.data);
    }
  }, [ordersQuery.data]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (should be more secure in production)
    if (adminPassword === "admin123") {
      setIsLoggedIn(true);
      toast.success("تم تسجيل الدخول بنجاح");
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      orderId,
      status: newStatus as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#f8fafc]">جاري التحميل...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-5">
        <div className="glass-card w-full max-w-md text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/606/606203.png"
            width="60"
            alt="Projexa"
            className="mx-auto mb-4"
          />
          <div className="gradient-text text-3xl font-black mb-8">
            PROJEXA <span className="text-[#06b6d4]">ADMIN</span>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="form-group">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="أدخل كلمة مرور الإدارة"
                className="text-center"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              دخول آمن
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-[#0f172a] border-l border-[rgba(255,255,255,0.05)] p-8">
          <div className="gradient-text text-2xl font-black mb-12 flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/606/606203.png"
              width="30"
              alt="Projexa"
            />
            PROJEXA
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`sidebar-link w-full text-right ${activeTab === "dashboard" ? "active" : ""}`}
            >
              <i className="fas fa-th-large"></i> الإحصائيات
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`sidebar-link w-full text-right ${activeTab === "orders" ? "active" : ""}`}
            >
              <i className="fas fa-inbox"></i> الطلبات الواردة
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`sidebar-link w-full text-right ${activeTab === "analytics" ? "active" : ""}`}
            >
              <i className="fas fa-chart-bar"></i> التحليلات
            </button>
          </nav>

          <button
            onClick={() => {
              setIsLoggedIn(false);
              setAdminPassword("");
            }}
            className="sidebar-link w-full text-right mt-12 text-[#ef4444]"
          >
            <i className="fas fa-power-off"></i> تسجيل خروج
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-12 overflow-y-auto">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-3xl font-black mb-8">مرحباً بك، مدير Projexa</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card">
                  <h3 className="text-4xl font-black text-[#8b5cf6]">{orders.length}</h3>
                  <p className="text-[#94a3b8] mt-2">إجمالي الطلبات</p>
                </div>
                <div className="glass-card">
                  <h3 className="text-4xl font-black text-[#06b6d4]">
                    {orders.filter((o) => o.status === "pending").length}
                  </h3>
                  <p className="text-[#94a3b8] mt-2">طلبات قيد الانتظار</p>
                </div>
                <div className="glass-card">
                  <h3 className="text-4xl font-black text-[#10b981]">
                    {orders.filter((o) => o.status === "delivered").length}
                  </h3>
                  <p className="text-[#94a3b8] mt-2">طلبات مكتملة</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-3xl font-black mb-8">الطلبات الواردة</h2>
              {ordersQuery.isLoading ? (
                <div className="text-center text-[#94a3b8]">جاري التحميل...</div>
              ) : orders.length === 0 ? (
                <div className="text-center text-[#94a3b8] py-12">لا توجد طلبات حالياً</div>
              ) : (
                <div className="glass-card overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>رقم الطلب</th>
                        <th>العميل</th>
                        <th>البريد الإلكتروني</th>
                        <th>المبلغ</th>
                        <th>الحالة</th>
                        <th>الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customerName}</td>
                          <td>{order.customerEmail}</td>
                          <td>{(order.totalAmount / 100).toFixed(2)} ج.م</td>
                          <td>
                            <span className={`status-badge status-${order.status}`}>
                              {order.status === "pending" && "قيد الانتظار"}
                              {order.status === "confirmed" && "مؤكد"}
                              {order.status === "shipped" && "مرسل"}
                              {order.status === "delivered" && "مسلم"}
                              {order.status === "cancelled" && "ملغي"}
                            </span>
                          </td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className="px-2 py-1 bg-[#1e293b] border border-[rgba(255,255,255,0.1)] rounded text-sm"
                            >
                              <option value="pending">قيد الانتظار</option>
                              <option value="confirmed">مؤكد</option>
                              <option value="shipped">مرسل</option>
                              <option value="delivered">مسلم</option>
                              <option value="cancelled">ملغي</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-3xl font-black mb-8">التحليلات</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card">
                  <h3 className="text-xl font-bold mb-4">توزيع الحالات</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>قيد الانتظار</span>
                      <span className="font-bold text-[#f59e0b]">
                        {orders.filter((o) => o.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>مؤكد</span>
                      <span className="font-bold text-[#06b6d4]">
                        {orders.filter((o) => o.status === "confirmed").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>مرسل</span>
                      <span className="font-bold text-[#8b5cf6]">
                        {orders.filter((o) => o.status === "shipped").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>مسلم</span>
                      <span className="font-bold text-[#10b981]">
                        {orders.filter((o) => o.status === "delivered").length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="glass-card">
                  <h3 className="text-xl font-bold mb-4">إجمالي الإيرادات</h3>
                  <div className="text-4xl font-black text-[#8b5cf6] mb-4">
                    {(orders.reduce((sum, o) => sum + o.totalAmount, 0) / 100).toFixed(2)} ج.م
                  </div>
                  <p className="text-[#94a3b8]">من {orders.length} طلب</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
