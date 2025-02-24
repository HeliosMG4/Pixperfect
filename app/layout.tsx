import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider,SignInButton,SignedIn,SignedOut,} from "@clerk/nextjs";

import "./globals.css";

const IBMPlex = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex'
});

export const metadata: Metadata = {
  title: "PixPerfect - An AI powered image editor.",
  description: "An AI-powered image editing tool to enable users to achieve professional grade results with unprecedented ease and efficiency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: { colorPrimary: '#624cf5' }
    }}>
      <html lang="en">
        <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
        <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
} 
