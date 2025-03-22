export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { eventName, eventId, value, currency, content_ids, content_type, userData, custom_data } = req.body;
  
    // Validate required fields
    if (!eventName || !eventId || !content_ids || !content_type || !userData) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    let clientIpAddress = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
  
    if (clientIpAddress === "127.0.0.1" || clientIpAddress === "::1" || !clientIpAddress) {
      clientIpAddress = "127.0.0.1";
    }
  
    const ipRegex = /^(?:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|[0-9a-fA-F:]+)$/;
    if (!ipRegex.test(clientIpAddress)) {
      console.error(`Invalid IP address format: ${clientIpAddress}`);
      clientIpAddress = "127.0.0.1";
    }
  
    // Use the host from the request headers to make the event_source_url dynamic
    const host = req.headers.host || "thegangsterbags.com";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const eventSourceUrl = `${protocol}://${host}${req.headers.referer || ""}`;
  
    const eventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl,
      action_source: "website",
      user_data: {
        client_ip_address: clientIpAddress,
        client_user_agent: userData.client_user_agent || req.headers["user-agent"],
        em: userData.em || null,
      },
      custom_data: {
        value: value || 0,
        currency: currency || "INR",
        content_ids: content_ids || [],
        content_type: content_type || "product",
        ...custom_data,
      },
    };
  
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${process.env.FACEBOOK_PIXEL_ID}/events?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: [eventData],
          }),
        }
      );
  
      const result = await response.json();
      if (response.ok) {
        return res.status(200).json({ success: true, result });
      } else {
        console.error("Error sending event to Facebook CAPI:", result);
        return res.status(500).json({ error: "Failed to send event", details: result });
      }
    } catch (error) {
      console.error("Error in Facebook CAPI request:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
    }
  }