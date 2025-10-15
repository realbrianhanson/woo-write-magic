// Deno edge function for email generation

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log("Received prompt, length:", prompt?.length);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Calling AI gateway...");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000); // 55s timeout

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5",
          messages: [
            {
              role: "system",
              content:
                "You are an expert direct response copywriter. Always return valid JSON only, no markdown formatting.",
            },
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    console.log("AI gateway response received, status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data).substring(0, 200));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid AI response structure");
    }
    
    let generatedText = data.choices[0].message.content;

    // Strip markdown code fences if present
    generatedText = generatedText.trim();
    if (generatedText.startsWith("```json")) {
      generatedText = generatedText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (generatedText.startsWith("```")) {
      generatedText = generatedText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-email function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
