export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AssetDefinition {
  id: string;
  title: string;
  description: string;
  width: number;
  height: number;
  aspectRatio: number; // width / height
  alternatives?: { label: string; width: number; height: number }[];
}

export interface ProcessedAsset {
  id: string;
  blob: Blob;
  previewUrl: string;
  fileName: string;
  width: number;
  height: number;
}