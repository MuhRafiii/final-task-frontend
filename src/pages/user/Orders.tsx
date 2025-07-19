import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { api } from "@/services/api";
import type { OrderType } from "@/types/OrderType";
import type { ProductType } from "@/types/ProductType";
import { useEffect, useState } from "react";

export function Orders() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemPrice = (name: string) => {
    const product = products.find((product) => product.name === name);
    return product?.price ?? 0;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/product");
        setProducts(res.data.products.fullProducts);
        console.log(res.data.products.fullProducts);
      } catch (err) {
        console.error("failed to fetch products", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order/my-orders", {
          params: {
            sortBy,
            orderBy,
            ...(minTotal && { minTotal }),
            ...(maxTotal && { maxTotal }),
            limit,
            page,
          },
        });
        setOrders(res.data.orders.orders);
        const totalItems = res.data.orders.total;
        setTotalPages(Math.ceil(totalItems / Number(limit)));
      } catch (err) {
        console.error("failed to fetch orders", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    fetchOrders();
  }, [sortBy, orderBy, minTotal, maxTotal, limit, page]);

  return (
    <>
      <Navbar />
      <div className="max-w-2/3 mx-auto p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="total">Total</option>
              <option value="createdAt">Created Date</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Order By</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Show per page</label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option selected>choose</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        {sortBy === "total" && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="Min Total"
              value={minTotal}
              onChange={(e) => setMinTotal(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxTotal}
              onChange={(e) => setMaxTotal(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">📦 Order History</h1>
            <p>Loading...</p>
          </div>
        ) : (
          <h1 className="text-2xl font-bold mb-4">📦 Order History</h1>
        )}

        {orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-lg">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2 mb-2">
                  {order.cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {formatRupiah(itemPrice(item.name) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-right font-bold text-blue-600">
                  Total: {formatRupiah(order.total)}
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>

              <span className="font-medium">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
