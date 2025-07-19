import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { api } from "@/services/api";
import type { ProductType } from "@/types/ProductType";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditProduct } from "./ProductEdit";

export default function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [orderBy, setOrderBy] = useState("asc");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product/", {
        params: {
          sortBy,
          orderBy,
          limit,
          page,
        },
      });
      setProducts(res.data.products.fullProducts);
      const totalItems = res.data.products.total;
      setTotalPages(Math.ceil(totalItems / limit));
    } catch (err) {
      console.error("failed to fetch products", err);
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortBy, orderBy, limit, page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Do you want to delete this product?")) return;
    try {
      setLoading(true);
      await api.delete(`/product/${id}/delete`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err: any) {
      alert(
        "failed to delete product: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold mb-4">Products</h1>
          <Button>
            <Link to="/admin/product/add">Add Product</Link>
          </Button>
        </div>

        {/* Filter & Sort */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="stocks">Stock</option>
              <option value="createdAt">Created Date</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p className="w-1/4 mx-auto bg-gray-200 text-gray-500 text-center text-lg mb-4 rounded p-2">
            Belum ada produk.
          </p>
        ) : (
          <div className="mb-4">
            <table className="w-full table-auto border-collapse text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Created Date</th>
                  <th className="border p-2">Updated Date</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td className="border p-2">
                      {index + 1 + limit * (page - 1)}
                    </td>
                    <td className="border p-2 flex justify-center">
                      <img
                        src={product.picture}
                        alt={product.name}
                        className="w-16 h-16"
                      />
                    </td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2 w-40">
                      <div className="line-clamp-2">{product.description}</div>
                    </td>
                    <td className="border p-2">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="border p-2">{product.stocks}</td>
                    <td className="border p-2">
                      {new Date(product.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="border p-2">
                      {new Date(product.updatedAt).toLocaleDateString("id-ID")}
                    </td>

                    <td className="border p-2">
                      <div className="flex justify-center gap-2">
                        <EditProduct
                          product={product}
                          onUpdateSuccess={fetchProducts}
                        />
                        <Button
                          variant={"destructive"}
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                <ChevronLeftIcon />
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        )}
        <Button>
          <Link to="/admin/products/deleted">Deleted Products</Link>
        </Button>
      </main>
    </div>
  );
}
