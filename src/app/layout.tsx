import { Metadata } from 'next'
import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}