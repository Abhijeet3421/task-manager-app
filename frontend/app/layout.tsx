export const metadata = {
  title: "Task Manager",
  description: "Full Stack Task Management System",
};

import Navbar from "./Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Segoe UI, sans-serif",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        {/*  DARK OVERLAY */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            minHeight: "100vh",
          }}
        >
          <Navbar />

          {/*  MAIN CONTENT */}
          <main
            style={{
              maxWidth: "900px",
              margin: "40px auto",
              padding: "25px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(15px)",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              color: "white",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}