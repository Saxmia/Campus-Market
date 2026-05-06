import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let result;
    switch (type) {
      case 'unsold':
        // 使用视图：未售商品视图
        result = await sql`SELECT * FROM unsold_items_view`;
        break;
      case 'sold_with_buyer':
        // 使用视图：已售商品视图 (商品名 + 买家ID)
        result = await sql`SELECT * FROM sold_items_view`;
        break;
      case 'price_gt_30':
        result = await sql`SELECT * FROM items WHERE price > 30`;
        break;
      case 'category_daily':
        result = await sql`SELECT * FROM items WHERE category = 'DailyGoods'`;
        break;
      case 'user_u001_items':
        result = await sql`SELECT * FROM items WHERE seller_id = 'u001'`;
        break;
      case 'u001_items_status':
        // 查询卖家是 u001 的商品是否被购买
        result = await sql`
          SELECT i.item_name, 
                 CASE WHEN o.order_id IS NOT NULL THEN '已购买' ELSE '未购买' END as buy_status
          FROM items i
          LEFT JOIN orders o ON i.item_id = o.item_id
          WHERE i.seller_id = 'u001'
        `;
        break;
      default:
        return NextResponse.json({ error: "Invalid query type" }, { status: 400 });
    }
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
