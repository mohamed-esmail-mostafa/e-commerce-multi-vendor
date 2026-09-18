import { Globe2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18nInstance from '@/i18n'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const activeI18n = i18n?.changeLanguage ? i18n : i18nInstance

  const currentLanguage = activeI18n?.resolvedLanguage || activeI18n?.language || 'en'
  const isAr = currentLanguage === 'ar'

  useEffect(() => {
    const updateDocumentLanguage = (lang: string) => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      }
    }

    // Update on first load
    updateDocumentLanguage(currentLanguage)

    // Update whenever i18n language changes
    if (typeof activeI18n?.on === 'function') {
      activeI18n.on('languageChanged', updateDocumentLanguage)
    }

    return () => {
      if (typeof activeI18n?.off === 'function') {
        activeI18n.off('languageChanged', updateDocumentLanguage)
      }
    }
  }, [activeI18n, currentLanguage])

  const toggleLanguage = () => {
    const nextLang = isAr ? 'en' : 'ar'
    if (typeof activeI18n?.changeLanguage === 'function') {
      activeI18n.changeLanguage(nextLang)
    }
  }

  
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-2 text-xs font-bold text-foreground shadow-xs transition hover:bg-accent hover:text-primary"
        title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
      >
        <Globe2 size={14} className="text-primary" />

        <span>
          {isAr ? 'EN' : 'العربية'}
        </span>
      </button>
  )
}
