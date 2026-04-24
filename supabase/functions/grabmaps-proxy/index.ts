import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GRABMAPS_BASE = "https://maps.grab.com";
const API_KEY = Deno.env.get("GRABMAPS_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders(),
    });
  }

  if (!API_KEY) {
    return json(
      { error: "Missing GRABMAPS_API_KEY secret" },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const grabPath = url.searchParams.get("path");
  const query = url.searchParams.get("query") || "";

  if (!grabPath) {
    return json({ error: "Missing path query parameter" }, { status: 400 });
  }

  const response = await fetch(`${GRABMAPS_BASE}${grabPath}?${query}`, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: req.method === "GET" ? undefined : await req.text(),
  });

  const contentType = response.headers.get("content-type") || "application/json";
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      ...corsHeaders(),
      "Content-Type": contentType,
    },
  });
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}
