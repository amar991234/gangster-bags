import Head from "next/head";
import Image from "next/image";
import Link from "next/link"; // Import Link
import styles from "@/styles/Admin.module.css";
import jwt from "jsonwebtoken";

export default function Settings() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Settings | The Gangster Bags Admin</title>
        <meta name="description" content="Admin panel to manage settings" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="The Gangster Bags Logo" width={150} height={80} priority />
        </div>
        <h1 className={styles.title}>
          <span className={styles.gangster}>THE GANGSTER</span>
          <span className={styles.bags}>BAGS</span>
        </h1>
      </header>

      <main className={styles.main}>
        <h2>Settings</h2>
        <div className={styles.navLinks}>
          <Link href="/admin/">Dashboard</Link>
          <Link href="/admin/products/">Products</Link>
          <Link href="/admin/settings/">Settings</Link>
        </div>
        <p>Settings page is under construction.</p>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 The Gangster Bags. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const token = req.cookies.authToken || null;

  if (!token) {
    return {
      redirect: {
        destination: `/admin/login?redirect=${encodeURIComponent("/admin/settings")}`,
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return {
      props: {},
    };
  } catch (error) {
    console.error("Token verification failed in /admin/settings:", error.message);
    res.setHeader("Set-Cookie", `authToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
    return {
      redirect: {
        destination: `/admin/login?redirect=${encodeURIComponent("/admin/settings")}`,
        permanent: false,
      },
    };
  }
}