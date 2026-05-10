-- Verify atomic save RPC exists (run after applying 20260510_save_simulation_run_atomic.sql).
select proname, pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and proname = 'save_simulation_run_atomic';
