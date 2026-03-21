'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';

interface ContactForm {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  isKochamMember: 'yes' | 'no';
  message: string;
}

const initialForm: ContactForm = {
  name: '',
  position: '',
  company: '',
  email: '',
  phone: '',
  industry: 'Software',
  isKochamMember: 'yes',
  message: ''
};

const requiredFields: Array<keyof ContactForm> = ['name', 'position', 'company', 'email'];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function MembersJoinCTA() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setIsSuccess(false);

    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        nextErrors[field] = '필수 입력 항목입니다.';
      }
    }

    if (form.email.trim() && !isValidEmail(form.email)) {
      nextErrors.email = '유효한 이메일 형식을 입력해 주세요.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('문의 전송에 실패했습니다.');
      }

      setForm(initialForm);
      setErrors({});
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section-shell pt-8">
      <div className="mx-auto grid w-full max-w-[900px] gap-6 rounded-xl border border-[rgba(59,130,246,0.15)] bg-bg-secondary p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <div className="space-y-4">
          <p className="eyebrow">JOIN KOCHAM ICT</p>
          <h2 className="font-heading text-3xl font-bold lg:text-4xl">협의회 가입 문의</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            KOCHAM ICT 협의회 가입 또는 협력 문의를
            <br />
            남겨주시면 사무국에서 확인 후
            <br />
            빠르게 연락드리겠습니다.
          </p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• 가입 절차 및 필요 서류 안내</li>
            <li>• 정기 월례회/세미나 참여 안내</li>
            <li>• 회원사 간 비즈니스 매칭 지원</li>
          </ul>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="성함*"
              value={form.name}
              error={errors.name}
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            />
            <Field
              label="직책*"
              value={form.position}
              error={errors.position}
              onChange={(value) => setForm((prev) => ({ ...prev, position: value }))}
            />
            <Field
              label="회사명*"
              value={form.company}
              error={errors.company}
              onChange={(value) => setForm((prev) => ({ ...prev, company: value }))}
            />
            <Field
              label="이메일*"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            />
            <Field
              label="연락처"
              value={form.phone}
              onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
            />

            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              <span>업종</span>
              <select
                className="rounded-lg border border-[rgba(59,130,246,0.15)] bg-bg-tertiary px-3 py-2 text-text-primary focus:border-accent focus:outline-none"
                value={form.industry}
                onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
              >
                <option>Software</option>
                <option>IT Services</option>
                <option>E-Commerce</option>
                <option>AI&Data</option>
                <option>Fintech</option>
                <option>Cloud</option>
                <option>기타</option>
              </select>
            </label>
          </div>

          <fieldset className="rounded-lg border border-[rgba(59,130,246,0.15)] p-3">
            <legend className="px-2 text-sm text-text-secondary">KOCHAM 회원 여부</legend>
            <div className="flex gap-6 text-sm text-text-primary">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isKochamMember"
                  checked={form.isKochamMember === 'yes'}
                  onChange={() => setForm((prev) => ({ ...prev, isKochamMember: 'yes' }))}
                />
                예
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isKochamMember"
                  checked={form.isKochamMember === 'no'}
                  onChange={() => setForm((prev) => ({ ...prev, isKochamMember: 'no' }))}
                />
                아니오
              </label>
            </div>
          </fieldset>

          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            <span>문의 내용</span>
            <textarea
              rows={5}
              className="rounded-lg border border-[rgba(59,130,246,0.15)] bg-bg-tertiary px-3 py-2 text-text-primary focus:border-accent focus:outline-none"
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            />
          </label>

          {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}
          {isSuccess ? <p className="text-sm text-emerald-400">문의가 정상적으로 접수되었습니다.</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Spinner /> 전송 중...
              </>
            ) : (
              '문의 보내기'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email';
}

function Field({ label, value, onChange, error, type = 'text' }: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-text-secondary">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-[rgba(59,130,246,0.15)] bg-bg-tertiary px-3 py-2 text-text-primary focus:border-accent focus:outline-none"
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  );
}
