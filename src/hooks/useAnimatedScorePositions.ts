import { useState, useEffect, useRef, useCallback } from 'react';
import { useScorePositions } from './useScorePositions';
import type { Player } from '../types';

interface AnimatedPosition {
  x: number;
  y: number;
  currentScore: number;
}

interface AnimationState {
  startTime: number;
  duration: number;
  startPosition: { x: number; y: number };
  path: { x: number; y: number; score: number }[];
  currentPathIndex: number;
}

export const useAnimatedScorePositions = (players: Player[]) => {
  const { getScorePosition } = useScorePositions();
  const [animatedPositions, setAnimatedPositions] = useState<Map<number, AnimatedPosition>>(new Map());
  const animationStates = useRef<Map<number, AnimationState>>(new Map());
  const animationFrameRefs = useRef<Map<number, number>>(new Map());
  const previousScores = useRef<Map<number, number>>(new Map());
  const isInitialized = useRef(false);

  // Easing function for smooth animation with personality
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Create a smooth path between score positions
  const createPath = useCallback((fromScore: number, toScore: number) => {
    const path: { x: number; y: number; score: number }[] = [];
    const distance = Math.abs(toScore - fromScore);
    
    // Handle the case where we're going backwards (like restarting)
    const isDecreasing = toScore < fromScore;
    
    // For small distances, use more points for smoothness
    // For large distances, use fewer points but still smooth
    const pathPoints = Math.min(Math.max(distance * 2, 10), 50);
    
    for (let i = 0; i <= pathPoints; i++) {
      const progress = i / pathPoints;
      const score = isDecreasing 
        ? fromScore - (distance * progress)
        : fromScore + (distance * progress);
      
      const position = getScorePosition(Math.max(0, score)); // Ensure score doesn't go below 0
      path.push({ x: position.x, y: position.y, score: Math.max(0, score) });
    }
    
    // Ensure we always have at least start and end points
    if (path.length === 0) {
      const startPos = getScorePosition(fromScore);
      const endPos = getScorePosition(toScore);
      path.push({ x: startPos.x, y: startPos.y, score: fromScore });
      path.push({ x: endPos.x, y: endPos.y, score: toScore });
    }
    
    return path;
  }, [getScorePosition]);

  // Calculate dynamic duration based on distance
  const calculateDuration = (distance: number): number => {
    // Base duration for small moves
    const baseDuration = 400; // ms
    
    // Scale factor - larger moves get proportionally faster
    const scaleFactor = Math.log(distance + 1) * 500;
    
    // Cap the maximum duration to prevent overly long animations
    return Math.min(baseDuration + scaleFactor, 7000);
  };

  // Initialize positions for players on first load or new players
  useEffect(() => {
    let hasChanges = false;
    const newPositions = new Map(animatedPositions);
    
    players.forEach(player => {
      if (!newPositions.has(player.id)) {
        const position = getScorePosition(player.totalScore);
        newPositions.set(player.id, {
          x: position.x,
          y: position.y,
          currentScore: player.totalScore
        });
        previousScores.current.set(player.id, player.totalScore);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setAnimatedPositions(newPositions);
    }
    
    isInitialized.current = true;
  }, [players.length, getScorePosition]);

  // Handle score changes with animation
  useEffect(() => {
    if (!isInitialized.current) return;

    players.forEach(player => {
      const previousScore = previousScores.current.get(player.id);
      
      if (previousScore !== undefined && previousScore !== player.totalScore) {
        const currentAnimatedPos = animatedPositions.get(player.id);
        if (currentAnimatedPos) {
          animateToScore(player.id, currentAnimatedPos.currentScore, player.totalScore);
          previousScores.current.set(player.id, player.totalScore);
        }
      } else if (previousScore === undefined) {
        previousScores.current.set(player.id, player.totalScore);
      }
    });
  }, [players.map(p => `${p.id}:${p.totalScore}`).join(',')]);

  const animateToScore = useCallback((playerId: number, fromScore: number, toScore: number) => {
    // Cancel any existing animation
    const existingAnimationId = animationFrameRefs.current.get(playerId);
    if (existingAnimationId) {
      cancelAnimationFrame(existingAnimationId);
    }

    const distance = Math.abs(toScore - fromScore);
    if (distance === 0) return;

    const duration = calculateDuration(distance);
    const path = createPath(fromScore, toScore);
    const startPosition = getScorePosition(fromScore);
    
    // Validate path before proceeding
    if (!path || path.length < 2) {
      console.warn('Invalid path generated for animation');
      // Jump directly to target position
      const finalPosition = getScorePosition(toScore);
      setAnimatedPositions(prev => {
        const newPositions = new Map(prev);
        newPositions.set(playerId, {
          x: finalPosition.x,
          y: finalPosition.y,
          currentScore: toScore
        });
        return newPositions;
      });
      return;
    }
    
    const animationState: AnimationState = {
      startTime: Date.now(),
      duration,
      startPosition,
      path,
      currentPathIndex: 0
    };
    
    animationStates.current.set(playerId, animationState);
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - animationState.startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing for smooth, natural movement
      const easedProgress = easeOutCubic(progress);
      
      // Find the current position along the path with bounds checking
      const pathIndex = Math.min(Math.floor(easedProgress * (path.length - 1)), path.length - 2);
      const nextIndex = Math.min(pathIndex + 1, path.length - 1);
      
      // Get path points with null checks
      const currentPoint = path[pathIndex];
      const nextPoint = path[nextIndex];
      
      if (!currentPoint || !nextPoint) {
        console.warn('Invalid path points during animation');
        // Jump to final position
        const finalPosition = getScorePosition(toScore);
        setAnimatedPositions(prev => {
          const newPositions = new Map(prev);
          newPositions.set(playerId, {
            x: finalPosition.x,
            y: finalPosition.y,
            currentScore: toScore
          });
          return newPositions;
        });
        animationFrameRefs.current.delete(playerId);
        animationStates.current.delete(playerId);
        return;
      }
      
      // Interpolate between path points for extra smoothness
      const segmentProgress = (easedProgress * (path.length - 1)) - pathIndex;
      const interpolatedX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
      const interpolatedY = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress;
      const interpolatedScore = currentPoint.score + (nextPoint.score - currentPoint.score) * segmentProgress;
      
      // Update position
      setAnimatedPositions(prev => {
        const newPositions = new Map(prev);
        const existing = newPositions.get(playerId);
        if (existing) {
          newPositions.set(playerId, {
            x: interpolatedX,
            y: interpolatedY,
            currentScore: interpolatedScore
          });
        }
        return newPositions;
      });
      
      // Continue animation if not complete
      if (progress < 1) {
        const animationId = requestAnimationFrame(animate);
        animationFrameRefs.current.set(playerId, animationId);
      } else {
        // Ensure we end exactly at the target
        const finalPosition = getScorePosition(toScore);
        setAnimatedPositions(prev => {
          const newPositions = new Map(prev);
          newPositions.set(playerId, {
            x: finalPosition.x,
            y: finalPosition.y,
            currentScore: toScore
          });
          return newPositions;
        });
        
        animationFrameRefs.current.delete(playerId);
        animationStates.current.delete(playerId);
      }
    };
    
    animate();
  }, [getScorePosition, createPath]);

  const getAnimatedPosition = useCallback((playerId: number) => {
    const animatedPos = animatedPositions.get(playerId);
    if (animatedPos) {
      return { x: animatedPos.x, y: animatedPos.y };
    }
    
    // Fallback to calculated position
    const player = players.find(p => p.id === playerId);
    if (player) {
      return getScorePosition(player.totalScore);
    }
    
    return { x: 0, y: 0 };
  }, [animatedPositions, players, getScorePosition]);

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      animationFrameRefs.current.forEach(animationId => {
        cancelAnimationFrame(animationId);
      });
      animationFrameRefs.current.clear();
      animationStates.current.clear();
    };
  }, []);

  return { getAnimatedPosition };
};