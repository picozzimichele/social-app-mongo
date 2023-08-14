import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
    title: "Threads",
    description: "A Next.js 13 Threads application created by Michele Picozzi",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${inter.className} bg-dark-1 flex items-center justify-center top-1/2 min-h-screen`}
                >
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
