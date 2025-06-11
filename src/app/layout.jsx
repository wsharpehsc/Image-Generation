import './globals.css';

export const metadata = {
  title: "My Gemini App",
  description: "AI image generation with Gemini",
  icons:{
    icon:"/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
