import { useDimensions } from './useDimensions';

export const useScorePositions = () => {
  const { windowDimensions } = useDimensions();

  const getScorePosition = (score: number): { x: number; y: number } => {
    const position = score % 100;
    const { width, height } = windowDimensions;
    
    // Border dimensions (matching the CSS)
    const borderWidth = window.innerWidth >= 768 ? 24 : 24; // 6 * 4px = 24px for w-6
    const borderHeight = window.innerWidth >= 768 ? 32 : 32; // 8 * 4px = 32px for h-8
    
    // Calculate the available track area
    const trackStartX = borderWidth;
    const trackEndX = width - borderWidth;
    const trackStartY = borderHeight;
    const trackEndY = height - borderHeight;
    
    const trackWidth = trackEndX - trackStartX;
    const trackHeight = trackEndY - trackStartY;
    
    // Distribute 100 positions around the perimeter
    const segment = position / 100;
    
    if (segment <= 0.25) {
      // Top edge (0-25)
      const progress = segment * 4;
      return { 
        x: trackStartX + (progress * trackWidth),
        y: borderHeight / 2
      };
    } else if (segment <= 0.5) {
      // Right edge (25-50)
      const progress = (segment - 0.25) * 4;
      return { 
        x: width - (borderWidth / 2),
        y: trackStartY + (progress * trackHeight)
      };
    } else if (segment <= 0.75) {
      // Bottom edge (50-75)
      const progress = (segment - 0.5) * 4;
      return { 
        x: trackEndX - (progress * trackWidth),
        y: height - (borderHeight / 2)
      };
    } else {
      // Left edge (75-100)
      const progress = (segment - 0.75) * 4;
      return { 
        x: borderWidth / 2,
        y: trackEndY - (progress * trackHeight)
      };
    }
  };

  return { getScorePosition };
};