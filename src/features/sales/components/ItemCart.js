export default function ItemCart ({ product, addToCart }) {

    const stock = Number(product.stock || 0);
    const price = Number(product.price || 0);

    const outOfStock = stock <= 0;

    return (
        <button type="button" className={`pos__product ${outOfStock ? 'pos__product--disabled' : ''}`} onClick={() => addToCart(product)} disabled={outOfStock}>
            <div className="pos__product-image">
                {product.name ?.charAt(0) ?.toUpperCase()}
            </div>

            <div className="pos__product-info">
                <span className="pos__product-name">{product.name}</span>
                <span className="pos__product-category">{product.category}</span>
            </div>

            <div className="pos__product-bottom">
                <strong>S/ {price.toFixed(2)}</strong>
                <span>{outOfStock ? 'Sin stock' : `Stock: ${stock} ${product.unit}`}</span>
            </div>
        </button>
    )
}