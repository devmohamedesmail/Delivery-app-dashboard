import { useContext } from 'react'
import { SettingContextType } from '@/types'
import { SettingContext } from '@/context/setting-provider'

export const useSetting = (): SettingContextType => {
  const context = useContext(SettingContext)
  if (!context) {
    throw new Error('useSetting must be used within a SettingProvider')
  }

  return context
}