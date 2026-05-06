import Link from 'next/link';
import { Home, ShoppingBag, Users, ClipboardList, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { name: '首页', href: '/', icon: Home },
    { name: '商品列表', href: '/items', icon: ShoppingBag },
    { name: '用户列表', href: '/users', icon: Users },
    { name: '订单列表', href: '/orders', icon: ClipboardList },
    { name: '统计数据', href: '/stats', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 text-blue-600 font-bold text-xl">
              <ShoppingBag className="w-8 h-8" />
              <span>校园二手交易平台</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-colors gap-1"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
