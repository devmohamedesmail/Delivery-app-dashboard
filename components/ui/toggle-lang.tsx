"use client"

import { useTranslation } from "react-i18next"

export default function ToggleLang() {
    const { i18n } = useTranslation()

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
    }

    return (
        <button onClick={toggleLang}>
            {i18n.language === "en" ? "English" : "العربية"}
        </button>
    )
}
