begin;

alter table if exists public.trainer_applications
  add column if not exists interview_time text;

update public.trainer_applications
set interview_time = coalesce(nullif(interview_time, ''), 'Не назначено')
where interview_time is null or interview_time = '';

alter table public.trainer_applications
  alter column interview_time set default 'Не назначено';

alter table public.trainer_applications
  alter column interview_time set not null;

commit;
