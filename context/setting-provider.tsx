import { config } from '@/constants/config'
import axios from 'axios'
import React , { createContext,useEffect } from 'react'
import { SettingContextType, Setting } from '@/types'


export const SettingContext = createContext<SettingContextType | null>(null)
export default function SettingProvider({children}: {children: React.ReactNode}) {
    const [settings, setSettings] = React.useState<Setting | null>(null)




    const getSettings = async () => {
        const response = await axios.get(`${config.API_URL}/settings`)
        const data = response.data.data
        setSettings(data)
    }

    useEffect(() => {
        getSettings()
    }, [])
  return (
    <SettingContext.Provider value={{settings,getSettings}}>
      {children}
    </SettingContext.Provider>
  )
}



