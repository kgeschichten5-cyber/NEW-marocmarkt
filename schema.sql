create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  address text not null default '',
  phone text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists address text not null default '';
alter table public.profiles add column if not exists phone text not null default '';

create or replace view public.public_profiles
with (security_barrier = true)
as
select id, display_name
from public.profiles;

grant select on public.public_profiles to anon, authenticated;
revoke insert, update, delete on public.public_profiles from anon, authenticated;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  seller_name text not null,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 20 and 5000),
  price numeric(12, 2) not null check (price > 0),
  city text not null,
  category text not null check (category in (
    'Autos', 'Immobilien', 'Elektronik', 'Möbel', 'Mode', 'Jobs',
    'Freizeit', 'Haustiere', 'Haus & Garten'
  )),
  image_paths text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'paused', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_active_created_idx
  on public.listings (created_at desc) where status = 'active';
create index if not exists listings_seller_idx on public.listings (seller_id);
create index if not exists listings_category_city_idx on public.listings (category, city);

create or replace function public.touch_listing_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_listing_updated on public.listings;
create trigger on_listing_updated
  before update on public.listings
  for each row execute procedure public.touch_listing_updated_at();

create table if not exists public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete set null,
  reported_user_id uuid references public.profiles (id) on delete set null,
  reason text not null,
  description text not null check (char_length(description) between 10 and 3000),
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists reports_status_created_idx on public.reports (status, created_at desc);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  constraint conversations_distinct_participants check (buyer_id <> seller_id),
  constraint conversations_one_buyer_per_listing unique (listing_id, buyer_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);

create or replace function public.touch_conversation_after_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_message_created on public.messages;
create trigger on_message_created
  after insert on public.messages
  for each row execute procedure public.touch_conversation_after_message();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_admin
  );
$$;

create or replace function public.can_publish_listing()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users as auth_user
    where auth_user.id = (select auth.uid())
      and auth_user.email_confirmed_at is not null
      and exists (
        select 1
        from public.profiles
        where id = auth_user.id
          and length(trim(address)) > 0
      )
  );
$$;

revoke all on function public.can_publish_listing() from public;
grant execute on function public.can_publish_listing() to authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, address, phone)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'address'), ''), ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'phone'), ''), '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Profiles are visible to signed-in users" on public.profiles;
drop policy if exists "Users can view public profile names" on public.profiles;
create policy "Users can view public profile names"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke update on public.profiles from authenticated;
grant update (display_name, address) on public.profiles to authenticated;

drop policy if exists "Active listings are public" on public.listings;
create policy "Active listings are public"
  on public.listings for select to anon, authenticated
  using (status = 'active' or seller_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Signed-in users can create listings" on public.listings;
create policy "Signed-in users can create listings"
  on public.listings for insert to authenticated
  with check (
    seller_id = (select auth.uid())
    and status = 'active'
    and (select public.can_publish_listing())
  );

drop policy if exists "Owners can update their listings" on public.listings;
create policy "Owners can update their listings"
  on public.listings for update to authenticated
  using (seller_id = (select auth.uid()) or (select public.is_admin()))
  with check (
    (seller_id = (select auth.uid()) and (select public.can_publish_listing()))
    or (select public.is_admin())
  );

drop policy if exists "Owners can delete their listings" on public.listings;
create policy "Owners can delete their listings"
  on public.listings for delete to authenticated
  using (seller_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Users manage their own favorites" on public.favorites;
create policy "Users manage their own favorites"
  on public.favorites for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.listings l where l.id = listing_id and l.status = 'active')
  );

drop policy if exists "Users can submit reports" on public.reports;
create policy "Users can submit reports"
  on public.reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and (reported_user_id is null or reported_user_id <> (select auth.uid()))
    and status = 'open'
  );

drop policy if exists "Users can view their reports and admins can moderate" on public.reports;
create policy "Users can view their reports and admins can moderate"
  on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins can moderate reports" on public.reports;
create policy "Admins can moderate reports"
  on public.reports for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Participants can view conversations" on public.conversations;
