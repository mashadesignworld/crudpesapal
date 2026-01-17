import Image from "next/image";
import Navbar from "../components/Navbar";
import Header from "@/components/Header";
import Focus from "@/components/Focus";
import Register from "@/components/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function Home() {
  return (
<>
<GoogleOAuthProvider clientId={clientId}>
    <Navbar/>
    <Header />
    <Focus />
    <Register />
    </GoogleOAuthProvider>
  
</>
  );
}
