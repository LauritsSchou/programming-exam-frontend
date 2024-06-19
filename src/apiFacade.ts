import { Product } from "./interfaces/productInterface";
import { API_URL } from "./settings";

function makeOptions(method: string, body: object | null): RequestInit {
  const opts: RequestInit = {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  };
  if (body) {
    opts.body = JSON.stringify(body);
  }
  return opts;
}

async function handleHttpErrors(res: Response) {
  if (!res.ok) {
    const fullError = await res.json();
    throw { status: res.status, fullError };
  }
  if (res.status === 204) {
    return {};
  }

  return res.json();
}

async function getProducts(): Promise<Product[]> {
  return fetch(API_URL + "/products").then(handleHttpErrors);
}
async function getProductById(id: number): Promise<Product> {
  return fetch(API_URL + "/products/" + id).then(handleHttpErrors);
}
async function createProduct(product: Product): Promise<Product> {
  return fetch(API_URL + "/products", makeOptions("POST", product)).then(handleHttpErrors);
}
async function updateProduct(id: number, product: Product): Promise<Product> {
  const options = makeOptions("PUT", product);
  return fetch(API_URL + "/products/" + id, options).then(handleHttpErrors);
}
async function deleteProduct(id: number) {
  const options = makeOptions("DELETE", null);
  const response = await fetch(API_URL + "/products/" + id, options);
  return response.status;
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
