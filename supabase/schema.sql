-- ICT Council Web - Supabase Database Schema
-- Supabase SQL Editor에서 실행하세요.

-- Members table
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_en text not null,
  sector text not null,
  description text,
  logo_url text,
  profile_photo_url text,
  website_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- News table
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title_ko text not null,
  title_en text not null,
  category text not null check (category in ('notice', 'activity')),
  content text,
  thumbnail_url text,
  image_urls text[] default '{}',
  published_at timestamptz,
  created_at timestamptz default now()
);

-- 기존 DB에 컬럼 추가 (이미 테이블이 있는 경우)
alter table news add column if not exists image_urls text[] default '{}';
alter table applications add column if not exists applicant_position text;

-- Gallery table
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  event_name text,
  event_date date,
  "order" int default 0,
  created_at timestamptz default now()
);

-- Executives table
create table if not exists executives (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_en text not null,
  role_ko text not null,
  role_en text not null,
  company text,
  photo_url text,
  "order" int default 0
);

-- Contacts table (문의/가입 신청)
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  company text not null,
  email text not null,
  phone text,
  industry text,
  is_kocham_member text default 'no',
  message text,
  created_at timestamptz default now()
);

-- Applications table (회원사 가입 신청)
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_en text not null,
  applicant_name text not null,
  applicant_position text,
  phone text,
  sector text not null,
  logo_url text,
  profile_photo_url text,
  description text,
  website_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz default now()
);

-- Milestones table (연혁)
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  event text not null,
  "order" int default 0
);

-- Storage bucket (Supabase 대시보드 Storage 탭에서 직접 생성하세요)
-- Bucket name: ict-council-assets
-- Public bucket: true (공개 버킷으로 설정)
