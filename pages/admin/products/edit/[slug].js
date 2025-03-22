import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";
import styles from "@/styles/Admin.module.css";
import { connectToDatabase } from "@/lib/mongodb";

export default function EditProduct({ product }) {
  const router = useRouter();
  const { slug } = router.query;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    image: product?.image || "",
    rate: product?.rate || "",
    description: product?.description || "",
    video: product?.video || "",
    meeshoLink: product?.meeshoLink || "",
    availability: product?.availability || "",
    specs: {
      material: product?.specs?.material || "",
      weight: product?.specs?.weight || "",
      dimensions: product?.specs?.dimensions || "",
      capacity: product?.specs?.capacity || "",
    },
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        image: product.image || "",
        rate: product.rate || "",
        description: product.description || "",
        video: product.video || "",
        meeshoLink: product.meeshoLink || "",
        availability: product.availability || "",
        specs: {
          material: product.specs?.material || "",
          weight: product.specs?.weight || "",
          dimensions: product.specs?.dimensions || "",
          capacity: product.specs?.capacity || "",
        },
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("specs.")) {
      const specField = name.split("specs.")[1];
      setFormData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Product updated successfully!");
        if (formData.slug !== slug) {
          router.push(`/admin/products/edit/${formData.slug}`);
        }
      } else {
        setMessage(data.message || "Error updating product");
      }
    } catch (error) {
      setMessage("Error updating product");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <AdminLayout>
        <p>Product Not Found</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.editProduct}>
        <h2>Edit Product: {product.name}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information */}
          <div className={styles.formSection}>
            <h3>Basic Information</h3>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="rate">Rate</label>
              <input
                type="text"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="availability">Availability</label>
              <input
                type="text"
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.formSection}>
            <h3>Description</h3>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Links */}
          <div className={styles.formSection}>
            <h3>Links</h3>
            <div className={styles.formGroup}>
              <label htmlFor="video">Video URL</label>
              <input
                type="text"
                id="video"
                name="video"
                value={formData.video}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="meeshoLink">Meesho Link</label>
              <input
                type="text"
                id="meeshoLink"
                name="meeshoLink"
                value={formData.meeshoLink}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className={styles.formSection}>
            <h3>Specifications</h3>
            <div className={styles.formGroup}>
              <label htmlFor="material">Material</label>
              <input
                type="text"
                id="material"
                name="specs.material"
                value={formData.specs.material}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="weight">Weight</label>
              <input
                type="text"
                id="weight"
                name="specs.weight"
                value={formData.specs.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="dimensions">Dimensions</label>
              <input
                type="text"
                id="dimensions"
                name="specs.dimensions"
                value={formData.specs.dimensions}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="capacity">Capacity</label>
              <input
                type="text"
                id="capacity"
                name="specs.capacity"
                value={formData.specs.capacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </button>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </button>
          </div>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </AdminLayout>
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