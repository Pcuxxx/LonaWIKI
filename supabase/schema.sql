-- LonaRPG: Архив Ноэра — анонимные комментарии на Supabase.
-- Выполните этот файл целиком в SQL Editor проекта Supabase.
-- Повторный запуск безопасен: объекты создаются через IF NOT EXISTS / OR REPLACE.

create extension if not exists pgcrypto;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  page_id text not null check (char_length(page_id) between 1 and 64),
  author text not null default 'Гость' check (char_length(author) between 1 and 40),
  body text not null check (char_length(body) between 1 and 4000),
  -- Случайный идентификатор браузера. Нужен только для удаления своих записей.
  client_id text not null check (char_length(client_id) between 8 and 80),
  reply_to uuid references public.comments(id) on delete cascade,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists comments_page_created_idx
  on public.comments (page_id, created_at desc);
create index if not exists comments_client_created_idx
  on public.comments (client_id, created_at desc);
create index if not exists comments_reply_idx
  on public.comments (reply_to);

alter table public.comments enable row level security;

-- Читать можно только неудалённые модератором записи.
drop policy if exists "comments: read visible" on public.comments;
create policy "comments: read visible"
  on public.comments for select
  to anon, authenticated
  using (hidden = false);

-- Писать можно только «видимые» записи; update/delete политик нет.
drop policy if exists "comments: insert anonymous" on public.comments;
create policy "comments: insert anonymous"
  on public.comments for insert
  to anon, authenticated
  with check (hidden = false);

-- Колоночные права: client_id нельзя прочитать даже с anon key,
-- иначе чужой токен позволил бы удалить чужой комментарий.
revoke all on table public.comments from anon, authenticated;
grant select (id, page_id, author, body, reply_to, created_at)
  on table public.comments to anon, authenticated;
grant insert (page_id, author, body, client_id, reply_to)
  on table public.comments to anon, authenticated;

-- Нормализация, защита от вложенных ответов и ограничение частоты.
create or replace function public.guard_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.page_id := btrim(new.page_id);
  new.author := left(coalesce(nullif(btrim(new.author), ''), 'Гость'), 40);
  new.body := btrim(new.body);
  new.created_at := now();
  new.hidden := false;

  if new.reply_to is not null then
    if not exists (
      select 1 from public.comments c
      where c.id = new.reply_to and c.page_id = new.page_id
    ) then
      raise exception 'invalid reply target' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from public.comments c
      where c.id = new.reply_to and c.reply_to is not null
    ) then
      raise exception 'nested reply not allowed' using errcode = 'P0001';
    end if;
  end if;

  if (
    select count(*)
    from public.comments c
    where c.client_id = new.client_id
      and c.created_at > now() - interval '5 minutes'
  ) >= 6 then
    raise exception 'comment rate limit' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists comments_guard on public.comments;
create trigger comments_guard
  before insert on public.comments
  for each row execute function public.guard_comment();

-- Удаление своего комментария: токен браузера сверяется на сервере.
create or replace function public.delete_own_comment(comment_id uuid, client_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  delete from public.comments
  where id = comment_id and client_id = client_token;
  get diagnostics removed = row_count;
  return removed > 0;
end;
$$;

revoke all on function public.delete_own_comment(uuid, text) from public;
grant execute on function public.delete_own_comment(uuid, text) to anon, authenticated;

-- На случай предыдущей версии с uuid-токеном.
drop function if exists public.delete_own_comment(uuid, uuid);
