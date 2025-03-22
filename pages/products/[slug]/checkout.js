import Head from "next/head";
import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";

export default function CheckoutPage({ product }) {
  if (!product || !product.slug) {
    console.error("Product or slug is missing:", { product });
    return <div>Error: Product not found.</div>;
  }

  return (
    <div style={styles.container}>
      <Head>
        <title>Checkout: {product.name} | The Gangster Bags</title>
        <meta name="description" content={`Checkout page for ${product.name}`} />
      </Head>

      <header style={styles.header}>
        <h1 style={styles.title}>The Gangster Bags</h1>
      </header>

      <main style={styles.main}>
        <h2 style={styles.checkoutTitle}>Checkout</h2>
        <div style={styles.checkoutContent}>
          <div style={styles.productSummary}>
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={250}
              style={styles.productImage}
            />
            <div style={styles.productDetails}>
              <h3>{product.name}</h3>
              <div style={styles.priceContainer}>
                <span style={styles.priceLabel}>Price:</span>
                <span style={styles.productRate}>{product.rate}</span>
              </div>
            </div>
          </div>
          <form action={`/api/submit-order?redirect=/products/${product.slug}/thankyou`} method="POST" style={styles.checkoutForm}>
            <input type="hidden" name="productSlug" value={product.slug} />
            <input type="hidden" name="productName" value={product.name} />
            <input type="hidden" name="productRate" value={product.rate} />
            <input type="hidden" name="status" value="Pending" />
            <input type="hidden" name="createdAt" value={new Date().toISOString()} />

            <h3>Customer Information</h3>
            <div style={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="customerName" required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="customerPhone" required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="customerEmail" required style={styles.input} />
            </div>
            <h3>Payment Method</h3>
            <div style={styles.paymentMethod}>
              <label>
                <input type="radio" name="payment" value="cod" defaultChecked />
                Cash on Delivery
              </label>
            </div>
            <button type="submit" style={styles.submitButton}>Place Order</button>
          </form>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 The Gangster Bags</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params, res }) {
  const { slug } = params;
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "-");
  console.log("getServerSideProps: Fetching product for slug:", normalizedSlug);
  try {
    const { db } = await connectToDatabase();
    const product = await db.collection("products").findOne({ slug: normalizedSlug });

    if (!product) {
      console.log(`Product not found for slug: ${normalizedSlug}`);
      return {
        notFound: true,
      };
    }

    console.log(`Product found: ${JSON.stringify(product)}`);

    if (res) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
    };
  } catch (error) {
    console.error("getServerSideProps: Error:", error);
    return { props: { product: null } };
  }
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f8f8f8",
    borderBottom: "1px solid #ddd",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  },
  main: {
    flex: 1,
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  checkoutTitle: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  checkoutContent: {
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  productSummary: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "300px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  productImage: {
    width: "200px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  productDetails: {
    textAlign: "center",
    marginTop: "10px",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
    backgroundColor: "#f8f8f8",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  priceLabel: {
    fontSize: "1.1rem",
    color: "#333",
    fontWeight: "600",
  },
  productRate: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#d32f2f",
  },
  checkoutForm: {
    maxWidth: "400px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  paymentMethod: {
    margin: "10px 0",
  },
  submitButton: {
    padding: "12px",
    fontSize: "1.1rem",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#005bb5",
  },
  footer: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f8f8f8",
    borderTop: "1px solid #ddd",
  },
};