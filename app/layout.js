import "./globals.css";

export const metadata = {
  title: "Médiation Française",
  description: "Plateforme de traitement des erreurs et de médiation métacognitive pour le FLE"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
