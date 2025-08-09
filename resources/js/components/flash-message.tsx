import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { PageProps } from '@/types/inertia';

export function FlashMessage() {
    const { flash } = usePage<PageProps>().props;
    const [show, setShow] = useState<boolean>(true);

    useEffect(() => {
        // Reset show to true if flash message berubah
        setShow(true);

        const timeout = setTimeout(() => {
            setShow(false);
        }, 3000); // 3 detik

        return () => clearTimeout(timeout);
    }, [flash.success, flash.error]);

    if (!show) return null;

    if (flash.success) {
        return (
            <Alert variant="default" className="mb-4 bg-green-500 text-white">
                <CheckCircle className="h-5 w-5" />
                <AlertTitle>Sukses</AlertTitle>
                <AlertDescription className='text-white'>{flash.success}</AlertDescription>
            </Alert>
        );
    }

    if (flash.error) {
        return (
            <Alert variant="destructive" className="mb-4 bg-red-500 text-white">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{flash.error}</AlertDescription>
            </Alert>
        );
    }

    return null;
}
