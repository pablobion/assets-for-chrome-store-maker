import React, { useState, useRef } from 'react';
import { AssetDefinition, ProcessedAsset } from '../types';
import { Upload, Download, Trash2, Image as ImageIcon, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';
import { CropModal } from './CropModal';

interface AssetCardProps {
  definition: AssetDefinition;
}

export const AssetCard: React.FC<AssetCardProps> = ({ definition }) => {
  const [processedAsset, setProcessedAsset] = useState<ProcessedAsset | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [activeDimension, setActiveDimension] = useState<{w: number, h: number}>({ 
    w: definition.width, 
    h: definition.height 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedFile(reader.result as string);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
      // Reset input so same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleCropComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setProcessedAsset({
      id: definition.id,
      blob,
      previewUrl: url,
      fileName: `chrome-${definition.id}-${activeDimension.w}x${activeDimension.h}.png`,
      width: activeDimension.w,
      height: activeDimension.h
    });
    setShowCropModal(false);
  };

  const handleDownload = () => {
    if (!processedAsset) return;
    const link = document.createElement('a');
    link.href = processedAsset.previewUrl;
    link.download = processedAsset.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemove = () => {
    if (processedAsset) {
      URL.revokeObjectURL(processedAsset.previewUrl);
    }
    setProcessedAsset(null);
    setSelectedFile(null);
  };

  // Switch between dimensions if alternatives exist
  const toggleDimension = (w: number, h: number) => {
    if (w !== activeDimension.w || h !== activeDimension.h) {
      setActiveDimension({ w, h });
      // If we already have a file uploaded, we might want to re-trigger crop or just clear. 
      // For simplicity, let's clear the result so user re-confirms the crop for new resolution quality.
      if (processedAsset) {
        handleRemove();
        // Ideally we could keep the source file and just re-open modal, but we cleared input.
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition-colors duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-700 bg-slate-800/50">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-500/10 rounded-lg">
              <ImageIcon className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="font-semibold text-lg text-white">{definition.title}</h3>
          </div>
          {processedAsset && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{definition.description}</p>
        
        {/* Dimension Selector (if alternatives exist) */}
        {definition.alternatives && definition.alternatives.length > 0 && (
          <div className="bg-slate-900/50 p-2 rounded-lg flex flex-wrap gap-2 mb-2">
             <div className="w-full text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1 mb-1">
                <SlidersHorizontal className="w-3 h-3" /> Output Size
             </div>
             {/* Default Option */}
             <button
               onClick={() => toggleDimension(definition.width, definition.height)}
               className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                 activeDimension.w === definition.width 
                   ? 'bg-brand-600 text-white shadow-md' 
                   : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
               }`}
             >
               {definition.width} x {definition.height}
             </button>
             {/* Alternatives */}
             {definition.alternatives.map((alt) => (
               <button
                 key={alt.label}
                 onClick={() => toggleDimension(alt.width, alt.height)}
                 className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                   activeDimension.w === alt.width 
                     ? 'bg-brand-600 text-white shadow-md' 
                     : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
                 }`}
               >
                 {alt.width} x {alt.height}
               </button>
             ))}
          </div>
        )}

        {/* Current Requirement Display */}
        {!definition.alternatives && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono">
                {activeDimension.w}px × {activeDimension.h}px
            </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 flex flex-col items-center justify-center bg-slate-900/30 min-h-[240px] relative group">
        
        {processedAsset ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
             {/* Image Preview */}
             <div className="relative rounded-lg overflow-hidden border border-slate-600 shadow-2xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-800">
                <img 
                  src={processedAsset.previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-[200px] object-contain"
                />
             </div>
             <p className="mt-4 text-xs text-slate-500 font-mono">
               {(processedAsset.blob.size / 1024).toFixed(1)} KB • PNG
             </p>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-slate-800/50 transition-all duration-300 group-hover:scale-[0.98]"
          >
            <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:bg-brand-500/20 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-400 transition-colors" />
            </div>
            <span className="text-sm font-medium text-slate-300">Click to upload image</span>
            <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP</span>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Actions Footer */}
      <div className="p-5 border-t border-slate-700 bg-slate-800/50 flex gap-3">
        {processedAsset ? (
          <>
            <Button 
              variant="danger" 
              onClick={handleRemove} 
              className="flex-1"
              icon={<Trash2 className="w-4 h-4"/>}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              onClick={handleDownload} 
              className="flex-[2]"
              icon={<Download className="w-4 h-4"/>}
            >
              Download
            </Button>
          </>
        ) : (
          <Button 
            variant="secondary" 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            icon={<Upload className="w-4 h-4"/>}
          >
            Select Source Image
          </Button>
        )}
      </div>

      {/* Modal */}
      {showCropModal && selectedFile && (
        <CropModal
          imageSrc={selectedFile}
          aspectRatio={activeDimension.w / activeDimension.h}
          outputWidth={activeDimension.w}
          outputHeight={activeDimension.h}
          onClose={() => {
            setShowCropModal(false);
            setSelectedFile(null); // Reset selection
            if(fileInputRef.current) fileInputRef.current.value = '';
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};