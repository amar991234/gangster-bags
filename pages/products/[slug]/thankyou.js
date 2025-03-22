import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link
import styles from "@/styles/Home.module.css";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default function ThankYou({ product, order }) {
  const [timer, setTimer] = useState(10);
  const [redirectFailed, setRedirectFailed] = useState(false);

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

    const hashEmail = (email) => {
      if (!email) return null;
      const trimmedEmail = email.trim().toLowerCase();
      return require("crypto").createHash("sha256").update(trimmedEmail).digest("hex");
    };

    const userData = {
      client_user_agent: navigator.userAgent,
    };

    if (order?.customer?.email) {
      userData.em = hashEmail(order.customer.email);
    }

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
        userData: userData,
        custom_data: {
          order_id: order?._id.toString(),
        },
      }),
    }).catch((error) => console.error("Error sending CAPI event:", error));
  }, [product, order]);

  useEffect(() => {
    if (!product.meeshoLink) {
      setRedirectFailed(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      if (product.meeshoLink) {
        try {
          window.location.href = product.meeshoLink;
        } catch (error) {
          console.error("Redirect to Meesho failed:", error);
          setRedirectFailed(true);
        }
      } else {
        setRedirectFailed(true);
      }
    }, 10000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirectTimer);
    };
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Thank You for Your Order of ${product.name} - Redirecting to Meesho`}</title>
        <meta name="description" content={`Thank you for ordering ${product.name}. Redirecting to Meesho for your order.`} />
        <link rel="preload" href={product.image} as="image" />
      </Head>

      <main className={styles.main}>
        <div className={styles.thankYouContainer}>
          {redirectFailed ? (
            <div className={styles.redirectMessage}>
              <p>
                <span className={styles.meeshoIcon}>⚠️</span> No Meesho link available for this product. Please continue shopping.
              </p>
            </div>
          ) : (
            <div className={styles.redirectMessage}>
              <p>
                <span className={styles.meeshoIcon}>📦</span> Redirecting to{" "}
                <span className={styles.meeshoHighlight}>Meesho</span> in{" "}
                <span className={styles.timerHighlight}>{timer} seconds</span>
              </p>
            </div>
          )}

          <h2 className={styles.thankYouTitle}>Order on Meesho for Cash on Delivery</h2>

          <p className={styles.confirmationMessage}>
            Thank you for your order! You will be charged{" "}
            <span className={styles.productRate}>
              <span className={styles.rupeeSymbol}>₹</span>
              {product.rate.replace(/[^0-9.]/g, "")}
            </span>{" "}
            on delivery.
          </p>

          <div className={styles.thankYouProductCard}>
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              priority
            />
            <div className={styles.thankYouProductInfo}>
              <p className={styles.thankYouProductName}>{product.name}</p>
              <div className={styles.productRateWrapper}>
                <p className={styles.productRate}>
                  <span className={styles.rupeeSymbol}>₹</span>
                  {product.rate.replace(/[^0-9.]/g, "")}
                </p>
                <span className={styles.codBadge}>COD Available</span>
              </div>
            </div>
          </div>

          {!redirectFailed && (
            <div className={styles.buttonGroup}>
              <a href={product.meeshoLink} className={styles.buyNow}>
                Go to Meesho Now
              </a>
            </div>
          )}

          {redirectFailed && (
            <div className={styles.buttonGroup}>
              <Link href="/products">
                <a className={styles.buyNow}>Continue Shopping</a>
              </Link>
              <Link href={`/products/${product.slug}`}>
                <a className={styles.viewVideo}>Back to Product</a>
              </Link>
            </div>
          )}
        </div>

        {timer === 0 && !redirectFailed && (
          <div className={styles.fullScreenLoader}>
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
              <p className={styles.loaderText}>Redirecting...</p>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2025 The Gangster Bags. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params, query }) {
  const { slug } = params;
  const { orderId } = query;
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "-");
  console.log(`getServerSideProps: Fetching product for slug: ${normalizedSlug}`);

  const { db } = await connectToDatabase();
  const product = await db.collection("products").findOne({ slug: normalizedSlug });

  if (!product) {
    console.log(`Product not found for slug: ${normalizedSlug}`);
    return {
      notFound: true,
    };
  }

  let order = null;
  if (orderId) {
    order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });
  }

  console.log(`Product found: ${JSON.stringify(product)}`);
  if (order) {
    console.log(`Order found: ${JSON.stringify(order)}`);
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      order: order ? JSON.parse(JSON.stringify(order)) : null,
    },
  };
}