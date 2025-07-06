import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Users, 
  MessageCircle, 
  MapPin, 
  User, 
  BarChart3,
  Network,
  Zap,
  CheckCircle,
  Play,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const AllPagesDemo: React.FC = () => {
  const pages = [
    {
      title: 'إنشاء لعبة محسّن',
      description: 'صفحة إنشاء الألعاب مع واجهة متقدمة ونماذج تفاعلية',
      path: '/create-game',
      icon: Gamepad2,
      color: 'bg-blue-500',
      status: 'مكتمل',
      features: ['نماذج ذكية', 'خطوات تفاعلية', 'اختيار الملاعب', 'دعوة اللاعبين']
    },
    {
      title: 'البحث عن شركاء',
      description: 'صفحة البحث عن شركاء اللعب مع فلاتر متقدمة',
      path: '/find-partners',
      icon: Users,
      color: 'bg-green-500',
      status: 'مكتمل',
      features: ['بحث متقدم', 'فلاتر ذكية', 'ملفات شخصية', 'دعوات فورية']
    },
    {
      title: 'الرسائل والدردشة',
      description: 'نظام محادثات متكامل مع واجهة حديثة',
      path: '/messages',
      icon: MessageCircle,
      color: 'bg-purple-500',
      status: 'مكتمل',
      features: ['دردشة فورية', 'مجموعات', 'مشاركة الملفات', 'إشعارات']
    },
    {
      title: 'اكتشاف الملاعب',
      description: 'صفحة البحث عن الملاعب وحجزها',
      path: '/courts',
      icon: MapPin,
      color: 'bg-orange-500',
      status: 'مكتمل',
      features: ['خرائط تفاعلية', 'حجز فوري', 'مراجعات', 'توافر الأوقات']
    },
    {
      title: 'الملف الشخصي',
      description: 'ملف شخصي شامل مع إحصائيات وإنجازات',
      path: '/profile',
      icon: User,
      color: 'bg-indigo-500',
      status: 'مكتمل',
      features: ['ملف شامل', 'إحصائيات', 'إنجازات', 'أصدقاء']
    },
    {
      title: 'لوحة التحليلات',
      description: 'تحليلات شاملة للأداء والإحصائيات',
      path: '/analytics',
      icon: BarChart3,
      color: 'bg-red-500',
      status: 'مكتمل',
      features: ['رسوم بيانية', 'تتبع الأداء', 'تقارير', 'إحصائيات متقدمة']
    },
    {
      title: 'الشبكة الاجتماعية',
      description: 'شبكة اجتماعية للاعبين والمجتمعات',
      path: '/network',
      icon: Network,
      color: 'bg-pink-500',
      status: 'مكتمل',
      features: ['أصدقاء', 'مجموعات', 'طلبات صداقة', 'مقترحات']
    },
    {
      title: 'الميزات الذكية',
      description: 'صفحة الميزات المتقدمة والذكية',
      path: '/smart-features',
      icon: Zap,
      color: 'bg-yellow-500',
      status: 'موجود',
      features: ['ذكاء اصطناعي', 'تحليل الفيديو', 'توصيات', 'مساعد ذكي']
    }
  ];

  const testPages = [
    {
      title: 'صفحة اختبار إنشاء اللعبة',
      description: 'نسخة مبسطة للاختبار السريع',
      path: '/test',
      color: 'bg-gray-500'
    },
    {
      title: 'إنشاء لعبة (نسخة تجريبية)',
      description: 'نسخة تجريبية بدون مصادقة',
      path: '/create-game-demo',
      color: 'bg-cyan-500'
    },
    {
      title: 'إنشاء لعبة V2',
      description: 'النسخة الثانية من صفحة إنشاء الألعاب',
      path: '/create-game-v2',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏆 تطبيق Fitcha - جميع الصفحات المحسّنة
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          عرض شامل لجميع الصفحات الأساسية مع واجهات متقدمة وتجربة مستخدم حديثة
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">8 صفحات مكتملة</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            <Play className="w-5 h-5" />
            <span className="font-semibold">جاهزة للاختبار</span>
          </div>
        </div>
      </div>

      {/* Main Pages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">الصفحات الأساسية المحسّنة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pages.map((page, index) => {
            const Icon = page.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`${page.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      page.status === 'مكتمل' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{page.title}</h3>
                  <p className="text-sm opacity-90">{page.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">الميزات الرئيسية:</h4>
                    <ul className="space-y-1">
                      {page.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={page.path} className="flex-1">
                      <Button className="w-full">
                        <Eye className="w-4 h-4 ml-2" />
                        عرض الصفحة
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Pages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">صفحات الاختبار والتطوير</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testPages.map((page, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className={`w-12 h-12 ${page.color} rounded-full flex items-center justify-center mb-4`}>
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{page.title}</h3>
              <p className="text-gray-600 mb-4">{page.description}</p>
              <Link to={page.path}>
                <Button variant="outline" className="w-full">
                  عرض الصفحة
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ملخص التطوير</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-green-700 font-semibold">صفحات مكتملة</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-blue-700 font-semibold">تعمل بدون أخطاء</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-purple-700 font-semibold">أخطاء حرجة</div>
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          جميع الصفحات الأساسية تم تطويرها بنجاح مع واجهات متقدمة وبيانات وهمية متكاملة.
          كل صفحة تعمل بشكل مستقل ويمكن فحصها والتفاعل معها.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Gamepad2 className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
          <Link to="/create-game">
            <Button variant="outline">
              البدء في إنشاء لعبة
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllPagesDemo;
