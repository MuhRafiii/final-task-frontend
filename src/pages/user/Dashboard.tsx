import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-sky-300 space-y-10">
      <Navbar />
      <div className="p-4 text-gray-700">
        <h1 className="text-4xl font-bold mb-4 text-center">Dashboard</h1>
        <p className="text-center">
          Selamat datang di dashboard, selamat belanja!
        </p>
      </div>
      <div className="w-2/3 mx-auto grid grid-cols-2 gap-8">
        <div className="w-full bg-radial from-blue-200 from-40% to-sky-400 text-center text-lg space-y-4 p-8 rounded-lg shadow-2xl">
          <p className="font-semibold text-gray-700">Lihat point kamu?</p>
          <Button
            variant="outline"
            className="dark:bg-gray-900 dark:hover:bg-gray-700"
          >
            <Link to="/transfer-point">Transfer Point</Link>
          </Button>
        </div>
        <div className="w-full bg-radial from-green-200 from-10% to-cyan-300 text-center text-lg space-y-4 p-8 rounded-lg shadow-2xl">
          <p className="font-semibold text-gray-700">Mulai belanja?</p>
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
