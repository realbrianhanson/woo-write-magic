import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping webpage with Firecrawl:', url);

    // Call Firecrawl API directly with content filtering
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
        onlyMainContent: true,
        excludeTags: ['nav', 'header', 'footer', 'aside', 'script', 'style', 'iframe'],
        waitFor: 1000
      })
    });

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      console.error('Firecrawl API error:', firecrawlResponse.status, errorText);
      throw new Error(`Firecrawl API error: ${firecrawlResponse.status}`);
    }

    const scrapeResult = await firecrawlResponse.json();

    if (!scrapeResult.success) {
      throw new Error('Failed to scrape webpage with Firecrawl');
    }

    // Extract markdown content only (cleaner for copywriting)
    let content = scrapeResult.data?.markdown || '';
    
    // Limit to reasonable length (first 10000 characters for better quality)
    if (content.length > 10000) {
      content = content.substring(0, 10000) + '...';
    }

    console.log('Successfully scraped webpage with Firecrawl');

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: content,
        url: url,
        metadata: {
          title: scrapeResult.data?.metadata?.title,
          description: scrapeResult.data?.metadata?.description,
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error scraping webpage:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to scrape webpage',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});