import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "PriceHawk",
  description:
    "Never miss a deal. Track prices, get alerts, save money on every purchase.",
  icons: {
    icon: "/pricehawk-logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
