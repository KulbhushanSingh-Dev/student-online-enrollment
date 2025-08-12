-- 1) Roles & RBAC setup
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- Policies for user_roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Admins can manage roles'
  ) THEN
    CREATE POLICY "Admins can manage roles"
    ON public.user_roles
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 2) Tighten RLS for enrollment_applications updates and add admin access
DROP POLICY IF EXISTS "Users can update their own applications" ON public.enrollment_applications;

-- User updates restricted to pending only
CREATE POLICY "Users can update their pending apps"
ON public.enrollment_applications
FOR UPDATE TO authenticated
USING (
  auth.uid() = user_id AND application_status = 'pending'
)
WITH CHECK (
  auth.uid() = user_id AND application_status = 'pending'
);

-- Admins can select and update all applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'enrollment_applications' AND policyname = 'Admins can select applications'
  ) THEN
    CREATE POLICY "Admins can select applications"
    ON public.enrollment_applications
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'enrollment_applications' AND policyname = 'Admins can update applications'
  ) THEN
    CREATE POLICY "Admins can update applications"
    ON public.enrollment_applications
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (true);
  END IF;
END $$;

-- 3) BEFORE write trigger to set user_id, compute consent requirement, and enforce consent
CREATE OR REPLACE FUNCTION public.enrollment_applications_before_write()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  is_minor boolean;
BEGIN
  -- Set user_id on insert if missing
  IF TG_OP = 'INSERT' THEN
    IF NEW.user_id IS NULL THEN
      NEW.user_id = auth.uid();
    END IF;
  END IF;

  -- Prevent non-admins from changing user_id
  IF TG_OP = 'UPDATE' THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id AND NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'user_id is immutable for non-admins';
    END IF;
  END IF;

  -- Compute parental consent requirement (under 18)
  is_minor := NEW.student_date_of_birth > (current_date - interval '18 years');
  NEW.parental_consent_required := COALESCE(is_minor, false);

  -- Enforce consent if required
  IF NEW.parental_consent_required AND COALESCE(NEW.parental_consent_given, false) = false THEN
    RAISE EXCEPTION 'Parental consent is required for applicants under 18.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enrollment_applications_before_write ON public.enrollment_applications;
CREATE TRIGGER enrollment_applications_before_write
BEFORE INSERT OR UPDATE ON public.enrollment_applications
FOR EACH ROW EXECUTE FUNCTION public.enrollment_applications_before_write();

-- 4) Ensure updated_at auto-updates on changes
DROP TRIGGER IF EXISTS set_enrollment_applications_updated_at ON public.enrollment_applications;
CREATE TRIGGER set_enrollment_applications_updated_at
BEFORE UPDATE ON public.enrollment_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Audit trail for sensitive changes
CREATE TABLE IF NOT EXISTS public.enrollment_application_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.enrollment_applications(id) ON DELETE CASCADE,
  actor_user_id uuid,
  action text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  old_row jsonb,
  new_row jsonb
);

ALTER TABLE public.enrollment_application_audits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.log_enrollment_application_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.enrollment_application_audits (
    application_id,
    actor_user_id,
    action,
    old_row,
    new_row
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    TG_OP::text,
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enrollment_applications_audit ON public.enrollment_applications;
CREATE TRIGGER enrollment_applications_audit
AFTER INSERT OR UPDATE ON public.enrollment_applications
FOR EACH ROW EXECUTE FUNCTION public.log_enrollment_application_audit();

-- Only admins can view the audits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'enrollment_application_audits' AND policyname = 'Admins can read audits'
  ) THEN
    CREATE POLICY "Admins can read audits"
    ON public.enrollment_application_audits
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(),'admin'));
  END IF;
END $$;