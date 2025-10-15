-- Add new fields to campaigns table for better copy generation
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS voice_tone TEXT,
ADD COLUMN IF NOT EXISTS voice_examples TEXT[],
ADD COLUMN IF NOT EXISTS specific_objections TEXT[],
ADD COLUMN IF NOT EXISTS differentiation JSONB DEFAULT '{"unfair_advantage": "", "vs_competitors": "", "category_position": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS transformation_timeline JSONB DEFAULT '{"time_to_first_results": "", "specific_metrics": "", "progression": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS funnel_context JSONB DEFAULT '{"traffic_temperature": "warm", "funnel_stage": "consideration", "sequence_position_context": ""}'::jsonb;

-- Add new fields to emails table for variants and critique
ALTER TABLE emails
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS critique JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS subject_line_variants JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS testing_recommendations JSONB DEFAULT '[]'::jsonb;