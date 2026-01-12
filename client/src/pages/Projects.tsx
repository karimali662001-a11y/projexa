import { Link } from "wouter";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "منصة التجارة الإلكترونية",
      category: "ويب",
      description: "منصة متكاملة للبيع والشراء عبر الإنترنت مع نظام دفع آمن",
      image: "https://via.placeholder.com/400x300?text=E-Commerce",
    },
    {
      id: 2,
      title: "تطبيق إدارة المشاريع",
      category: "موبايل",
      description: "تطبيق iOS و Android لإدارة المشاريع والفريق بكفاءة",
      image: "https://via.placeholder.com/400x300?text=Project+Manager",
    },
    {
      id: 3,
      title: "نظام إدارة المستشفيات",
      category: "سيستم",
      description: "نظام متكامل لإدارة المستشفيات والعيادات الطبية",
      image: "https://via.placeholder.com/400x300?text=Hospital+System",
    },
    {
      id: 4,
      title: "تطبيق الذكاء الاصطناعي",
      category: "AI",
      description: "تطبيق يستخدم تقنيات الذكاء الاصطناعي لتحليل البيانات",
      image: "https://via.placeholder.com/400x300?text=AI+App",
    },
    {
      id: 5,
      title: "موقع الشركة الاحترافي",
      category: "ويب",
      description: "موقع شركة احترافي مع نظام إدارة محتوى متقدم",
      image: "https://via.placeholder.com/400x300?text=Company+Website",
    },
    {
      id: 6,
      title: "تطبيق المحفظة الرقمية",
      category: "موبايل",
      description: "تطبيق آمن لإدارة المحفظة الرقمية والتحويلات المالية",
      image: "https://via.placeholder.com/400x300?text=Digital+Wallet",
    },
  ];

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

      {/* Hero Section */}
      <section className="py-16 px-5 text-center">
        <div className="container-rtl">
          <h1 className="text-5xl font-black mb-4 gradient-text">أعمالنا المميزة</h1>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
            استعرض مجموعة من المشاريع الناجحة التي طورناها لعملائنا حول العالم
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-5">
        <div className="container-rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="card hover:border-[#8b5cf6] hover:shadow-glow transition-all duration-300 animate-slide-up overflow-hidden group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="mb-4 overflow-hidden rounded-lg h-48">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(139,92,246,0.2)] text-[#8b5cf6]">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-[#94a3b8] mb-4">{project.description}</p>
                <button className="btn btn-primary w-full text-sm">
                  اعرف المزيد
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5 bg-[rgba(15,23,42,0.5)]">
        <div className="container-rtl text-center">
          <h2 className="text-4xl font-black mb-6">هل تريد مشروعك في هذه القائمة؟</h2>
          <p className="text-[#94a3b8] text-lg mb-8 max-w-2xl mx-auto">
            تواصل معنا اليوم واحصل على استشارة مجانية لتحويل فكرتك إلى واقع رقمي ناجح
          </p>
          <Link href="/order" className="btn btn-primary inline-block">
            ابدأ مشروعك الآن
          </Link>
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
