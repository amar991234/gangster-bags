import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Admin.module.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("adminLoggedIn")) {
      router.push("/admin");
      return;
    }

    const fetchOrders = async () => {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Orders</h1>
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderItem}>
            <p>Order ID: {order._id}</p>
            <p>Customer: {order.customerName}</p>
            <p>Product: {order.productName}</p>
            <p>Rate: {order.productRate}</p>
            <p>Phone: {order.customerPhone}</p>
            <p>Email: {order.customerEmail}</p>
            <p>Status: {order.status}</p>
            <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}