create policy "Participants can view conversations"
  on public.conversations for select to authenticated
  using (
    buyer_id = (select auth.uid())
    or seller_id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists "Buyers can start conversations for active listings" on public.conversations;
create policy "Buyers can start conversations for active listings"
  on public.conversations for insert to authenticated
  with check (
    buyer_id = (select auth.uid())
    and buyer_id <> seller_id
    and exists (
      select 1 from public.listings l
      where l.id = listing_id and l.seller_id = seller_id and l.status = 'active'
    )
  );

drop policy if exists "Participants can view messages" on public.messages;
create policy "Participants can view messages"
  on public.messages for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and ((select auth.uid()) in (c.buyer_id, c.seller_id) or (select public.is_admin()))
    )
  );

drop policy if exists "Participants can send messages" on public.messages;
create policy "Participants can send messages"
  on public.messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.buyer_id, c.seller_id)
    )
  );

revoke update on public.messages from authenticated;
grant update (read_at) on public.messages to authenticated;

drop policy if exists "Recipients can mark incoming messages as read" on public.messages;
create policy "Recipients can mark incoming messages as read"
  on public.messages for update to authenticated
  using (
    sender_id <> (select auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.buyer_id, c.seller_id)
    )
  )
  with check (
    sender_id <> (select auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.buyer_id, c.seller_id)
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Listing images are publicly readable" on storage.objects;
create policy "Listing images are publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'listing-images');

drop policy if exists "Users upload images to their own folder" on storage.objects;
create policy "Users upload images to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users delete images from their own folder" on storage.objects;
create policy "Users delete images from their own folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_admin()))
  );

-- Privileged platform administration is separate from the legacy profile flag.
create table if not exists public.platform_admins (
  user_id uuid primary key references public.profiles (id),
  role text not null check (role in ('admin', 'super_admin')),
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.super_admin_setup (
  singleton boolean primary key default true check (singleton),
  token_hash text,
  expires_at timestamptz,
  consumed_at timestamptz
);

create table if not exists public.admin_action_log (
  id bigint generated always as identity primary key,
  admin_id uuid not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  reason text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists admin_action_log_created_idx
  on public.admin_action_log (created_at desc);

create table if not exists public.listing_archive (
  id bigint generated always as identity primary key,
  listing_id uuid not null references public.listings (id) on delete cascade,
  snapshot jsonb not null,
  deleted_by uuid not null,
  deletion_reason text not null,
  deleted_at timestamptz not null default now(),
  restored_at timestamptz
);
create index if not exists listing_archive_listing_idx
  on public.listing_archive (listing_id, deleted_at desc);

create table if not exists public.user_moderation (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null check (action in ('warning', 'suspend', 'ban')),
  reason text not null,
  expires_at timestamptz,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  lifted_at timestamptz,
  lifted_by uuid
);
create index if not exists user_moderation_user_idx
  on public.user_moderation (user_id, created_at desc);

create table if not exists public.moderation_appeals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id),
  moderation_id bigint references public.user_moderation (id) on delete cascade,
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'open' check (status in ('open', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check ((listing_id is null) <> (moderation_id is null))
);
create index if not exists moderation_appeals_status_created_idx
  on public.moderation_appeals (status, created_at desc);

create table if not exists public.user_notifications (
  id bigint generated always as identity primary key,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  notification_type text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists user_notifications_recipient_idx
  on public.user_notifications (recipient_id, created_at desc);

alter table public.platform_admins enable row level security;
alter table public.super_admin_setup enable row level security;
alter table public.admin_action_log enable row level security;
alter table public.listing_archive enable row level security;
alter table public.user_moderation enable row level security;
alter table public.moderation_appeals enable row level security;
alter table public.user_notifications enable row level security;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
    and exists (
      select 1 from public.platform_admins
      where user_id = (select auth.uid())
    );
$$;

create or replace function public.assert_platform_admin(required_role text default 'admin')
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_role text;
begin
  if coalesce((select auth.jwt() ->> 'aal'), '') <> 'aal2' then
    raise exception 'Administrator access requires verified multi-factor authentication';
  end if;
  select role into actor_role
  from public.platform_admins
  where user_id = (select auth.uid());
  if actor_role is null
    or (required_role = 'super_admin' and actor_role <> 'super_admin') then
    raise exception 'Insufficient administrator privileges';
  end if;
  return actor_role;
end;
$$;

create or replace function public.is_user_restricted()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_moderation
    where user_id = (select auth.uid())
      and action in ('suspend', 'ban')
      and lifted_at is null
      and (expires_at is null or expires_at > now())
  );
$$;

drop policy if exists "Active listings are public" on public.listings;
create policy "Active listings are public"
  on public.listings for select to anon, authenticated
  using (
    status = 'active'
    or seller_id = (select auth.uid())
    or (select public.is_platform_admin())
  );

drop policy if exists "Owners can update their listings" on public.listings;
create policy "Owners can update their listings"
  on public.listings for update to authenticated
  using (seller_id = (select auth.uid()) and status = 'active')
  with check (
    seller_id = (select auth.uid())
    and status = 'active'
    and (select public.can_publish_listing())
    and not (select public.is_user_restricted())
  );

drop policy if exists "Owners can delete their listings" on public.listings;
create policy "Owners can delete their listings"
  on public.listings for delete to authenticated
  using (
    seller_id = (select auth.uid())
    and status = 'active'
    and not (select public.is_user_restricted())
  );

drop policy if exists "Signed-in users can create listings" on public.listings;
create policy "Signed-in users can create listings"
  on public.listings for insert to authenticated
  with check (
    seller_id = (select auth.uid())
    and status = 'active'
    and (select public.can_publish_listing())
    and not (select public.is_user_restricted())
  );

drop policy if exists "Users can view public profile names" on public.profiles;
create policy "Users can view public profile names"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_platform_admin()));

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) and not (select public.is_user_restricted()))
  with check (id = (select auth.uid()) and not (select public.is_user_restricted()));

