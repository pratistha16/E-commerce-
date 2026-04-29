import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MultiMarket | Multi-Tenant E-Commerce Platform",
  description: "Scalable Multi-Tenant E-Commerce Platform for modern digital brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased min-h-screen bg-white text-slate-900 flex flex-col`}
      >
        <AuthProvider>
          <TenantProvider>
            <CartProvider>
              <main className="flex-grow">{children}</main>
              <Toaster position="top-right" richColors />
            </CartProvider>
          </TenantProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
