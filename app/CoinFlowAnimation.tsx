import { User, Lightbulb } from "lucide-react";
export default function CoinFlowAnimation() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-title mb-4 text-center">
          no middleman. direct funding.
        </h2>
        <p className="text-subtitle text-center text-text-dim mb-16 max-w-2xl mx-auto">
          your contribution goes straight to creators. smart contracts handle
          the rest.
        </p>
        <div className="relative max-w-5xl mx-auto">
          {/* The Flow Container */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-between">
            <hr className="text-border w-full absolute border-dashed h-10" />
            {/* Arced Line */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none pb-56 md:pb-72"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              <path
                d="M150,250 Q500,50 850,250"
                stroke="url(#arcGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10 5"
                strokeDashoffset="0"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="15"
                  to="0"
                  dur=".5s"
                  repeatCount="indefinite"
                />
              </path>
              <defs>
                <linearGradient id="arcGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="50%" stopColor="#8b9aff" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
            {/* Backer (Left) */}
            <div className="relative z-10 flex flex-col items-center bg-bg">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full gradient-purple flex items-center justify-center mb-4">
                <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <p className="text-2xl text-text">backer</p>
            </div>
            {/* Middleman (Center - Crossed Out) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-5 flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface border-border flex items-center justify-center mb-4"></div>
                {/* Crossing lines */}
                <div className="absolute inset-0 flex items-center justify-center mb-4">
                  <div className="absolute w-28 h-px md:w-32 bg-border rotate-45"></div>
                  <div className="absolute w-28 h-px md:w-32 bg-border -rotate-45"></div>
                </div>
              </div>
              <p className="text-subtitle">platform</p>
            </div>
            {/* Creator (Right) */}
            <div className="relative z-10 flex flex-col items-center bg-bg">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full gradient-blue flex items-center justify-center mb-4 ">
                <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <p className="text-2xl text-text">creator</p>
            </div>
          </div>
          {/* Bottom Text */}
          <div className="mt-12 text-center">
            <p className="text-body max-w-xl mx-auto">
              traditional platforms take 5-10% in fees. with blockchain, 100% of
              your contribution reaches the creator. smart contracts ensure
              transparency and automatic fund release when goals are met.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
