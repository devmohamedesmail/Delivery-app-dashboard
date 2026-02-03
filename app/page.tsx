'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import {
  Package,
  Truck,
  Clock,
  Shield,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users
} from 'lucide-react'
import Navbar from '@/components/user/navbar'
import Hero from '@/components/user/hero'
import Footer from '@/components/user/footer'

export default function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Zap,
      title: t('home.features.fastDelivery.title'),
      description: t('home.features.fastDelivery.description')
    },
    {
      icon: Shield,
      title: t('home.features.secure.title'),
      description: t('home.features.secure.description')
    },
    {
      icon: MapPin,
      title: t('home.features.tracking.title'),
      description: t('home.features.tracking.description')
    },
    {
      icon: Clock,
      title: t('home.features.support.title'),
      description: t('home.features.support.description')
    }
  ]

  const stats = [
    { value: '50K+', label: t('home.stats.customers') },
    { value: '100K+', label: t('home.stats.deliveries') },
    { value: '500+', label: t('home.stats.stores') },
    { value: '4.9', label: t('home.stats.rating') }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('home.whyChooseUs.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('home.whyChooseUs.description')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-y border-border bg-muted/50 py-20">
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('home.cta.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('home.cta.description')}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                  {t('home.cta.createAccount')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t('home.cta.signIn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
  <Footer />
    </div>
  )
}
