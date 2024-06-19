import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import { Product } from "../interfaces/productInterface";
import { getProducts } from "../apiFacade";

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const productsList = await getProducts();
    setProducts(productsList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSubmit = () => {
    setSelectedProduct(null);
    fetchProducts();
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div style={{ display: "flex", margin: "1rem", padding: "1vw", gap: "2vw", justifyContent: "space-evenly" }}>
      <ProductForm onSubmit={handleProductSubmit} product={selectedProduct} />
      <ProductList products={products} setProducts={setProducts} onEdit={handleProductEdit} />
    </div>
  );
}

export default ProductPage;
