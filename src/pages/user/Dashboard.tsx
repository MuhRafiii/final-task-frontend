import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="space-y-10">
      <Navbar />
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Dashboard</h1>
        <p className="text-center">
          Selamat datang di dashboard, selamat belanja!
        </p>
      </div>
      <div className="w-2/3 mx-auto grid grid-cols-2 gap-8">
        <div className="w-full bg-sky-500 dark:bg-sky-600 text-center text-lg space-y-4 p-8 rounded-lg shadow-2xl">
          <p className="text-white">Lihat point kamu?</p>
          <Button
            variant="outline"
            className="dark:bg-gray-900 dark:hover:bg-gray-700"
          >
            <Link to="/transfer-point">Transfer Point</Link>
          </Button>
        </div>
        <div className="w-full bg-green-500 dark:bg-green-600 text-center text-lg space-y-4 p-8 rounded-lg shadow-2xl">
          <p className="text-white">Mulai belanja?</p>
          <Button
            variant="outline"
            className="dark:bg-gray-900 dark:hover:bg-gray-700"
          >
            <Link to="/products">Lanjut Belanja</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
