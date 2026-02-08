'use client'

import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false)
  const { t } = useTranslation()
  const { login } = useAuth()
  const router = useRouter()
  const [cookies] = useCookies(['access_token'])
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')

  const validationSchema = Yup.object({
    email: loginMethod === 'email'
      ? Yup.string().email(t('auth.email_invalid')).required(t('auth.email_required'))
      : Yup.string().notRequired(),
    phone: loginMethod === 'phone'
      ? Yup.string().matches(/^[0-9]{10,15}$/, t('auth.phone_invalid')).required(t('auth.phone_required'))
      : Yup.string().notRequired(),
    password: Yup.string()
      .required(t('auth.password_required'))
      .min(6, t('auth.password_min')),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      phone: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const identifier = loginMethod === 'email' ? values.email : values.phone
        const result = await login(identifier, values.password)
        const role = result?.user?.role?.role
        if (result.success && role === "admin") {
          toast.success(t("auth.login_success"))
          router.push('/admin')
        } else {
          toast.error(t("auth.login_failed"))
        }
      } catch (error) {
        toast.error(t("auth.login_failed"))
      }
    },
  })

  const handleTabChange = (value: string) => {
    setLoginMethod(value as 'email' | 'phone')
    formik.resetForm()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md relative shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            {t('auth.login_title')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('auth.login_subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={loginMethod} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger
                value="email"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all"
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('auth.email')}
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('auth.phone')}
              </TabsTrigger>
            </TabsList>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <TabsContent value="email" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('auth.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('auth.email_placeholder')}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="pl-10 h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t('auth.phone')}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={t('auth.phone_placeholder')}
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="pl-10 h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
              </TabsContent>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t('auth.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t('auth.password_placeholder')}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10 h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {t('auth.remember_me')}
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t('auth.forgot_password')}
                </button>
              </div>

              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('auth.login')}...
                  </>
                ) : (
                  <>
                    {t('auth.login')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t('auth.no_account')}{' '}
              <button className="font-semibold text-primary hover:text-primary/80 transition-colors">
                {t('auth.sign_up')}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
