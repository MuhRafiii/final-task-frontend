import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Admin Dashboard</h1>
        <p className="text-gray-700">Quick overview and stats...</p>
      </main>
    </div>
  );
}
