import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { connectToDatabase } from "@/lib/mongodb";

export default function Home({ products }) {
  const handleViewVideoClick = (slug) => {
    console.log(`Navigating to video page for slug: ${slug}`);
    window.location.href = `/products/${slug}/video`; // Fallback navigation
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>The Gangster Bags</title>
        <meta name="description" content="Premium & Stylish Bags for Every Occasion" />
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

      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <button
            className={styles.shopNow}
            onClick={() => (window.location.href = "/products")}
            aria-label="Shop Now"
          >
            Shop Now
          </button>
        </div>

        <p className={styles.tagline}>Premium & Stylish Bags for Every Occasion</p>

        <div className={styles.productShowcase}>
          {products.map((product) => (
            <div key={product.slug} className={styles.productCard}>
              <Image src={product.image} alt={product.name} width={250} height={300} />
              <p>{product.name}</p>
              <p className={styles.productRate}>
                <span className={styles.rupeeSymbol}>₹</span>
                {product.rate.replace(/[^0-9.]/g, "")} {/* Remove any non-numeric characters except decimal */}
              </p>
              <div className={styles.buttonGroup}>
                <Link href={`/products/${product.slug}/video`} passHref legacyBehavior>
                  <button
                    className={styles.viewVideo}
                    onClick={() => handleViewVideoClick(product.slug)}
                    onTouchStart={() =>
                      console.log(`Touch detected on View Video for ${product.slug}`)
                    }
                  >
                    View Video
                  </button>
                </Link>
                <Link href={`/products/${product.slug}`} passHref legacyBehavior>
                  <button className={styles.buyNow}>Buy Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 The Gangster Bags. All rights reserved.</p>
      </footer>
    </div>
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