import React from 'react';
import { AssetDefinition } from './types';
import { AssetCard } from './components/AssetCard';
import { Layers, Chrome } from 'lucide-react';

const assets: AssetDefinition[] = [
  {
    id: 'icon',
    title: 'Store Icon',
    description: 'The main icon used in the Chrome Web Store listing and extension management page.',
    width: 128,
    height: 128,
    aspectRatio: 1,
  },
  {
    id: 'cover',
    title: 'Marquee / Cover',
    description: 'The large promotional image used at the top of your store listing. Choose your preferred density.',
    width: 1280,
    height: 800,
    aspectRatio: 1280 / 800,
    alternatives: [
      { label: 'Small Cover', width: 640, height: 400 }
    ]
  },
  {
    id: 'promo-small',
    title: 'Small Promo Tile',
    description: 'A smaller promotional tile used in related items or search results.',
    width: 440,
    height: 280,
    aspectRatio: 440 / 280,
  },
  {
    id: 'promo-marquee',
    title: 'Marquee Promo Tile',
    description: 'Wide banner used for featuring your extension in special store collections.',
    width: 1400,
    height: 560,
    aspectRatio: 1400 / 560,
  },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-brand-500/30">
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Chrome className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">CWS Studio</h1>
              <p className="text-[10px] text-brand-400 font-medium tracking-wider uppercase">Asset Generator</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</a>
             <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Templates</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Create perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-500">Store Assets</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Upload your source images, crop with precision, and download optimized PNGs formatted exactly for the Chrome Web Store requirements.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {assets.map((asset) => (
            <AssetCard key={asset.id} definition={asset} />
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-20 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Layers className="w-4 h-4" />
            <span>All processing happens locally in your browser.</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CWS Studio Generator</p>
        </div>

      </main>
    </div>
  );
};

export default App;