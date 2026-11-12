import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

// お問い合わせを新しい順に取得
export async function GET() {
  try {
    const inquiries = await executeQuery<Inquiry>(
      'SELECT * FROM inquiries ORDER BY created_at DESC;'
    );
    return NextResponse.json(inquiries);
  } catch (err) {
    console.error('お問い合わせ取得エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}

// お問い合わせを登録
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // 未入力チェックのみ
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ message: 'すべての項目を入力してください。' }, { status: 400 });
    }

    await executeQuery(
      'INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?);',
      [name.trim(), email.trim(), message.trim()]
    );

    return NextResponse.json({ message: 'お問い合わせを送信しました。' }, { status: 201 });
  } catch (err) {
    console.error('お問い合わせ登録エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}