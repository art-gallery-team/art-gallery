-- 1. Artworks table (lots)
create table public.lots (
  id uuid default gen_random_uuid () primary key,
  title text not null,
  author text not null,
  style text not null,
  year integer not null,
  description text not null,
  image_url text not null,
  start_price numeric not null check (start_price > 0),
  current_price numeric not null check (current_price > 0),
  min_step numeric not null default 100 check (min_step > 0),
  status text not null default 'active' check (status in ('active', 'sold')),
  highest_bidder_id uuid references auth.users (id) on delete set null,
  created_at timestamptz default now() not null
);

-- 2. Bids table (bids)
create table public.bids (
  id uuid default gen_random_uuid () primary key,
  lot_id uuid references public.lots (id) on delete cascade not null,
  user_id uuid references auth.users (id) on delete cascade not null,
  amount numeric not null check (amount > 0),
  created_at timestamptz default now() not null
);

-- 3. Favorites table (favorites)
create table public.favorites (
  id uuid default gen_random_uuid () primary key,
  user_id uuid references auth.users (id) on delete cascade not null,
  lot_id uuid references public.lots (id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (user_id, lot_id)
);

-- 4. Purchases table (purchases)
create table public.purchases (
  id uuid default gen_random_uuid () primary key,
  user_id uuid references auth.users (id) on delete cascade not null,
  lot_id uuid references public.lots (id) on delete cascade not null,
  final_price numeric not null check (final_price >= 0),
  promo_used text,
  purchased_at timestamptz default now() not null,
  unique (lot_id)
);

-- Enable Row Level Security (RLS)
alter table public.lots enable row level security;

alter table public.bids enable row level security;

alter table public.favorites enable row level security;

alter table public.purchases enable row level security;

-- RLS Policies
create policy "Lots are viewable by everyone" on public.lots for
select
  using (true);

create policy "Authenticated users can update active lots" on public.lots
for update
  using (auth.role () = 'authenticated');

create policy "Bids are viewable by everyone" on public.bids for
select
  using (true);

create policy "Users can insert their own bids" on public.bids for insert
with
  check (auth.uid () = user_id);

create policy "Users can view own favorites" on public.favorites for
select
  using (auth.uid () = user_id);

create policy "Users can insert own favorites" on public.favorites for insert
with
  check (auth.uid () = user_id);

create policy "Users can delete own favorites" on public.favorites for delete using (auth.uid () = user_id);

create policy "Users can view own purchases" on public.purchases for
select
  using (auth.uid () = user_id);

create policy "Users can insert own purchases" on public.purchases for insert
with
  check (auth.uid () = user_id);

-- Grant permissions and reload API schema cache
grant usage on schema public to anon,
authenticated;

grant
select
  on table public.lots,
  public.bids to anon,
  authenticated;

grant all on table public.lots,
public.bids,
public.favorites,
public.purchases to authenticated;

-- Seed initial artworks
insert into
  public.lots (
    title,
    author,
    style,
    year,
    description,
    image_url,
    start_price,
    current_price,
    min_step,
    status
  )
values
  (
    'The Persistence of Memory',
    'Salvador Dalí',
    'Surrealism',
    1931,
    'An iconic surrealist masterpiece featuring soft melting pocket watches set against a Catalonian landscape.',
    'https://unsplash.com',
    5000,
    5400,
    200,
    'active'
  ),
  (
    'Composition VIII',
    'Wassily Kandinsky',
    'Abstract Art',
    1923,
    'A geometric abstraction built on the dynamic interplay of circles, triangles, and sharp lines.',
    'https://unsplash.com',
    3200,
    3500,
    150,
    'active'
  ),
  (
    'Nighthawks',
    'Edward Hopper',
    'Realism',
    1942,
    'An atmospheric scene of a late-night downtown diner capturing the quiet stillness and solitude of the big city.',
    'https://unsplash.com',
    4100,
    4100,
    200,
    'active'
  ),
  (
    'Composition with Red, Blue and Yellow',
    'Piet Mondrian',
    'Neoplasticism',
    1930,
    'A strict harmony of primary colors and a black grid arranged on a white canvas.',
    'https://unsplash.com',
    2800,
    3100,
    100,
    'active'
  ),
  (
    'The Scream at Sunset',
    'Edvard Munch',
    'Expressionism',
    1893,
    'An emotional expressionist composition with a swirling orange-and-red sky.',
    'https://unsplash.com',
    6000,
    6500,
    250,
    'active'
  ),
  (
    'Water Lilies',
    'Claude Monet',
    'Impressionism',
    1916,
    'A luminous interplay of light and reflections across the surface of the pond in the Giverny garden.',
    'https://unsplash.com',
    4500,
    4900,
    200,
    'sold'
  ),
  (
    'Black Suprematic Square',
    'Kazimir Malevich',
    'Suprematism',
    1915,
    'A manifesto of non-objective art and the starting point of a new visual language in the 20th century.',
    'https://unsplash.com',
    7000,
    7000,
    300,
    'active'
  ),
  (
    'Campbell''s Soup Cans',
    'Andy Warhol',
    'Pop Art',
    1962,
    'An icon of pop art that blurs the boundary between mass culture and fine art.',
    'https://unsplash.com',
    2500,
    2900,
    100,
    'active'
  );

