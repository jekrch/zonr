import { useDimensions } from './useDimensions';

export const useScorePositions = () => {
  const { windowDimensions } = useDimensions();

  const getScorePosition = (score: number): { x: number; y: number } => {
    // Validate inputs
    if (typeof score !== 'number' || isNaN(score)) {
      console.warn('Invalid score provided to getScorePosition:', score);
      return { x: 0, y: 0 };
    }

    const { width, height } = windowDimensions;
    
    // Return safe fallback if dimensions aren't ready
    if (!width || !height || width <= 0 || height <= 0) {
      return { x: 0, y: 0 };
    }

    const position = score % 100;
    
    // Border dimensions (matching the CSS)
    const borderWidth = 24; // w-6 = 24px
    const borderHeight = 32; // h-8 = 32px
    
    // Validate border dimensions make sense
    if (borderWidth >= width / 2 || borderHeight >= height / 2) {
      console.warn('Border dimensions too large for window size');
      return { x: width / 2, y: height / 2 };
    }
    
    // Calculate the available track area
    const trackStartX = borderWidth;
    const trackEndX = width - borderWidth;
    const trackStartY = borderHeight;
    const trackEndY = height - borderHeight;
    
    const trackWidth = trackEndX - trackStartX;
    const trackHeight = trackEndY - trackStartY;
    
    // Ensure track dimensions are positive
    if (trackWidth <= 0 || trackHeight <= 0) {
      console.warn('Invalid track dimensions:', { trackWidth, trackHeight });
      return { x: width / 2, y: height / 2 };
    }
    
    // Distribute 100 positions around the perimeter
    const segment = position / 100;
    
    try {
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
    } catch (error) {
      console.error('Error calculating score position:', error);
      return { x: width / 2, y: height / 2 };
    }
  };

  return { getScorePosition };
};