import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function CheckoutPage({ product, settings }) {
  if (!product || !product.slug) {
    console.error("Product or slug is missing:", { product });
    return <div>Error: Product or slug not found.</div>;
  }

  if (!settings) {
    console.error("Settings are missing:", settings);
    return <div>Error: Settings not found.</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout: {product.name} | The Gangster Bags</title>
        <meta name="description" content={`Checkout page for ${product.name}`} />
      </Head>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.png"
            alt="The Gangster Bags Logo"
            width={150}
            height={80}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <h1 className={styles.title}>
          <span className={styles.gangster}>THE GANGSTER</span>
          <span className={styles.bags}>BAGS</span>
        </h1>
      </header>

      <main className={styles.checkoutMain}>
        <h2 className={styles.checkoutTitle}>Checkout</h2>
        <div className={styles.checkoutContent}>
          <div className={styles.productSummary}>
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={250}
              style={{ width: "auto", height: "auto" }}
            />
            <div className={styles.productDetails}>
              <h3>{product.name}</h3>
              <p className={styles.productRate}>{product.rate}</p>
            </div>
          </div>
          <form action={`/api/submit-order?redirect=/products/${product.slug}/thankyou`} method="POST" className={styles.checkoutForm}>
            <input type="hidden" name="productSlug" value={product.slug} />
            <input type="hidden" name="productName" value={product.name} />
            <input type="hidden" name="productRate" value={product.rate} />
            <input type="hidden" name="status" value="Pending" />
            <input type="hidden" name="createdAt" value={new Date().toISOString()} />

            <h3>Customer Information</h3>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="customerName" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="customerPhone" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="customerEmail" required />
            </div>
            <h3>Payment Method</h3>
            <div className={styles.paymentMethod}>
              <label>
                <input type="radio" name="payment" value="cod" defaultChecked />
                Cash on Delivery
              </label>
            </div>
            <button type="submit" className={styles.submitButton}>
              Place Order
            </button>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>{settings.footerText}</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  console.log("getServerSideProps: Fetching product for slug:", params.slug);
  try {
    const productRes = await fetch(`http://localhost:3000/api/products/${params.slug}`);
    console.log("getServerSideProps: Product response status:", productRes.status);
    if (!productRes.ok) {
      throw new Error(`Failed to fetch product: ${productRes.status}`);
    }
    const product = await productRes.json();
    console.log("getServerSideProps: Product data:", product);

    const settingsRes = await fetch("http://localhost:3000/api/settings");
    console.log("getServerSideProps: Settings response status:", settingsRes.status);
    if (!settingsRes.ok) {
      throw new Error(`Failed to fetch settings: ${settingsRes.status}`);
    }
    const settings = await settingsRes.json();
    console.log("getServerSideProps: Settings data:", settings);

    return { props: { product: { ...product, slug: params.slug }, settings } };
  } catch (error) {
    console.error("getServerSideProps: Error:", error);
    return { props: { product: null, settings: { tagline: "", footerText: "" } } };
  }
}