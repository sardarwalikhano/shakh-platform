-- M03: allow authenticated customers to submit their own merchant applications.
-- Row-level security remains enabled. The existing INSERT policy requires:
-- applicant_id = auth.uid(), status = 'submitted', and review/store fields to be NULL.
GRANT INSERT ON TABLE public.merchant_applications TO authenticated;
