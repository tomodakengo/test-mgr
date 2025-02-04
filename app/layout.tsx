import "./globals.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { getServerSession } from "@auth/core";
import AuthContext from "@/context/AuthContext";
import { authConfig } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Test Manager",
  description: "Web-based software test management tool",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthContext session={session}>{children}</AuthContext>
      </body>
    </html>
  );
}
