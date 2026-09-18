import React from 'react'
import { useTranslation } from 'react-i18next'

export default function useImport() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language?.startsWith('ar') || (typeof i18n.dir === 'function' ? i18n.dir() === 'rtl' : false)

    return {
        t,
        i18n,
        isRtl
    }
}
