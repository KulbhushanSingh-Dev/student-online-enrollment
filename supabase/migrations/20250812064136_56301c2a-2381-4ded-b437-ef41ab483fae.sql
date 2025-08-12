-- 1) Ensure RLS is enabled on audits (safe if already enabled)
ALTER TABLE public.enrollment_application_audits ENABLE ROW LEVEL SECURITY;

-- 2) Allow authenticated inserts into audit table (so SECURITY DEFINER trigger can write)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'enrollment_application_audits'
      AND policyname = 'Allow inserts via triggers'
  ) THEN
    CREATE POLICY "Allow inserts via triggers"
    ON public.enrollment_application_audits
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;
END$$;

-- 3) Attach BEFORE trigger to enforce server-side rules (parental consent, user_id set, immutable user_id for non-admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'before_write_enrollment_applications'
  ) THEN
    CREATE TRIGGER before_write_enrollment_applications
    BEFORE INSERT OR UPDATE ON public.enrollment_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.enrollment_applications_before_write();
  END IF;
END$$;

-- 4) Attach UPDATED_AT trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_enrollment_applications_updated_at'
  ) THEN
    CREATE TRIGGER set_enrollment_applications_updated_at
    BEFORE UPDATE ON public.enrollment_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- 5) Attach AUDIT trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'audit_enrollment_application_changes'
  ) THEN
    CREATE TRIGGER audit_enrollment_application_changes
    AFTER INSERT OR UPDATE ON public.enrollment_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.log_enrollment_application_audit();
  END IF;
END$$;

-- 6) Make user_id NOT NULL now that server-side population is enforced
--    (verified there are no NULLs; will fail if any exist)
ALTER TABLE public.enrollment_applications
  ALTER COLUMN user_id SET NOT NULL;