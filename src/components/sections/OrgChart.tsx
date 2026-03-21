import type { Executive } from '@/types/executive';

interface Props {
  executives: Executive[];
}

function byRole(executives: Executive[], role: string, index = 0): string {
  const matched = executives
    .filter((e) => e.roleKo === role)
    .sort((a, b) => a.order - b.order);
  return matched[index]?.nameKo ?? '';
}

// ── 카드 좌표 상수 ─────────────────────────────────────────
// 영사: (70, 64) w=150 h=52  → right=220, centerY=90
// 센터장: (70,124) w=150 h=52 → right=220, centerY=150
// 회장: (380,50) w=200 h=80  → left=380, right=580, centerY=90, bottom=130
// 감사: (610,64) w=150 h=52  → left=610, centerY=90
// 수석부회장: (390,196) w=180 h=60 → centerX=480, top=196, bottom=256
// 부회장1: (175,278) w=150 h=52 → centerX=250, top=278, bottom=330
// 부회장2: (405,278) w=150 h=52 → centerX=480, top=278, bottom=330
// 부회장3: (635,278) w=150 h=52 → centerX=710, top=278, bottom=330
// 기획국장: (122,355) w=155 h=52 → centerX=200, top=355, bottom=407
// 대외협력국장: (402,355) w=155 h=52 → centerX=480, top=355, bottom=407
// 사무국장: (682,355) w=155 h=52 → centerX=760, top=355, bottom=407
// 사무1차장: (610,432) w=145 h=50 → centerX=683, top=432
// 사무2차장: (762,432) w=145 h=50 → centerX=835, top=432

interface CardProps {
  role: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  roleColor: string;
  nameFill: string;
  rectFill: string;
  rectStroke: string;
  nameFontSize?: number;
}

function OrgCard({ role, name, x, y, w, h, roleColor, nameFill, rectFill, rectStroke, nameFontSize = 14 }: CardProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={w} height={h} rx="7" fill={rectFill} stroke={rectStroke} strokeWidth="1" />
      <text
        x={w / 2} y={Math.round(h * 0.38)}
        textAnchor="middle"
        fontSize="10"
        fontWeight="500"
        fill={roleColor}
        fillOpacity="0.85"
      >
        {role}
      </text>
      <text
        x={w / 2} y={Math.round(h * 0.74)}
        textAnchor="middle"
        fontSize={nameFontSize}
        fontWeight="600"
        fill={nameFill}
      >
        {name}
      </text>
    </g>
  );
}

