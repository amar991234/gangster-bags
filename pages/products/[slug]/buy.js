import Head from "next/head";
import Image from "next/image"; // Import Image
import styles from "@/styles/Buy.module.css";

export default function Buy({ product }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Buy {product.name} | The Gangster Bags</title>
        <meta name="description" content={`Buy ${product.name} from The Gangster Bags`} />
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
        <h2>Buy {product.name}</h2>
        <p>Price: ₹{product.rate}</p>
        {/* Add your buy form or logic here */}
      </main>

      <footer className={styles.footer}>
        <p>© 2025 The Gangster Bags. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  // Fetch product data based on slug (you may need to adjust this based on your data source)
  const product = {
    name: "Sample Product",
    rate: 1000,
  };

  return {
    props: {
      product,
    },
  };
}