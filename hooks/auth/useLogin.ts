import React,{useState} from 'react'
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

export default function useLogin() {
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

        switch (role) {
          case "admin":
            toast.success(t("auth.login_success"))
            router.push('/admin')
            break;
          case "delivery_man":
            toast.success(t("auth.login_success"))
            router.push('/admin')
            break;
          case "customer":
            toast.success(t("auth.login_success"))
            router.push('/customer')
            break;
          default:
            toast.error(t("auth.login_failed"))
            break;
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

  return {t,loginMethod,formik, handleTabChange, rememberMe, setRememberMe }
}
