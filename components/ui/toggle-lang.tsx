"use client"
import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"

export default function ToggleLang() {
    const { i18n } = useTranslation()

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
    }

    return (
        <button onClick={toggleLang} className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {i18n.language === "en" ? "English" : "العربية"}
        </button>
    )
}
