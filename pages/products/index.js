import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { connectToDatabase } from "@/lib/mongodb";

export default function Products({ products }) {
  return (
    <div className={styles.productsContainer}>
      <Head>
        <title>Products | The Gangster Bags</title>
        <meta name="description" content="Explore all premium and stylish bags at The Gangster Bags" />
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

      <main className={styles.productsMain}>
        <h2 className={styles.productsTitle}>Our Products</h2>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.slug} className={styles.productItem}>
              <div className={styles.imageContainer}>
                <Image src={product.image} alt={product.name} width={250} height={300} />
              </div>
              <div className={styles.productInfo}>
                <p className={styles.productName}>{product.name}</p>
                <div className={styles.productRateWrapper}>
                  <p className={styles.productRate}>
                    <span className={styles.rupeeSymbol}>₹</span>
                    {product.rate.replace(/[^0-9.]/g, "")}
                  </p>
                  <span className={styles.codBadge}>COD Available</span>
                </div>
                <div className={styles.buttonGroup}>
                  <Link href={`/products/${product.slug}/video`} passHref>
                    <button
                      className={styles.viewVideo}
                      onClick={() => console.log(`Navigating to video page for ${product.slug}`)}
                      onTouchStart={() =>
                        console.log(`Touch detected on View Video for ${product.slug}`)
                      }
                    >
                      View Video
                    </button>
                  </Link>
                  <Link href={`/products/${product.slug}`} passHref>
                    <button className={styles.buyNow}>Buy Now</button>
                  </Link>
                </div>
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