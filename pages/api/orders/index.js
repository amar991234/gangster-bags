import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import styles from "@/styles/Admin.module.css";
import { connectToDatabase } from "@/lib/mongodb";

export default function Orders({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <AdminLayout>
      <div className={styles.orderTable}>
        <div className={styles.tableHeader}>
          <span>Order ID</span>
          <span>Product</span>
          <span>Customer</span>
          <span>Order Date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {orders.length === 0 ? (
          <p className={styles.noOrders}>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className={styles.tableRow}>
              <span>{order._id}</span>
              <span>{order.productName}</span>
              <span>{order.customer.name}</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className={styles.status}>
                <span
                  className={
                    order.status === "Pending"
                      ? styles.statusPending
                      : styles.statusCompleted
                  }
                >
                  {order.status}
                </span>
              </span>
              <span>
                <button
                  className={styles.toggleButton}
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  {expandedOrder === order._id ? "Hide Details" : "View Details"}
                </button>
              </span>
              {expandedOrder === order._id && (
                <div className={styles.orderDetails}>
                  <h3>Order Details</h3>
                  <p><strong>Price:</strong> ₹{order.productRate}</p>
                  <p><strong>Email:</strong> {order.customer.email}</p>
                  <p><strong>Phone:</strong> {order.customer.phone}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const orders = await db.collection("orders").find({}).toArray();

  return {
    props: {
      initialOrders: JSON.parse(JSON.stringify(orders)),
    },
  };
}