import '@/styles/globals.css'
import { Providers } from '@/components/providers'
import { cn } from '@/utils/cn'

export const metadata = {
  title: "Pesquisa Igreja",
  description: "Sistema de pesquisas da igreja",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={cn(
        "h-full bg-gray-50 text-gray-900",
        "antialiased overflow-x-hidden"
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}