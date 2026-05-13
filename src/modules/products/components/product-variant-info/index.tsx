import React from 'react';
import { HttpTypes } from '@medusajs/types';

type ProductVariantInfoProps = {
  variant?: HttpTypes.StoreProductVariant | null;
};

const ProductVariantInfo: React.FC<ProductVariantInfoProps> = ({ variant }) => {
  const barcode = variant?.barcode;
  const sku = variant?.sku;
  const hsCode = variant?.hs_code;

  if (!barcode && !sku && !hsCode) return null;

  return (
    <div className="text-[16px] text-secondary space-y-2">
      {sku && (
        <p>
          <span className="font-normal">Kωδικός: </span>
          <span className="font-bold">{sku}</span>
        </p>
      )}
      {barcode && (
        <p>
          <span className="font-normal">Barcode: </span>
          <span className="font-bold">{barcode}</span>
        </p>
      )}
      {hsCode && (
        <p>
          <span className="font-normal">Code: </span>
          <span className="font-bold">{hsCode}</span>
        </p>
      )}
    </div>
  );
};

export default ProductVariantInfo;