import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useRef, useState } from "react";

export function EditProduct({ product, onUpdateSuccess }: any) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stocks, setStocks] = useState(product.stocks);
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stocks", stocks.toString());
    formData.append("picture", picture!);
    try {
      setLoading(true);
      await api.put(`/product/${product.id}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpdateSuccess();
      dialogCloseRef.current?.click();
    } catch (err: any) {
      console.error("failed to update product", err);
      alert(err.response?.data?.message || "failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="mb-2">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="mb-2">Stock</Label>
            <Input
              type="number"
              value={stocks}
              onChange={(e) => setStocks(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="picture" className="mb-2">
              Image
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
                className="mt-2 h-20 object-cover border rounded"
              />
            )}
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <div className="">
              <Button
                className="w-full"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <DialogClose>
                <button ref={dialogCloseRef} className="hidden" />
              </DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
