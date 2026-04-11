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

  order_extra_ratio: string | null



  // USER APP

  user_min_version: string | null
  user_force_update: boolean
  user_update_title: string | null
  user_update_message: string | null
  user_android_url: string | null
  user_ios_url: string | null

  // VENDOR APP
  vendor_version: string | null
  vendor_min_version: string | null
  vendor_force_update: boolean
  vendor_update_title: string | null
  vendor_update_message: string | null
  vendor_android_url: string | null
  vendor_ios_url: string | null
}


export interface SettingContextType {
  settings: Setting | null
  getSettings: () => Promise<void>
}