
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Pant Image (Flat-lay or Product Shot)
      </label>
      <div 
        className={`relative group border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 h-64 flex flex-col items-center justify-center cursor-pointer
          ${selectedImage ? 'border-transparent' : 'border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />
        
        {selectedImage ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img src={selectedImage} alt="Uploaded pants" className="max-h-full object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm font-medium">
                Change Image
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
            </div>
            <p className="text-gray-600 font-medium">Click to upload or drag & drop</p>
            <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
