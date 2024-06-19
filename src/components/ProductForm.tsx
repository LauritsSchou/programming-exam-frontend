import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../apiFacade";
import { Product } from "../interfaces/productInterface";
import { toast } from "react-toastify";
import "../styling/product-form.css";
import "react-toastify/dist/ReactToastify.css";

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  product: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, product }) => {
  const defaultFormObj: Product = {
    id: undefined,
    name: "",
    price: 0,
  };

  const [formData, setFormData] = useState<Product>(product || defaultFormObj);

  useEffect(() => {
    setFormData(product || defaultFormObj);
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let savedProduct;
      if (formData.id) {
        savedProduct = await updateProduct(formData.id, formData);
      } else {
        savedProduct = await createProduct(formData);
      }
      onSubmit(savedProduct);
      setFormData(defaultFormObj);
      toast.success("Product saved successfully");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price" && Number(value) < 0) {
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="product-form-page">
      <h2 className="product-header">Add New Product</h2>
      <div className="product-form-container">
        <form className="product-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <label>
            Price:
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
          </label>
          <button type="submit">Save Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
