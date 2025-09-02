import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/useOrder";
import { formatRupiah } from "@/lib/utils";
import { api } from "@/services/api";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";

export function Cart() {
  const { cart, updateQuantity, removeItem, clearCart, cartLoading } =
    useCart();
  const { createOrder } = useOrder();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIncrease = (id: number, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleDecrease = (id: number, currentQty: number) => {
    if (currentQty === 1) {
      removeItem(id);
    } else {
      updateQuantity(id, currentQty - 1);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/order/add", {
        cart: [
          ...cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            // price: item.price,
          })),
        ],
      });
      const total = totalPrice;
      await createOrder(res.data, total);
      clearCart();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err: any) {
      console.error("Login error", err);
      setErrorMsg(err.response?.data?.message || "Order gagal");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        {cartLoading ? (
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
            <p>Loading...</p>
          </div>
        ) : (
          <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
        )}

        {cart.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Your cart is empty.
          </p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              console.log(item);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between border p-4 rounded shadow-sm"
                >
                  <div className="flex flex-col gap-4">
                    <h2 className="font-semibold">{item.name}</h2>
                    <img
                      src={item.picture}
                      alt={item.name}
                      className="w-20 rounded"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm text-black font-semibold dark:text-white">
                        Price:{" "}
                        <span className="text-gray-600 font-normal dark:text-gray-400">
                          {formatRupiah(item.price)}{" "}
                        </span>
                        x {item.quantity}
                      </p>
                      <p className="text-sm text-black font-semibold dark:text-white">
                        Total:{" "}
                        <span className="text-gray-600 font-normal dark:text-gray-400">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-500"
                      disabled={cartLoading}
                    >
                      –
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-500"
                      disabled={cartLoading}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 dark:bg-red-700"
                      disabled={cartLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col items-end mt-6 gap-2">
              <p className="text-xl font-bold">
                Total: {formatRupiah(totalPrice)}
              </p>
              {errorMsg && <p className="text-red-500">{errorMsg}</p>}
              <Button onClick={handleCheckout}>
                {loading ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
