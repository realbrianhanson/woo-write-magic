-- Restrict the SECURITY DEFINER helper function so it is not callable by API roles.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;