import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      icon: "fas fa-mobile-alt",
      title: "تطبيقات الموبايل",
      desc: "بناء تطبيقات iOS و Android بأداء فائق وتجربة مستخدم مذهلة.",
    },
    {
      icon: "fas fa-laptop-code",
      title: "تطبيقات الديسكتوب",
      desc: "أنظمة قوية تعمل على Windows و Mac لتنظيم أعمالك بكفاءة.",
    },
    {
      icon: "fas fa-globe",
      title: "تطوير الويب",
      desc: "مواقع ومنصات إلكترونية سريعة، مؤمنة، ومتوافقة مع كافة الشاشات.",
    },
    {
      icon: "fas fa-robot",
      title: "الذكاء الاصطناعي",
      desc: "دمج تقنيات AI و Machine Learning لتحليل البيانات وأتمتة المهام.",
    },
    {
      icon: "fas fa-server",
      title: "الأنظمة المتكاملة",
      desc: "بناء Backend قوي وقواعد بيانات ضخمة تتحمل آلاف المستخدمين.",
    },
    {
      icon: "fas fa-shield-alt",
      title: "الأمن السيبراني",
      desc: "تأمين شامل لمشروعك ضد كافة أنواع الاختراقات والتهديدات.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-effect" : "bg-transparent"
        } border-b border-[rgba(255,255,255,0.1)]`}
      >
        <div className="container-rtl flex justify-between items-center py-4">
          <div className="gradient-text text-2xl font-black flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/606/606203.png"
              width="40"
              alt="Projexa"
            />
            PROJEXA
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#services" className="text-[#f8fafc] font-medium hover:text-[#8b5cf6] transition">
              خدماتنا
            </a>
            <Link href="/projects" className="text-[#f8fafc] font-medium hover:text-[#8b5cf6] transition">
              المشاريع
            </Link>
            <Link href="/order" className="text-[#f8fafc] font-medium hover:text-[#8b5cf6] transition">
              اطلب مشروعك
            </Link>
            <Link href="/admin" className="text-[#f8fafc] font-medium hover:text-[#8b5cf6] transition">
              الإدارة
            </Link>
          </nav>
          <Link href="/order" className="btn btn-primary text-sm">
            ابدأ رحلتك
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center py-20 px-5">
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight animate-slide-up">
          نصمم <span className="gradient-text">المستقبل</span> الرقمي بأيدي خبراء
        </h1>
        <p className="text-xl text-[#94a3b8] max-w-3xl mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          وكالة Projexa هي شريكك التقني لتنفيذ أضخم المشاريع البرمجية، من تطبيقات الموبايل إلى أنظمة الذكاء الاصطناعي المعقدة.
        </p>
        <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Link href="/projects" className="btn btn-primary">
            استكشف أعمالنا
          </Link>
          <Link
            href="/order"
            className="btn btn-secondary"
          >
            تواصل معنا
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-5 bg-[rgba(15,23,42,0.5)]">
        <div className="container-rtl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">تخصصاتنا الاحترافية</h2>
            <p className="text-[#94a3b8] text-lg">نقدم حلولاً برمجية متكاملة تناسب طموحاتك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="card hover:border-[#8b5cf6] hover:shadow-glow animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-5xl text-[#8b5cf6] mb-4">
                  <i className={service.icon}></i>
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-[#94a3b8]">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5">
        <div className="container-rtl text-center">
          <h2 className="text-4xl font-black mb-6">هل أنت مستعد لبدء مشروعك؟</h2>
          <p className="text-[#94a3b8] text-lg mb-8 max-w-2xl mx-auto">
            تواصل معنا اليوم واحصل على استشارة مجانية لتحويل فكرتك إلى واقع رقمي ناجح
          </p>
          <Link href="/order" className="btn btn-primary inline-block">
            ابدأ الآن
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-[rgba(255,255,255,0.1)] py-12 px-5">
        <div className="container-rtl">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div className="gradient-text text-2xl font-black flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/606/606203.png"
                width="30"
                alt="Projexa"
              />
              PROJEXA
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-[#94a3b8] text-2xl hover:text-[#8b5cf6]">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-[#94a3b8] text-2xl hover:text-[#8b5cf6]">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-[#94a3b8] text-2xl hover:text-[#8b5cf6]">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          <div className="text-center text-[#94a3b8] text-sm">
            <p>جميع الحقوق محفوظة لشركة Projexa © 2025 | <i className="fas fa-lock"></i> اتصال مشفر وآمن</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
