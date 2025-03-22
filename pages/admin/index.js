import AdminLayout from "@/components/AdminLayout";
import styles from "@/styles/Admin.module.css";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";

export default function AdminDashboard({ productCount, orderCount }) {
  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <h2>Welcome to the Admin Dashboard</h2>
        <div className={styles.summaryCards}>
          <div className={styles.card}>
            <h3>Total Products</h3>
            <p>{productCount}</p>
            <Link href="/admin/products">
              <button className={styles.button}>Manage Products</button>
            </Link>
          </div>
          <div className={styles.card}>
            <h3>Total Orders</h3>
            <p>{orderCount}</p>
            <Link href="/admin/orders">
              <button className={styles.button}>View Orders</button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const productCount = await db.collection("products").countDocuments();
  const orderCount = await db.collection("orders").countDocuments();

  return {
    props: {
      productCount,
      orderCount,
    },
  };
}