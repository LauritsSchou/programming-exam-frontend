import { deleteProduct } from "../apiFacade";
import { Product } from "../interfaces/productInterface";
import { toast } from "react-toastify";
import "../styling/product-list.css";

interface ProductListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onEdit: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, setProducts, onEdit }) => {
  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      console.error("Cannot delete product: id is undefined");
      return;
    }

    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Could not delete product, something went wrong.");
      console.error(error);
    }
  };
  const handleEdit = async (product: Product) => {
    onEdit(product);
    window.scrollTo(0, 0);
  };

  return (
    <div className="product-list-page">
      <h2 className="product-header">Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}DKK</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
