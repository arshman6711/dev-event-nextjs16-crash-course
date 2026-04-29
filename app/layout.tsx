import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/navbar";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev event",
  description: "the hub for every dev event you mustn't miss",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}){
    return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <body 
      className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
    <Navbar/>

       <div className="absolute inset-0 top-0 z-[-1] min-h-screen ">
  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#5dfeca"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={3}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}
/>
</div>
<main>
  {children}
</main>
      </body>
    </html>
  );
}