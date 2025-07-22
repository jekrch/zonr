import React, { useState, useEffect, useMemo } from 'react';
import { X, Trophy, Target, TrendingUp, Users, Clock, Share2, ArrowLeft, RotateCcw, Plus } from 'lucide-react';
import { Meeple } from './Meeple';
import type { GameState } from '../types';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type ISourceOptions,
} from "@tsparticles/engine";
import { loadAll } from "@tsparticles/all";

interface EndGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToGame: () => void;
  onRestartGame: () => void;
  onNewGame: () => void;
  gameState: GameState;
}

const scoreCategories = [
  { key: 'roads' as const, label: 'Roads', icon: '🛤️', color: 'text-blue-400' },
  { key: 'cities' as const, label: 'Cities', icon: '🏰', color: 'text-purple-400' },
  { key: 'monasteries' as const, label: 'Mnsts', icon: '⛪', color: 'text-green-400' },
  { key: 'fields' as const, label: 'Fields', icon: '🌾', color: 'text-yellow-400' }
];

export const EndGameModal: React.FC<EndGameModalProps> = ({ 
  isOpen, 
  onClose, 
  onBackToGame,
  onRestartGame,
  onNewGame,
  gameState 
}) => {
  const [animationPhase, setAnimationPhase] = useState<'hidden' | 'visible'>('hidden');
  const [visibleStats, setVisibleStats] = useState<number>(0);
  const [particlesInit, setParticlesInit] = useState(false);

  // Initialize tsParticles engine with full features
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Load all features instead of slim to support advanced fireworks
      await loadAll(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);


  // Enhanced fireworks configuration based on the CodePen example
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
                value: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff4757", "#2ed573", "#3742fa", "#ffa502"]
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
    []
  );

  // Calculate winner and game stats
  const winner = gameState.players.reduce((prev, current) => 
    current.totalScore > prev.totalScore ? current : prev
  );
  
  const sortedPlayers = [...gameState.players].sort((a, b) => b.totalScore - a.totalScore);
  
  // Get all losing players (everyone except the winner)
  const losingPlayers = sortedPlayers.slice(1);
  
  const gameStats = {
    totalTurns: Math.max(1, ...gameState.players.map(p => p.history.length)),
    highestSingleTurn: Math.max(0, ...gameState.players.flatMap(p => p.history.map(h => h.total))),
    averageScore: Math.round(gameState.players.reduce((sum, p) => sum + p.totalScore, 0) / gameState.players.length),
    totalPoints: gameState.players.reduce((sum, p) => sum + p.totalScore, 0),
    mostProductiveCategory: (() => {
      const categoryTotals = gameState.players.reduce((acc, player) => {
        player.history.forEach(entry => {
          acc.roads += entry.scores.roads;
          acc.cities += entry.scores.cities;
          acc.monasteries += entry.scores.monasteries;
          acc.fields += entry.scores.fields;
        });
        return acc;
      }, { roads: 0, cities: 0, monasteries: 0, fields: 0 });
      
      const categories = [
        { name: 'Roads', value: categoryTotals.roads, icon: '🛤️' },
        { name: 'Cities', value: categoryTotals.cities, icon: '🏰' },
        { name: 'Monasteries', value: categoryTotals.monasteries, icon: '⛪' },
        { name: 'Fields', value: categoryTotals.fields, icon: '🌾' }
      ];
      
      return categories.reduce((prev, current) => current.value > prev.value ? current : prev);
    })()
  };

  // Calculate individual player breakdowns
  const playerBreakdowns = sortedPlayers.map(player => {
    const breakdown = player.history.reduce((acc, entry) => {
      acc.roads += entry.scores.roads;
      acc.cities += entry.scores.cities;
      acc.monasteries += entry.scores.monasteries;
      acc.fields += entry.scores.fields;
      return acc;
    }, { roads: 0, cities: 0, monasteries: 0, fields: 0 });
    
    return { ...player, breakdown };
  });

  useEffect(() => {
    if (isOpen) {
      setAnimationPhase('hidden');
      setVisibleStats(0);
      
      const timers = [
        setTimeout(() => setAnimationPhase('visible'), 300),
        setTimeout(() => setVisibleStats(1), 1000),
        setTimeout(() => setVisibleStats(2), 1200),
        setTimeout(() => setVisibleStats(3), 1400),
        setTimeout(() => setVisibleStats(4), 1600),
      ];
      
      return () => timers.forEach(clearTimeout);
    } else {
      setAnimationPhase('hidden');
      setVisibleStats(0);
    }
  }, [isOpen]);

