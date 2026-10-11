import React from 'react';
import { Utensils, Bed, Lamp, Sparkles, Armchair, LayoutGrid } from 'lucide-react';

const CATEGORY_ICONS = {
  'kitchen': Utensils,
  'bed-bath': Bed,
  'home-decor': Lamp,
  'cleaning-storage': Sparkles,
  'furniture': Armchair,
};

export default function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-stone-900 font-serif">Browse Categories</h2>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>All Items</span>
        </button>

        {categories.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.slug] || LayoutGrid;
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-[1.02]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
