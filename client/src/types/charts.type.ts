export type PeakPeriod = {
  label: string;
  count: number;
};

export type StatsData = {
  labels: string[];
  counts: number[];
  totalRegistrations: number;
  dailyAverage: number;
  peakPeriod: PeakPeriod;
  growthRate: number;
};

export type StatsResponse = {
  message: string;
  data: StatsData;
};
