import { useFormik } from "formik";

export interface BannerFormValues {
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  image: File | null;
  link: string | null;
}


export interface CreateBannerData {
    title: string;
    slug: string;
    content?: string;
    is_published?: boolean;
    image?: File;
    link?: string;
}

export interface UpdateBannerData {
    title?: string;
    slug?: string;
    content?: string;
    is_published?: boolean;
    image?: File;
    link?: string;
}


export interface Banner {
    id: number;
    title: string;
    slug: string;
    content?: string | null;
    is_published: boolean;
    image?: string | null;
    createdAt?: string;
    updatedAt?: string;
    link?: string | null;
}

export interface BannerFormProps {
    formik: ReturnType<typeof useFormik<BannerFormValues>>;
    existingImageUrl?: string | null;
    isPending: boolean;
    submitLabel: string;
    onCancel: () => void;
}