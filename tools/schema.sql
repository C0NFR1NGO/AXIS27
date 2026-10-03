-- ============================================================
-- AXIS'27 — User Auth + Registration Schema
-- Run this in your Supabase SQL Editor after creating the project.
-- ============================================================

-- 1. Profiles table
create table if not exists profiles (
  id         uuid primary key references auth.users on delete cascade,
  axis_id    text unique,
  full_name  text not null default '',
  email      text not null default '',
  phone      text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);


-- 2. AXIS ID counter (single row)
create table if not exists id_counter (
  id            int primary key default 1,
  current_value int not null default 0,
  constraint id_counter_single_row check (id = 1)
);

insert into id_counter (id, current_value) values (1, 0)
  on conflict (id) do nothing;

alter table id_counter enable row level security;

create policy "Anyone can read counter"
  on id_counter for select
  using (true);

-- No insert/update/delete policy — only claim_axis_id() (security definer) can write


-- 3. claim_axis_id() — atomic sequential ID generator
-- Format: AXIS27-0000 through AXIS27-9999, then A001-A9999, B001-B9999, etc.
create or replace function claim_axis_id()
returns text
language plpgsql
security definer
as $$
declare
  v_next int;
  v_seq  text;
  v_num  int;
  v_char text;
begin
  -- Atomically increment and get the new value
  update id_counter set current_value = current_value + 1 where id = 1
    returning current_value into v_next;

  if v_next <= 9999 then
    -- Numeric phase: 0000-9999
    v_seq := 'AXIS27-' || lpad(v_next::text, 4, '0');
  else
    -- Letter phase: A001, A002, ..., A9999, B001, ...
    -- Subtract the 10000 numeric slots, then compute letter + number
    v_num := v_next - 10000;

    -- Each letter covers 9999 slots (A001-A9999, B001-B9999, etc.)
    -- But we're using A001 as the first after 9999 (no A000)
    -- So: index 0 -> A001, index 9998 -> A9999, index 9999 -> B001, etc.
    -- Actually let's make it 10000 per letter for clean math:
    -- A0001-A9999 = 9999 slots, then B0001-B9999...
    -- Simpler: each letter covers 9999 numbers (1-9999)
    -- v_num is 0-indexed after subtracting 10000
    -- But user wants A001, not A000, so we use 1-indexed within each letter block

    -- Each letter block has 9999 values (001-9999)
    v_char := chr(65 + (v_num / 9999));  -- A=65, B=66, etc.
    v_num  := (v_num % 9999) + 1;        -- 1-9999 within the block
    v_seq  := 'AXIS27-' || v_char || lpad(v_num::text, 4, '0');
  end if;

  return v_seq;
end;
$$;


-- 4. Event registrations
create table if not exists event_registrations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  event_name   text not null,
  category     text not null default '',
  status       text not null default 'registered'
                 check (status in ('registered', 'waitlisted', 'cancelled')),
  registered_at timestamptz not null default now()
);

alter table event_registrations enable row level security;

create policy "Users can read own event registrations"
  on event_registrations for select
  using (auth.uid() = user_id);

create policy "Users can insert own event registrations"
  on event_registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own event registrations"
  on event_registrations for update
  using (auth.uid() = user_id);

create policy "Users can delete own event registrations"
  on event_registrations for delete
  using (auth.uid() = user_id);


-- 5. Workshop registrations
create table if not exists workshop_registrations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  workshop_name text not null,
  status       text not null default 'registered'
                 check (status in ('registered', 'waitlisted', 'cancelled')),
  registered_at timestamptz not null default now()
);

alter table workshop_registrations enable row level security;

create policy "Users can read own workshop registrations"
  on workshop_registrations for select
  using (auth.uid() = user_id);

create policy "Users can insert own workshop registrations"
  on workshop_registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workshop registrations"
  on workshop_registrations for update
  using (auth.uid() = user_id);

create policy "Users can delete own workshop registrations"
  on workshop_registrations for delete
  using (auth.uid() = user_id);


-- 6. Accommodation bookings
create table if not exists accommodation_bookings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  status     text not null default 'pending'
               check (status in ('pending', 'confirmed', 'cancelled')),
  check_in   date,
  check_out  date,
  booked_at  timestamptz not null default now()
);

alter table accommodation_bookings enable row level security;

create policy "Users can read own accommodation bookings"
  on accommodation_bookings for select
  using (auth.uid() = user_id);

create policy "Users can insert own accommodation bookings"
  on accommodation_bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own accommodation bookings"
  on accommodation_bookings for update
  using (auth.uid() = user_id);

create policy "Users can delete own accommodation bookings"
  on accommodation_bookings for delete
  using (auth.uid() = user_id);


-- 7. Pro-show registrations
create table if not exists proshow_registrations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  show_name     text not null,
  status        text not null default 'registered'
                  check (status in ('registered', 'cancelled')),
  registered_at timestamptz not null default now()
);

alter table proshow_registrations enable row level security;

create policy "Users can read own proshow registrations"
  on proshow_registrations for select
  using (auth.uid() = user_id);

create policy "Users can insert own proshow registrations"
  on proshow_registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own proshow registrations"
  on proshow_registrations for update
  using (auth.uid() = user_id);

create policy "Users can delete own proshow registrations"
  on proshow_registrations for delete
  using (auth.uid() = user_id);


-- 8. Indexes
create index if not exists idx_profiles_axis_id on profiles(axis_id);
create index if not exists idx_event_reg_user on event_registrations(user_id);
create index if not exists idx_workshop_reg_user on workshop_registrations(user_id);
create index if not exists idx_accommodation_user on accommodation_bookings(user_id);
create index if not exists idx_proshow_reg_user on proshow_registrations(user_id);
