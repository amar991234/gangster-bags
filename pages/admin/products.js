import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Admin.module.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("adminLoggedIn")) {
      router.push("/admin");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products", {
          headers: {
            "x-admin-session": "true", // Pass admin session status
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [router]);

  const handleDelete = async (slug) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/admin/products/${slug}`, {
          method: "DELETE",
          headers: {
            "x-admin-session": "true", // Pass admin session status
          },
        });
        if (!res.ok) {
          throw new Error("Failed to delete product");
        }
        setProducts(products.filter((p) => p.slug !== slug));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Products</h1>
      <Link href="/admin/products/add">
        <button className={styles.addToCart}>Add New Product</button>
      </Link>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.slug} className={styles.productItem}>
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <p>{product.name}</p>
              <p>{product.rate}</p>
              <div className={styles.buttonGroup}>
                <Link href={`/admin/products/edit/${product.slug}`}>
                  <button className={styles.viewVideo}>Edit</button>
                </Link>
                <button onClick={() => handleDelete(product.slug)} className={styles.buyNow}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}