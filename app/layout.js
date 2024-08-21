import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme.js'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rate my Professor Assistant",
  description: "rmp-rag",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
        </body>
    </html>
  );
}
