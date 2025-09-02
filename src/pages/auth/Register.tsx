import { api } from "@/services/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (pictureFile) {
      formData.append("picture", pictureFile);
    }

    try {
      const res = await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Register success:", res.data);
      navigate("/login");
    } catch (err: any) {
      console.error("Register error", err);
      setErrorMsg(err.response?.data?.message || "Register gagal");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white text-center dark:bg-zinc-900 p-6 rounded shadow space-y-4"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <div className="space-y-2">
          <Label htmlFor="name">Username</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="picture">Profile Image</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPictureFile(file);
            }}
          />
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}

        <Button type="submit" className="w-full">
          Register
        </Button>

        <p className="text-sm">
          Already have an account? {""}
          <Link to="/login" className="text-sm underline text-blue-700">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
