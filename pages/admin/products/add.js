import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Admin.module.css";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    rate: "",
    description: "",
    video: "",
    meeshoLink: "",
    specs: { material: "", weight: "", dimensions: "", capacity: "" },
    availability: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    router.push("/admin/products");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Image URL</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Rate</label>
          <input
            type="text"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Video URL</label>
          <input
            type="text"
            value={formData.video}
            onChange={(e) => setFormData({ ...formData, video: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Meesho Link</label>
          <input
            type="text"
            value={formData.meeshoLink}
            onChange={(e) => setFormData({ ...formData, meeshoLink: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Material</label>
          <input
            type="text"
            value={formData.specs.material}
            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, material: e.target.value } })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Weight</label>
          <input
            type="text"
            value={formData.specs.weight}
            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, weight: e.target.value } })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Dimensions</label>
          <input
            type="text"
            value={formData.specs.dimensions}
            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, dimensions: e.target.value } })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Capacity</label>
          <input
            type="text"
            value={formData.specs.capacity}
            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, capacity: e.target.value } })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Availability</label>
          <input
            type="text"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Add Product</button>
      </form>
    </div>
  );
}