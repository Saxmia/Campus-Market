import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. 统计商品总数
    const totalItems = await sql`SELECT COUNT(*) FROM items`;
    
    // 2. 统计每类商品数量
    const categoryCount = await sql`SELECT category, COUNT(*) FROM items GROUP BY category`;
    
    // 3. 计算所有商品平均价格
    const avgPrice = await sql`SELECT AVG(price) FROM items`;
    
    // 4. 查询发布商品数量最多的用户
    const topSeller = await sql`
      SELECT u.user_name, COUNT(i.item_id) as item_count
      FROM users u
      JOIN items i ON u.user_id = i.seller_id
      GROUP BY u.user_id, u.user_name
      ORDER BY item_count DESC
      LIMIT 1
    `;

    return NextResponse.json({
      totalItems: totalItems[0].count,
      categoryCount: categoryCount,
      avgPrice: parseFloat(avgPrice[0].avg || '0').toFixed(2),
      topSeller: topSeller[0] || { user_name: '无', item_count: 0 }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
