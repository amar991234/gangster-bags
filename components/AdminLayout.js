import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Admin.module.css";

export default function AdminLayout({ children }) {
  const router = useRouter();

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>The Gangster Bags</h2>
          <p>Admin Panel</p>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin">
            <span className={router.pathname === "/admin" ? styles.active : ""}>
              Dashboard
            </span>
          </Link>
          <Link href="/admin/products">
            <span
              className={
                router.pathname.startsWith("/admin/products") ? styles.active : ""
              }
            >
              Products
            </span>
          </Link>
          <Link href="/admin/orders">
            <span
              className={
                router.pathname === "/admin/orders" ? styles.active : ""
              }
            >
              Orders
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>
            {router.pathname === "/admin"
              ? "Dashboard"
              : router.pathname.startsWith("/admin/products")
              ? "Products"
              : "Orders"}
          </h1>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <p>© 2025 The Gangster Bags. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}