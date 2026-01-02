
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import FittingControls from './components/FittingControls';
import { generateModelFit } from './services/geminiService';
import { FittingConfig, GenerationState } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [fittingConfig, setFittingConfig] = useState<FittingConfig>({
    modelType: 'female',
    pose: 'Shop Display',
    background: 'Clean',
    aspectRatio: '3:4'
  });
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultUrl: null,
  });

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setState({ isGenerating: true, error: null, resultUrl: null });
    setIsImageLoading(false);

    try {
      const result = await generateModelFit(selectedImage, fittingConfig);
      setState({ isGenerating: false, error: null, resultUrl: result });
      setIsImageLoading(true);
    } catch (err: any) {
      console.error("App Generate Error:", err);
      if (err.message === "PERMISSION_ISSUE") {
        setState({ 
          isGenerating: false, 
          error: "Permission denied. Please ensure your environment has a valid API key with access to the Gemini 2.5 Flash Image model.", 
          resultUrl: null 
        });
      } else {
        setState({ isGenerating: false, error: err.message, resultUrl: null });
      }
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setState(prev => ({ ...prev, error: "The generated image failed to display. This can happen if the base64 data is corrupt or restricted by the browser." }));
  };

  const reset = () => {
    setState({ isGenerating: false, error: null, resultUrl: null });
    setSelectedImage(null);
    setIsImageLoading(false);
  };

  const downloadImage = () => {
    if (!state.resultUrl) return;
    const link = document.createElement('a');
    link.href = state.resultUrl;
    link.download = `fashion-fit-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-inter">
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
              <i className="fa-solid fa-shirt text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">AI Fashion Fit</h1>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Professional Virtual Fitting</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-[10px] font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Studio Ready
             </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                <i className="fa-solid fa-upload text-sm"></i>
              </span>
              Upload Garment
            </h2>
            <ImageUploader 
              onImageSelected={setSelectedImage} 
              selectedImage={selectedImage} 
            />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                <i className="fa-solid fa-wand-sparkles text-sm"></i>
              </span>
              Studio Options
            </h2>
            <FittingControls 
              config={fittingConfig} 
              onChange={setFittingConfig} 
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedImage || state.isGenerating}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl transition-all transform active:scale-95
              ${!selectedImage || state.isGenerating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
              }
            `}
          >
            {state.isGenerating ? (
              <span className="flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin mr-3"></i>
                Rendering Model...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fa-solid fa-sparkles mr-3"></i>
                Generate Model Shot
              </span>
            )}
          </button>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm h-full min-h-[650px] flex flex-col overflow-hidden relative">
            <div className="border-b border-gray-50 p-6 flex items-center justify-between bg-white z-10">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-gray-900">Result Canvas</h2>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold">{fittingConfig.aspectRatio} Aspect Ratio</span>
              </div>
              {state.resultUrl && !state.isGenerating && (
                <div className="flex space-x-2">
                  <button 
                    onClick={downloadImage}
                    className="w-10 h-10 flex items-center justify-center hover:bg-indigo-50 rounded-xl text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
                    title="Download High-Res"
                  >
                    <i className="fa-solid fa-download"></i>
                  </button>
                  <button 
                    onClick={reset}
                    className="w-10 h-10 flex items-center justify-center hover:bg-rose-50 rounded-xl text-rose-500 transition-colors border border-transparent hover:border-rose-100"
                    title="Clear Result"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative flex items-center justify-center bg-[#F1F3F6] p-4 md:p-12 overflow-hidden">
              {/* Empty State */}
              {!state.resultUrl && !state.isGenerating && !state.error && (
                <div className="text-center max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <i className="fa-solid fa-image text-gray-200 text-3xl"></i>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2">Ready for Fitting</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Upload your pants to see them fitted on a model in a professional {fittingConfig.background.toLowerCase()} environment.
                  </p>
                </div>
              )}

              {/* Generating Loader */}
              {state.isGenerating && (
                <div className="text-center z-10">
                  <div className="mb-8 relative flex justify-center">
                    <div className="w-24 h-24 border-[6px] border-indigo-100 rounded-full"></div>
                    <div className="absolute top-0 w-24 h-24 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-shirt text-indigo-600 text-2xl animate-pulse"></i>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Simulating Drape...</h3>
                  <p className="text-gray-400 text-sm max-w-[200px] mx-auto">
                    Matching fabric textures with {fittingConfig.background.toLowerCase()} lighting.
                  </p>
                </div>
              )}

              {/* Error State */}
              {state.error && (
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md text-center border border-rose-100 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-circle-exclamation text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Generation Failed</h3>
                  <p className="text-gray-400 mb-8 text-sm leading-relaxed">{state.error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="bg-gray-900 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Result Display */}
              {state.resultUrl && (
                <div className={`w-full h-full relative flex items-center justify-center transition-all duration-1000 ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                   {isImageLoading && (
                     <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#F1F3F6]">
                        <i className="fa-solid fa-circle-notch fa-spin text-indigo-600 text-3xl"></i>
                     </div>
                   )}
                   <div className="relative group max-h-full flex items-center justify-center">
                    <img 
                      src={state.resultUrl} 
                      alt="Generated fashion shot" 
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-white ring-1 ring-black/5"
                    />
                    {!isImageLoading && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                         <span className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl text-white text-[10px] uppercase tracking-widest font-bold border border-white/20 shadow-2xl whitespace-nowrap">
                          {fittingConfig.background} Studio Fit
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest mb-1">Powered by Google Gemini 2.5</p>
          <p className="text-gray-400 text-xs">AI Fashion Virtual Fitting Room • Dynamic Context Visualization</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
