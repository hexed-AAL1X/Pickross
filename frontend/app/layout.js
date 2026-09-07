import "./globals.css";

export const metadata = {
  title: "PickCross — Picross Solver",
  description:
    "Normal, Color and Mega Picross solver with step-by-step animation",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