export function OrgChart({ executives }: Props) {
  const vp = [
    byRole(executives, '부회장', 0),
    byRole(executives, '부회장', 1),
    byRole(executives, '부회장', 2),
  ];

  return (
    <div className="w-full">
      <svg
        width="100%"
        viewBox="0 0 960 520"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: 'inherit', display: 'block' }}
      >
        {/* ════════════════════════════════════════
            CONNECTOR LINES  (선이 박스 안으로 들어가지 않음)
            ════════════════════════════════════════ */}

        {/* 영사/센터장 → 회장 (left advisory, dashed blue) */}
        {/* 세로 브래킷: 영사 right-center(220,90) → 센터장 right-center(220,150) */}
        <line x1="220" y1="90"  x2="220" y2="150" stroke="rgba(74,158,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
        {/* 수평: 브래킷 → 회장 left */}
        <line x1="220" y1="90"  x2="380" y2="90"  stroke="rgba(74,158,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />

        {/* 감사 → 회장 (right advisory, gold dashed) */}
        <line x1="580" y1="90"  x2="610" y2="90"  stroke="rgba(255,180,80,0.45)" strokeWidth="1" strokeDasharray="5 3" />

        {/* 회장 bottom → 수석부회장 top */}
        <line x1="480" y1="130" x2="480" y2="196" stroke="rgba(74,158,255,0.45)" strokeWidth="1" />

        {/* 수석부회장 bottom → 부회장 row */}
        <line x1="480" y1="256" x2="480" y2="267" stroke="rgba(74,158,255,0.38)" strokeWidth="1" />
        <line x1="250" y1="267" x2="710" y2="267" stroke="rgba(74,158,255,0.38)" strokeWidth="1" />
        <line x1="250" y1="267" x2="250" y2="278" stroke="rgba(74,158,255,0.38)" strokeWidth="1" />
        <line x1="480" y1="267" x2="480" y2="278" stroke="rgba(74,158,255,0.38)" strokeWidth="1" />
        <line x1="710" y1="267" x2="710" y2="278" stroke="rgba(74,158,255,0.38)" strokeWidth="1" />

        {/* 부회장(center) bottom → 국장 row */}
        <line x1="480" y1="330" x2="480" y2="342" stroke="rgba(100,220,160,0.35)" strokeWidth="1" />
        <line x1="200" y1="342" x2="760" y2="342" stroke="rgba(100,220,160,0.35)" strokeWidth="1" />
        <line x1="200" y1="342" x2="200" y2="355" stroke="rgba(100,220,160,0.35)" strokeWidth="1" />
        <line x1="480" y1="342" x2="480" y2="355" stroke="rgba(100,220,160,0.35)" strokeWidth="1" />
        <line x1="760" y1="342" x2="760" y2="355" stroke="rgba(100,220,160,0.35)" strokeWidth="1" />

        {/* 사무국장 bottom → 차장 row */}
        <line x1="760" y1="407" x2="760" y2="420" stroke="rgba(180,180,220,0.28)" strokeWidth="1" />
        <line x1="683" y1="420" x2="835" y2="420" stroke="rgba(180,180,220,0.28)" strokeWidth="1" />
        <line x1="683" y1="420" x2="683" y2="432" stroke="rgba(180,180,220,0.28)" strokeWidth="1" />
        <line x1="835" y1="420" x2="835" y2="432" stroke="rgba(180,180,220,0.28)" strokeWidth="1" />

        {/* ════════════════════════════════════════
            CARDS
            ════════════════════════════════════════ */}

        {/* 영사 (회장 왼쪽 상단) */}
        <OrgCard
          role="영사 (ICT 담당)" name={byRole(executives, '영사')}
          x={70} y={64} w={150} h={52}
          roleColor="#4a9eff" nameFill="#c8d8f0"
          rectFill="rgba(74,158,255,0.07)" rectStroke="rgba(74,158,255,0.28)"
        />
        {/* 센터장 (회장 왼쪽 하단) */}
        <OrgCard
          role="센터장 (ICT 담당)" name={byRole(executives, '센터장')}
          x={70} y={124} w={150} h={52}
          roleColor="#4a9eff" nameFill="#c8d8f0"
          rectFill="rgba(74,158,255,0.07)" rectStroke="rgba(74,158,255,0.28)"
        />

        {/* 회장 (중앙) */}
        <g transform="translate(380, 50)">
          <rect width="200" height="80" rx="9" fill="rgba(20,50,110,0.92)" stroke="rgba(74,158,255,0.65)" strokeWidth="1.5" />
          <rect width="200" height="80" rx="9" fill="none" stroke="rgba(74,158,255,0.12)" strokeWidth="6" />
          <text x="100" y="30" textAnchor="middle" fontSize="11" fontWeight="500" fill="#7bbfff" fillOpacity="0.85">
            회장
          </text>
          <text x="100" y="58" textAnchor="middle" fontSize="17" fontWeight="700" fill="#e8edf5">
            {byRole(executives, '회장')}
          </text>
        </g>

        {/* 감사 (회장 오른쪽) */}
        <OrgCard
          role="감사" name={byRole(executives, '감사')}
          x={610} y={64} w={150} h={52}
          roleColor="#ffb450" nameFill="#e8d8b0"
          rectFill="rgba(255,180,80,0.07)" rectStroke="rgba(255,180,80,0.35)"
        />

        {/* 수석부회장 */}
        <OrgCard
          role="수석부회장" name={byRole(executives, '수석부회장')}
          x={390} y={196} w={180} h={60}
          roleColor="#5ab0ff" nameFill="#d0e0f5"
          rectFill="rgba(74,158,255,0.10)" rectStroke="rgba(74,158,255,0.40)"
          nameFontSize={15}
        />

        {/* 부회장 3명 */}
        <OrgCard
          role="부회장" name={vp[0]}
          x={175} y={278} w={150} h={52}
          roleColor="#6aaee8" nameFill="#c0d0e8"
          rectFill="rgba(74,158,255,0.07)" rectStroke="rgba(74,158,255,0.22)"
        />
        <OrgCard
          role="부회장" name={vp[1]}
          x={405} y={278} w={150} h={52}
          roleColor="#6aaee8" nameFill="#c0d0e8"
          rectFill="rgba(74,158,255,0.07)" rectStroke="rgba(74,158,255,0.22)"
        />
        <OrgCard
          role="부회장" name={vp[2]}
          x={635} y={278} w={150} h={52}
          roleColor="#6aaee8" nameFill="#c0d0e8"
          rectFill="rgba(74,158,255,0.07)" rectStroke="rgba(74,158,255,0.22)"
        />

        {/* 국장 3명 */}
        <OrgCard
          role="기획국장" name={byRole(executives, '기획국장')}
          x={122} y={355} w={155} h={52}
          roleColor="#64dc9f" nameFill="#b0e0c8"
          rectFill="rgba(100,220,160,0.07)" rectStroke="rgba(100,220,160,0.22)"
        />
        <OrgCard
          role="대외협력국장" name={byRole(executives, '대외협력국장')}
          x={402} y={355} w={155} h={52}
          roleColor="#64dc9f" nameFill="#b0e0c8"
          rectFill="rgba(100,220,160,0.07)" rectStroke="rgba(100,220,160,0.22)"
        />
        <OrgCard
          role="사무국장" name={byRole(executives, '사무국장')}
          x={682} y={355} w={155} h={52}
          roleColor="#64dc9f" nameFill="#b0e0c8"
          rectFill="rgba(100,220,160,0.07)" rectStroke="rgba(100,220,160,0.22)"
        />

        {/* 차장 2명 */}
        <OrgCard
          role="사무 1차장" name={byRole(executives, '사무 1차장')}
          x={610} y={432} w={145} h={50}
          roleColor="#9090b8" nameFill="#a8a8cc"
          rectFill="rgba(180,180,220,0.06)" rectStroke="rgba(180,180,220,0.18)"
          nameFontSize={13}
        />
        <OrgCard
          role="사무 2차장" name={byRole(executives, '사무 2차장')}
          x={762} y={432} w={145} h={50}
          roleColor="#9090b8" nameFill="#a8a8cc"
          rectFill="rgba(180,180,220,0.06)" rectStroke="rgba(180,180,220,0.18)"
          nameFontSize={13}
        />

        {/* ── Legend ── */}
        <line x1="40" y1="498" x2="64" y2="498" stroke="rgba(74,158,255,0.4)" strokeDasharray="4 3" strokeWidth="1" />
        <text x="70" y="502" fill="rgba(200,210,230,0.45)" fontSize="10">자문 관계</text>
        <line x1="170" y1="498" x2="194" y2="498" stroke="rgba(255,180,80,0.45)" strokeDasharray="5 3" strokeWidth="1" />
        <text x="200" y="502" fill="rgba(200,210,230,0.45)" fontSize="10">감사 관계</text>
        <line x1="300" y1="498" x2="324" y2="498" stroke="rgba(74,158,255,0.45)" strokeWidth="1" />
        <text x="330" y="502" fill="rgba(200,210,230,0.45)" fontSize="10">직속 관계</text>
      </svg>
    </div>
  );
}
