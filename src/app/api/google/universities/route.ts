import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const country = url.searchParams.get("country") || "";
  const city = url.searchParams.get("city") || "";

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 400 });
  }

  const query = `universities in ${city} ${country}`;
  const endpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Google" }, { status: 502 });
    }
    const data = await res.json();
    const items = (data.results || []).map((r: any) => ({
      id: r.place_id,
      name: r.name,
      address: r.formatted_address,
      // try to extract city from formatted address
      city: (r.formatted_address || "").split(",").slice(-3).join(", ")
    }));
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: "Exception calling Google" }, { status: 500 });
  }
}
