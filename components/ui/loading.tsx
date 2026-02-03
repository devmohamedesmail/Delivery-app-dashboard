import React from 'react'
import { ClipLoader } from 'react-spinners'
import { useTranslation } from 'react-i18next'

export default function Loading() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ClipLoader color="#FD4A12" size={50} />
      <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
    </div>
  )
}
