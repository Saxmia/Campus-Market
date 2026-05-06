'use client';

import { useState, useEffect } from 'react';
import { PieChart, TrendingUp, Package, User } from 'lucide-react';

interface Stats {
  totalItems: string;
  categoryCount: { category: string; count: string }[];
  avgPrice: string;
  topSeller: { user_name: string; item_count: string };
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">加载中...</div>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">数据统计概览</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">商品总数</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalItems}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均价格</p>
              <h3 className="text-2xl font-bold text-gray-900">¥{stats.avgPrice}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">最活跃卖家</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.topSeller?.user_name || '无'}</h3>
              <p className="text-xs text-gray-400">发布商品: {stats.topSeller?.item_count || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          分类统计
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.categoryCount.map(cat => (
            <div key={cat.category} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500">{cat.category}</p>
              <h4 className="text-xl font-bold text-gray-900">{cat.count}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
