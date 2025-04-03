import { Metadata } from 'next'
import { Providers } from './providers'
import Header from './_components/Header'
import Footer from './_components/Footer'
import '../app/globals.css'
import '../app/font.css'
import { BreadCrumbs } from './_components/breadcrumbs/breadcrumbs'
import { ToastProvider } from '@/components/ui/ToastContext'

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <ToastProvider>
          <Providers>
            <Header />
            <div className='flex flex-col items-center min-h-screen'>

              <main className="flex-1 container">
                <BreadCrumbs withHome={true}>
                  {children}
                </BreadCrumbs>
              </main>
            </div>
            <Footer />
          </Providers>
        </ToastProvider>
      </body>
    </html>
  )
}