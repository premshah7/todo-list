import { getCurrentUser } from '@/lib/auth'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'
import { redirect } from 'next/navigation'



export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar user={user} />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}
