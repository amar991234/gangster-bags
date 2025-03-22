import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import styles from "@/styles/Admin.module.css";
import { connectToDatabase } from "@/lib/mongodb";

export default function Products({ products }) {
  return (
    <AdminLayout>
      <div className={styles.products}>
        <div className={styles.productsHeader}>
          <h2>Products</h2>
          <Link href="/admin/products/add">
            <button className={styles.button}>Add New Product</button>
          </Link>
        </div>
        {products.length === 0 ? (
          <p className={styles.noProducts}>No products found.</p>
        ) : (
          <div className={styles.productTable}>
            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Slug</span>
              <span>Rate</span>
              <span>Availability</span>
              <span>Actions</span>
            </div>
            {products.map((product) => (
              <div key={product._id} className={styles.tableRow}>
                <span>{product.name}</span>
                <span>{product.slug}</span>
                <span>{product.rate}</span>
                <span>{product.availability}</span>
                <span>
                  <Link href={`/admin/products/edit/${product.slug}`}>
                    <button className={styles.button}>Edit</button>
                  </Link>
                  <button
                    className={styles.buttonDanger}
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this product?")) {
                        await fetch(`/api/products/${product.slug}`, {
                          method: "DELETE",
                        });
                        window.location.reload();
                      }
                    }}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const products = await db.collection("products").find({}).toArray();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}