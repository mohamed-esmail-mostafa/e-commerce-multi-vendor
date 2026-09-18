import React from 'react'
import { useFormik } from 'formik'
import { router } from '@inertiajs/react'
import { toast } from 'sonner'
import useImport from '@/hooks/use-import'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/input-error'
export default function createStorePage() {
    const { t } = useImport()
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async (values) => {
            router.post("/create-store", values, {
                onSuccess: () => { },
                onError: () => {
                    toast.error(t('common.error'))
                }
            })
        }
    })
    return (
        <div>
            <div>
                <Label>fsd</Label>
                <Input />
                <InputError message='' />
            </div>
        </div>
    )
}
