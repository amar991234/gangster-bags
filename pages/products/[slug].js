import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { connectToDatabase } from "@/lib/mongodb";

export default function ProductDetail({ product }) {
  const router = useRouter();
  const { slug } = router.query;

  // Track ViewContent event when the page loads
  useEffect(() => {
    if (!product) return;

    const eventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        eventID: eventId,
      });
    }

    fetch("/api/facebook-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName: "ViewContent",
        eventId: eventId,
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        userData: {
          client_user_agent: navigator.userAgent,
        },
      }),
    }).catch((error) => console.error("Error sending CAPI event:", error));
  }, [product]);

  // Track AddToCart event
  const handleAddToCart = () => {
    const eventId = `addtocart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        eventID: eventId,
      });
    }

    fetch("/api/facebook-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName: "AddToCart",
        eventId: eventId,
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        userData: {
          client_user_agent: navigator.userAgent,
        },
      }),
    }).catch((error) => console.error("Error sending CAPI event:", error));
  };

  // Track InitiateCheckout event
  const handleBuyNow = () => {
    const eventId = `checkout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        eventID: eventId,
      });
    }

    fetch("/api/facebook-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName: "InitiateCheckout",
        eventId: eventId,
        content_ids: [product.slug],
        content_type: "product",
        value: parseFloat(product.rate.replace(/[^0-9.]/g, "")),
        currency: "INR",
        userData: {
          client_user_agent: navigator.userAgent,
        },
      }),
    }).catch((error) => console.error("Error sending CAPI event:", error));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.productDetailContainer}>
      <Head>
        <title>{product.name} | The Gangster Bags</title>
        <meta name="description" content={`Details of the ${product.name}`} />
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
            <h2 className={styles.productName}>{product.name}</h2>
            <p className={styles.productRate}>{product.rate}</p>
            <p className={styles.productDescription}>{product.description}</p>
            <div className={styles.productSpecs}>
              <h3>Specifications:</h3>
              <ul>
                <li>Material: {product.specs.material}</li>
                <li>Weight: {product.specs.weight}</li>
                <li>Dimensions: {product.specs.dimensions}</li>
                <li>Capacity: {product.specs.capacity}</li>
              </ul>
            </div>
            <p className={styles.productAvailability}>Availability: {product.availability}</p>
            <div className={styles.buttonGroup}>
              <Link href={`/products/${slug}/video`} passHref legacyBehavior>
                <button
                  className={styles.viewVideo}
                  onClick={() => console.log(`Navigating to video for ${slug}`)}
                >
                  View Video
                </button>
              </Link>
              <Link href={`/products/${slug}/checkout`} passHref legacyBehavior>
                <button className={styles.buyNow} onClick={handleBuyNow}>
                  Buy Now
                </button>
              </Link>
              <button className={styles.addToCart} onClick={handleAddToCart}>
                Add to Cart
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
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "-"); // Normalize slug
  console.log(`getServerSideProps: Fetching product for slug: ${normalizedSlug}`);
  const { db } = await connectToDatabase();
  const product = await db.collection("products").findOne({ slug: normalizedSlug });

  if (!product) {
    console.log(`Product not found for slug: ${normalizedSlug}`);
    return {
      notFound: true,
    };
  }

  console.log(`Product found: ${JSON.stringify(product)}`);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}