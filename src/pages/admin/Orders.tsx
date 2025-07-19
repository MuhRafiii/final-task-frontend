import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { formatDateForInput, formatRupiah } from "@/lib/utils";
import { api } from "@/services/api";
import type { OrderType } from "@/types/OrderType";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/order", {
          params: {
            sortBy,
            orderBy,
            ...(minTotal && { minTotal }),
            ...(maxTotal && { maxTotal }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            limit,
            page,
          },
        });

        setOrders(res.data.orders.orders);
        console.log(res.data);

        const totalItems = res.data.orders.total;
        setTotalPages(Math.ceil(totalItems / limit));
        setErrorMsg("");
      } catch (err) {
        console.error("Gagal fetch data orders", err);
        setErrorMsg("Gagal fetch data orders");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    fetchOrders();
  }, [sortBy, orderBy, minTotal, maxTotal, startDate, endDate, limit, page]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold mb-4">Orders Summary</h1>
          <Button>
            <Link to="/admin/orders/group-by-user">Group By User</Link>
          </Button>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="email">Email</option>
              <option value="total">Total</option>
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
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={formatDateForInput(startDate)}
              onChange={(e) =>
                setStartDate(
                  new Date(e.target.value + "T00:00:00").toISOString()
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={formatDateForInput(endDate)}
              onChange={(e) =>
                setEndDate(new Date(e.target.value + "T23:59:59").toISOString())
              }
              className="w-full border p-2 rounded"
            />
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

        {sortBy === "total" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Total
              </label>
              <input
                type="number"
                value={minTotal}
                onChange={(e) => setMinTotal(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Max Total
              </label>
              <input
                type="number"
                value={maxTotal}
                onChange={(e) => setMaxTotal(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : errorMsg ? (
          <p className="w-1/4 mx-auto bg-gray-200 text-gray-500 text-center text-lg mb-4 rounded p-2">
            Tidak ada order
          </p>
        ) : (
          <div className="">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Total Item</th>
                  <th className="border p-2">Total Spent</th>
                  <th className="border p-2">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className="text-center">
                    <td className="border p-2">
                      {index + 1 + (page - 1) * limit}
                    </td>
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.email}</td>
                    <td className="border p-2">
                      {order.cart
                        .map((item) => item.quantity)
                        .reduce((a, b) => a + b, 0)}
                    </td>
                    <td className="border p-2">{formatRupiah(order.total)}</td>
                    <td className="border p-2">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
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
      </main>
    </div>
  );
}