const handleShare = async () => {
    // Get the current URL parameters
    const currentUrl = new URL(window.location.href);
    
    // Set the endGame parameter to true
    currentUrl.searchParams.set('endGame', 'true');
    
    // If there's no game parameter but we have a gameState, we need to encode it
    if (!currentUrl.searchParams.has('game') && gameState.players.length > 0) {
      // Encode the current game state
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
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Carcassonne Game Results',
          text: `${winner.getPlayerName()} won with ${winner.totalScore} points!`,
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

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[120] p-4">
      {/* tsParticles Fireworks Background */}
      {particlesInit && animationPhase === 'visible' && (
        <Particles
          id="fireworks"
          //particlesLoaded={particlesLoaded}
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
          {/* Compact Winner Celebration Section */}
          <div className="p-6">
            <div className="flex items-center justify-center gap-12 mb-6">
              {/* Losing Players - Left Side Only */}
              <div className="flex flex-col gap-4">
                {losingPlayers.map((player, index) => (
                  <div 
                    key={`losing-${player.id}`}
                    className={`flex items-center gap-3 transition-all duration-700 gentle-sway ${
                      animationPhase === 'visible' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`}
                    style={{ 
                      transitionDelay: `${index * 200 + 500}ms`,
                      animationDelay: `${index * 0.5}s`
                    }}
                  >
                    <div className="text-znr-text-muted font-bold text-lg min-w-[2rem] text-center">#{index + 2}</div>
                    <div className="w-8 h-8 flex-shrink-0">
                      <Meeple color={player.color} className="w-full h-full opacity-80" />
                    </div>
                    <div className="text-left">
                      <div className="text-znr-text text-base font-semibold">{player.name}</div>
                      <div className="text-znr-text-muted text-sm font-medium">{player.totalScore} pts</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Winner - Center */}
              <div className="text-center relative">
                {/* Floating Crown */}
                <div className={`text-5xl mb-1 transition-all duration-1000 floating-crown ${
                  animationPhase === 'visible' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}>
                  👑
                </div>

                {/* Dancing Winner Meeple */}
                <div className="relative mb-0">
                  <div className={`w-18 h-18 mx-auto transition-all duration-1000 dancing-winner ${
                    animationPhase === 'visible' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>
                    <Meeple color={winner.color} className="w-full h-full drop-shadow-2xl" />
                  </div>
                  
                  {/* Floating Trophy */}
                  <div className={`absolute -top-3 -right-3 transition-all duration-1000 gentle-float ${
                    animationPhase === 'visible' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`} style={{ animationDelay: '0.5s' }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <Trophy size={16} className="text-yellow-900" />
                    </div>
                  </div>
                </div>

                {/* Winner Text */}
                <div className={`space-y-3 transition-all duration-1000 ${
                  animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`} style={{ transitionDelay: '300ms' }}>
                  <h3 className="text-4xl font-bold text-znr-text">
                    {winner.name} Wins!
                  </h3>
                  <div className="ml-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mr-2">
                    {winner.totalScore}
                  </span>
                  <span className="text-znr-text-muted text-lg">pts</span>
                </div>
                </div>
              </div>

              {/* Right Side - Empty Space (or could add decorative elements) */}
              <div className="w-0 md:w-32 lg:w-48">
                {/* This space remains empty to balance the layout */}
              </div>
            </div>
          </div>

          {/* Game Statistics Section */}
          <div className={`px-6 pb-6 transition-all duration-1000 ${
            animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '800ms' }}>
            <div className="bg-znr-tertiary/50 backdrop-blur-sm rounded-2xl p-6 border border-znr-border">
              <h4 className="text-xl font-semibold text-znr-text mb-4 flex items-center gap-3">
                <TrendingUp size={20} />
                Game Statistics
              </h4>
              
              {/* Overall Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: Clock, color: 'text-blue-400', value: gameStats.totalTurns, label: 'Total Turns' },
                  { icon: Target, color: 'text-green-400', value: gameStats.highestSingleTurn, label: 'Best Turn' },
                  { icon: Users, color: 'text-purple-400', value: gameStats.averageScore, label: 'Avg Score' },
                  { icon: () => <span className="text-lg">{gameStats.mostProductiveCategory.icon}</span>, color: 'text-yellow-400', value: gameStats.mostProductiveCategory.value, label: gameStats.mostProductiveCategory.name }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center p-3 bg-znr-elevated/50 rounded-xl transition-all duration-500 ${
                      visibleStats > index ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: `${index * 200}ms`,
                      animationDelay: `${index * 0.8}s`
                    }}
                  >
                    <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-znr-text">{stat.value}</div>
                    <div className="text-znr-text-muted text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Detailed Player Breakdowns */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-znr-text mb-3">Player Breakdowns</h5>
                {playerBreakdowns.map((player, playerIndex) => (
                  <div 
                    key={player.id} 
                    className={`bg-znr-elevated/50 rounded-xl p-4 transition-all duration-500 ${
                      visibleStats > 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${(playerIndex + 1) * 150}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-znr-text-muted font-bold w-6 text-sm">#{playerIndex + 1}</div>
                        <div className="w-8 h-8">
                          <Meeple color={player.color} className="w-full h-full" />
                        </div>
                        <div>
                          <span className="text-znr-text font-semibold">{player.name}</span>
                          <div className="text-znr-text-muted text-xs">{player.history.length} turns</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-znr-text">{player.totalScore}</div>
                    </div>
                    
                    {/* Category Breakdown */}
                    <div className="grid grid-cols-4 gap-2">
                      {scoreCategories.map(category => (
                        <div key={category.key} className="bg-znr-secondary/50 rounded-lg p-2 text-center">
                          <div className={`text-sm mb-1 ${category.color}`}>{category.icon}</div>
                          <div className="text-lg font-bold text-znr-text">{player.breakdown[category.key]}</div>
                          <div className="text-xs text-znr-text-muted">{category.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`px-6 pb-6 transition-all duration-1000 ${
            animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1000ms' }}>
            <div className="bg-znr-tertiary/30 rounded-2xl p-4 border border-znr-border">
              <h5 className="text-lg font-semibold text-znr-text mb-3">What's Next?</h5>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={onRestartGame}
                  className="flex-1 min-w-48 flex items-center gap-3 p-3 pl-6 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-znr-text transition-all duration-300"
                >
                  <RotateCcw size={18} className="text-amber-400" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Restart Game</div>
                    <div className="text-xs text-znr-text-muted">Same players, fresh scores</div>
                  </div>
                </button>
                
                <button
                  onClick={onNewGame}
                  className="flex-1 min-w-48 flex items-center gap-3 p-3 pl-6 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl text-znr-text transition-all duration-300"
                >
                  <Plus size={18} className="text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium text-sm">New Game</div>
                    <div className="text-xs text-znr-text-muted">Setup new players</div>
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