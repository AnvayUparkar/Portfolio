import type { Metadata } from 'next';
import { ThemeProvider } from './context/ThemeContext';
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'Anvay Uparkar — Developer Portfolio',
  description:
    'Full-Stack Engineer & ML Architect building immersive digital experiences.',
  openGraph: {
    title: 'Anvay Uparkar — Developer Portfolio',
    description: 'Cinematic portfolio experience',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
