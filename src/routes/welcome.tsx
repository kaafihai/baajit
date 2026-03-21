import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RabbitMascot } from "@/components/rabbit-mascot";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("nibble_welcomed", "true");
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 space-y-5">
      {/* Field scene with rabbit and carrot basket */}
      <div className="relative w-80 h-64">
        <FieldScene />
        {/* Rabbit sitting in the field */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-28 h-28">
          <RabbitMascot mood="waving" size="lg" showBubble={false} animated />
        </div>
      </div>

      {/* App name */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">nibble</h1>
        <p className="text-sm opacity-50 font-medium">your little life companion</p>
      </div>

      {/* Cheery description */}
      <div
        className="max-w-xs space-y-3 p-6 rounded-3xl"
        style={{ background: "var(--accent-warm-subtle)" }}
      >
        <p className="text-base leading-relaxed">
          Hey there! I'm your rabbit buddy, and I'm here to make
          the everyday stuff feel a little less overwhelming and
          a little more... fun.
        </p>
        <p className="text-sm leading-relaxed opacity-80">
          Track tasks, build tiny habits, and log how you're feeling.
          I'll cheer you on, remember your wins, and maybe even
          wear a silly hat while doing it.
        </p>
        <p className="text-xs opacity-60 italic">
          No pressure. No guilt. Just you and me, one nibble at a time.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleStart}
        className="btn bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
      >
        Let's go!
      </button>
    </div>
  );
}

// --- Lush carrot field with overflowing basket SVG illustration ---

