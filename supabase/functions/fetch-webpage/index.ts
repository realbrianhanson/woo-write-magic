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

    // Detect if this is an Amazon reviews page
    const isAmazon = url.includes('amazon.com') || url.includes('amazon.');
    
    // For Amazon, we want ALL content including reviews, not just main content
    const scrapeConfig = isAmazon ? {
      url: url,
      formats: ['markdown'],
      onlyMainContent: false,  // Get everything to capture reviews
      excludeTags: ['script', 'style', 'iframe'],  // Only exclude non-content
      waitFor: 3000  // Give more time for Amazon to load
    } : {
      url: url,
      formats: ['markdown'],
      onlyMainContent: true,
      excludeTags: ['nav', 'header', 'footer', 'aside', 'script', 'style', 'iframe'],
      waitFor: 1000
    };

    // Call Firecrawl API
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scrapeConfig)
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
    
    // For Amazon pages, extract ONLY reviews section
    if (isAmazon && content) {
      console.log('Processing Amazon page - extracting reviews only');
      
      // Look for review patterns in the content
      const reviewPatterns = [
        /##?\s*Customer [Rr]eviews?[\s\S]*$/,  // "Customer Reviews" heading and everything after
        /##?\s*Reviews?[\s\S]*$/,              // "Reviews" heading and everything after
        /##?\s*Top [Rr]eviews?[\s\S]*$/,       // "Top reviews" and everything after
        /\d+\.\d+\s*out of 5[\s\S]*$/,         // Rating line and everything after
      ];
      
      let reviewContent = '';
      for (const pattern of reviewPatterns) {
        const match = content.match(pattern);
        if (match) {
          reviewContent = match[0];
          break;
        }
      }
      
      if (reviewContent) {
        content = reviewContent;
        console.log('Found review section, length:', content.length);
      } else {
        console.log('No review section found with patterns, returning full content');
      }
    }
    
    // Clean up the content - remove junk
    content = content
      // Remove image markdown: ![alt](url) and [![](url)](url)
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Remove standalone link markdown, keep just the text: [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove "Amazon Customer" labels
      .replace(/Amazon Customer\s*/gi, '')
      // Remove "Customer reviews" header section
      .replace(/Customer [Rr]eviews\s*/gi, '')
      // Remove star ratings (4.5 out of 5 stars, etc.)
      .replace(/_?\d+\.?\d*\s*out of\s*\d+\s*stars?_?/gi, '')
      .replace(/\d+\.?\d*\s*out of\s*\d+/gi, '')
      // Remove image review labels
      .replace(/Images in this review\s*/gi, '')
      .replace(/Reviews with images\s*/gi, '')
      .replace(/See all photos\s*/gi, '')
      .replace(/All photos\s*/gi, '')
      // Remove pagination
      .replace(/_?Previous page_?\s*/gi, '')
      .replace(/_?Next page_?\s*/gi, '')
      // Remove numbered lists (standalone numbers 1. 2. 3. etc.)
      .replace(/^\d+\.\s*$/gm, '')
      // Remove global ratings count
      .replace(/\d+[,\d]*\s*global ratings?/gi, '')
      // Remove Amazon explanation text
      .replace(/Customer Reviews,.*?work on Amazon/gis, '')
      .replace(/Learn more how customers reviews work on Amazon/gi, '')
      // Remove "Review this product" section
      .replace(/Review this product\s*/gi, '')
      .replace(/Share your thoughts with other customers\s*/gi, '')
      .replace(/Write a customer review\s*/gi, '')
      // Remove Amazon rating breakdowns (5 star4 star3 star... lines)
      .replace(/[-•]\s*\d+\s*star\d+\s*star\d+\s*star\d+\s*star\d+\s*star.*/gi, '')
      // Remove percentage lines (65%27%7%1%0%...)
      .replace(/\d+%\d+%\d+%\d+%\d+%.*/g, '')
      // Remove "How customer reviews and ratings work"
      .replace(/How customer reviews and ratings work/gi, '')
      // Remove "Select to learn more" sections
      .replace(/Select to learn more[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, '')
      // Remove customer mention statistics (e.g., "84 customers mention...")
      .replace(/\d+\s+customers?\s+mention\s+"[^"]+"\d+\s+positive\d+\s+negative/gi, '')
      // Remove markdown horizontal rules (*** or * * *)
      .replace(/^\s*\*\s*\*\s*\*\s*$/gm, '')
      .replace(/^[-*_]{3,}\s*$/gm, '')
      // Remove markdown heading markers (### ## #)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove backslash line breaks
      .replace(/\\\\/g, '')
      // Remove multiple blank lines
      .replace(/\n{3,}/g, '\n\n')
      // Remove common navigation patterns
      .replace(/\[Skip to content\]/gi, '')
      .replace(/\[(Home|About|Contact|Menu|Navigation|Login|Sign Up|Register)\]/gi, '')
      // Trim whitespace
      .trim();
    
    // Limit to reasonable length (20000 characters for reviews)
    if (content.length > 20000) {
      content = content.substring(0, 20000) + '...';
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