import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function HeroBanner({ onShopNow }) {
  return (
    <div className="relative bg-stone-900 text-white overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-xl">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
          alt="Modern Home Interior"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-3xl px-6 py-12 sm:px-12 sm:py-20 lg:py-24">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Household Arrivals</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 tracking-tight leading-tight mb-4">
          Thoughtfully Designed for Modern Living.
        </h1>

        <p className="text-stone-300 text-base sm:text-lg mb-8 max-w-xl font-normal leading-relaxed">
          Discover artisanal cookware, organic linen bedding, handcrafted ceramics, and ergonomic furniture made to elevate your daily home rituals.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onShopNow}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-7 py-3.5 rounded-full text-base transition-all shadow-lg hover:shadow-emerald-900/50 hover:gap-3"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-stone-800 text-xs text-stone-300">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Fast Carbon-Neutral Delivery</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>100% Organic & Non-Toxic</span>
          </div>
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Lifetime Craftsmanship Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
