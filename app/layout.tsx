import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Конструктор окон ПВХ',
  description: 'Создание эскизов окон ПВХ с экспортом в PDF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}