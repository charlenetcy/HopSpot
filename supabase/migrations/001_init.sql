create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key,
  username text unique not null,
  display_name text not null default '',
  bio text default '',
  avatar_url text default '',
  is_kol boolean default false,
  created_at timestamptz default now()
);

create table if not exists itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null default 'My Itinerary',
  description text default '',
  cover_emoji text default '🗺️',
  is_public boolean default false,
  area_label text default '',
  transport_mode text default 'walking',
  grab_session_id text default '',
  total_duration_secs int default 0,
  total_distance_meters int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references itineraries(id) on delete cascade,
  position int not null,
  place_name text not null,
  formatted_address text default '',
  lat double precision not null,
  lng double precision not null,
  poi_id text default '',
  business_type text default '',
  emoji_tag text default '📍',
  notes text default '',
  arrive_by_time text default '',
  estimated_stay_mins int default 60,
  leg_duration_secs int default 0,
  leg_distance_meters int default 0,
  created_at timestamptz default now()
);

create table if not exists wishlist_spots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  place_name text not null,
  formatted_address text default '',
  lat double precision not null,
  lng double precision not null,
  poi_id text default '',
  business_type text default '',
  emoji_tag text default '📍',
  notes text default '',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table itineraries enable row level security;
alter table itinerary_stops enable row level security;
alter table wishlist_spots enable row level security;

create policy "Public profiles are viewable by everyone"
on profiles for select using (true);

create policy "Users can update own profile"
on profiles for update using (auth.uid() = id);

create policy "Public itineraries viewable by all"
on itineraries for select using (is_public = true or auth.uid() = user_id);

create policy "Users manage own itineraries"
on itineraries for all using (auth.uid() = user_id);

create policy "Stops visible with itinerary"
on itinerary_stops for select using (
  exists (
    select 1 from itineraries
    where itineraries.id = itinerary_stops.itinerary_id
      and (itineraries.is_public = true or itineraries.user_id = auth.uid())
  )
);

create policy "Users manage own stops"
on itinerary_stops for all using (
  exists (
    select 1 from itineraries
    where itineraries.id = itinerary_stops.itinerary_id
      and itineraries.user_id = auth.uid()
  )
);

create policy "Users manage own wishlist"
on wishlist_spots for all using (auth.uid() = user_id);
