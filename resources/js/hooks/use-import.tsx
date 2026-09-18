import React from 'react'
import { useTranslation } from 'react-i18next'

export default function useImport() {
  const {t}=useTranslation()
    return {
        t
    }
}
