import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Store,
    Globe,
    Phone,
    MapPin,
    Sparkles,
    Facebook,
    Instagram,
    FileText,
    Share2,
    Palette,
    ArrowRight,
    Loader2,
    CheckCircle2,
    ExternalLink,
    Info,
} from 'lucide-react';

import useImport from '@/hooks/use-import';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ImagePicker from '@/components/ui/image-picker';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LanguageToggle from '@/components/shared/language-toggle';

export interface Country {
    id: number;
    name_en: string;
    name_ar: string;
    currency_ar?: string;
    currency_en?: string;
    code?: string;
    flag?: string;
    is_active?: boolean;
}

interface CreateStorePageProps {
    countries?: Country[];
}

interface StoreFormValues {
    [key: string]: any;
    name: string;
    country_id: string;
    phone: string;
    address: string;
    description: string;
    facebook: string;
    titok: string;
    instagram: string;
    logo: File | null;
    cover: File | null;
}

const TikTokIcon = ({ className = 'size-4' }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 10.74 4.56c1.8-1.57 2.05-4.22 2.05-6.59v-4.1a8.16 8.16 0 0 0 4.65 1.46V7.6a4.85 4.85 0 0 1-1-.91z" />
    </svg>
);

export default function createStorePage({
    countries = [],
}: CreateStorePageProps) {
    const { t, isRtl } = useImport();

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            name: Yup.string()
                .trim()
                .min(
                    2,
                    t(
                        'validations.name_min',
                        'Store name must be at least 2 characters',
                    ),
                )
                .max(
                    255,
                    t(
                        'validations.name_max',
                        'Store name must be at most 255 characters',
                    ),
                )
                .required(
                    t('validations.name_required', 'Store name is required'),
                ),
            country_id: Yup.string().nullable(),
            phone: Yup.string().nullable(),
            address: Yup.string().nullable(),
            description: Yup.string()
                .max(
                    2000,
                    t(
                        'validations.desc_max',
                        'Description cannot exceed 2000 characters',
                    ),
                )
                .nullable(),
            facebook: Yup.string().nullable(),
            titok: Yup.string().nullable(),
            instagram: Yup.string().nullable(),
        });
    }, [t]);

    const formik = useFormik<StoreFormValues>({
        initialValues: {
            name: '',
            country_id: '',
            phone: '',
            address: '',
            description: '',
            facebook: '',
            titok: '',
            instagram: '',
            logo: null,
            cover: null,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            router.post('/create-store', values, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        t(
                            'stores.create_success',
                            'Store created successfully!',
                        ),
                    );
                },
                onError: (errors: Record<string, string>) => {
                    setErrors(errors);
                    const firstError = Object.values(errors)[0];
                    toast.error(
                        firstError ||
                            t(
                                'common.error',
                                'An error occurred. Please check the form.',
                            ),
                    );
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            });
        },
    });

    const slugPreview = useMemo(() => {
        if (!formik.values.name) return '';
        return formik.values.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u0621-\u064A-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }, [formik.values.name]);

    const selectedCountry = useMemo(() => {
        if (!formik.values.country_id) return null;
        return (
            countries.find(
                (c) => String(c.id) === String(formik.values.country_id),
            ) || null
        );
    }, [countries, formik.values.country_id]);

    const logoPreviewUrl = useMemo(() => {
        if (formik.values.logo instanceof File) {
            return URL.createObjectURL(formik.values.logo);
        }
        return null;
    }, [formik.values.logo]);

    const coverPreviewUrl = useMemo(() => {
        if (formik.values.cover instanceof File) {
            return URL.createObjectURL(formik.values.cover);
        }
        return null;
    }, [formik.values.cover]);

    const breadcrumbs = [
        {
            title: t('dashboard.title', 'Dashboard'),
            href: '/dashboard',
        },
        {
            title: t('stores.create_store', 'Create Store'),
            href: '/create-store/page',
        },
    ];

    return (
        <div>
             <Head title={t('stores.create_store_title', 'Create Your Store')} />
<LanguageToggle />
            <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
                {/* Header Title Section with Primary Accents */}
                <div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 shadow-sm md:p-8">
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                <Sparkles className="size-3.5 animate-pulse text-primary" />
                                {t('stores.create_store', 'Create Store')}
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {t(
                                    'stores.create_store_title',
                                    'Create Your Store',
                                )}
                            </h1>
                            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                                {t(
                                    'stores.create_store_subtitle',
                                    'Launch your digital store in seconds, showcase your brand, and connect with customers.',
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => formik.resetForm()}
                                disabled={formik.isSubmitting}
                                className="border-border hover:border-primary/50"
                            >
                                {t('stores.reset', 'Reset Form')}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => formik.handleSubmit()}
                                disabled={formik.isSubmitting}
                                className="bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                            >
                                {formik.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        {t(
                                            'stores.creating',
                                            'Creating Store...',
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Store className="mr-2 size-4" />
                                        {t(
                                            'stores.submit_create',
                                            'Create Store',
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* Left Column: Form Fields */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Card 1: Basic Information */}
                            <Card className="border-border/80 shadow-xs transition-colors hover:border-primary/40">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Info className="size-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {t(
                                                    'stores.basic_info',
                                                    'Basic Information',
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                {t(
                                                    'stores.basic_info_desc',
                                                    'Set your store name, country, and contact details.',
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <Separator className="mb-6 opacity-60" />
                                <CardContent className="space-y-5">
                                    {/* Store Name */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label
                                                htmlFor="name"
                                                className="font-medium text-foreground"
                                            >
                                                {t(
                                                    'stores.store_name',
                                                    'Store Name',
                                                )}{' '}
                                                <span className="font-bold text-primary">
                                                    *
                                                </span>
                                            </Label>
                                            {slugPreview && (
                                                <span className="text-xs text-muted-foreground">
                                                    {t(
                                                        'stores.store_slug_preview',
                                                        'URL:',
                                                    )}{' '}
                                                    <span className="font-mono font-semibold text-primary">
                                                        /store/{slugPreview}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder={t(
                                                'stores.store_name_placeholder',
                                                'e.g. Apex Electronics',
                                            )}
                                            className="h-10 border-input focus-visible:border-primary"
                                        />
                                        <InputError
                                            message={
                                                formik.touched.name &&
                                                formik.errors.name
                                                    ? formik.errors.name
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    {/* Country & Phone Row */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {/* Country Selector */}
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="country_id"
                                                className="flex items-center gap-1.5 font-medium"
                                            >
                                                <Globe className="size-4 text-primary" />
                                                {t('stores.country', 'Country')}
                                            </Label>
                                            <Select
                                                value={
                                                    formik.values.country_id
                                                        ? String(
                                                              formik.values
                                                                  .country_id,
                                                          )
                                                        : ''
                                                }
                                                onValueChange={(val) =>
                                                    formik.setFieldValue(
                                                        'country_id',
                                                        val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="country_id"
                                                    className="h-10 w-full border-input focus-visible:border-primary"
                                                >
                                                    <SelectValue
                                                        placeholder={t(
                                                            'stores.select_country',
                                                            'Select Country',
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map(
                                                        (country) => (
                                                            <SelectItem
                                                                key={country.id}
                                                                value={String(
                                                                    country.id,
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {country.flag && (
                                                                        <span className="text-base leading-none">
                                                                            {
                                                                                country.flag
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    <span>
                                                                        {isRtl
                                                                            ? country.name_ar ||
                                                                              country.name_en
                                                                            : country.name_en ||
                                                                              country.name_ar}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    formik.touched.country_id &&
                                                    formik.errors.country_id
                                                        ? formik.errors
                                                              .country_id
                                                        : undefined
                                                }
                                            />
                                        </div>

                                        {/* Phone Number */}
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="phone"
                                                className="flex items-center gap-1.5 font-medium"
                                            >
                                                <Phone className="size-4 text-primary" />
                                                {t(
                                                    'stores.phone',
                                                    'Phone Number',
                                                )}
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formik.values.phone}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t(
                                                    'stores.phone_placeholder',
                                                    '+20 100 123 4567',
                                                )}
                                                className="h-10 border-input focus-visible:border-primary"
                                            />
                                            <InputError
                                                message={
                                                    formik.touched.phone &&
                                                    formik.errors.phone
                                                        ? formik.errors.phone
                                                        : undefined
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Physical Address */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="address"
                                            className="flex items-center gap-1.5 font-medium"
                                        >
                                            <MapPin className="size-4 text-primary" />
                                            {t(
                                                'stores.address',
                                                'Store Address / City',
                                            )}
                                        </Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder={t(
                                                'stores.address_placeholder',
                                                'e.g. 123 Main Street, Cairo',
                                            )}
                                            className="h-10 border-input focus-visible:border-primary"
                                        />
                                        <InputError
                                            message={
                                                formik.touched.address &&
                                                formik.errors.address
                                                    ? formik.errors.address
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="description"
                                            className="flex items-center gap-1.5 font-medium"
                                        >
                                            <FileText className="size-4 text-primary" />
                                            {t(
                                                'stores.description',
                                                'Store Description',
                                            )}
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder={t(
                                                'stores.description_placeholder',
                                                'Describe what makes your store unique, products offered, and your mission...',
                                            )}
                                            className="resize-y"
                                        />
                                        <InputError
                                            message={
                                                formik.touched.description &&
                                                formik.errors.description
                                                    ? formik.errors.description
                                                    : undefined
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: Branding & Visuals */}
                            <Card className="border-border/80 shadow-xs transition-colors hover:border-primary/40">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Palette className="size-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {t(
                                                    'stores.branding',
                                                    'Branding & Media',
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                {t(
                                                    'stores.branding_desc',
                                                    'Upload high-quality logos and banners to represent your brand.',
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <Separator className="mb-6 opacity-60" />
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Store Logo Picker */}
                                        <div className="space-y-2">
                                            <ImagePicker
                                                id="logo"
                                                label={t(
                                                    'stores.store_logo',
                                                    'Store Logo',
                                                )}
                                                onChange={(file) =>
                                                    formik.setFieldValue(
                                                        'logo',
                                                        file,
                                                    )
                                                }
                                                error={
                                                    formik.touched.logo &&
                                                    formik.errors.logo
                                                        ? String(
                                                              formik.errors
                                                                  .logo,
                                                          )
                                                        : undefined
                                                }
                                                previewClassName="h-44 object-contain bg-muted/40 p-2"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {t(
                                                    'common.file-size-limit',
                                                    'WebP, PNG, JPG or GIF up to 5MB',
                                                )}
                                            </p>
                                        </div>

                                        {/* Store Cover Banner Picker */}
                                        <div className="space-y-2">
                                            <ImagePicker
                                                id="cover"
                                                label={t(
                                                    'stores.store_cover',
                                                    'Cover Banner',
                                                )}
                                                onChange={(file) =>
                                                    formik.setFieldValue(
                                                        'cover',
                                                        file,
                                                    )
                                                }
                                                error={
                                                    formik.touched.cover &&
                                                    formik.errors.cover
                                                        ? String(
                                                              formik.errors
                                                                  .cover,
                                                          )
                                                        : undefined
                                                }
                                                previewClassName="h-44 object-cover"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {t(
                                                    'common.file-size-limit',
                                                    'WebP, PNG, JPG or GIF up to 5MB',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 3: Social Media Links */}
                            <Card className="border-border/80 shadow-xs transition-colors hover:border-primary/40">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Share2 className="size-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {t(
                                                    'stores.social_links',
                                                    'Social Media Links',
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                {t(
                                                    'stores.social_links_desc',
                                                    'Help customers find you on social networks.',
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <Separator className="mb-6 opacity-60" />
                                <CardContent className="space-y-4">
                                    {/* Facebook */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="facebook"
                                            className="flex items-center gap-1.5 font-medium"
                                        >
                                            <Facebook className="size-4 text-[#1877F2]" />
                                            {t(
                                                'stores.facebook',
                                                'Facebook Page URL',
                                            )}
                                        </Label>
                                        <Input
                                            id="facebook"
                                            name="facebook"
                                            type="url"
                                            value={formik.values.facebook}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder={t(
                                                'stores.facebook_placeholder',
                                                'https://facebook.com/your-store',
                                            )}
                                            className="h-10 border-input focus-visible:border-primary"
                                        />
                                        <InputError
                                            message={
                                                formik.touched.facebook &&
                                                formik.errors.facebook
                                                    ? formik.errors.facebook
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    {/* TikTok */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="titok"
                                            className="flex items-center gap-1.5 font-medium"
                                        >
                                            <TikTokIcon className="size-4 text-foreground" />
                                            {t(
                                                'stores.tiktok',
                                                'TikTok Profile URL',
                                            )}
                                        </Label>
                                        <Input
                                            id="titok"
                                            name="titok"
                                            type="url"
                                            value={formik.values.titok}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder={t(
                                                'stores.tiktok_placeholder',
                                                'https://tiktok.com/@your-store',
                                            )}
                                            className="h-10 border-input focus-visible:border-primary"
                                        />
                                        <InputError
                                            message={
                                                formik.touched.titok &&
                                                formik.errors.titok
                                                    ? formik.errors.titok
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    {/* Instagram */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="instagram"
                                            className="flex items-center gap-1.5 font-medium"
                                        >
                                            <Instagram className="size-4 text-[#E1306C]" />
                                            {t(
                                                'stores.instagram',
                                                'Instagram Profile URL',
                                            )}
                                        </Label>
                                        <Input
                                            id="instagram"
                                            name="instagram"
                                            type="url"
                                            value={formik.values.instagram}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder={t(
                                                'stores.instagram_placeholder',
                                                'https://instagram.com/your-store',
                                            )}
                                            className="h-10 border-input focus-visible:border-primary"
                                        />
                                        <InputError
                                            message={
                                                formik.touched.instagram &&
                                                formik.errors.instagram
                                                    ? formik.errors.instagram
                                                    : undefined
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Live Store Card Preview */}
                        <div className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
                            <Card className="overflow-hidden border-border/80 bg-card/90 shadow-md backdrop-blur-xs">
                                <CardHeader className="border-b bg-muted/20 pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="size-4 text-primary" />
                                            <CardTitle className="text-base font-semibold">
                                                {t(
                                                    'stores.preview_card_title',
                                                    'Live Store Preview',
                                                )}
                                            </CardTitle>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="border border-primary/30 bg-primary/10 text-xs font-medium text-primary"
                                        >
                                            {t(
                                                'stores.active_badge',
                                                'Live Preview',
                                            )}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs">
                                        {t(
                                            'stores.preview_card_desc',
                                            'Here is how your store will look to customers.',
                                        )}
                                    </CardDescription>
                                </CardHeader>

                                {/* Preview Card Banner */}
                                <div className="relative h-32 w-full overflow-hidden bg-gradient-to-r from-primary/30 via-primary/20 to-orange-500/20">
                                    {coverPreviewUrl ? (
                                        <img
                                            src={coverPreviewUrl}
                                            alt="Cover Preview"
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-primary/40">
                                            <Store className="size-10 opacity-30" />
                                        </div>
                                    )}

                                    {/* Floating Store Logo */}
                                    <div className="absolute -bottom-6 left-6 flex size-16 items-center justify-center overflow-hidden rounded-xl border-2 border-background bg-card shadow-md">
                                        {logoPreviewUrl ? (
                                            <img
                                                src={logoPreviewUrl}
                                                alt="Logo Preview"
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <Store className="size-8 text-primary" />
                                        )}
                                    </div>
                                </div>

                                {/* Preview Card Body */}
                                <CardContent className="space-y-4 px-6 pt-8 pb-5">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="truncate text-lg font-bold text-foreground">
                                                {formik.values.name ||
                                                    t(
                                                        'stores.store_name_placeholder',
                                                        'Your Store Name',
                                                    )}
                                            </h3>
                                            <CheckCircle2 className="size-4 shrink-0 text-primary" />
                                        </div>

                                        <p className="mt-0.5 truncate font-mono text-xs text-primary">
                                            /store/{slugPreview || 'your-store'}
                                        </p>
                                    </div>

                                    {/* Country & Location */}
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        {selectedCountry && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
                                                <span>
                                                    {selectedCountry.flag}
                                                </span>
                                                <span>
                                                    {isRtl
                                                        ? selectedCountry.name_ar ||
                                                          selectedCountry.name_en
                                                        : selectedCountry.name_en ||
                                                          selectedCountry.name_ar}
                                                </span>
                                            </span>
                                        )}
                                        {formik.values.address && (
                                            <span className="inline-flex max-w-[180px] items-center gap-1 truncate rounded-md bg-muted px-2 py-0.5">
                                                <MapPin className="size-3 shrink-0 text-primary" />
                                                <span className="truncate">
                                                    {formik.values.address}
                                                </span>
                                            </span>
                                        )}
                                        {formik.values.phone && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
                                                <Phone className="size-3 shrink-0 text-primary" />
                                                <span>
                                                    {formik.values.phone}
                                                </span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Description Bio */}
                                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                        {formik.values.description ||
                                            t(
                                                'stores.description_placeholder',
                                                'Store description and customer intro will appear here...',
                                            )}
                                    </p>

                                    {/* Social icons if provided */}
                                    {(formik.values.facebook ||
                                        formik.values.titok ||
                                        formik.values.instagram) && (
                                        <div className="flex items-center gap-2 border-t border-border/50 pt-2">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {t(
                                                    'stores.social_links',
                                                    'Connect:',
                                                )}
                                            </span>
                                            {formik.values.facebook && (
                                                <a
                                                    href={
                                                        formik.values.facebook
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex size-7 items-center justify-center rounded-full bg-muted text-[#1877F2] transition-colors hover:bg-[#1877F2]/10"
                                                >
                                                    <Facebook className="size-3.5" />
                                                </a>
                                            )}
                                            {formik.values.titok && (
                                                <a
                                                    href={formik.values.titok}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
                                                >
                                                    <TikTokIcon className="size-3.5" />
                                                </a>
                                            )}
                                            {formik.values.instagram && (
                                                <a
                                                    href={
                                                        formik.values.instagram
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex size-7 items-center justify-center rounded-full bg-muted text-[#E1306C] transition-colors hover:bg-[#E1306C]/10"
                                                >
                                                    <Instagram className="size-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Fast Action Card */}
                            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-xs">
                                <CardContent className="space-y-3 p-5">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                        <Store className="size-4" />
                                        <span>
                                            {t(
                                                'stores.submit_create',
                                                'Ready to Launch?',
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {t(
                                            'stores.create_store_subtitle',
                                            'Once submitted, your store will be created instantly and you will be ready to add products and manage sales.',
                                        )}
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        className="h-11 w-full bg-primary font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                                    >
                                        {formik.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 size-4 animate-spin" />
                                                {t(
                                                    'stores.creating',
                                                    'Creating Store...',
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span>
                                                    {t(
                                                        'stores.submit_create',
                                                        'Create Store Now',
                                                    )}
                                                </span>
                                                <ArrowRight className="ml-2 size-4 rtl:rotate-180" />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
