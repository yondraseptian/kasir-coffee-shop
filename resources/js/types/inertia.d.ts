import { PageProps as InertiaPageProps } from '@inertiajs/inertia';

export interface FlashMessages {
    success?: string;
    error?: string;
}

export interface PageProps extends InertiaPageProps {
    flash: FlashMessages;
}