import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>();
  const [stocks, setStocks] = useState<number>();
  const [picture, setPicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("stocks", String(stocks));
      formData.append("picture", picture!); // 👈 hanya satu file

      setLoading(true);

      const res = await api.post("/product/add", formData);
      console.log(res.data);

      navigate("/admin/products");
    } catch (err) {
      console.error("Gagal menambah produk", err);
      alert("Gagal menambah produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-1/2 mx-auto p-4 flex flex-col justify-center gap-4">
        <h2 className="text-2xl font-semibold mb-4">Tambah Produk</h2>
        <div className="space-y-4">
          <div>
            <Label className="mb-1" htmlFor="name">
              Nama Produk
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="description">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="price">
              Harga
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="stocks">
              Stok
            </Label>
            <Input
              id="stocks"
              type="number"
              value={stocks}
              onChange={(e) => setStocks(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="picture">
              Gambar
            </Label>
            <Input
              id="picture"
              type="file"
              onChange={(e) => {
                setPicture(e.target.files![0]);
                setPreview(URL.createObjectURL(e.target.files![0]));
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-20 object-cover rounded"
              />
            )}
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </div>
      </div>
    </div>
  );
}
