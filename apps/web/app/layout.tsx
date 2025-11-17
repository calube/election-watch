import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Election Watch - Non-Partisan Election Information',
  description:
    'Comprehensive election information across all levels of government with intelligent reminders and objective candidate information.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
