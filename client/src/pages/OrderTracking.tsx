import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function OrderTracking() {
  const params = useParams();
  const orderId = parseInt(params.id || "0");

  const orderQuery = trpc.orders.getById.useQuery(orderId);

  if (orderQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#f8fafc]">جاري التحميل...</div>
      </div>
    );
  }

  if (!orderQuery.data) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
        <header className="glass-effect border-b border-[rgba(255,255,255,0.1)]">
          <div className="container-rtl flex justify-between items-center py-4">
            <Link href="/" className="gradient-text text-2xl font-black">
              PROJEXA
            </Link>
          </div>
        </header>
        <section className="py-20 px-5 text-center">
          <div className="container-rtl">
            <h1 className="text-3xl font-black mb-4">الطلب غير موجود</h1>
            <p className="text-[#94a3b8] mb-8">عذراً، لم نتمكن من العثور على الطلب المطلوب</p>
            <Link href="/" className="btn btn-primary">
              العودة للرئيسية
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const order = orderQuery.data;
  const statusSteps = [
    { status: "pending", label: "قيد الانتظار", icon: "fas fa-hourglass-start" },
    { status: "confirmed", label: "مؤكد", icon: "fas fa-check-circle" },
    { status: "shipped", label: "مرسل", icon: "fas fa-truck" },
    { status: "delivered", label: "مسلم", icon: "fas fa-box-open" },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      {/* Header */}
      <header className="glass-effect border-b border-[rgba(255,255,255,0.1)]">
        <div className="container-rtl flex justify-between items-center py-4">
          <Link href="/" className="gradient-text text-2xl font-black flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/606/606203.png"
              width="40"
              alt="Projexa"
            />
            PROJEXA
          </Link>
        </div>
      </header>

      {/* Order Tracking */}
      <section className="py-20 px-5">
        <div className="container-rtl max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-center mb-12">تتبع طلبك</h1>

          {/* Order Status Timeline */}
          <div className="glass-card mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-8">حالة الطلب</h2>
              <div className="flex justify-between items-center">
                {statusSteps.map((step, idx) => (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${
                        idx <= currentStepIndex
                          ? "bg-[#8b5cf6] text-white"
                          : "bg-[rgba(255,255,255,0.1)] text-[#94a3b8]"
                      }`}
                    >
                      <i className={step.icon}></i>
                    </div>
                    <span className="text-sm text-center text-[#94a3b8]">{step.label}</span>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`absolute w-16 h-1 mt-6 ${
                          idx < currentStepIndex ? "bg-[#8b5cf6]" : "bg-[rgba(255,255,255,0.1)]"
                        }`}
                        style={{
                          left: `calc(50% + 2rem)`,
                          top: "2.5rem",
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="glass-card">
              <h3 className="text-xl font-bold mb-4">معلومات الطلب</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[#94a3b8]">رقم الطلب:</span>
                  <p className="font-bold">#{order.id}</p>
                </div>
                <div>
                  <span className="text-[#94a3b8]">تاريخ الطلب:</span>
                  <p className="font-bold">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                </div>
                <div>
                  <span className="text-[#94a3b8]">طريقة الدفع:</span>
                  <p className="font-bold">
                    {order.paymentMethod === "vodafone_cash" && "Vodafone Cash"}
                    {order.paymentMethod === "instapay" && "InstaPay"}
                    {order.paymentMethod === "manual" && "تحويل يدوي"}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-bold mb-4">معلومات العميل</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[#94a3b8]">الاسم:</span>
                  <p className="font-bold">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-[#94a3b8]">البريد الإلكتروني:</span>
                  <p className="font-bold text-sm">{order.customerEmail}</p>
                </div>
                <div>
                  <span className="text-[#94a3b8]">الهاتف:</span>
                  <p className="font-bold">{order.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.paymentStatus === "pending" && (
            <div className="glass-card border border-[#f59e0b] mb-12">
              <h3 className="text-xl font-bold mb-4 text-[#f59e0b]">
                <i className="fas fa-exclamation-circle ml-2"></i>
                انتظار تأكيد الدفع
              </h3>
              <p className="text-[#94a3b8] mb-4">
                تم استقبال طلبك بنجاح. يرجى إكمال عملية الدفع باستخدام البيانات التالية:
              </p>
              <div className="bg-[rgba(15,23,42,0.5)] p-4 rounded-lg mb-4">
                <p className="text-sm text-[#94a3b8] mb-2">رقم المرجع:</p>
                <p className="font-mono font-bold text-lg">{order.paymentReference}</p>
              </div>
              <p className="text-[#94a3b8] text-sm">
                سيتم تحديث حالة طلبك فور استقبال الدفع والتحقق منه من قبل فريق الإدارة.
              </p>
            </div>
          )}

          {order.paymentStatus === "completed" && (
            <div className="glass-card border border-[#10b981] mb-12">
              <h3 className="text-xl font-bold mb-4 text-[#10b981]">
                <i className="fas fa-check-circle ml-2"></i>
                تم تأكيد الدفع
              </h3>
              <p className="text-[#94a3b8]">شكراً لك! تم استقبال دفعتك بنجاح وسيتم معالجة طلبك قريباً.</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="glass-card">
            <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.1)]">
                <span className="text-[#94a3b8]">المبلغ الإجمالي:</span>
                <span className="text-2xl font-black text-[#8b5cf6]">
                  {(order.totalAmount / 100).toFixed(2)} ج.م
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94a3b8]">حالة الدفع:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    order.paymentStatus === "completed"
                      ? "bg-[rgba(16,185,129,0.2)] text-[#10b981]"
                      : "bg-[rgba(245,158,11,0.2)] text-[#f59e0b]"
                  }`}
                >
                  {order.paymentStatus === "completed" ? "مدفوع" : "قيد الانتظار"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-12">
            <p className="text-[#94a3b8] mb-4">هل تحتاج إلى مساعدة؟</p>
            <a href="mailto:support@projexa.com" className="btn btn-primary">
              تواصل مع الدعم
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-[rgba(255,255,255,0.1)] py-12 px-5">
        <div className="container-rtl text-center text-[#94a3b8] text-sm">
          <p>جميع الحقوق محفوظة لشركة Projexa © 2025 | <i className="fas fa-lock"></i> اتصال مشفر وآمن</p>
        </div>
      </footer>
    </div>
  );
}
