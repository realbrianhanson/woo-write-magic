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
    
    if (!prompt) {
      console.error("No prompt provided");
      return new Response(
        JSON.stringify({ error: "No prompt provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured - ANTHROPIC_API_KEY missing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Calling Anthropic API...");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 3 minute timeout

    const requestBody = {
      model: "claude-sonnet-4-5",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `You are an expert direct response copywriter. Always return valid JSON only, no markdown formatting.\n\n${prompt}`,
        },
      ],
    };
    
    console.log("Request body:", JSON.stringify(requestBody).substring(0, 300));
    
    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);
    
    console.log("Anthropic API response status:", response.status);
    console.log("Anthropic API response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error (claude-sonnet-4-5):", response.status, errorText);

      // Fallback to haiku on server errors
      const retriable = [500, 502, 503, 504, 529].includes(response.status);
      if (retriable) {
        try {
          console.log("Retrying with claude-3-5-haiku...");
          const fallbackBody = { ...requestBody, model: "claude-3-5-haiku-20241022" };
          const fallbackResp = await fetch(
            "https://api.anthropic.com/v1/messages",
            {
              method: "POST",
              headers: {
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(fallbackBody),
              signal: controller.signal,
            }
          );
          console.log("Fallback response status:", fallbackResp.status);
          if (fallbackResp.ok) {
            const data = await fallbackResp.json();
            console.log("Fallback model succeeded");
            if (!data.content || !data.content[0] || !data.content[0].text) {
              console.error("Invalid fallback response structure:", data);
              return new Response(JSON.stringify({ error: "Invalid AI response structure (fallback)" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
            }
            let generatedText = data.content[0].text.trim();
            if (generatedText.startsWith("```json")) generatedText = generatedText.replace(/^```json\n/, "").replace(/\n```$/, "");
            else if (generatedText.startsWith("```")) generatedText = generatedText.replace(/^```\n/, "").replace(/\n```$/, "");
            return new Response(JSON.stringify({ generatedText }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          } else {
            const fbText = await fallbackResp.text();
            console.error("Fallback model failed:", fallbackResp.status, fbText);
          }
        } catch (fbErr) {
          console.error("Fallback call error:", fbErr);
        }
      }

      return new Response(
        JSON.stringify({ 
          error: `Anthropic API error: ${response.status}`,
          details: errorText
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Anthropic API response received, status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data).substring(0, 200));
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid AI response structure");
    }
    
    let generatedText = data.content[0].text;

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
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      error: JSON.stringify(error, null, 2)
    });
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: error instanceof Error ? error.stack : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
