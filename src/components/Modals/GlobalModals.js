'use client';

import { useModal } from '@/context/ModalContext';

import ProductModal from './Products/ProductModal';
import ProductEditModal from './Products/ProductEditModal';
import ProductStockModal from './Products/ProductStockModal';
import ProductDetailModal from './Products/ProductDetailModal';
import ProductionModal from './Production/ProductionModal';
import ProductionDetailModal from './Production/ProductionDetailModal';

export default function GlobalModals() {
    const { modal, data, options, closeModal } = useModal();

    if (!modal) return null;

    const handleSuccess = (result) => {
        if (options?.onSuccess) {
            options.onSuccess(result);
        }
        closeModal();
    };

    switch (modal) {

        case 'product-create':
            return (
                <ProductModal onClose={closeModal} onSuccess={handleSuccess} />
            );

        case 'product-edit':
            return (
                <ProductEditModal product={data} onClose={closeModal} onSuccess={handleSuccess} />
            );

        case 'product-stock':
            return (
                <ProductStockModal product={data} onClose={closeModal} onSuccess={handleSuccess} />
            );

        case 'product-detail':
            return (
                <ProductDetailModal product={data} onClose={closeModal} />
            );

        case 'production-create':
            return (
                <ProductionModal onClose={closeModal} onSuccess={handleSuccess} />
            );

        case 'production-detail':
            return (
                <ProductionDetailModal order={data} onClose={closeModal} />
            );

        default:
            return null;
    }
}