drop policy if exists "Users manage their own favorites" on public.favorites;
create policy "Users manage their own favorites"
  on public.favorites for all to authenticated
  using (
    user_id = (select auth.uid())
    and not (select public.is_user_restricted())
  )
  with check (
    user_id = (select auth.uid())
    and not (select public.is_user_restricted())
    and exists (select 1 from public.listings l where l.id = listing_id and l.status = 'active')
  );

drop policy if exists "Users can view their reports and admins can moderate" on public.reports;
create policy "Users can view their reports and admins can moderate"
  on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select public.is_platform_admin()));

drop policy if exists "Admins can moderate reports" on public.reports;
create policy "Admins can moderate reports"
  on public.reports for update to authenticated
  using (false)
  with check (false);

drop policy if exists "Users can submit reports" on public.reports;
create policy "Users can submit reports"
  on public.reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and (reported_user_id is null or reported_user_id <> (select auth.uid()))
    and status = 'open'
    and not (select public.is_user_restricted())
  );

drop policy if exists "Users can view their notifications" on public.user_notifications;
create policy "Users can view their notifications"
  on public.user_notifications for select to authenticated
  using (recipient_id = (select auth.uid()));
drop policy if exists "Users can mark their notifications read" on public.user_notifications;
create policy "Users can mark their notifications read"
  on public.user_notifications for update to authenticated
  using (recipient_id = (select auth.uid()))
  with check (recipient_id = (select auth.uid()));

drop policy if exists "Admins can read action log" on public.admin_action_log;
create policy "Admins can read action log"
  on public.admin_action_log for select to authenticated
  using ((select public.is_platform_admin()));
drop policy if exists "Admins can read archive" on public.listing_archive;
create policy "Admins can read archive"
  on public.listing_archive for select to authenticated
  using ((select public.is_platform_admin()));
drop policy if exists "Admins can read moderation history" on public.user_moderation;
create policy "Admins can read moderation history"
  on public.user_moderation for select to authenticated
  using ((select public.is_platform_admin()));
drop policy if exists "Users can read their moderation history" on public.user_moderation;
create policy "Users can read their moderation history"
  on public.user_moderation for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "Users can read their appeals and admins can review" on public.moderation_appeals;
create policy "Users can read their appeals and admins can review"
  on public.moderation_appeals for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_platform_admin()));
drop policy if exists "Users can appeal their own moderation" on public.moderation_appeals;
create policy "Users can appeal their own moderation"
  on public.moderation_appeals for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'open'
    and (
      exists (
        select 1 from public.listings l
        where l.id = listing_id and l.seller_id = (select auth.uid()) and l.status = 'removed'
      )
      or exists (
        select 1 from public.user_moderation m
        where m.id = moderation_id and m.user_id = (select auth.uid()) and m.lifted_at is null
      )
    )
  );
drop policy if exists "Admins cannot directly edit appeals" on public.moderation_appeals;
create policy "Admins cannot directly edit appeals"
  on public.moderation_appeals for update to authenticated
  using (false)
  with check (false);
