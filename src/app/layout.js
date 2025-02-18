import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Iowa Regulations Dashboard | Government Analytics',
  description: 'Explore Iowa\'s regulatory landscape through interactive visualizations of rules, agencies, and regulatory trends. Track the growth and complexity of state regulations over time.',
  keywords: 'Iowa regulations, government analytics, regulatory dashboard, state agencies, bureaucracy index',
  openGraph: {
    title: 'Iowa Regulations Dashboard',
    description: 'Interactive analytics dashboard tracking Iowa\'s regulatory landscape and bureaucracy index.',
    url: 'https://regulations.iowa.gov',
    siteName: 'Iowa Regulations Dashboard',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'Iowa Regulations Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iowa Regulations Dashboard',
    description: 'Interactive analytics dashboard tracking Iowa\'s regulatory landscape and bureaucracy index.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
