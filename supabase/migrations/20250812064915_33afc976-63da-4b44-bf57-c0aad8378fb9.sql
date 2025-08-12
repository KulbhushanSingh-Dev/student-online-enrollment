-- Security hardening migration
-- 1) Drop permissive INSERT policy on audits (only triggers with table owner privileges should insert)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'enrollment_application_audits'
      AND policyname = 'Allow inserts via triggers'
  ) THEN
    DROP POLICY "Allow inserts via triggers" ON public.enrollment_application_audits;
  END IF;
END$$;

-- 2) Deduplicate triggers on enrollment_applications - keep standardized names
-- Drop older/duplicate triggers if present
DROP TRIGGER IF EXISTS enrollment_applications_before_write ON public.enrollment_applications;
DROP TRIGGER IF EXISTS update_enrollment_applications_updated_at ON public.enrollment_applications;
DROP TRIGGER IF EXISTS enrollment_applications_audit ON public.enrollment_applications;

-- Ensure our standardized triggers exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'before_write_enrollment_applications'
  ) THEN
    CREATE TRIGGER before_write_enrollment_applications
    BEFORE INSERT OR UPDATE ON public.enrollment_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.enrollment_applications_before_write();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_enrollment_applications_updated_at'
  ) THEN
    CREATE TRIGGER set_enrollment_applications_updated_at
    BEFORE UPDATE ON public.enrollment_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'audit_enrollment_application_changes'
  ) THEN
    CREATE TRIGGER audit_enrollment_application_changes
    AFTER INSERT OR UPDATE ON public.enrollment_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.log_enrollment_application_audit();
  END IF;
END$$;