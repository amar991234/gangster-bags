import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.css";
import { connectToDatabase } from "@/lib/mongodb";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function ProductVideo({ product }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  // Function to check if the video URL is a YouTube link (including Shorts)
  const isYouTubeLink = (url) => {
    if (!url) return false;
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be") || url.includes("youtube.com/shorts");
    console.log(`Checking if URL is YouTube: ${url} -> ${isYouTube}`);
    return isYouTube;
  };

  // Function to check if the video URL is an Instagram Reel link
  const isInstagramReelLink = (url) => {
    if (!url) return false;
    const isInstagram = url.includes("instagram.com/reels");
    console.log(`Checking if URL is Instagram Reel: ${url} -> ${isInstagram}`);
    return isInstagram;
  };

  // Function to extract YouTube video ID from URL (including Shorts)
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtube.com/shorts")) {
      videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0];
    } else if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else {
      videoId = url.split("v=")[1]?.split("&")[0];
    }
    console.log(`Extracted YouTube video ID: ${videoId}`);
    return videoId;
  };

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0` : null;
  };

  // Handle YouTube video load errors
  const handleVideoError = () => {
    setVideoError(true);
  };

  // Initialize Video.js player for non-YouTube videos
  useEffect(() => {
    if (!product || !product.video || isYouTubeLink(product.video) || isInstagramReelLink(product.video)) {
      return;
    }

    // Initialize Video.js player for non-YouTube videos
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true,
      aspectRatio: "9:16",
      sources: [
        {
          src: product.video,
          type: "video/mp4",
        },
      ],
    });

    playerRef.current = player;

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [product]);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  return (
    <div className={styles.fullScreenContainer}>
      <Head>
        <title>Video: {product.name} | The Gangster Bags</title>
        <meta name="description" content={`Watch the video for ${product.name}`} />
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

      <main className={styles.fullScreenMain}>
        <h2 className={styles.videoTitle}>{product.name} - Product Video</h2>
        {product.video ? (
          <div className={styles.productVideo}>
            {isYouTubeLink(product.video) ? (
              videoError ? (
                <p className={styles.errorMessage}>
                  Unable to load the video. Please try again later or watch it directly on{" "}
                  <a href={product.video} target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>.
                </p>
              ) : (
                <div className={styles.videoWrapper}>
                  <iframe
                    src={getYouTubeEmbedUrl(product.video)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onError={handleVideoError}
                  ></iframe>
                </div>
              )
            ) : isInstagramReelLink(product.video) ? (
              <div className={styles.instagramVideo}>
                <div className={styles.videoPlaceholder}>
                  <Image
                    src="/instagram-placeholder.jpg" // Replace with a placeholder image
                    alt="Instagram Reel Placeholder"
                    width={300}
                    height={400}
                    className={styles.placeholderImage}
                  />
                  <a
                    href={product.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.watchButton}
                  >
                    Watch on Instagram
                  </a>
                </div>
              </div>
            ) : (
              <div data-vjs-player className={styles.videoWrapper}>
                <video
                  ref={videoRef}
                  className="video-js vjs-default-skin vjs-big-play-centered"
                  playsInline
                />
              </div>
            )}
          </div>
        ) : (
          <p>No video available for this product.</p>
        )}
        {/* Buy Now Button at the Bottom */}
        <div className={styles.buyNowContainer}>
          <a href={`/products/${product.slug}`} className={styles.buyNow}>
            <span className={styles.typingText}>Buy Now</span>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 The Gangster Bags. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params, res }) {
  const { slug } = params;
  console.log(`Fetching product for slug: ${slug}`); // Debug log
  try {
    const { db } = await connectToDatabase();
    const product = await db.collection("products").findOne({ slug });

    if (!product) {
      console.log(`Product not found for slug: ${slug}`);
      return {
        notFound: true,
      };
    }

    console.log(`Product found: ${JSON.stringify(product)}`);

    // Disable caching to ensure fresh data
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
    console.error(`Error fetching product for slug ${slug}:`, error);
    return {
      notFound: true,
    };
  }
}