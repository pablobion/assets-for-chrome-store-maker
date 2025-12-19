import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { PixelCrop } from '../types';
import { Button } from './Button';
import { X, Check, ZoomIn, RotateCw } from 'lucide-react';
import getCroppedImg from '../utils/canvasUtils';

interface CropModalProps {
  imageSrc: string;
  aspectRatio: number;
  outputWidth: number;
  outputHeight: number;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  imageSrc,
  aspectRatio,
  outputWidth,
  outputHeight,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: PixelCrop) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        outputWidth,
        outputHeight
      );
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] md:h-[800px] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit & Crop</h3>
            <p className="text-xs text-slate-400">Target Output: {outputWidth}px x {outputHeight}px</p>
          </div>
          <Button variant="ghost" onClick={onClose} size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-slate-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            classes={{
              containerClassName: "h-full w-full",
              mediaClassName: "",
              cropAreaClassName: "border-2 border-brand-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
            }}
          />
        </div>

        {/* Controls Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Zoom</span>
                <span>{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> Rotate</span>
                <span>{rotation}°</span>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              disabled={isProcessing}
              icon={isProcessing ? undefined : <Check className="w-4 h-4" />}
            >
              {isProcessing ? 'Processing...' : 'Apply Crop'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};