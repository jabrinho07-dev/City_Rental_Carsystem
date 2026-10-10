import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroSection } from '@/components/common/HeroSection'
import { BookingSearch } from '@/components/forms/BookingSearch'
import { CarCategories } from '@/components/sections/CarCategories'
import { FAQ } from '@/components/sections/FAQ'
import { FeaturedCars } from '@/components/sections/FeaturedCars'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { StatsSection } from '@/components/sections/StatsSection'
import { Testimonials } from '@/components/sections/Testimonials'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'

export default function HomePage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash !== '#booking-search' && hash !== '#faq') return undefined

    const frame = requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [hash])

  return (
    <>
      <HeroSection />
      <BookingSearch />
      <FeaturedCars />
      <CarCategories />
      <WhyChooseUs />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  )
}
