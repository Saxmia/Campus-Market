import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM items ORDER BY item_id ASC`;
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { item_id, item_name, category, price, seller_id } = await request.json();
    await sql`
      INSERT INTO items (item_id, item_name, category, price, status, seller_id)
      VALUES (${item_id}, ${item_name}, ${category}, ${price}, 0, ${seller_id})
    `;
    return NextResponse.json({ message: "Item added successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { item_id, price } = await request.json();
    await sql`
      UPDATE items SET price = ${price} WHERE item_id = ${item_id}
    `;
    return NextResponse.json({ message: "Price updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const item_id = searchParams.get('item_id');
    
    // 只能删除未售出的商品
    const { rows } = await sql`SELECT status FROM items WHERE item_id = ${item_id}`;
    if (rows.length > 0 && rows[0].status === 1) {
      return NextResponse.json({ error: "Cannot delete sold item" }, { status: 400 });
    }

    await sql`DELETE FROM items WHERE item_id = ${item_id}`;
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
