export type RewardConfig = {
  tokenTresholds: {
    time: number;
    tokens: number;
  }[];
  cupTresholds: {
    time: number;
    cups: number;
  }[];
};

// Number of TurboTokens and TurboTokens you get connected to certain times
export const TRACK_REWARDS: Record<string, RewardConfig> = {
  race1: {
    tokenTresholds: [
      { time: 45_000, tokens: 100 },
      { time: 50_000, tokens: 75 },
      { time: 55_000, tokens: 50 },
      { time: 60_000, tokens: 25 },
      { time: 65_000, tokens: 20 },
      { time: 70_000, tokens: 10 },
      { time: 80_000, tokens: 5 },
    ],
    cupTresholds: [
      { time: 45_000, cups: 5 },
      { time: 57_000, cups: 3 },
      { time: 62_000, cups: 2 },
      { time: 80_000, cups: 1 },
    ],
  },

  race2: {
    tokenTresholds: [
      { time: 60_000, tokens: 45 },
      { time: 70_000, tokens: 35 },
      { time: 80_000, tokens: 30 },
      { time: 90_000, tokens: 20},
      { time: 105_000, tokens: 10 },
      { time: 120_000, tokens: 5 },
    ],
    cupTresholds: [
      { time: 45_000, cups: 5 },
      { time: 75_000, cups: 3 },
      { time: 90_000, cups: 2 },
      { time: 110_000, cups: 1 },
    ],
  },

  race3: {
    tokenTresholds: [
      { time: 70_000, tokens: 45 },
      { time: 80_000, tokens: 30 },
      { time: 90_000, tokens: 20 },
      { time: 105_000, tokens: 15 },
      { time: 120_000, tokens: 10 },
      { time: 150_000, tokens: 5 },
    ],
    cupTresholds: [
      { time: 85_000, cups: 3 },
      { time: 105_000, cups: 2 },
      { time: 120_000, cups: 1 },
    ],
  },
};
