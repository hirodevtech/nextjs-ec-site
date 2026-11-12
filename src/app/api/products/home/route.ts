import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db'; // DB共通モジュール
import { type ProductData } from '@/types/product';

// 商品データの型定義
type Product = Pick<ProductData, 'id' | 'name' | 'price' | 'image_url'>;

// トップページ用の商品データを取得
export async function GET() {
  try {
    const columns = 'id, name, price, image_url';

    const [pickUp, newArrival, hotItems] = await Promise.all([
      // おすすめ商品:is_featured が 1 のもの(新しい順に3件)
      executeQuery<Product>(`
        SELECT ${columns}
        FROM products
        WHERE is_featured = 1
        ORDER BY created_at DESC
        LIMIT 3
      ;`),
      // 新着商品:作成日時が新しい順に4件
      executeQuery<Product>(`
        SELECT ${columns}
        FROM products
        ORDER BY created_at DESC
        LIMIT 4
      ;`),
      // 注目商品:販売数が多い順に4件
      executeQuery<Product>(`
        SELECT ${columns}
        FROM products
        ORDER BY sales_count DESC
        LIMIT 4
      ;`),
    ]);

    return NextResponse.json({ pickUp, newArrival, hotItems });
  } catch (err) {
    console.error('トップページ商品取得エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}