function FieldScene() {
  return (
    <svg viewBox="0 0 320 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dce8f5" />
          <stop offset="60%" stopColor="#eae4da" />
          <stop offset="100%" stopColor="#f0e8d8" />
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8aba7a" />
          <stop offset="100%" stopColor="#6a9a58" />
        </linearGradient>
        <linearGradient id="grassLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8d8a8" />
          <stop offset="100%" stopColor="#98c488" />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6E4E" />
          <stop offset="100%" stopColor="#6B5038" />
        </linearGradient>
        <linearGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="100%" stopColor="#f5dca0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="256" fill="url(#sky)" rx="16" />

      {/* Sun with glow */}
      <circle cx="270" cy="38" r="32" fill="url(#sunGlow)" />
      <circle cx="270" cy="38" r="16" fill="#f5dca0" opacity="0.7" />
      <circle cx="270" cy="38" r="10" fill="#f8e8b8" opacity="0.9" />

      {/* Clouds */}
      <g opacity="0.5">
        <ellipse cx="55" cy="35" rx="28" ry="11" fill="white" />
        <ellipse cx="78" cy="31" rx="20" ry="9" fill="white" opacity="0.8" />
        <ellipse cx="42" cy="32" rx="14" ry="8" fill="white" opacity="0.7" />
      </g>
      <g opacity="0.4">
        <ellipse cx="180" cy="48" rx="22" ry="9" fill="white" />
        <ellipse cx="198" cy="45" rx="16" ry="7" fill="white" opacity="0.8" />
      </g>
      <g opacity="0.3">
        <ellipse cx="120" cy="25" rx="18" ry="7" fill="white" />
      </g>

      {/* Distant hills */}
      <ellipse cx="80" cy="140" rx="120" ry="30" fill="#c4d8b8" opacity="0.5" />
      <ellipse cx="260" cy="145" rx="100" ry="28" fill="#c4d8b8" opacity="0.4" />

      {/* Main ground - lush green */}
      <ellipse cx="160" cy="210" rx="200" ry="70" fill="url(#grass)" />
      <ellipse cx="60" cy="220" rx="110" ry="50" fill="url(#grassLight)" opacity="0.6" />
      <ellipse cx="270" cy="215" rx="100" ry="55" fill="url(#grassLight)" opacity="0.5" />

      {/* Soil rows for carrot field */}
      <g opacity="0.3">
        <ellipse cx="160" cy="195" rx="130" ry="4" fill="#8B6E4E" />
        <ellipse cx="160" cy="208" rx="140" ry="4" fill="#8B6E4E" />
        <ellipse cx="160" cy="221" rx="135" ry="4" fill="#8B6E4E" />
      </g>

      {/* === CARROT PLANTS ROW 1 (back row, smaller) === */}
      <g opacity="0.7">
        {/* Plant 1 */}
        <g transform="translate(45, 178)">
          <path d="M0 0 Q-3 -14 -1 -18" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q1 -16 3 -20" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q4 -12 6 -16" stroke="#4a8a38" strokeWidth="1.2" fill="none" />
          <path d="M0 2 L0 6" stroke="#e88040" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Plant 2 */}
        <g transform="translate(75, 176)">
          <path d="M0 0 Q-2 -16 0 -20" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q2 -14 4 -18" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q-4 -12 -5 -15" stroke="#5a9a45" strokeWidth="1.2" fill="none" />
          <path d="M0 2 L0 7" stroke="#e88040" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        {/* Plant 3 */}
        <g transform="translate(105, 178)">
          <path d="M0 0 Q-1 -18 1 -22" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q3 -15 5 -19" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 6" stroke="#e88040" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Plant 4 */}
        <g transform="translate(215, 177)">
          <path d="M0 0 Q-2 -15 -1 -19" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q2 -17 3 -21" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q5 -11 6 -14" stroke="#5a9a45" strokeWidth="1.2" fill="none" />
          <path d="M0 2 L0 7" stroke="#e88040" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Plant 5 */}
        <g transform="translate(245, 179)">
          <path d="M0 0 Q-3 -13 -1 -17" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q1 -15 2 -19" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 5" stroke="#e88040" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Plant 6 */}
        <g transform="translate(275, 178)">
          <path d="M0 0 Q-2 -14 0 -18" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q3 -12 4 -16" stroke="#4a8a38" strokeWidth="1.2" fill="none" />
          <path d="M0 2 L0 6" stroke="#e88040" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* === CARROT PLANTS ROW 2 (middle row) === */}
      <g opacity="0.85">
        {/* Plant 1 */}
        <g transform="translate(30, 192)">
          <path d="M0 0 Q-4 -18 -1 -24" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q2 -20 4 -26" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 0 Q5 -14 7 -20" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 0 Q-5 -10 -7 -16" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 9" stroke="#e88040" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* Plant 2 */}
        <g transform="translate(58, 190)">
          <path d="M0 0 Q-3 -20 0 -26" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 0 Q3 -18 5 -24" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q-5 -15 -6 -20" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 10" stroke="#e88040" strokeWidth="4.5" strokeLinecap="round" />
        </g>
        {/* Plant 3 */}
        <g transform="translate(88, 191)">
          <path d="M0 0 Q-2 -22 1 -28" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q4 -17 6 -22" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 0 Q-4 -13 -5 -18" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 8" stroke="#e88040" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        {/* Plant 4 */}
        <g transform="translate(230, 191)">
          <path d="M0 0 Q-3 -19 -1 -25" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 0 Q2 -21 4 -27" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q5 -14 7 -19" stroke="#5a9a45" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 9" stroke="#e88040" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* Plant 5 */}
        <g transform="translate(260, 192)">
          <path d="M0 0 Q-4 -17 -2 -23" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q1 -20 3 -25" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 0 Q-5 -12 -6 -17" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 10" stroke="#e88040" strokeWidth="4.5" strokeLinecap="round" />
        </g>
        {/* Plant 6 */}
        <g transform="translate(290, 190)">
          <path d="M0 0 Q-2 -18 0 -24" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 0 Q3 -16 5 -21" stroke="#4a8a38" strokeWidth="1.5" fill="none" />
          <path d="M0 2 L0 8" stroke="#e88040" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>

      {/* === CARROT PLANTS ROW 3 (front row, largest) === */}
      <g>
        {/* Plant 1 */}
        <g transform="translate(18, 208)">
          <path d="M0 0 Q-5 -22 -2 -30" stroke="#4a8a38" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q2 -25 5 -32" stroke="#5a9a45" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q6 -18 8 -24" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q-6 -14 -8 -20" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 2 L0 12" stroke="#e88040" strokeWidth="5" strokeLinecap="round" />
        </g>
        {/* Plant 2 */}
        <g transform="translate(48, 206)">
          <path d="M0 0 Q-4 -24 -1 -32" stroke="#5a9a45" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q3 -22 5 -30" stroke="#4a8a38" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q-6 -16 -7 -22" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q6 -15 8 -20" stroke="#5a9a45" strokeWidth="1.8" fill="none" />
          <path d="M0 2 L0 13" stroke="#e88040" strokeWidth="5.5" strokeLinecap="round" />
        </g>
        {/* Plant 3 */}
        <g transform="translate(78, 207)">
          <path d="M0 0 Q-3 -26 0 -34" stroke="#4a8a38" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q4 -20 6 -28" stroke="#5a9a45" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q-5 -15 -7 -22" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 2 L0 11" stroke="#e88040" strokeWidth="5" strokeLinecap="round" />
        </g>
        {/* Plant 4 */}
        <g transform="translate(240, 207)">
          <path d="M0 0 Q-4 -23 -1 -31" stroke="#5a9a45" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q3 -25 5 -33" stroke="#4a8a38" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q6 -16 8 -22" stroke="#5a9a45" strokeWidth="2" fill="none" />
          <path d="M0 0 Q-6 -14 -8 -19" stroke="#4a8a38" strokeWidth="1.8" fill="none" />
          <path d="M0 2 L0 12" stroke="#e88040" strokeWidth="5" strokeLinecap="round" />
        </g>
        {/* Plant 5 */}
        <g transform="translate(270, 206)">
          <path d="M0 0 Q-5 -21 -2 -29" stroke="#4a8a38" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q2 -24 4 -31" stroke="#5a9a45" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q5 -17 7 -23" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 2 L0 13" stroke="#e88040" strokeWidth="5.5" strokeLinecap="round" />
        </g>
        {/* Plant 6 */}
        <g transform="translate(300, 208)">
          <path d="M0 0 Q-3 -20 -1 -27" stroke="#5a9a45" strokeWidth="2.5" fill="none" />
          <path d="M0 0 Q3 -18 5 -25" stroke="#4a8a38" strokeWidth="2" fill="none" />
          <path d="M0 0 Q-5 -12 -6 -18" stroke="#4a8a38" strokeWidth="1.8" fill="none" />
          <path d="M0 2 L0 11" stroke="#e88040" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Tiny flowers scattered */}
      <circle cx="38" cy="198" r="2.5" fill="#f0b0a0" opacity="0.6" />
      <circle cx="38" cy="198" r="1" fill="#f5d0a0" />
      <circle cx="285" cy="200" r="2.5" fill="#c4b5d8" opacity="0.6" />
      <circle cx="285" cy="200" r="1" fill="#f5d0a0" />
      <circle cx="110" cy="215" r="2" fill="#f0b0a0" opacity="0.5" />
      <circle cx="210" cy="212" r="2" fill="#c4b5d8" opacity="0.5" />
      <circle cx="15" cy="218" r="2" fill="#eeb0c0" opacity="0.5" />
      <circle cx="305" cy="218" r="2" fill="#eeb0c0" opacity="0.4" />

      {/* Grass tufts */}
      <g opacity="0.5" stroke="#5a8a48" strokeWidth="1.5" fill="none">
        <path d="M10 210 Q12 198 14 210" />
        <path d="M13 210 Q16 195 19 210" />
        <path d="M305 212 Q307 200 309 212" />
        <path d="M308 212 Q311 197 314 212" />
        <path d="M135 220 Q137 210 139 220" />
        <path d="M185 218 Q187 208 189 218" />
      </g>

      {/* === OVERFLOWING BASKET OF CARROTS === */}
      <g transform="translate(197, 155)">
        {/* Basket shadow */}
        <ellipse cx="35" cy="48" rx="38" ry="6" fill="#000" opacity="0.08" />

        {/* Basket body - woven look */}
        <path d="M0 16 Q3 46 14 46 L56 46 Q67 46 70 16Z" fill="#c4956a" stroke="#a07048" strokeWidth="1.5" />
        {/* Basket rim - thick woven edge */}
        <ellipse cx="35" cy="16" rx="37" ry="8" fill="#d4a878" stroke="#a07048" strokeWidth="1.5" />
        <ellipse cx="35" cy="16" rx="33" ry="5.5" fill="#c49868" stroke="none" />
        {/* Basket weave pattern */}
        <path d="M10 24 Q35 30 60 24" stroke="#a07048" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M8 30 Q35 36 62 30" stroke="#a07048" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M10 36 Q35 42 60 36" stroke="#a07048" strokeWidth="0.8" fill="none" opacity="0.4" />
        {/* Vertical weave lines */}
        <line x1="20" y1="16" x2="18" y2="44" stroke="#a07048" strokeWidth="0.5" opacity="0.3" />
        <line x1="35" y1="16" x2="35" y2="46" stroke="#a07048" strokeWidth="0.5" opacity="0.3" />
        <line x1="50" y1="16" x2="52" y2="44" stroke="#a07048" strokeWidth="0.5" opacity="0.3" />
        {/* Basket handle */}
        <path d="M15 16 Q35 -8 55 16" stroke="#a07048" strokeWidth="2.5" fill="none" />
        <path d="M15 16 Q35 -6 55 16" stroke="#c4956a" strokeWidth="1.5" fill="none" />

        {/* Carrots overflowing from basket - big bushy tops! */}

        {/* Carrot 1 - far left, leaning out */}
        <g transform="rotate(-30 12 10)">
          <path d="M12 10 L8 -12" stroke="#e88040" strokeWidth="5" strokeLinecap="round" />
          <path d="M8 -12 L7 -16" stroke="#d87030" strokeWidth="4" strokeLinecap="round" />
          <path d="M4 -14 Q7 -26 10 -14" fill="#4a8a38" />
          <path d="M6 -14 Q9 -28 12 -14" fill="#5a9a45" />
          <path d="M8 -14 Q11 -24 14 -14" fill="#4a8a38" opacity="0.8" />
        </g>

        {/* Carrot 2 - left-center */}
        <g transform="rotate(-12 22 8)">
          <path d="M22 8 L20 -16" stroke="#e88040" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M20 -16 L19 -20" stroke="#d87030" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M15 -18 Q19 -32 23 -18" fill="#5a9a45" />
          <path d="M17 -18 Q21 -34 25 -18" fill="#4a8a38" />
          <path d="M19 -18 Q23 -30 27 -18" fill="#5a9a45" opacity="0.8" />
          <path d="M21 -18 Q24 -28 27 -18" fill="#3a7a28" opacity="0.6" />
        </g>

        {/* Carrot 3 - center (tallest) */}
        <g transform="rotate(3 35 6)">
          <path d="M35 6 L33 -20" stroke="#e88040" strokeWidth="6" strokeLinecap="round" />
          <path d="M33 -20 L32 -25" stroke="#d87030" strokeWidth="5" strokeLinecap="round" />
          <path d="M27 -22 Q32 -38 37 -22" fill="#4a8a38" />
          <path d="M29 -22 Q34 -40 39 -22" fill="#5a9a45" />
          <path d="M31 -22 Q36 -36 41 -22" fill="#4a8a38" opacity="0.8" />
          <path d="M33 -22 Q37 -34 41 -22" fill="#5a9a45" opacity="0.7" />
          <path d="M35 -22 Q38 -32 41 -22" fill="#3a7a28" opacity="0.5" />
        </g>

        {/* Carrot 4 - right-center */}
        <g transform="rotate(15 48 8)">
          <path d="M48 8 L50 -14" stroke="#e88040" strokeWidth="5" strokeLinecap="round" />
          <path d="M50 -14 L51 -18" stroke="#d87030" strokeWidth="4" strokeLinecap="round" />
          <path d="M46 -16 Q50 -28 54 -16" fill="#5a9a45" />
          <path d="M48 -16 Q52 -30 56 -16" fill="#4a8a38" />
          <path d="M50 -16 Q53 -26 56 -16" fill="#5a9a45" opacity="0.8" />
        </g>

        {/* Carrot 5 - far right, leaning out */}
        <g transform="rotate(28 58 10)">
          <path d="M58 10 L61 -8" stroke="#e88040" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M61 -8 L62 -12" stroke="#d87030" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M58 -10 Q61 -22 64 -10" fill="#4a8a38" />
          <path d="M59 -10 Q63 -24 66 -10" fill="#5a9a45" />
          <path d="M61 -10 Q64 -20 67 -10" fill="#4a8a38" opacity="0.7" />
        </g>

        {/* Carrot 6 - tiny one peeking from middle */}
        <g transform="rotate(-5 28 12)">
          <path d="M28 12 L27 2" stroke="#e88040" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24 2 Q27 -6 30 2" fill="#5a9a45" />
          <path d="M26 2 Q28 -4 30 2" fill="#4a8a38" opacity="0.8" />
        </g>

        {/* Carrot 7 - another small one on right side */}
        <g transform="rotate(8 42 12)">
          <path d="M42 12 L43 2" stroke="#e88040" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 2 Q43 -5 46 2" fill="#4a8a38" />
          <path d="M42 2 Q44 -3 46 2" fill="#5a9a45" opacity="0.8" />
        </g>
      </g>

      {/* Loose carrots on the ground near basket */}
      <g transform="translate(178, 210) rotate(-40)">
        <path d="M0 0 L-2 -14" stroke="#e88040" strokeWidth="4" strokeLinecap="round" />
        <path d="M-5 -14 Q-2 -22 1 -14" fill="#5a9a45" />
        <path d="M-3 -14 Q0 -20 3 -14" fill="#4a8a38" />
      </g>
      <g transform="translate(285, 212) rotate(25)">
        <path d="M0 0 L1 -12" stroke="#e88040" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M-2 -12 Q1 -19 4 -12" fill="#5a9a45" />
        <path d="M0 -12 Q2 -17 4 -12" fill="#4a8a38" />
      </g>

      {/* Sparkles */}
      <text x="195" y="148" fontSize="7" opacity="0.35">&#10022;</text>
      <text x="275" y="160" fontSize="6" opacity="0.3">&#10022;</text>
      <text x="140" y="175" fontSize="5" opacity="0.25">&#10022;</text>

      {/* Tiny butterfly */}
      <g transform="translate(50, 120)" opacity="0.5">
        <path d="M0 0 Q-5 -4 -3 -8 Q0 -5 0 0" fill="#d8a8d0" />
        <path d="M0 0 Q5 -4 3 -8 Q0 -5 0 0" fill="#c898c0" />
        <line x1="0" y1="0" x2="0" y2="3" stroke="#886088" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
