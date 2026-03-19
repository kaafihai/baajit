import { createFileRoute, Link } from "@tanstack/react-router";
import { RabbitMascot } from "@/components/rabbit-mascot";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 space-y-6">
      {/* Field scene with rabbit and carrot basket */}
      <div className="relative w-72 h-56">
        <FieldScene />
        {/* Rabbit sitting in the field */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 h-28">
          <RabbitMascot mood="waving" size="lg" showBubble={false} animated />
        </div>
      </div>

      {/* App name */}
      <div className="space-y-2">
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
      <Link
        to="/"
        className="btn bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
      >
        Let's go!
      </Link>
    </div>
  );
}

// --- Field with carrot basket SVG illustration ---

function FieldScene() {
  return (
    <svg viewBox="0 0 288 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f0f8" />
          <stop offset="100%" stopColor="#f5ede3" />
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8d4b0" />
          <stop offset="100%" stopColor="#98c48c" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="288" height="220" fill="url(#sky)" rx="16" />

      {/* Soft clouds */}
      <ellipse cx="60" cy="40" rx="30" ry="12" fill="white" opacity="0.5" />
      <ellipse cx="80" cy="36" rx="20" ry="10" fill="white" opacity="0.4" />
      <ellipse cx="210" cy="50" rx="25" ry="10" fill="white" opacity="0.45" />
      <ellipse cx="230" cy="46" rx="18" ry="8" fill="white" opacity="0.35" />

      {/* Sun */}
      <circle cx="245" cy="35" r="18" fill="#f5dca0" opacity="0.6" />
      <circle cx="245" cy="35" r="12" fill="#f5dca0" opacity="0.8" />

      {/* Rolling hills */}
      <ellipse cx="144" cy="190" rx="180" ry="60" fill="url(#grass)" />
      <ellipse cx="60" cy="200" rx="100" ry="45" fill="#a8c8a0" opacity="0.6" />
      <ellipse cx="240" cy="195" rx="90" ry="50" fill="#a8c8a0" opacity="0.5" />

      {/* Grass tufts */}
      <g opacity="0.6">
        <path d="M30 170 Q32 158 34 170" stroke="#6a9a5a" strokeWidth="1.5" fill="none" />
        <path d="M33 170 Q36 155 39 170" stroke="#6a9a5a" strokeWidth="1.5" fill="none" />
        <path d="M250 175 Q252 163 254 175" stroke="#6a9a5a" strokeWidth="1.5" fill="none" />
        <path d="M253 175 Q256 160 259 175" stroke="#6a9a5a" strokeWidth="1.5" fill="none" />
        <path d="M80 178 Q82 168 84 178" stroke="#6a9a5a" strokeWidth="1.5" fill="none" />
        <path d="M200 172 Q202 162 204 172" stroke="#6a9a5a" strokeWidth="1.5" fill="none" />
      </g>

      {/* Tiny flowers */}
      <circle cx="45" cy="178" r="2.5" fill="#f0b0a0" opacity="0.7" />
      <circle cx="45" cy="178" r="1" fill="#f5d0a0" />
      <circle cx="235" cy="180" r="2.5" fill="#c4b5d8" opacity="0.7" />
      <circle cx="235" cy="180" r="1" fill="#f5d0a0" />
      <circle cx="100" cy="185" r="2" fill="#f0b0a0" opacity="0.6" />
      <circle cx="190" cy="182" r="2" fill="#c4b5d8" opacity="0.6" />

      {/* === Basket of carrots === */}
      <g transform="translate(185, 148)">
        {/* Basket body */}
        <path d="M0 12 Q2 32 10 32 L50 32 Q58 32 60 12Z" fill="#c4956a" stroke="#a87850" strokeWidth="1.2" />
        {/* Basket rim */}
        <ellipse cx="30" cy="12" rx="32" ry="6" fill="#d4a878" stroke="#a87850" strokeWidth="1.2" />
        {/* Basket weave lines */}
        <path d="M8 18 Q30 24 52 18" stroke="#a87850" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M6 24 Q30 30 54 24" stroke="#a87850" strokeWidth="0.8" fill="none" opacity="0.5" />

        {/* Carrot 1 - poking out left */}
        <g transform="rotate(-20 15 8)">
          <path d="M15 8 L12 -14" stroke="#e88040" strokeWidth="4" strokeLinecap="round" />
          <path d="M10 -14 Q12 -22 14 -14" fill="#5a9a45" />
          <path d="M12 -14 Q14 -24 16 -14" fill="#4a8a38" />
        </g>

        {/* Carrot 2 - center */}
        <g transform="rotate(5 30 6)">
          <path d="M30 6 L28 -18" stroke="#e88040" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M25 -18 Q28 -28 31 -18" fill="#5a9a45" />
          <path d="M27 -18 Q30 -30 33 -18" fill="#4a8a38" />
          <path d="M29 -18 Q32 -26 35 -18" fill="#5a9a45" opacity="0.8" />
        </g>

        {/* Carrot 3 - poking out right */}
        <g transform="rotate(15 42 8)">
          <path d="M42 8 L44 -12" stroke="#e88040" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M41 -12 Q44 -20 47 -12" fill="#5a9a45" />
          <path d="M43 -12 Q45 -22 47 -12" fill="#4a8a38" />
        </g>

        {/* Carrot 4 - tiny one peeking */}
        <g transform="rotate(-8 22 10)">
          <path d="M22 10 L21 -4" stroke="#e88040" strokeWidth="3" strokeLinecap="round" />
          <path d="M19 -4 Q21 -10 23 -4" fill="#5a9a45" />
        </g>
      </g>

      {/* A loose carrot on the ground */}
      <g transform="translate(90, 182) rotate(-35)">
        <path d="M0 0 L-2 -12" stroke="#e88040" strokeWidth="3" strokeLinecap="round" />
        <path d="M-4 -12 Q-2 -18 0 -12" fill="#5a9a45" />
        <path d="M-2 -12 Q0 -16 2 -12" fill="#4a8a38" />
      </g>

      {/* Sparkle near basket */}
      <text x="255" y="155" fontSize="8" opacity="0.4">✦</text>
      <text x="175" y="145" fontSize="6" opacity="0.3">✦</text>
    </svg>
  );
}
