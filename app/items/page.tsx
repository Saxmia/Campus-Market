'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ShoppingCart, Filter, Search } from 'lucide-react';

interface Item {
  item_id: string;
  item_name: string;
  category: string;
  price: string;
  status: number;
  seller_id: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  
  // 表单状态
  const [newItem, setNewItem] = useState({ item_id: '', item_name: '', category: '', price: '', seller_id: 'u001' });
  const [editingPrice, setEditingPrice] = useState<{id: string, price: string} | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    let url = '/api/items';
    if (filterType !== 'all') {
      url = `/api/queries?type=${filterType}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [filterType]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      setNewItem({ item_id: '', item_name: '', category: '', price: '', seller_id: 'u001' });
      fetchItems();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('确定要删除这个商品吗？')) return;
    const res = await fetch(`/api/items?item_id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchItems();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const handleUpdatePrice = async (id: string, price: string) => {
    const res = await fetch('/api/items', {
      method: 'PATCH',
      body: JSON.stringify({ item_id: id, price }),
    });
    if (res.ok) {
      setEditingPrice(null);
      fetchItems();
    }
  };

  const handlePurchase = async (itemId: string) => {
    const orderId = 'o' + Math.random().toString(36).substr(2, 5);
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, item_id: itemId, buyer_id: 'u002' }),
    });
    if (res.ok) {
      alert('购买成功！');
      fetchItems();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">商品列表</h1>
        <div className="flex flex-wrap gap-2">
          <select 
            className="border rounded-md px-3 py-2 text-sm bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">全部商品</option>
            <option value="unsold">未售出商品 (视图查询)</option>
            <option value="price_gt_30">价格 &gt; 30</option>
            <option value="category_daily">生活用品 (DailyGoods)</option>
            <option value="user_u001_items">u001 发布的所有商品</option>
            <option value="u001_items_status">u001 商品状态 (连接查询)</option>
          </select>
        </div>
      </div>

      {/* 添加商品表单 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          发布新商品
        </h2>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input 
            placeholder="商品ID (如 i006)" 
            className="border rounded-md px-3 py-2 text-sm"
            value={newItem.item_id}
            onChange={e => setNewItem({...newItem, item_id: e.target.value})}
            required
          />
          <input 
            placeholder="商品名称" 
            className="border rounded-md px-3 py-2 text-sm"
            value={newItem.item_name}
            onChange={e => setNewItem({...newItem, item_name: e.target.value})}
            required
          />
          <input 
            placeholder="分类" 
            className="border rounded-md px-3 py-2 text-sm"
            value={newItem.category}
            onChange={e => setNewItem({...newItem, category: e.target.value})}
            required
          />
          <input 
            placeholder="价格" 
            type="number"
            className="border rounded-md px-3 py-2 text-sm"
            value={newItem.price}
            onChange={e => setNewItem({...newItem, price: e.target.value})}
            required
          />
          <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
            发布
          </button>
        </form>
      </div>

      {/* 商品列表表格 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">卖家</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">加载中...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">暂无数据</td></tr>
            ) : items.map((item) => (
              <tr key={item.item_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.item_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingPrice?.id === item.item_id ? (
                    <div className="flex items-center gap-1">
                      <input 
                        className="border rounded px-1 w-20 py-1 text-sm"
                        value={editingPrice.price}
                        onChange={e => setEditingPrice({...editingPrice, price: e.target.value})}
                        autoFocus
                      />
                      <button onClick={() => handleUpdatePrice(item.item_id, editingPrice.price)} className="text-green-600 font-bold">✓</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      ¥{item.price}
                      <button onClick={() => setEditingPrice({id: item.item_id, price: item.price})} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {/* 特殊处理 u001_items_status 的返回结果 */}
                  {(item as any).buy_status ? (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(item as any).buy_status === '已购买' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {(item as any).buy_status}
                    </span>
                  ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {item.status === 1 ? '已售出' : '未售出'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.seller_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  {item.status === 0 && (
                    <>
                      <button onClick={() => handlePurchase(item.item_id)} className="text-blue-600 hover:text-blue-900" title="购买">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteItem(item.item_id)} className="text-red-600 hover:text-red-900" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
