import React, { useState, useEffect, useMemo } from 'react';
import { X, Trophy, Target, TrendingUp, Users, Clock, Share2, ArrowLeft, RotateCcw, Plus, Star } from 'lucide-react';
import { Meeple } from './Meeple';
import type { GameState } from '../types';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type ISourceOptions,
} from "@tsparticles/engine";
import { loadAll } from "@tsparticles/all";

interface EndGameModalProps {
  isOpen: boolean;
  playerWon?: boolean;
  onClose: () => void;
  onBackToGame: () => void;
  onRestartGame: () => void;
  onNewGame: () => void;
  gameState: GameState;
}

const scoreCategories = [
  { key: 'roads' as const, label: 'Roads', icon: '🛤️', color: 'text-blue-400' },
  { key: 'cities' as const, label: 'Cities', icon: '🏰', color: 'text-purple-400' },
  { key: 'monasteries' as const, label: 'Monst', icon: '⛪', color: 'text-green-400' },
  { key: 'fields' as const, label: 'Fields', icon: '🌾', color: 'text-yellow-400' },
  { key: 'other' as const, label: 'Any', icon: '➕', color: 'text-orange-400' }
];

export const EndGameModal: React.FC<EndGameModalProps> = ({ 
  isOpen, 
  playerWon,
  onClose, 
  onBackToGame,
  onRestartGame,
  onNewGame,
  gameState 
}) => {
  const [animationPhase, setAnimationPhase] = useState<'hidden' | 'visible'>('hidden');
  const [visibleStats, setVisibleStats] = useState<number>(0);
  const [particlesInit, setParticlesInit] = useState(false);

  // Check if this is a single player game
  const isSinglePlayer = gameState.players.length === 1;
  const singlePlayer = isSinglePlayer ? gameState.players[0] : null;

  // Initialize tsParticles engine with full features
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Load all features instead of slim to support advanced fireworks
      await loadAll(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);

  // Enhanced fireworks configuration - only for wins
  const fireworksOptions: ISourceOptions = useMemo(
    () => ({
      background: {
        opacity: 0
      },
      fpsLimit: 120,
      emitters: [
        {
          autoPlay: true,
          fill: true,
          life: {
            wait: false,
            duration: 0.1,
            delay: 0.1
          },
          rate: {
            delay: 0.15,
            quantity: 1
          },
          shape: "circle",
          startCount: 0,
          size: {
            mode: "percent",
            height: 0,
            width: 0
          },
          position: {
            x: 15,
            y: 100
          },
          particles: {
            move: {
              direction: "top",
              outModes: {
                top: "none",
                default: "destroy"
              }
            }
          }
        },
        {
          autoPlay: true,
          fill: true,
          life: {
            wait: false,
            duration: 0.1,
            delay: 0.3
          },
          rate: {
            delay: 0.15,
            quantity: 1
          },
          shape: "circle",
          startCount: 0,
          size: {
            mode: "percent",
            height: 0,
            width: 0
          },
          position: {
            x: 75,
            y: 100
          },
          particles: {
            move: {
              direction: "top",
              outModes: {
                top: "none",
                default: "destroy"
              }
            }
          }
        },
        {
          autoPlay: true,
          fill: true,
          life: {
            wait: false,
            duration: 0.1,
            delay: 0.5
          },
          rate: {
            delay: 0.15,
            quantity: 1
          },
          shape: "circle",
          startCount: 0,
          size: {
            mode: "percent",
            height: 0,
            width: 0
          },
          position: {
            x: 50,
            y: 100
          },
          particles: {
            move: {
              direction: "top",
              outModes: {
                top: "none",
                default: "destroy"
              }
            }
          }
        }
      ],
      particles: {
        color: {
          value: "#ffffff"
        },
        number: {
          value: 0
        },
        destroy: {
          bounds: {
            top: 10
          },
          mode: "split",
          split: {
            count: 1,
            factor: {
              value: 0.333333
            },
            rate: {
              value: 100
            },
            particles: {
              stroke: {
                width: 0
              },
              color: {
                value: isSinglePlayer && playerWon 
                  ? ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff4757", "#2ed573", "#3742fa", "#ffa502"]
                  : isSinglePlayer && !playerWon
                  ? ["#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"] // Muted colors for loss
                  : ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff4757", "#2ed573", "#3742fa", "#ffa502"]
              },
              number: {
                value: 0
              },
              collisions: {
                enable: false
              },
              destroy: {
                bounds: {
                  top: 0
                }
              },
              opacity: {
                value: {
                  min: 0.1,
                  max: 1
                },
                animation: {
                  enable: true,
                  speed: 0.7,
                  sync: false,
                  startValue: "max",
                  destroy: "min"
                }
              },
              shape: {
                type: "circle"
              },
              size: {
                value: 2,
                animation: {
                  enable: false
                }
              },
              life: {
                count: 1,
                duration: {
                  value: {
                    min: 1,
                    max: 2
                  }
                }
              },
              move: {
                enable: true,
                gravity: {
                  enable: true,
                  acceleration: 9.81,
                  inverse: false
                },
                decay: 0.1,
                speed: {
                  min: 10,
                  max: 25
                },
                direction: "outside",
                outModes: "destroy"
              }
            }
          }
        },
        life: {
          count: 1
        },
        shape: {
          type: "circle"
        },
        size: {
          value: 1
        },
        move: {
          enable: true,
          gravity: {
            acceleration: 15,
            enable: true,
            inverse: true,
            maxSpeed: 100
          },
          speed: {
            min: 10,
            max: 20
          },
          outModes: {
            default: "destroy",
            top: "none"
          }
        }
      }
    }),
    [isSinglePlayer, playerWon]
  );

  // Calculate winners (plural) and game stats for multiplayer
  const highestScore = Math.max(...gameState.players.map(p => p.totalScore));
  const winners = gameState.players.filter(p => p.totalScore === highestScore);
  const isTie = winners.length > 1;
  
  // Sort players: winners first, then others by score descending
  const sortedPlayers = [...gameState.players].sort((a, b) => {
    if (a.totalScore === highestScore && b.totalScore === highestScore) return 0;
    if (a.totalScore === highestScore) return -1;
    if (b.totalScore === highestScore) return 1;
    return b.totalScore - a.totalScore;
  });
  
  const nonWinners = sortedPlayers.filter(p => p.totalScore < highestScore);
  
  const gameStats = {
    totalTurns: Math.max(1, ...gameState.players.map(p => p.history.length)),
    highestSingleTurn: Math.max(0, ...gameState.players.flatMap(p => p.history.map(h => h.total))),
    averageScore: Math.round(gameState.players.reduce((sum, p) => sum + p.totalScore, 0) / gameState.players.length),
    totalPoints: gameState.players.reduce((sum, p) => sum + p.totalScore, 0),
    mostProductiveCategory: (() => {
      const categoryTotals = gameState.players.reduce((acc, player) => {
        player.history.forEach(entry => {
          acc.roads += entry.scores.roads || 0;
          acc.cities += entry.scores.cities || 0;
          acc.monasteries += entry.scores.monasteries || 0;
          acc.fields += entry.scores.fields || 0;
          acc.other += entry.scores.other || 0;
        });
        return acc;
      }, { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 });
      
      const categories = [
        { name: 'Roads', value: categoryTotals.roads, icon: '🛤️' },
        { name: 'Cities', value: categoryTotals.cities, icon: '🏰' },
        { name: 'Monasteries', value: categoryTotals.monasteries, icon: '⛪' },
        { name: 'Fields', value: categoryTotals.fields, icon: '🌾' },
        { name: 'Any', value: categoryTotals.other, icon: '➕' }
      ];
      
      return categories.reduce((prev, current) => current.value > prev.value ? current : prev);
    })()
  };

  // Calculate player breakdown for single player
  const singlePlayerBreakdown = singlePlayer ? {
    ...singlePlayer,
    breakdown: singlePlayer.history.reduce((acc, entry) => {
      acc.roads += entry.scores.roads || 0;
      acc.cities += entry.scores.cities || 0;
      acc.monasteries += entry.scores.monasteries || 0;
      acc.fields += entry.scores.fields || 0;
      acc.other += entry.scores.other || 0;
      return acc;
    }, { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 })
  } : null;

  // Calculate player breakdowns for multiplayer
  const playerBreakdowns = sortedPlayers.map((player) => {
    const breakdown = player.history.reduce((acc, entry) => {
      acc.roads += entry.scores.roads || 0;
      acc.cities += entry.scores.cities || 0;
      acc.monasteries += entry.scores.monasteries || 0;
      acc.fields += entry.scores.fields || 0;
      acc.other += entry.scores.other || 0;
      return acc;
    }, { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 });
    
    let position;
    if (player.totalScore === highestScore) {
      position = isTie ? 'T1' : '1';
    } else {
      const playersAhead = sortedPlayers.filter(p => p.totalScore > player.totalScore).length;
      position = (playersAhead + 1).toString();
    }
    
    return { ...player, breakdown, position };
  });

  useEffect(() => {
    if (isOpen) {
      // Start completely hidden
      setAnimationPhase('hidden');
      setVisibleStats(0);
      
      const timers = [
        // Everything starts together at the same time
        setTimeout(() => {
          setAnimationPhase('visible');
          setVisibleStats(4); // Show all stats at once
        }, 800),
      ];
      
      return () => timers.forEach(clearTimeout);
    } else {
      setAnimationPhase('hidden');
      setVisibleStats(0);
    }
  }, [isOpen]);

  const handleShare = async () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('endGame', 'true');
    
    if (!currentUrl.searchParams.has('game') && gameState.players.length > 0) {
      const gameStateData = {
        players: gameState.players,
        activePlayer: gameState.activePlayer,
        currentScores: gameState.currentScores,
        turn: gameState.turn
      };
      const encodedGameState = btoa(JSON.stringify(gameStateData));
      currentUrl.searchParams.set('game', encodedGameState);
    }   
    const shareUrl = currentUrl.toString();
    
    let shareText;
    if (isSinglePlayer) {
      shareText = playerWon 
        ? `${singlePlayer?.getPlayerName()} won their Carcassonne game with ${singlePlayer?.totalScore} points! 🏆`
        : `${singlePlayer?.getPlayerName()} played Carcassonne and scored ${singlePlayer?.totalScore} points! Good effort! 🎯`;
    } else {
      shareText = isTie 
        ? `Tie game! ${winners.map(w => w.getPlayerName()).join(' & ')} tied with ${highestScore} points!`
        : `${winners[0].getPlayerName()} won with ${highestScore} points!`;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Carcassonne Game Results',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch (clipErr) {
          console.log('Share and clipboard both failed');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (clipErr) {
        console.log('Clipboard failed');
      }
    }
  };

  if (!isOpen) return null;

  // Single Player Results Component
  const SinglePlayerResults = () => (
    <div className="p-6">
      <div className="text-center mb-8">
        {/* Result Icon */}
        <div className={`text-6xl mb-4 transition-all duration-1000 ${
          playerWon ? 'floating-crown' : 'gentle-sway'
        } ${animationPhase === 'visible' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          {playerWon ? '🏆' : '🎯'}
        </div>

        {/* Player Meeple */}
        <div className="relative mb-6">
          <div 
            className="w-20 h-20 mx-auto transition-all duration-1000 ease-out"
            style={{ 
              opacity: animationPhase === 'visible' ? 1 : 0,
              transform: animationPhase === 'visible' ? 'scale(1) translateY(0px)' : 'scale(0.75) translateY(32px)',
              transitionDelay: '0ms'
            }}
          >
            <div className={`w-full h-full ${playerWon ? 'dancing-winner' : 'gentle-sway'}`}
                 style={{ animationDelay: '1.0s' }}>
              <Meeple color={singlePlayer?.color || '#5B9BD5'} className="w-full h-full drop-shadow-2xl" />
            </div>
            
            {/* Floating Badge */}
            <div 
              className="absolute -top-3 -right-3 transition-all duration-1000 gentle-float"
              style={{ 
                opacity: animationPhase === 'visible' ? 1 : 0,
                transform: animationPhase === 'visible' ? 'scale(1)' : 'scale(0)',
                transitionDelay: '200ms'
              }}
            >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              playerWon 
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
            }`}>
              {playerWon ? (
                <Trophy size={20} className="text-yellow-900" />
              ) : (
                <Star size={20} className="text-white" />
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Result Text */}
        <div className={`space-y-3 transition-all duration-1000 ${
          animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '0ms' }}>
          <h3 className="text-3xl font-bold text-znr-text">
            {playerWon ? 'Victory!' : 'Great Effort!'}
          </h3>
          <div className="text-lg text-znr-text-muted">
            {singlePlayer?.getPlayerName()}
          </div>
          <div className="mb-4">
            <span className={`text-5xl font-bold bg-gradient-to-r ${
              playerWon 
                ? 'from-yellow-400 via-yellow-500 to-yellow-600' 
                : 'from-blue-400 via-purple-500 to-purple-600'
            } bg-clip-text text-transparent mr-2`}>
              {singlePlayer?.totalScore}
            </span>
            <span className="text-znr-text-muted text-xl">pts</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Multiplayer Results Component
  const MultiPlayerResults = () => (
    <div className="p-6">
      <div className="flex items-center justify-center gap-8 mb-6">
        {/* Non-winners - Left Side */}
        {nonWinners.length > 0 && (
          <div className="flex flex-col gap-4">
            {nonWinners.map((player) => {
              const playerData = playerBreakdowns.find(p => p.id === player.id);
              return (
                <div 
                  key={`non-winner-${player.id}`}
                  className={`flex items-center gap-3 transition-all duration-800 ease-out ${
                    animationPhase === 'visible' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                  }`}
                  style={{ 
                    transitionDelay: '0ms'
                  }}
                >
                  <div className="text-znr-text-muted font-bold text-lg min-w-[2rem] text-center">#{playerData?.position}</div>
                  <div className="w-8 h-8 flex-shrink-0">
                    <Meeple color={player.color} className="w-full h-full opacity-80" />
                  </div>
                  <div className="text-left">
                    <div className="text-znr-text text-base font-semibold">{player.name}</div>
                    <div className="text-znr-text-muted text-sm font-medium">{player.totalScore} pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Winners - Center */}
        <div className="text-center relative">
          {/* Crown(s) */}
          <div className={`text-5xl mb-1 transition-all duration-1000 floating-crown ${
            animationPhase === 'visible' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            {isTie ? '👑👑' : '👑'}
          </div>

          {/* Winner Meeples */}
          <div className="relative mb-0">
            {isTie ? (
              /* Multiple Winners Layout */
              <div 
                className="flex justify-center items-end gap-3 transition-all duration-1000 ease-out"
                style={{ 
                  opacity: animationPhase === 'visible' ? 1 : 0,
                  transform: animationPhase === 'visible' ? 'scale(1) translateY(0px)' : 'scale(0.75) translateY(32px)',
                  transitionDelay: '0ms'
                }}
              >
                {winners.map((winner, index) => (
                  <div key={winner.id} className="relative">
                    <div className={`w-16 h-16 dancing-winner`} 
                         style={{ animationDelay: `${1.0 + index * 0.2}s` }}>
                      <Meeple color={winner.color} className="w-full h-full drop-shadow-2xl" />
                    </div>
                    {/* Individual Trophy for each winner */}
                    <div 
                      className="absolute -top-2 -right-2 transition-all duration-1000 gentle-float"
                      style={{ 
                        opacity: animationPhase === 'visible' ? 1 : 0,
                        transform: animationPhase === 'visible' ? 'scale(1)' : 'scale(0)',
                        transitionDelay: '200ms'
                      }}
                    >
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <Trophy size={12} className="text-yellow-900" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              /* Single Winner Layout */
              <div 
                className={`w-18 h-18 mx-auto transition-all duration-1000 ease-out`}
                style={{ 
                  opacity: animationPhase === 'visible' ? 1 : 0,
                  transform: animationPhase === 'visible' ? 'scale(1) translateY(0px)' : 'scale(0.75) translateY(32px)',
                  transitionDelay: '0ms'
                }}
              >
                <div className="w-full h-full dancing-winner" style={{ animationDelay: '1.0s' }}>
                  <Meeple color={winners[0].color} className="w-full h-full drop-shadow-2xl" />
                </div>
                
                {/* Floating Trophy */}
                <div 
                  className={`absolute -top-3 -right-3 transition-all duration-1000 gentle-float`}
                  style={{ 
                    animationDelay: '1.0s',
                    opacity: animationPhase === 'visible' ? 1 : 0,
                    transform: animationPhase === 'visible' ? 'scale(1)' : 'scale(0)',
                    transitionDelay: '200ms'
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy size={16} className="text-yellow-900" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Winner Text */}
          <div className={`space-y-3 transition-all duration-1000 ${
            animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '0ms' }}>
            <h3 className="text-2xl font-bold text-znr-text">
              {isTie ? (
                winners.length === 2 ? 
                  `${winners[0].getPlayerName()} & ${winners[1].getPlayerName()} Tie!` :
                  `${winners.length}-Way Tie!`
              ) : (
                `${winners[0].name} Wins!`
              )}
            </h3>
            <div className="ml-4">
              <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mr-2">
                {highestScore}
              </span>
              <span className="text-znr-text-muted text-lg">pts</span>
            </div>
            {isTie && (
              <div className="text-sm text-znr-text-muted mt-2">
                Shared Victory in Carcassonne!
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Empty Space */}
        <div className="w-0 md:w-32 lg:w-48"></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[120] p-4">
      {/* tsParticles Fireworks Background - only for wins or multiplayer */}
      {particlesInit && animationPhase === 'visible' && (!isSinglePlayer || playerWon) && (
        <Particles
          id="fireworks"
          className="absolute inset-0 pointer-events-none"
          options={fireworksOptions}
        />
      )}
      
      <div className="bg-znr-secondary/95 backdrop-blur-xl border border-znr-border rounded-3xl w-full max-w-5xl max-h-[80vh] overflow-hidden shadow-2xl relative flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-znr-border bg-znr-secondary/80 backdrop-blur-sm">
          <button
            onClick={onBackToGame}
            className="flex items-center gap-2 px-4 py-2 bg-znr-tertiary hover:bg-znr-elevated rounded-xl text-znr-text transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Back to Game
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-znr-tertiary hover:bg-znr-elevated rounded-xl flex items-center justify-center text-znr-text-muted hover:text-znr-text transition-all duration-300"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-znr-tertiary hover:bg-znr-elevated rounded-xl flex items-center justify-center text-znr-text-muted hover:text-znr-text transition-all duration-300"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto znr-scroll-enhanced">
          {/* Results Section - Different for single vs multiplayer */}
          {isSinglePlayer ? <SinglePlayerResults /> : <MultiPlayerResults />}

          {/* Game Statistics Section */}
          <div className={`px-6 pb-6 transition-all duration-1000 ${
            animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '0ms' }}>
            <div className="bg-znr-tertiary/50 backdrop-blur-sm rounded-2xl p-6 border border-znr-border">
              <h4 className="text-xl font-semibold text-znr-text mb-4 flex items-center gap-3">
                <TrendingUp size={20} />
                {isSinglePlayer ? 'Your Game Stats' : 'Game Statistics'}
              </h4>
              
              {/* Overall Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: Clock, color: 'text-blue-400', value: gameStats.totalTurns, label: isSinglePlayer ? 'Turns Played' : 'Total Turns' },
                  { icon: Target, color: 'text-green-400', value: gameStats.highestSingleTurn, label: 'Best Turn' },
                  { icon: Users, color: 'text-purple-400', value: gameStats.averageScore, label: isSinglePlayer ? 'Final Score' : 'Avg Score' },
                  { icon: () => <span className="text-lg">{gameStats.mostProductiveCategory.icon}</span>, color: 'text-yellow-400', value: gameStats.mostProductiveCategory.value, label: gameStats.mostProductiveCategory.name }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center p-3 bg-znr-elevated/50 rounded-xl transition-all duration-800 ${
                      visibleStats > index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ 
                      transitionDelay: '0ms'
                    }}
                  >
                    <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-znr-text">{stat.value}</div>
                    <div className="text-znr-text-muted text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Player Breakdown - Single Player vs Multiplayer */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-znr-text mb-3">
                  {isSinglePlayer ? 'Score Breakdown' : 'Player Breakdowns'}
                </h5>
                
                {isSinglePlayer && singlePlayerBreakdown ? (
                  /* Single Player Breakdown */
                  <div className={`bg-znr-elevated/50 rounded-xl p-4 transition-all duration-800 ${
                    playerWon ? 'ring-2 ring-yellow-400/30 bg-yellow-500/5' : 'ring-2 ring-blue-400/30 bg-blue-500/5'
                  } ${visibleStats > 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: '0ms' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10">
                          <Meeple color={singlePlayerBreakdown.color} className="w-full h-full" />
                        </div>
                        <div>
                          <span className={`font-semibold text-lg ${
                            playerWon ? 'text-yellow-300' : 'text-blue-300'
                          }`}>
                            {singlePlayerBreakdown.name}
                            {playerWon && <span className="text-xs text-yellow-400 ml-2">🏆 VICTORY</span>}
                          </span>
                          <div className="text-znr-text-muted text-sm">{singlePlayerBreakdown.history.length} turns</div>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        playerWon ? 'text-yellow-300' : 'text-blue-300'
                      }`}>
                        {singlePlayerBreakdown.totalScore}
                      </div>
                    </div>
                    
                    {/* Category Breakdown */}
                    <div className="grid grid-cols-5 gap-2">
                      {scoreCategories.map(category => (
                        <div key={category.key} className="bg-znr-secondary/50 rounded-lg p-2 text-center">
                          <div className={`text-sm mb-1 ${category.color}`}>{category.icon}</div>
                          <div className="text-lg font-bold text-znr-text">{singlePlayerBreakdown.breakdown[category.key]}</div>
                          <div className="text-xs text-znr-text-muted">{category.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Multiplayer Breakdowns */
                  playerBreakdowns.map((player) => (
                    <div 
                      key={player.id} 
                      className={`bg-znr-elevated/50 rounded-xl p-4 transition-all duration-800 ${
                        visibleStats > 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      } ${player.totalScore === highestScore ? 'ring-2 ring-yellow-400/30 bg-yellow-500/5' : ''}`}
                      style={{ transitionDelay: '0ms' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`font-bold w-8 text-sm text-center ${
                            player.totalScore === highestScore ? 'text-yellow-400' : 'text-znr-text-muted'
                          }`}>
                            #{player.position}
                          </div>
                          <div className="w-8 h-8">
                            <Meeple color={player.color} className="w-full h-full" />
                          </div>
                          <div>
                            <span className={`font-semibold ${
                              player.totalScore === highestScore ? 'text-yellow-300' : 'text-znr-text'
                            }`}>
                              {player.name}
                              {player.totalScore === highestScore && (
                                <span className="text-xs text-yellow-400 ml-2">👑 WINNER</span>
                              )}
                            </span>
                            <div className="text-znr-text-muted text-xs">{player.history.length} turns</div>
                          </div>
                        </div>
                        <div className={`text-xl font-bold ${
                          player.totalScore === highestScore ? 'text-yellow-300' : 'text-znr-text'
                        }`}>
                          {player.totalScore}
                        </div>
                      </div>
                      
                      {/* Category Breakdown */}
                      <div className="grid grid-cols-5 gap-2">
                        {scoreCategories.map(category => (
                          <div key={category.key} className="bg-znr-secondary/50 rounded-lg p-2 text-center">
                            <div className={`text-sm mb-1 ${category.color}`}>{category.icon}</div>
                            <div className="text-lg font-bold text-znr-text">{player.breakdown[category.key]}</div>
                            <div className="text-xs text-znr-text-muted">{category.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`px-6 pb-6 transition-all duration-1000 ${
            animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '0ms' }}>
            <div className="bg-znr-tertiary/30 rounded-2xl p-4 border border-znr-border">
              <h5 className="text-lg font-semibold text-znr-text mb-3">What's Next?</h5>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={onRestartGame}
                  className="flex-1 min-w-48 flex items-center gap-3 p-3 pl-6 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-znr-text transition-all duration-300"
                >
                  <RotateCcw size={18} className="text-amber-400" />
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      {isSinglePlayer ? 'Play Again' : 'Restart Game'}
                    </div>
                    <div className="text-xs text-znr-text-muted">
                      {isSinglePlayer ? 'Same player, fresh start' : 'Same players, fresh scores'}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={onNewGame}
                  className="flex-1 min-w-48 flex items-center gap-3 p-3 pl-6 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl text-znr-text transition-all duration-300"
                >
                  <Plus size={18} className="text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium text-sm">New Game</div>
                    <div className="text-xs text-znr-text-muted">
                      {isSinglePlayer ? 'Change player or add more' : 'Setup new players'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};