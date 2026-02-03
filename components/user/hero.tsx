"use client"
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowRight, Package, Truck, Star, Zap } from 'lucide-react'
import { useSetting } from '@/hooks/useSetting'

export default function Hero() {
    const { t } = useTranslation()
    const { settings } = useSetting()
  return (
     <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-4 w-4" />
                <span>{t('home.hero.badge')}</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t('home.hero.title')}
                <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"> {t('home.hero.titleHighlight')}</span>
              </h1>

              <p className="text-lg text-muted-foreground sm:text-xl">
                {t('home.hero.description')}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    {t('home.hero.createAccount')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    {t('home.hero.signIn')}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-sm font-semibold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('home.hero.trustedBy')}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-linear-to-r from-primary/20 to-primary/10 blur-2xl" />
              <div className="relative rounded-2xl border border-border bg-card p-8 shadow-2xl">
                <div className="aspect-square relative">
                  {settings?.banner && (
                    <img src={settings?.banner} alt="Hero" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
