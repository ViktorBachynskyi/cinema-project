import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2 className="text-center mb-10">Sign In</h2>
      <form className="flex flex-col items-center gap-5" onSubmit={handleEmailLogin}>
        <input
            className="w-full border p-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <input
            className="w-full border p-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <button className="w-max border p-2" type="submit">Sign in with Email</button>
      </form>
      <hr className="my-5" />
      <div className="flex justify-center">
        <button className="w-max border p-2 mx-auto" onClick={handleGoogleLogin}>
            Sign in with Google
        </button>
      </div>
      {error && (
        <p style={{ color: "red", marginTop: 10 }}>{error}</p>
      )}
    </div>
  );
};

export default SignIn;