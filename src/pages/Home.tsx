import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/hooks/useAuth";
import { formatRupiah } from "@/lib/utils";
import { api } from "@/services/api";
import type { ProductType } from "@/types/ProductType";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product/", {
          params: { limit: 6, page: 1 },
        });
        setProducts(res.data.products.fullProducts || []); // fallback array
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-sky-300">
      <Navbar />

      {/* Hero Section */}
      <div className="text-center py-16 px-4 text-gray-700">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Selamat Datang di Mini Store
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Belanja lebih mudah, cepat, dan hemat. Dapatkan point rewards setiap
          kali belanja!
        </p>
        {!isAuthenticated && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-400 hover:bg-blue-500 text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-green-400 hover:bg-green-500 text-white"
            >
              Register
            </Button>
          </div>
        )}
      </div>

      {/* Produk Carousel */}
      <div className="w-full mx-auto px-4 pb-16">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Produk Pilihan Kami
        </h2>

        {products.length > 0 ? (
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-1/1 md:basis-1/2 lg:basis-1/3 p-4"
                >
                  <Card className="h-110 rounded-2xl hover:shadow-lg">
                    <CardHeader className="flex justify-center p-4">
                      <img
                        src={product.picture}
                        alt={product.name}
                        className="h-48 object-cover rounded"
                      />
                    </CardHeader>
                    <CardContent className="px-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-blue-600 font-bold mb-4">
                        {formatRupiah(product.price)}
                      </p>
                      <CardDescription className="text-justify line-clamp-3">
                        {product.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-center text-gray-500">Memuat produk...</p>
        )}
      </div>

      <div className="h-30 bg-sky-400 mask-t-to-transparent"></div>

      {/* Ajakan Join */}
      <div className="text-center pt-6 pb-12 bg-sky-400 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Yuk, mulai belanja sekarang juga!
        </h2>
        {isAuthenticated ? (
          <div className="w-2/3 mx-auto my-12 grid grid-cols-2 gap-8 text-gray-700">
            <div className="w-full bg-radial from-blue-200 from-40% to-blue-400 text-center text-lg space-y-4 p-8 rounded-lg shadow-2xl">
              <p className="font-semibold text-gray-700">Lihat point kamu?</p>
              <Button
                variant="outline"
                className="dark:bg-gray-900 dark:hover:bg-gray-700"
              >
                <Link to="/transfer-point">Transfer Point</Link>
              </Button>
            </div>
            <div className="w-full bg-radial from-green-200 from-40% to-cyan-400 text-center text-lg space-y-4 p-8 rounded-lg shadow-2xl">
              <p className="font-semibold text-gray-700">Mulai belanja?</p>
              <Button
                variant="outline"
                className="dark:bg-gray-900 dark:hover:bg-gray-700"
              >
                <Link to="/products">Lanjut Belanja</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6">
              Login atau daftar untuk menikmati berbagai promo dan point
              rewards.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/register")}
              className="font-semibold hover:bg-gray-100 text-black hover:text-sky-500"
            >
              Daftar Sekarang
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