create or replace function public.issue_super_admin_setup_token()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  raw_token text;
begin
  if exists (select 1 from public.platform_admins) then
    raise exception 'A platform administrator is already configured';
  end if;
  if exists (
    select 1 from public.super_admin_setup
    where singleton and consumed_at is null and expires_at > now()
  ) then
    raise exception 'An unexpired setup token already exists';
  end if;
  raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.super_admin_setup (singleton, token_hash, expires_at, consumed_at)
  values (
    true,
    encode(extensions.digest(convert_to(raw_token, 'UTF8'), 'sha256'), 'hex'),
    now() + interval '30 minutes',
    null
  )
  on conflict (singleton) do update
    set token_hash = excluded.token_hash,
        expires_at = excluded.expires_at,
        consumed_at = null;
  return raw_token;
end;
$$;

create or replace function public.bootstrap_super_admin(setup_token text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  setup_row public.super_admin_setup%rowtype;
  actor_id uuid := (select auth.uid());
begin
  if actor_id is null or coalesce((select auth.jwt() ->> 'aal'), '') <> 'aal2' then
    raise exception 'Sign in and verify an authenticator factor before setup';
  end if;
  if not exists (
    select 1 from auth.users
    where id = actor_id and email_confirmed_at is not null
  ) then
    raise exception 'Confirm the account email before setup';
  end if;
  if exists (select 1 from public.platform_admins) then
    raise exception 'The one-time administrator setup has already been used';
  end if;
  select * into setup_row
  from public.super_admin_setup
  where singleton
  for update;
  if not found or setup_row.consumed_at is not null or setup_row.expires_at <= now() then
    raise exception 'The setup token is missing or expired';
  end if;
  if setup_row.token_hash <> encode(extensions.digest(convert_to(coalesce(setup_token, ''), 'UTF8'), 'sha256'), 'hex') then
    raise exception 'Invalid setup token';
  end if;
  update public.super_admin_setup
  set consumed_at = now(), token_hash = null
  where singleton;
  insert into public.platform_admins (user_id, role, created_by)
  values (actor_id, 'super_admin', actor_id);
  insert into public.admin_action_log (admin_id, action, target_type, target_id, reason)
  values (actor_id, 'bootstrap_super_admin', 'admin', actor_id::text, 'One-time secure setup');
  return 'super_admin';
end;
$$;

create or replace function public.get_platform_admin_role()
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_role text;
begin
  if coalesce((select auth.jwt() ->> 'aal'), '') <> 'aal2' then
    return null;
  end if;
  select role into actor_role from public.platform_admins where user_id = (select auth.uid());
  return actor_role;
end;
$$;

create or replace function public.admin_set_listing_status(
  target_listing uuid,
  new_status text,
  action_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  listing_row public.listings%rowtype;
begin
  perform public.assert_platform_admin();
  if new_status is null or new_status not in ('active', 'paused', 'removed')
    or length(trim(coalesce(action_reason, ''))) < 5
    or length(action_reason) > 1000 then
    raise exception 'Invalid listing status or reason';
  end if;
  select * into listing_row from public.listings where id = target_listing for update;
  if not found then raise exception 'Listing not found'; end if;
  if listing_row.status = 'removed' and new_status = 'paused' then
    raise exception 'Restore the listing before pausing it';
  end if;
  if new_status = 'removed' and listing_row.status <> 'removed' then
    insert into public.listing_archive (listing_id, snapshot, deleted_by, deletion_reason)
    values (
      listing_row.id,
      to_jsonb(listing_row),
      actor_id,
      trim(action_reason)
    );
  elsif new_status = 'active' and listing_row.status = 'removed' then
    update public.listing_archive
    set restored_at = now()
    where listing_id = listing_row.id and restored_at is null;
  end if;
  update public.listings set status = new_status where id = listing_row.id;
  insert into public.admin_action_log (admin_id, action, target_type, target_id, reason, details)
  values (
    actor_id,
    case new_status when 'removed' then 'delete_listing' when 'paused' then 'deactivate_listing' else 'restore_or_publish_listing' end,
    'listing',
    listing_row.id::text,
    trim(action_reason),
    jsonb_build_object('previous_status', listing_row.status, 'new_status', new_status)
  );
  if new_status in ('removed', 'paused') and listing_row.status <> new_status then
    insert into public.user_notifications (recipient_id, notification_type, message)
    values (
      listing_row.seller_id,
      case new_status when 'removed' then 'listing_removed' else 'listing_paused' end,
      case new_status when 'removed' then 'Your listing was removed by platform moderation.' else 'Your listing was temporarily deactivated by platform moderation.' end
    );
  elsif new_status = 'active' and listing_row.status <> 'active' then
    insert into public.user_notifications (recipient_id, notification_type, message)
    values (listing_row.seller_id, 'listing_restored', 'Your listing has been restored by platform moderation.');
  end if;
end;
$$;

create or replace function public.admin_review_report(
  target_report uuid,
  new_status text,
  action_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
begin
  perform public.assert_platform_admin();
  if new_status is null or new_status not in ('resolved', 'dismissed')
    or length(trim(coalesce(action_reason, ''))) < 5
    or length(action_reason) > 1000 then
    raise exception 'Invalid report status or reason';
  end if;
  update public.reports
  set status = new_status, resolved_at = now()
  where id = target_report and status = 'open';
  if not found then raise exception 'Open report not found'; end if;
  insert into public.admin_action_log (admin_id, action, target_type, target_id, reason)
  values (actor_id, case new_status when 'dismissed' then 'dismiss_report' else 'resolve_report' end, 'report', target_report::text, trim(action_reason));
end;
$$;

create or replace function public.admin_review_appeal(
  target_appeal uuid,
  decision text,
  action_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  appeal_row public.moderation_appeals%rowtype;
  seller_id uuid;
begin
  perform public.assert_platform_admin();
  if decision is null or decision not in ('accepted', 'rejected')
    or length(trim(coalesce(action_reason, ''))) < 5
    or length(action_reason) > 1000 then
    raise exception 'Invalid appeal decision or reason';
  end if;
  select * into appeal_row
  from public.moderation_appeals
  where id = target_appeal and status = 'open'
  for update;
  if not found then raise exception 'Open appeal not found'; end if;

  if decision = 'accepted' and appeal_row.listing_id is not null then
    update public.listings
    set status = 'active'
    where id = appeal_row.listing_id and status = 'removed'
    returning listings.seller_id into seller_id;
    if not found then raise exception 'The appealed listing is no longer removed'; end if;
    update public.listing_archive
    set restored_at = now()
    where listing_id = appeal_row.listing_id and restored_at is null;
    insert into public.user_notifications (recipient_id, notification_type, message)
    values (seller_id, 'listing_restored', 'Your listing was restored after your appeal.');
  elsif decision = 'accepted' and appeal_row.moderation_id is not null then
    update public.user_moderation
    set lifted_at = now(), lifted_by = actor_id
    where id = appeal_row.moderation_id and user_id = appeal_row.user_id and lifted_at is null;
    if not found then raise exception 'The appealed restriction is no longer active'; end if;
  end if;

  update public.moderation_appeals
  set status = decision, resolved_at = now()
  where id = appeal_row.id;
  insert into public.admin_action_log (admin_id, action, target_type, target_id, reason, details)
  values (
    actor_id,
    case decision when 'accepted' then 'accept_appeal' else 'reject_appeal' end,
    'appeal',
    appeal_row.id::text,
    trim(action_reason),
    jsonb_build_object('listing_id', appeal_row.listing_id, 'moderation_id', appeal_row.moderation_id)
  );
  insert into public.user_notifications (recipient_id, notification_type, message)
  values (
    appeal_row.user_id,
    'appeal_decision',
    case decision when 'accepted' then 'Your appeal was accepted.' else 'Your appeal was rejected.' end
  );
end;
$$;

create or replace function public.admin_moderate_user(
  target_user uuid,
  moderation_action text,
  action_reason text,
  duration_hours integer default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  moderation_id bigint;
begin
  perform public.assert_platform_admin();
  if target_user = actor_id then raise exception 'Administrators cannot moderate their own account'; end if;
  if not exists (select 1 from public.profiles where id = target_user) then
    raise exception 'User not found';
  end if;
  if exists (select 1 from public.platform_admins where user_id = target_user) then
    perform public.assert_platform_admin('super_admin');
  end if;
  if moderation_action is null or moderation_action not in ('warning', 'suspend', 'ban', 'unsuspend')
    or length(trim(coalesce(action_reason, ''))) < 5
    or length(action_reason) > 1000
    or (moderation_action = 'suspend' and (duration_hours is null or duration_hours < 1 or duration_hours > 8760)) then
    raise exception 'Invalid moderation action or reason';
  end if;
  if moderation_action = 'unsuspend' then
    update public.user_moderation
    set lifted_at = now(), lifted_by = actor_id
    where user_id = target_user and action in ('suspend', 'ban') and lifted_at is null;
    if not found then raise exception 'No active suspension or ban found'; end if;
  else
    insert into public.user_moderation (user_id, action, reason, expires_at, created_by)
    values (
      target_user,
      moderation_action,
      trim(action_reason),
      case when moderation_action = 'suspend' then now() + make_interval(hours => duration_hours) else null end,
      actor_id
    )
    returning id into moderation_id;
  end if;
  insert into public.admin_action_log (admin_id, action, target_type, target_id, reason, details)
  values (
    actor_id,
    moderation_action,
    'user',
    target_user::text,
    trim(action_reason),
    jsonb_build_object('duration_hours', duration_hours, 'moderation_id', moderation_id)
  );
  insert into public.user_notifications (recipient_id, notification_type, message)
  values (
    target_user,
    case moderation_action when 'warning' then 'account_warning' when 'suspend' then 'account_suspended' when 'ban' then 'account_banned' else 'account_restored' end,
    case moderation_action
      when 'warning' then 'Your account received a platform warning.'
      when 'suspend' then 'Your account has been temporarily suspended.'
      when 'ban' then 'Your account has been permanently suspended.'
      else 'Your account restrictions have been lifted.'
    end
  );
end;
$$;

create or replace function public.admin_manage_admin(
  target_user uuid,
  new_role text,
  action_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  old_role text;
begin
  perform public.assert_platform_admin('super_admin');
  if target_user = actor_id then raise exception 'Use another super administrator to change your own role'; end if;
  if new_role is null or new_role not in ('admin', 'super_admin', 'remove')
    or length(trim(coalesce(action_reason, ''))) < 5
    or length(action_reason) > 1000 then
    raise exception 'Invalid administrator role or reason';
  end if;
  if not exists (select 1 from public.profiles where id = target_user) then
    raise exception 'User profile not found';
  end if;
  select role into old_role from public.platform_admins where user_id = target_user for update;
  if old_role = 'super_admin' and new_role <> 'super_admin' and (
    select count(*) from public.platform_admins where role = 'super_admin'
  ) <= 1 then
    raise exception 'Cannot demote the last super administrator';
  end if;
  if new_role = 'remove' then
    if old_role = 'super_admin' and (
      select count(*) from public.platform_admins where role = 'super_admin'
    ) <= 1 then
      raise exception 'Cannot remove the last super administrator';
    end if;
    delete from public.platform_admins where user_id = target_user;
  else
    insert into public.platform_admins (user_id, role, created_by)
    values (target_user, new_role, actor_id)
    on conflict (user_id) do update set role = excluded.role;
  end if;
  insert into public.admin_action_log (admin_id, action, target_type, target_id, reason, details)
  values (
    actor_id,
    case new_role when 'remove' then 'remove_admin' else 'set_admin_role' end,
    'admin',
    target_user::text,
    trim(action_reason),
    jsonb_build_object('previous_role', old_role, 'new_role', nullif(new_role, 'remove'))
  );
end;
$$;

create or replace function public.admin_list_admins()
returns table (user_id uuid, role text, display_name text, created_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_platform_admin('super_admin');
  return query
    select a.user_id, a.role, p.display_name, a.created_at
    from public.platform_admins a
    join public.profiles p on p.id = a.user_id
    order by a.created_at;
end;
$$;

create or replace function public.notify_admins_of_new_report()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_notifications (recipient_id, notification_type, message)
  select user_id, 'new_report', 'A new user complaint requires review.'
  from public.platform_admins;
  return new;
end;
$$;
drop trigger if exists on_report_notify_admins on public.reports;
create trigger on_report_notify_admins
  after insert on public.reports
  for each row execute procedure public.notify_admins_of_new_report();

create or replace function public.notify_admins_of_new_appeal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_notifications (recipient_id, notification_type, message)
  select user_id, 'new_appeal', 'A new moderation appeal requires review.'
  from public.platform_admins;
  return new;
end;
$$;
drop trigger if exists on_appeal_notify_admins on public.moderation_appeals;
create trigger on_appeal_notify_admins
  after insert on public.moderation_appeals
  for each row execute procedure public.notify_admins_of_new_appeal();

create or replace function public.notify_admins_of_suspicious_listing()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.title || ' ' || new.description) ~ '(https?://|www[.])' then
    insert into public.user_notifications (recipient_id, notification_type, message)
    select user_id, 'suspicious_listing', 'A new listing contains an external link and should be reviewed.'
    from public.platform_admins;
  end if;
  return new;
end;
$$;
drop trigger if exists on_listing_suspicious_check on public.listings;
create trigger on_listing_suspicious_check
  after insert on public.listings
  for each row execute procedure public.notify_admins_of_suspicious_listing();

drop policy if exists "Participants can view conversations" on public.conversations;
create policy "Participants can view conversations"
  on public.conversations for select to authenticated
  using (
    buyer_id = (select auth.uid())
    or seller_id = (select auth.uid())
    or (select public.is_platform_admin())
  );
drop policy if exists "Buyers can start conversations for active listings" on public.conversations;
create policy "Buyers can start conversations for active listings"
  on public.conversations for insert to authenticated
  with check (
    buyer_id = (select auth.uid())
    and buyer_id <> seller_id
    and exists (
      select 1 from public.listings l
      where l.id = listing_id and l.seller_id = seller_id and l.status = 'active'
    )
    and not (select public.is_user_restricted())
  );
drop policy if exists "Participants can view messages" on public.messages;
create policy "Participants can view messages"
  on public.messages for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and ((select auth.uid()) in (c.buyer_id, c.seller_id) or (select public.is_platform_admin()))
    )
  );
drop policy if exists "Participants can send messages" on public.messages;
create policy "Participants can send messages"
  on public.messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and not (select public.is_user_restricted())
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.buyer_id, c.seller_id)
    )
  );
drop policy if exists "Users delete images from their own folder" on storage.objects;
create policy "Users delete images from their own folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and not (select public.is_user_restricted())
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.is_platform_admin())
    )
  );
