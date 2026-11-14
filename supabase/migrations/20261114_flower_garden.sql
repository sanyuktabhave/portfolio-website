-- Public doodles only. Visitors can read, but may publish solely through a validated RPC.
create table if not exists public.garden_flowers (
  id uuid primary key default gen_random_uuid(),
  drawing jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.garden_flowers enable row level security;
revoke all on public.garden_flowers from anon, authenticated;
grant select on public.garden_flowers to anon, authenticated;
create policy "Visitors can view flowers" on public.garden_flowers for select to anon, authenticated using (true);

create or replace function public.valid_garden_drawing(d jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare stroke jsonb; point jsonb; total integer := 0;
begin
  if jsonb_typeof(d) is distinct from 'array' or jsonb_array_length(d) < 1 or jsonb_array_length(d) > 24 or octet_length(d::text) > 32000 then return false; end if;
  for stroke in select value from jsonb_array_elements(d) loop
    if jsonb_typeof(stroke) is distinct from 'object' or coalesce(stroke->>'color','') not in ('#52233b','#db8dac','#e1ac4b','#7b99c3','#76946b') or not stroke ? 'color' then return false; end if;
    if jsonb_typeof(stroke->'points') is distinct from 'array' or jsonb_array_length(stroke->'points') < 1 or jsonb_array_length(stroke->'points') > 256 then return false; end if;
    total := total + jsonb_array_length(stroke->'points');
    for point in select value from jsonb_array_elements(stroke->'points') loop
      if jsonb_typeof(point) <> 'array' or jsonb_array_length(point) <> 2 then return false; end if;
      if jsonb_typeof(point->0) <> 'number' or jsonb_typeof(point->1) <> 'number' then return false; end if;
      if (point->>0)::numeric < 0 or (point->>0)::numeric > 320 or (point->>1)::numeric < 0 or (point->>1)::numeric > 220 then return false; end if;
    end loop;
  end loop;
  return total <= 1600;
exception when others then return false;
end;
$$;

create or replace function public.plant_garden_flower(drawing jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare flower_id uuid;
begin
  if not public.valid_garden_drawing(drawing) then raise exception 'Please draw a small flower using the available colours.'; end if;
  perform pg_advisory_xact_lock(20261114);
  if (select count(*) from public.garden_flowers where created_at > now() - interval '1 minute') >= 20 then raise exception 'The garden is busy. Please try again in a minute.'; end if;
  if (select count(*) from public.garden_flowers) >= 3000 then raise exception 'The garden is full for now. Thank you for stopping by.'; end if;
  insert into public.garden_flowers (drawing) values (drawing) returning id into flower_id;
  return flower_id;
end;
$$;
revoke all on function public.plant_garden_flower(jsonb) from public;
grant execute on function public.plant_garden_flower(jsonb) to anon, authenticated;
