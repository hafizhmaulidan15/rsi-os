import { Button } from '@/Components/ui/button';
import { Download } from 'lucide-react';

interface Props {
    type: string;
    label?: string;
}

export function ExportCSV({ type, label = 'CSV' }: Props) {
    return (
        <a href={`/export/csv/${type}`}>
            <Button variant="secondary" size="sm">
                <Download className="mr-1 h-4 w-4" /> {label}
            </Button>
        </a>
    );
}

export function ExportPDF({ type, label = 'PDF' }: Props) {
    return (
        <a href={`/export/pdf/${type}`}>
            <Button variant="secondary" size="sm">
                <Download className="mr-1 h-4 w-4" /> {label}
            </Button>
        </a>
    );
}
