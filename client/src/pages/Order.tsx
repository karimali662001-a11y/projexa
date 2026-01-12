import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Order() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectCategory: "",
    projectDesc: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createOrderMutation = trpc.orders.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create order
      const result = await createOrderMutation.mutateAsync({
        customerEmail: formData.clientEmail,
        customerName: formData.clientName,
        customerPhone: formData.clientPhone,
        totalAmount: 59000, // Default amount from your pricing
        paymentMethod: "manual",
        shippingAddress: formData.projectCategory,
        items: [
          {
            productId: 1,
            quantity: 1,
            price: 59000,
          },
        ],
      });

      if (result) {
        toast.success("تم إرسال طلبك بنجاح! ستصلك رسالة تأكيد على بريدك الإلكتروني");
        
        // Reset form
        setFormData({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          projectCategory: "",
          projectDesc: "",
        });

        // Redirect to order tracking
        setTimeout(() => {
          window.location.href = `/order-tracking/${result.orderId}`;
        }, 1500);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب. حاول مجددًا");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-[#f8fafc] font-medium hover:text-[#8b5cf6]">
              الرئيسية
            </Link>
            <Link href="/projects" className="text-[#f8fafc] font-medium hover:text-[#8b5cf6]">
              المشاريع
            </Link>
            <Link href="/order" className="text-[#f8fafc] font-medium hover:text-[#8b5cf6]">
              اطلب مشروعك
            </Link>
          </nav>
        </div>
      </header>

      {/* Order Form Section */}
      <section className="py-20 px-5">
        <div className="container-rtl max-w-2xl mx-auto">
          <div className="card animate-slide-up">
            <h2 className="text-3xl font-black text-center mb-8">نموذج طلب تنفيذ مشروع</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="clientName">الاسم الكامل</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسمك"
                />
              </div>

              <div className="form-group">
                <label htmlFor="clientEmail">البريد الإلكتروني (Gmail)</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  required
                  placeholder="example@gmail.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="clientPhone">رقم الواتساب</label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  required
                  placeholder="+20 10XXXXXXXX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectCategory">تخصص المشروع</label>
                <select
                  id="projectCategory"
                  name="projectCategory"
                  value={formData.projectCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر التخصص...</option>
                  <option value="برمجة تطبيقات موبايل">برمجة تطبيقات موبايل</option>
                  <option value="تطبيقات ديسكتوب">تطبيقات ديسكتوب</option>
                  <option value="ويب سايت">ويب سايت</option>
                  <option value="ذكاء اصطناعي">ذكاء اصطناعي</option>
                  <option value="سيستم متكامل">سيستم متكامل</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="projectDesc">وصف فكرة المشروع</label>
                <textarea
                  id="projectDesc"
                  name="projectDesc"
                  value={formData.projectDesc}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="اشرح فكرتك بالتفصيل..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب للإدارة"}
              </button>
            </form>

            {/* Pricing Info */}
            <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl font-bold mb-4">معلومات الأسعار</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">تطوير الموقع الأساسي</span>
                  <span className="font-bold">35,000 ج.م</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">المصروفات والماتريال</span>
                  <span className="font-bold">24,000 ج.م</span>
                </div>
                <div className="flex justify-between items-center border-t border-[rgba(255,255,255,0.1)] pt-3 mt-3">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-[#8b5cf6] text-2xl font-black">59,000 ج.م</span>
                </div>
              </div>
              <p className="text-[#94a3b8] text-sm mt-4">
                * يمكنك إضافة تطبيق ديسكتوب مقابل 30,000 ج.م إضافي
              </p>
            </div>
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
