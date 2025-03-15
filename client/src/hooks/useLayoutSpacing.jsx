import { useMemo } from 'react';

export default function useLayoutSpacing(height) {
    return useMemo(() => {
        let layoutSize;
        if (height < 568) {
            layoutSize = 'xs';
        } else if (height < 667) {
            layoutSize = 'sm';
        } else if (height < 812) {
            layoutSize = 'md';
        } else {
            layoutSize = 'lg';
        }

        // Define spacing based on layout size
        const spacing = {
            xs: {
                header: 'pt-2 pb-1',
                form: 'space-y-2',
                stats: 'mt-2',
                briefing: 'my-auto py-2',
                actionButtons: 'p-2',
                tankPreview: 'h-48',
                tankStats: 'py-2',
            },
            sm: {
                header: 'pt-1 pb-1',
                form: 'space-y-3',
                stats: 'mt-3',
                briefing: 'my-auto py-3',
                actionButtons: 'p-1',
                tankPreview: 'h-38',
                tankStats: 'py-2',
            },
            md: {
                header: 'pt-6 pb-2',
                form: 'space-y-4',
                stats: 'mt-4',
                briefing: 'my-auto py-4',
                actionButtons: 'p-4',
                tankPreview: 'h-64',
                tankStats: 'py-4',
            },
            lg: {
                header: 'pt-8 pb-2',
                form: 'space-y-5',
                stats: 'mt-6',
                briefing: 'my-auto py-5',
                actionButtons: 'p-6',
                tankPreview: 'h-72',
                tankStats: 'py-5',
            }
        };

        return {
            layoutSize,
            spacing: spacing[layoutSize]
        };
    }, [height]);
}
