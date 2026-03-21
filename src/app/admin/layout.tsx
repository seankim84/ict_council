// /admin/login 은 이 레이아웃만 사용 (인증 체크 없음)
// /admin/(protected)/* 는 별도 레이아웃에서 인증 체크 수행
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
