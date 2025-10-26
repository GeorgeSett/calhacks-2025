import Link from "next/link";
import Spline from "@splinetool/react-spline/next";
import { Spotlight } from "@/components/ui/spotlight";
import CoinFlowAnimation from "./CoinFlowAnimation";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-18">
        <Spotlight />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="max-w-3xl">
              <h1 className="text-hero mb-6">crowdfund anything on sui</h1>
              <p className="text-subtitle mb-8 text-text-dim">
                no platform fees. no middlemen. just you, your idea, and the
                blockchain.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/explore" className="btn btn-primary">
                  browse campaigns
                </Link>
                <Link href="/create" className="btn btn-ghost">
                  start yours
                </Link>
              </div>
            </div>

            {/* Right side - Spline 3D scene */}
            <div className="h-[500px] lg:h-[600px] relative [&_canvas]:pointer-events-none">
              <Spline scene="https://prod.spline.design/OCKFlypEkfhigBFW/scene.splinecode" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-18 border-t border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <p className="text-stat-lg gradient-text-purple mb-1">250.0</p>
              <div className="text-body text-text-dim">raised all time</div>
            </div>

            <div className="text-center">
              <p className="text-stat-lg gradient-text-green mb-1">500</p>
              <div className="text-body text-text-dim">total backers</div>
            </div>

            <div className="text-center">
              <p className="text-stat-lg gradient-text-blue mb-1">36</p>
              <div className="text-body text-text-dim">active campaigns</div>
            </div>
          </div>
        </div>
      </section>

      <CoinFlowAnimation />

      {/* Why section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <h2 className="text-title mb-16">why we exist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                actually decentralized
              </h3>
              <p className="text-body">
                smart contracts handle everything. funds release when goals hit.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">sui is fast</h3>
              <p className="text-body">
                back a project in under a second. no waiting around for block
                confirmations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">
                completely transparent
              </h3>
              <p className="text-body">
                every transaction on chain. see exactly where money goes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
