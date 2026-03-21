import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ContactPayload {
  name?: string;
  position?: string;
  company?: string;
  email?: string;
  phone?: string;
  industry?: string;
  isKochamMember?: 'yes' | 'no';
  message?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  const name = payload.name?.trim() ?? '';
  const position = payload.position?.trim() ?? '';
  const company = payload.company?.trim() ?? '';
  const email = payload.email?.trim() ?? '';

  if (!name || !position || !company || !email) {
    return NextResponse.json({ message: 'name, position, company, email are required' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: 'invalid email format' }, { status: 400 });
  }

  const { error } = await supabase.from('contacts').insert({
    name,
    position,
    company,
    email,
    phone: payload.phone?.trim() ?? '',
    industry: payload.industry?.trim() ?? '',
    is_kocham_member: payload.isKochamMember ?? 'no',
    message: payload.message?.trim() ?? ''
  });

  if (error) {
    return NextResponse.json({ message: 'Failed to submit contact' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
