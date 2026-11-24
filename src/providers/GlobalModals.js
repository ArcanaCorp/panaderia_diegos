'use client';

import { useModal } from '@/context/ModalContext';

import ProductModal from '@/features/products/components/modals/ProductModal';
import ProductEditModal from '@/features/products/components/modals/ProductEditModal';
import ProductStockModal from '@/features/products/components/modals/ProductStockModal';
import ProductDetailModal from '@/features/products/components/modals/ProductDetailModal';
import ProductionModal from '@/features/production/components/ProductionModal';
import ProductionDetailModal from '@/features/production/components/ProductionDetailModal';
import StoreTransferModal from '@/features/stores/components/modals/StoreTransferModal';
import StoreInventoryModal from '@/features/stores/components/modals/StoreInventoryModal';
import StoreDetailModal from '@/features/stores/components/modals/StoreDetailModal';

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

        case 'store-transfer':
            return (
                <StoreTransferModal onClose={closeModal} onSuccess={handleSuccess} />
            );

        case 'store-inventory':
            return (
                <StoreInventoryModal onClose={closeModal} />
            );

        case 'store-detail':
            return (
                <StoreDetailModal store={data} onClose={closeModal} />
            )

        default:
            return null;
    }
}

