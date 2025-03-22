export default function TestOrderPage() {
    const handleTestOrder = async () => {
      console.log("Step 1: Test button clicked");
  
      const order = {
        productSlug: "test-product",
        productName: "Test Product",
        productRate: "$50",
        customerName: "Test User",
        customerPhone: "1234567890",
        customerEmail: "test@example.com",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
  
      console.log("Step 2: Order data to be sent:", order);
  
      try {
        console.log("Step 3: Sending fetch request to /api/orders");
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(order),
        });
  
        console.log("Step 4: Response status:", res.status);
        const data = await res.json();
        console.log("Step 5: Response data:", data);
  
        if (res.status === 201 && data.insertedId) {
          console.log("Step 6: Order placed successfully:", data);
          alert("Order placed successfully!");
        } else {
          console.error("Step 7: Failed to place order:", data);
          alert(`Failed to place order: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Step 8: Error placing order:", error);
        alert(`Failed to place order: ${error.message}`);
      }
    };
  
    return (
      <div>
        <h1>Test Order Page</h1>
        <button onClick={handleTestOrder}>Place Test Order</button>
      </div>
    );
  }