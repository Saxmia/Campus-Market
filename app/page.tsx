import Link from 'next/link';
import { ShoppingBag, Users, ClipboardList, BarChart3, Database } from 'lucide-react';

export default function Home() {
  const cards = [
    { title: '商品管理', description: '查看、添加、修改和删除二手商品信息', href: '/items', icon: ShoppingBag, color: 'bg-blue-500' },
    { title: '用户管理', description: '查看平台注册用户信息', href: '/users', icon: Users, color: 'bg-green-500' },
    { title: '订单管理', description: '查看商品成交记录', href: '/orders', icon: ClipboardList, color: 'bg-purple-500' },
    { title: '数据统计', description: '聚合查询商品、分类及平均价格', href: '/stats', icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Database className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          校园二手交易平台数据库系统
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          基于 Next.js + PostgreSQL 构建的高性能数据库课程大作业系统。
          支持完整的 CRUD 操作、连接查询、视图及事务处理。
        </p>
        <div className="mt-8">
          <Link
            href="/items"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            开始浏览商品
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="group">
            <div className="h-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
