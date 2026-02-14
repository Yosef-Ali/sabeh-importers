
import "dotenv/config";

// Reliable image URLs
const TEST_IMAGE_WITH_TEXT = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1000"; // Book cover with text
const TEST_IMAGE_CAR = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000"; // Unsplash car

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("--- TESTING OCR ---");
  try {
    const res = await fetch(`${BASE_URL}/api/ai/ocr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: TEST_IMAGE_WITH_TEXT }),
    });
    const text = await res.text();
    console.log("OCR Extracted Text:", text);
  } catch (e) {
    console.error("OCR Test failed:", e);
  }

  console.log("\n--- TESTING IMAGE ANALYSIS ---");
  try {
    const res = await fetch(`${BASE_URL}/api/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: TEST_IMAGE_CAR }),
    });
    const data = await res.json();
    console.log("Analysis Result:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Analysis Test failed:", e);
  }
}

runTests().then(() => process.exit(0));
