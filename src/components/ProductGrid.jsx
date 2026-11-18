import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, columns = 4 }) {
  return (
    <div className={`product-grid ${columns === 3 ? 'product-grid-3' : ''}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
