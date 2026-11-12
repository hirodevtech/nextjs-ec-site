'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInquiries = async () => {
      try {
        const res = await fetch('/api/inquiries');
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.message || '取得に失敗しました。');
          return;
        }
        setInquiries(data);
      } catch {
        setErrorMessage('通信エラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    getInquiries();
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <Link href="/admin/products" className="text-indigo-600 hover:text-indigo-700">
        トップページへ戻る
      </Link>
      <h1 className="text-center my-6">お問い合わせ一覧</h1>

      {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}
      {loading && <p className="text-center text-gray-600">読み込み中です...</p>}

      {!loading && !errorMessage && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">ID</th>
                <th className="p-3">氏名</th>
                <th className="p-3">メールアドレス</th>
                <th className="p-3">お問い合わせ内容</th>
                <th className="p-3">送信日時</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry.id} className="border-b">
                  <td className="p-3">{inquiry.id}</td>
                  <td className="p-3">{inquiry.name}</td>
                  <td className="p-3">{inquiry.email}</td>
                  <td className="p-3 whitespace-pre-wrap">{inquiry.message}</td>
                  <td className="p-3">{new Date(inquiry.created_at).toLocaleString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}