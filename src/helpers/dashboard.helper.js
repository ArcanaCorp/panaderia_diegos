import { IconClipboardList, IconPackage, IconShoppingCart } from "@tabler/icons-react";

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
    }).format(value || 0);
};

export const formatPercentage = (value) => {
    const number = Number(value || 0);
    return `${number > 0 ? '+' : ''}${number.toFixed(1)}%`;
};

export const getTrendClass = (value) => {
    if (value > 0) return 'card__trend--positive';
    if (value < 0) return 'card__trend--negative';

    return '';
};

export const getTrendIcon = (value) => {

    if (value > 0) {
        return <IconArrowUpRight size={13} />;
    }

    if (value < 0) {
        return <IconArrowDownRight size={13} />;
    }

    return null;
};

export const getTrendText = (value, label) => {

    if (value === 0) {
        return `0% ${label}`;
    }

    return `${formatPercentage(Math.abs(value))} ${label}`;
};

export const getActivityIcon = (type) => {
    switch (type) {
        case 'sale':
            return <IconShoppingCart size={15} />;

        case 'purchase':
            return <IconPackage size={15} />;

        case 'order':
            return <IconClipboardList size={15} />;

        default:
            return <IconClipboardList size={15} />;
    }
};

export const getActivityType = (type) => {
    if (type === 'sale') return 'positive';
    if (type === 'purchase') return 'neutral';
    if (type === 'order') return 'positive';
    return 'neutral';
};