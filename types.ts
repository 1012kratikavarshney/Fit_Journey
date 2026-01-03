export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: Date;
}

export interface Workout {
  id: string;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  date: Date;
}

export interface UserStats {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
}

export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  MEALS = 'MEALS',
  WORKOUTS = 'WORKOUTS',
  REMINDERS = 'REMINDERS',
}

export interface AIResponse<T> {
  data: T | null;
  error?: string;
  loading: boolean;
}