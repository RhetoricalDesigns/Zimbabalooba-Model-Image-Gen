
import React from 'react';

export const POSES = [
  { id: 'shop-display', label: 'Shop Display', icon: 'fa-shop', description: 'Relaxed posture, slight side angle for a natural look' },
  { id: 'walking', label: 'Walking Motion', icon: 'fa-person-walking', description: 'Dynamic movement showing fabric drape' },
  { id: 'side-profile', label: 'Side Profile', icon: 'fa-user', description: 'Shows silhouette and side seams' },
  { id: 'back-view', label: 'Back View', icon: 'fa-user', description: 'Displays rear construction and pockets' },
  { id: 'sitting', label: 'Relaxed Sitting', icon: 'fa-chair', description: 'Casual lifestyle context' },
  { id: 'crouching', label: 'Urban Crouch', icon: 'fa-child-reaching', description: 'Modern street-style aesthetic' },
];

export const BACKGROUNDS = [
  { id: 'clean', label: 'Clean', icon: 'fa-border-none', description: 'Minimalist studio setup with soft shadows' },
  { id: 'urban', label: 'Urban', icon: 'fa-city', description: 'Modern city street, concrete and glass' },
  { id: 'outdoors', label: 'Outdoors', icon: 'fa-tree', description: 'Natural daylight in a park or garden' },
  { id: 'active', label: 'Active', icon: 'fa-bolt', description: 'Dynamic sports court or gym environment' },
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square (1:1)' },
  { id: '3:4', label: 'Portrait (3:4)' },
  { id: '4:3', label: 'Landscape (4:3)' },
  { id: '9:16', label: 'Story (9:16)' },
  { id: '16:9', label: 'Wide (16:9)' },
];

export const MODEL_SHOT_PROMPT = (config: { modelType: string, pose: string, background: string }) => {
  let envDescription = '';
  switch (config.background) {
    case 'Urban':
      envDescription = 'A stylish urban city street at golden hour, featuring concrete textures, modern architecture in the background, and natural city lighting.';
      break;
    case 'Outdoors':
      envDescription = 'A serene outdoor setting with natural daylight, soft greenery or a park path in the blurred background, creating a high-end lifestyle look.';
      break;
    case 'Active':
      envDescription = 'A dynamic sports environment, like a modern basketball court or an upscale gym with professional athletic lighting and clean industrial details.';
      break;
    default:
      envDescription = 'A professional photo studio with a clean white floor and a clean white wall, featuring a subtle horizon line and soft studio lighting.';
  }

  return `
    High-end professional photography.
    Subject: A ${config.modelType} model wearing the exact pants from the uploaded image.
    Pose: The model is in a ${config.pose === 'Shop Display' ? 'relaxed, natural posture, standing at a slight 3/4 side angle' : config.pose} position.
    Environment: ${envDescription}
    Environmental Details: 
    - Realistic lighting creating soft, high-end shadows on the ground.
    - Professional depth of field with the model in sharp focus.
    Aesthetics:
    - Full body or lower body framing including hips, legs, and feet.
    - Model is wearing generic, high-fashion footwear that perfectly complements the ${config.background} theme and the pants.
    - CRITICAL: Perfectly preserve the color, texture, material, pattern, and unique details of the original pants provided in the image.
    - The fabric should drape, fold, and wrinkle naturally based on the ${config.pose} pose and ${config.background} context.
    - Ensure a clean interaction between the pants hem and the shoes or ground.
    - Resolution: Sharp, commercial-grade quality, clean edges, zero artifacts.
  `;
};
