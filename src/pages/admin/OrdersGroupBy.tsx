import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { api } from "@/services/api";
import type { GroupedOrders } from "@/types/OrderType";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function OrdersByUser() {
  const [orders, setOrders] = useState<GroupedOrders[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/order/group-by-user", {
          params: {
            limit,
            page,
          },
        });

        setOrders(res.data.orders.result);
        console.log(res.data);

        const totalItems = res.data.orders.total;
        setTotalPages(Math.ceil(totalItems / limit));
        console.log(totalPages);

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
  }, [limit, page]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders Summary By User</h1>

        {/* Filter */}
        <div className="flex mb-4 justify-end">
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
        ) : errorMsg ? (
          <p className="w-1/4 mx-auto bg-gray-200 text-gray-500 text-center text-lg mb-4 rounded p-2">
            Tidak ada order
          </p>
        ) : (
          <div className="mb-4">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Total Item</th>
                  <th className="border p-2">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">
                      {index + 1 + (page - 1) * limit}
                    </td>
                    <td className="border p-2">{order.email}</td>
                    <td className="border p-2">{order.cart}</td>
                    <td className="border p-2">{formatRupiah(order.total)}</td>
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
            to="/admin/orders"
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
