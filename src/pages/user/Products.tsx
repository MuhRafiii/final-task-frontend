import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/utils";
import type { CartItem } from "@/types/CartType";
import type { ProductType } from "@/types/ProductType";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const { cart, addItem, updateQuantity, removeItem, cartLoading } = useCart();
  const cartItem = cart.find(
    (item: CartItem) => item.name === selectedProduct?.name
  );

  const [sortBy, setSortBy] = useState("price");
  const [orderBy, setOrderBy] = useState("asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/product/", {
          params: {
            sortBy,
            orderBy,
            ...(minPrice && { minPrice }),
            ...(maxPrice && { maxPrice }),
            limit,
            page,
          },
        });
        setProducts(res.data.products.fullProducts);
        const totalItems = res.data.products.total;
        setTotalPages(Math.ceil(totalItems / Number(limit)));
        setErrorMsg("");
      } catch (err) {
        console.error("Gagal fetch data products", err);
        setErrorMsg("Gagal fetch data products");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    fetchPosts();
  }, [sortBy, orderBy, minPrice, maxPrice, limit, page]);

  const handleAddToCart = () => {
    addItem({ ...selectedProduct!, quantity: 1 });
  };

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

  return (
    <>
      <Navbar />
      <div className="max-w-10/12 mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Products</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="price">Price</option>
              <option value="name">Name</option>
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
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        {sortBy === "price" && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : errorMsg ? (
          <p className="text-center">No products found</p>
        ) : (
          <div className="">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {products.map((product) => (
                <Dialog key={product.id}>
                  <DialogTrigger asChild>
                    <Card
                      onClick={() => setSelectedProduct(product)}
                      className="cursor-pointer hover:shadow-md transition"
                    >
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center gap-4">
                        <img
                          src={product.picture}
                          alt={product.name}
                          className="w-50 h-50"
                        />
                        <p>
                          <span className="font-bold">Price: </span>
                          {formatRupiah(product.price)}
                        </p>
                        <CardDescription className="text-justify line-clamp-3">
                          {product.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedProduct?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center">
                      <img
                        src={selectedProduct?.picture}
                        alt={selectedProduct?.name}
                        className="w-50 h-50"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">Price: </span>
                        {selectedProduct?.price !== undefined &&
                          formatRupiah(selectedProduct.price)}
                      </p>
                      <p>
                        <span className="font-bold">Stock: </span>
                        {selectedProduct?.stocks}
                      </p>
                    </div>
                    <DialogDescription className="text-justify">
                      {selectedProduct?.description}
                    </DialogDescription>
                    <DialogFooter>
                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          {cartLoading && <p>Loading...</p>}
                          <button
                            onClick={() =>
                              handleDecrease(cartItem.id, cartItem.quantity)
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                            disabled={cartLoading}
                          >
                            –
                          </button>

                          <span>{cartItem.quantity}</span>

                          <button
                            onClick={() =>
                              handleIncrease(cartItem.id, cartItem.quantity)
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                            disabled={cartLoading}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {cartLoading && <p>Loading...</p>}
                          <Button
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </ul>
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
