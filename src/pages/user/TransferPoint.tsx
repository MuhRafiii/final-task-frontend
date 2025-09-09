import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

export function TransferPoints() {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState<number>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [point, setPoint] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/transfer-point/point");
        setPoint(res.data.point);
      } catch (err) {
        console.error("Gagal fetch data products", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const res = await api.post("/transfer-point", {
        receiverEmail,
        amount,
      });
      setMessage(`Success! Transferred ${amount} points: ${res.data.message}`);
      setReceiverEmail("");
      setAmount(0);
      setPoint(res.data.transfer.sender.points);
      console.log(res.data);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Transfer failed.");
      console.error("failed to transfer points", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-sky-300">
      <Navbar />
      <div className="max-w-10/12 mx-auto flex justify-between text-gray-700">
        <h1 className="text-3xl font-bold">Transfer Points</h1>
        <p className="bg-sky-50 rounded-md text-gray-700 font-bold p-4 dark:bg-black dark:text-gray-200 dark:border-2">
          <Coins className="w-5 h-5 text-yellow-500 inline" /> {point}
        </p>
      </div>
      <div className="max-w-md bg-white mx-auto mt-10 p-6 rounded-xl shadow-md dark:border-2">
        <h2 className="text-xl font-bold mb-4">Transfer Points</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Receiver Email */}
          <div>
            <Label className="mb-1" htmlFor="receiverEmail">
              Receiver Email
            </Label>
            <Input
              id="receiverEmail"
              type="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              placeholder="receiver@email.com"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <Label className="mb-1" htmlFor="amount">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("Success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Transferring..." : "Transfer"}
          </Button>
        </form>
      </div>
    </div>
  );
}
