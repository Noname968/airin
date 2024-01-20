import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from "./providers";
import NextTopLoader from 'nextjs-toploader';
import Search from '@/components/search/Search'
import GoToTop from '@/components/GoToTop';
import localFont from 'next/font/local';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] })
const myfont = localFont({ src: "../static-fonts/28 Days Later.ttf" })

const APP_NAME = "Aniplay";
const APP_DEFAULT_TITLE = "Aniplay - Watch Anime Online";
const APP_DESCRIPTION = "Explore a vast collection of anime on Aniplay, your go-to destination for streaming the latest and classic anime series. Immerse yourself in captivating storylines, vibrant animation, and diverse genres. Discover a world of entertainment at your fingertips with Aniplay, where every episode is an adventure.";

export const metadata = {
  metadataBase: new URL('https://aniplay-next.vercel.app'),
  applicationName: APP_NAME,
  title: APP_DEFAULT_TITLE,
  description: APP_DESCRIPTION,
  keywords: [
    'anime',
    'trending anime',
    'watch anime subbed',
    'watch anime dubbed',
    'latest anime episodes',
    'anime streaming sub',
    'anime streaming dub',
    'subbed anime online',
    'dubbed anime online',
    'new anime releases',
    'watch anime sub and dub',
    'anime episodes subtitles',
    'english dubbed anime',
    'subbed and dubbed series',
    'anime series updates',
    'anime episodes english sub',
    'anime episodes english dub',
    'latest subbed anime',
    'latest dubbed anime',
    'subbed anime streaming',
    'dubbed anime streaming',
    'aniplay latest anime',
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark text-foreground bg-background'>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script src="https://kit.fontawesome.com/c189d5d7c5.js" crossOrigin="anonymous" async></script>
      </head>
      <body className={inter.className}>
        <Providers>
          <NextTopLoader color="#CA1313" className="z-[99999]" />
          <Search />
          {children}
          <GoToTop />
          <Footer/>
        </Providers>
      </body>
    </html>
  )
}
