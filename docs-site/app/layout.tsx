import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'
import { Sidebar } from '@/components/Sidebar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trinity Method SDK - Documentation',
  description: 'Comprehensive documentation for the Trinity Method SDK - Investigation-first development methodology',
  keywords: ['trinity method', 'investigation framework', 'development methodology', 'ai coding', 'claude code'],
  authors: [{ name: 'Trinity Method Team' }],
  openGraph: {
    title: 'Trinity Method SDK Documentation',
    description: 'Investigation-first development methodology for modern software projects',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:flex lg:gap-8">
                <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
                  <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8">
                    <Sidebar />
                  </div>
                </aside>
                <main className="flex-1 py-8 lg:py-12">
                  <div className="max-w-4xl mx-auto">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
