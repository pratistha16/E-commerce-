import LandingFooter from '@/components/landing/LandingFooter';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import AboutUs from '@/components/landing/AboutUs';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import StoreShowcase from '@/components/landing/StoreShowcase';
import Testimonials from '@/components/landing/Testimonials';
import FinalCTA from '@/components/landing/FinalCTA';

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-950 font-sans selection:bg-primary-100 selection:text-primary-900">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <AboutUs />
        <HowItWorks />
        <FeaturedProducts />
        <StoreShowcase />
        <Testimonials />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
