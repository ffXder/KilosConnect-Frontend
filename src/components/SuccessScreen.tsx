interface SuccessScreenProps {
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function SuccessScreen({
  title, message, primaryLabel, onPrimary, secondaryLabel, onSecondary,
}: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 font-['Poppins']">
      <style>{`
        @keyframes ss-pop  { 0% {transform:scale(0);opacity:0} 60% {transform:scale(1.15);opacity:1} 100% {transform:scale(1)} }
        @keyframes ss-ring { 0% {transform:scale(.8);opacity:.6} 100% {transform:scale(1.8);opacity:0} }
        @keyframes ss-draw { to {stroke-dashoffset:0} }
        @keyframes ss-up   { from {opacity:0;transform:translateY(12px)} to {opacity:1;transform:none} }
        @media (prefers-reduced-motion: reduce) {
          .ss-anim { animation: none !important; }
          .ss-check { stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <div className="relative w-28 h-28 flex items-center justify-center">
        <span
          className="ss-anim absolute inset-0 rounded-full bg-emerald-400/40"
          style={{ animation: "ss-ring 1.2s ease-out .3s 2" }}
        />
        <div
          className="ss-anim relative w-28 h-28 rounded-full bg-[#0a2e27] flex items-center justify-center shadow-lg"
          style={{ animation: "ss-pop .5s cubic-bezier(.2,.9,.3,1.2) both" }}
        >
          <svg viewBox="0 0 52 52" className="w-14 h-14" fill="none" stroke="#FDFFE0"
            strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path
              className="ss-anim ss-check"
              d="M14 27 l8 8 l16 -18"
              style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: "ss-draw .45s ease-out .45s forwards" }}
            />
          </svg>
        </div>
      </div>

      <h2 className="ss-anim text-2xl font-extrabold text-gray-900 mt-8"
        style={{ animation: "ss-up .5s ease-out .7s both" }}>
        {title}
      </h2>
      <p className="ss-anim text-sm text-gray-500 font-medium mt-2 max-w-xs"
        style={{ animation: "ss-up .5s ease-out .85s both" }}>
        {message}
      </p>

      <div className="ss-anim w-full max-w-xs mt-8 space-y-3"
        style={{ animation: "ss-up .5s ease-out 1s both" }}>
        <button onClick={onPrimary}
          className="w-full py-3.5 rounded-xl bg-[#d86125] hover:bg-[#ba6300] text-[#FDFFE0] text-sm font-bold shadow-md transition-colors">
          {primaryLabel}
        </button>
        {secondaryLabel && onSecondary && (
          <button onClick={onSecondary}
            className="w-full py-3.5 rounded-xl border border-[#e8e8e8] bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}