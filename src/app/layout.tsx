import { Metadata } from 'next'
import { Providers } from './providers'
import Header from './_components/Header'
import Footer from './_components/Footer'
import '../app/globals.css'
import '../app/font.css'

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
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}