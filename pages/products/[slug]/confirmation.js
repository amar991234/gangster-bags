import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { connectToDatabase } from "@/lib/mongodb";

export default function PurchaseConfirmation({ product }) {
  const router = useRouter();
  const { slug } = router.query;

  // Track Purchase event when the confirmation page loads
  useEffect(() => {
    if (!product) return;

    const eventId = `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (window.fbq) {
      window.fbq("track", "Purchase", {
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        eventID: eventId,
      });
    }

    // Send server-side event via Conversions API
    fetch("/api/facebook-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName: "Purchase",
        eventId: eventId,
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        userData: {
          client_ip_address: "unknown", // We'll get this server-side
          client_user_agent: navigator.userAgent,
        },
      }),
    }).catch((error) => console.error("Error sending CAPI event:", error));
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.productDetailContainer}>
      <Head>
        <title>Purchase Confirmation | The Gangster Bags</title>
        <meta name="description" content={`Confirmation of your purchase for ${product.name}`} />
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

      <main className={styles.productDetailMain}>
        <div className={styles.productDetailContent}>
          <div className={styles.productImage}>
            <Image src={product.image} alt={product.name} width={400} height={500} />
          </div>
          <div className={styles.productInfo}>
            <h2 className={styles.productName}>Thank You for Your Purchase!</h2>
            <p className={styles.productDescription}>
              Your order for <strong>{product.name}</strong> has been successfully placed.
            </p>
            <p className={styles.productRate}>
              Total: ₹{product.rate.replace(/[^0-9.]/g, "")}
            </p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.buyNow}
                onClick={() => router.push("/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 The Gangster Bags. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const { db } = await connectToDatabase();
  const product = await db.collection("products").findOne({ slug });

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}