import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { api } from "@/services/api";
import type { ProductType } from "@/types/ProductType";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DeletedProducts() {
  const [deletedProducts, setDeletedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDeletedProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/product/deleted", {
        params: {
          sortBy,
          orderBy,
          limit,
          page,
        },
      });
      const result = res.data.products.deletedProducts;
      setDeletedProducts(result);
      const totalItems = res.data.products.total;
      setTotalPages(Math.ceil(totalItems / limit));
      console.log(limit);
    } catch (err) {
      console.error("failed to fetch deleted products", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, [sortBy, orderBy, limit, page]);

  const handleRestore = async (id: number) => {
    if (!confirm("Do you want to restore this product?")) return;
    try {
      setLoading(true);
      await api.patch(`/product/${id}/restore`);
      setDeletedProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error("failed to restore product", err);
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
        <h1 className="text-2xl font-semibold mb-4">
          Restore Deleted Products
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : deletedProducts.length === 0 ? (
          <p className="text-gray-500 mb-4">Tidak ada produk yang dihapus.</p>
        ) : (
          <div className="mb-4">
            {/* Filter & Sort */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="name">Name</option>
                  <option value="stocks">Stock</option>
                  <option value="deletedAt">Deleted Date</option>
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

            <table className="w-full table-auto border-collapse text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Deleted At</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {deletedProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td className="border p-2 bg-gray-100">{index + 1}</td>
                    <td className="border p-2 flex justify-center bg-gray-100 opacity-50">
                      <img
                        src={product.picture}
                        alt={product.name}
                        className="w-16 h-16 grayscale opacity-70 object-cover rounded"
                      />
                    </td>
                    <td className="border p-2 bg-gray-100 opacity-50">
                      {product.name}
                    </td>
                    <td className="border p-2 bg-gray-100 opacity-50">
                      {product.description}
                    </td>
                    <td className="border p-2 bg-gray-100 opacity-50">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="border p-2 bg-gray-100 opacity-50">
                      {product.stocks}
                    </td>
                    <td className="border p-2 bg-gray-100">
                      {new Date(product.deletedAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="border p-2 bg-gray-100">
                      <Button
                        onClick={() => handleRestore(product.id)}
                        variant="outline"
                      >
                        Restore
                      </Button>
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
        <Button className="p-2 pr-4">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 justify-around"
          >
            <ChevronLeftIcon className="p-0" />
            Back
          </Link>
        </Button>
      </main>
    </div>
  );
}
