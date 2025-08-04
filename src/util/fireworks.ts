import type { ISourceOptions } from "@tsparticles/engine";

interface FireworksConfigParams {
  isSinglePlayer: boolean;
  playerWon?: boolean;
}

export const createFireworksOptions = ({ isSinglePlayer, playerWon }: FireworksConfigParams): ISourceOptions => ({
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
});