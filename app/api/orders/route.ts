import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await sql`
      SELECT o.order_id, o.item_id, i.item_name, o.buyer_id, u.user_name as buyer_name, o.order_date
      FROM orders o
      JOIN items i ON o.item_id = i.item_id
      JOIN users u ON o.buyer_id = u.user_id
      ORDER BY o.order_id ASC
    `;
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { order_id, item_id, buyer_id } = await request.json();
    const order_date = new Date().toISOString().split('T')[0];

    // 使用事务
    await sql.begin(async (sql) => {
      // 1. 检查商品是否已售出
      const rows = await sql`SELECT status FROM items WHERE item_id = ${item_id} FOR UPDATE`;
      if (rows.length === 0) {
        throw new Error("Item not found");
      }
      if (rows[0].status === 1) {
        throw new Error("Item already sold");
      }

      // 2. 在 orders 表中新增一条记录
      await sql`
        INSERT INTO orders (order_id, item_id, buyer_id, order_date)
        VALUES (${order_id}, ${item_id}, ${buyer_id}, ${order_date})
      `;

      // 3. 修改 item 表中该商品 status 为 1
      await sql`
        UPDATE items SET status = 1 WHERE item_id = ${item_id}
      `;
    });

    return NextResponse.json({ message: "Purchase successful" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
