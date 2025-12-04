import "./globals.css";

export const metadata = {
  title: "Picross Solver",
  description: "Normal, Color and Mega Picross solver with step-by-step animation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
