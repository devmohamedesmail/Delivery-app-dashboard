export interface Setting {
  id: number

  name_ar: string
  name_en: string

  logo: string | null
  banner: string | null

  version: string
  description: string

  url: string
  email: string
  phone: string
  address: string

  facebook: string | null
  instagram: string | null
  twitter: string | null
  whatsapp: string | null
  telegram: string | null

  support_phone: string | null
  support_chat: string | null
  support_email: string | null
  support_address: string | null
  support_hours: string | null
  support_whatsapp: string | null

  maintenance_mode: boolean
  maintenance_message: string | null
}


export interface SettingContextType {
  settings: Setting | null
  getSettings: () => Promise<void>
}