drop policy if exists "Users upload images to their own folder" on storage.objects;
create policy "Users upload images to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and not (select public.is_user_restricted())
  );

drop policy if exists "Recipients can mark incoming messages as read" on public.messages;
create policy "Recipients can mark incoming messages as read"
  on public.messages for update to authenticated
  using (
    sender_id <> (select auth.uid())
    and not (select public.is_user_restricted())
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.buyer_id, c.seller_id)
    )
  )
  with check (
    sender_id <> (select auth.uid())
    and not (select public.is_user_restricted())
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.buyer_id, c.seller_id)
    )
  );

revoke all on public.platform_admins, public.super_admin_setup, public.admin_action_log,
  public.listing_archive, public.user_moderation, public.moderation_appeals, public.user_notifications
  from anon, authenticated;
grant select on public.user_notifications to authenticated;
grant update (read_at) on public.user_notifications to authenticated;
grant select on public.admin_action_log, public.listing_archive,
  public.user_moderation, public.moderation_appeals to authenticated;
grant insert on public.moderation_appeals to authenticated;

revoke all on function public.issue_super_admin_setup_token() from public, anon, authenticated;
revoke all on function public.bootstrap_super_admin(text) from public, anon;
revoke all on function public.get_platform_admin_role() from public, anon;
revoke all on function public.admin_set_listing_status(uuid, text, text) from public, anon;
revoke all on function public.admin_review_report(uuid, text, text) from public, anon;
revoke all on function public.admin_review_appeal(uuid, text, text) from public, anon;
revoke all on function public.admin_moderate_user(uuid, text, text, integer) from public, anon;
revoke all on function public.admin_manage_admin(uuid, text, text) from public, anon;
revoke all on function public.admin_list_admins() from public, anon;
revoke all on function public.is_platform_admin() from public, anon;
revoke all on function public.assert_platform_admin(text) from public, anon;
grant execute on function public.bootstrap_super_admin(text) to authenticated;
grant execute on function public.get_platform_admin_role() to authenticated;
grant execute on function public.admin_set_listing_status(uuid, text, text) to authenticated;
grant execute on function public.admin_review_report(uuid, text, text) to authenticated;
grant execute on function public.admin_review_appeal(uuid, text, text) to authenticated;
grant execute on function public.admin_moderate_user(uuid, text, text, integer) to authenticated;
grant execute on function public.admin_manage_admin(uuid, text, text) to authenticated;
grant execute on function public.admin_list_admins() to authenticated;
grant execute on function public.is_platform_admin() to authenticated, anon;
grant execute on function public.assert_platform_admin(text) to authenticated;
revoke all on function public.is_user_restricted() from public, anon;
grant execute on function public.is_user_restricted() to authenticated;
