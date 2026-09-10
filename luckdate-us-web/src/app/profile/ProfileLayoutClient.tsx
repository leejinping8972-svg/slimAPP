'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import { User, MapPin, Package, Mail, LogOut, Check, X, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function ProfileLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 认证状态检查完成后再判断是否需要跳转
  useEffect(() => {
    if (!mounted || loading) return; // 正在加载中，不执行跳转逻辑

    if (!user) {
      router.push('/login');
    }
  }, [mounted, user, loading, router]);

  // 显示加载状态或未登录时的空白页
  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen bg-[#F7F5F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#D8CBB8]/20 border-t-[#D8CBB8] rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: 'Profile Info', href: '/profile', icon: <User className="w-5 h-5" /> },
    // { label: 'Addresses', href: '/profile/addresses', icon: <MapPin className="w-5 h-5" /> },
    { label: 'Orders', href: '/profile/orders', icon: <Package className="w-5 h-5" /> },
    { label: 'Coupons', href: '/profile/coupons', icon: <Ticket className="w-5 h-5" /> }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // 构建邮件内容
    const subject = encodeURIComponent(contactForm.subject);
    const body = encodeURIComponent(
      `From: ${user.name || user.email}\nEmail: ${user.email}\n\n${contactForm.message}`
    );

    // 创建 mailto: 链接
    const mailtoLink = `mailto:support@luckdate.com?subject=${subject}&body=${body}`;

    // 打开邮件客户端
    window.location.href = mailtoLink;

    // 模拟发送完成（实际由用户在邮件客户端中发送）
    setTimeout(() => {
      setIsSending(false);
      setIsContactOpen(false);
      setContactForm({ subject: '', message: '' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F1] flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 pt-32 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          <aside className="w-full md:w-64 shrink-0 space-y-2">
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm flex items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#D8CBB8]/20 flex items-center justify-center text-[#D8CBB8] font-bold text-xl uppercase">
                  {user.name ? user.name[0] : user.email[0]}
                </div>
              )}
              <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 truncate">{user.name || 'User'}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
              {tabs.map(tab => {
                const isActive = pathname === tab.href;
                return (
                  <Link 
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive ? 'bg-[#D8CBB8]/10 text-[#D8CBB8]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </Link>
                )
              })}
              
              <button 
                onClick={() => setIsContactOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>

          <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 sm:p-8 md:max-w-[55vw]">
            {children}
          </div>

        </div>
      </main>

      {/* Contact Support Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsContactOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                <h3 className="text-2xl font-bold font-['Montserrat'] mb-6">Contact Support</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                            required
                            type="text"
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none"
                            placeholder="How can we help?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                            required
                            rows={4}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none resize-none"
                            placeholder="Describe your issue..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white rounded-xl py-3 font-bold transition-colors disabled:opacity-70"
                    >
                        {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#4E554B] text-white px-8 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
            <div className="w-5 h-5 bg-[#D8CBB8] rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#D8CBB8]/20">
                <Check className="w-3 h-3" />
            </div>
            <span className="font-medium text-sm">Message sent successfully!</span>
        </div>
      )}

      <Footer />
      <CartDrawer />
    </div>
  );
}
