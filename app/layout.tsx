import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "QR Code Generator is a simple and easy-to-use tool that allows you to create QR codes for free. With our generator, you can quickly generate QR codes for URLs, text, email addresses, phone numbers, and more. Simply enter the information you want to encode, customize the design if desired, and download your QR code in various formats. Start creating your own QR codes today with our user-friendly generator!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins} `}
    >
      <body className="min-h-full flex flex-col">
        {children}
        </body>
    </html>
  );
}
