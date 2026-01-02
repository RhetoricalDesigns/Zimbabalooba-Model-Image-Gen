
import React from 'react';
import { FittingConfig, ModelType } from '../types';
import { POSES, BACKGROUNDS, ASPECT_RATIOS, RACES } from '../constants';

interface FittingControlsProps {
  config: FittingConfig;
  onChange: (config: FittingConfig) => void;
}

const FittingControls: React.FC<FittingControlsProps> = ({ config, onChange }) => {
  const updateConfig = (key: keyof FittingConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Model Gender/Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Model Preference</label>
        <div className="grid grid-cols-3 gap-2">
          {(['male', 'female', 'unisex'] as ModelType[]).map((type) => (
            <button
              key={type}
              onClick={() => updateConfig('modelType', type)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize border-2 transition-all
                ${config.modelType === type 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Model Ethnicity/Race */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Model Ethnicity</label>
        <div className="flex flex-wrap gap-2">
          {RACES.map((race) => (
            <button
              key={race.id}
              onClick={() => updateConfig('modelRace', race.label)}
              className={`px-3 py-2 rounded-xl text-[10px] font-bold border-2 transition-all
                ${config.modelRace === race.label 
                  ? 'border-indigo-600 bg-indigo-600 text-white' 
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
              `}
            >
              {race.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Background Scene</label>
        <div className="grid grid-cols-2 gap-2">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => updateConfig('background', bg.label)}
              className={`flex items-center p-3 rounded-xl border-2 transition-all text-left group
                ${config.background === bg.label 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-gray-50 bg-white hover:border-indigo-100'}
              `}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors
                ${config.background === bg.label ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:text-indigo-400'}`}
              >
                <i className={`fa-solid ${bg.icon} text-xs`}></i>
              </div>
              <span className={`text-xs font-bold ${config.background === bg.label ? 'text-indigo-900' : 'text-gray-700'}`}>
                {bg.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Canvas Aspect Ratio</label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => updateConfig('aspectRatio', ratio.id)}
              className={`px-3 py-2 rounded-xl text-[10px] font-bold border-2 transition-all
                ${config.aspectRatio === ratio.id 
                  ? 'border-indigo-600 bg-indigo-600 text-white' 
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
              `}
            >
              {ratio.id}
            </button>
          ))}
        </div>
      </div>

      {/* Pose Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Model Pose</label>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {POSES.map((pose) => (
            <button
              key={pose.id}
              onClick={() => updateConfig('pose', pose.label)}
              className={`flex items-center w-full p-3 rounded-2xl border-2 transition-all text-left group
                ${config.pose === pose.label 
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                  : 'border-gray-50 bg-white hover:border-indigo-100 hover:bg-indigo-50/30'}
              `}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-4 transition-colors
                ${config.pose === pose.label ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:text-indigo-400'}`}
              >
                <i className={`fa-solid ${pose.icon} text-sm`}></i>
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold ${config.pose === pose.label ? 'text-indigo-900' : 'text-gray-700'}`}>
                  {pose.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{pose.description}</p>
              </div>
              {config.pose === pose.label && (
                <div className="text-indigo-600 ml-2">
                  <i className="fa-solid fa-circle-check text-xs"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d0d0d0;
        }
      `}</style>
    </div>
  );
};

export default FittingControls;
