import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Admin.module.css";
import jwt from "jsonwebtoken";

export default function Dashboard() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Dashboard | The Gangster Bags</title>
        <meta name="description" content="Admin dashboard for The Gangster Bags" />
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
        <h2>Admin Dashboard</h2>
        <div className={styles.dashboardLinks}>
          <Link href="/admin/products">
            <button className={styles.submitButton}>Manage Products</button>
          </Link>
          <Link href="/admin/orders">
            <button className={styles.submitButton}>Manage Orders</button>
          </Link>
          <Link href="/admin/settings">
            <button className={styles.submitButton}>Settings</button>
          </Link>
          <button onClick={handleLogout} className={styles.deleteButton}>
            Logout
          </button>
        </div>
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
        destination: `/admin/login?redirect=${encodeURIComponent("/admin/dashboard")}`,
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
    console.error("Token verification failed in /admin/dashboard:", error.message);
    res.setHeader("Set-Cookie", `authToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
    return {
      redirect: {
        destination: `/admin/login?redirect=${encodeURIComponent("/admin/dashboard")}`,
        permanent: false,
      },
    };
  }
}