import React, { useState, useEffect } from 'react';
import { Home, Utensils, Dumbbell, Moon, Sun, Bell } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import MealTracker from './components/MealTracker';
import WorkoutTracker from './components/WorkoutTracker';
import Reminders from './components/Reminders';
import { AppScreen, Meal, UserStats, Workout } from './types';

const App: React.FC = () => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.ONBOARDING);

  // Theme State
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Data State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<UserStats>({
    steps: 6540, // Mock initial data
    caloriesBurned: 450,
    activeMinutes: 35
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleAddMeal = (meal: Meal) => {
    setMeals(prev => [meal, ...prev]);
    setStats(prev => ({
      ...prev,
      // Simple logic: we are tracking intake, but let's assume active calories for now or just display
    }));
  };

  const handleRemoveMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const handleClearMeals = () => {
    setMeals([]);
  };

  const handleAddWorkout = (workout: Workout) => {
    setWorkouts(prev => [workout, ...prev]);
    setStats(prev => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + workout.caloriesBurned,
      activeMinutes: prev.activeMinutes + workout.duration
    }));
  };

  // Bottom Navigation Component
  const BottomNav = () => (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 dark:bg-card-dark/90 backdrop-blur-md border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 rounded-full py-3 px-6 flex justify-between items-center z-50 transition-colors duration-300">
      <button 
        onClick={() => setCurrentScreen(AppScreen.DASHBOARD)}
        className={`p-2 rounded-full transition-all duration-300 ${currentScreen === AppScreen.DASHBOARD ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
      >
        <Home size={24} strokeWidth={currentScreen === AppScreen.DASHBOARD ? 2.5 : 2} />
      </button>
      <button 
        onClick={() => setCurrentScreen(AppScreen.MEALS)}
        className={`p-2 rounded-full transition-all duration-300 ${currentScreen === AppScreen.MEALS ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
      >
        <Utensils size={24} strokeWidth={currentScreen === AppScreen.MEALS ? 2.5 : 2} />
      </button>
      <button 
        onClick={() => setCurrentScreen(AppScreen.WORKOUTS)}
        className={`p-2 rounded-full transition-all duration-300 ${currentScreen === AppScreen.WORKOUTS ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
      >
        <Dumbbell size={24} strokeWidth={currentScreen === AppScreen.WORKOUTS ? 2.5 : 2} />
      </button>
      <button 
        onClick={() => setCurrentScreen(AppScreen.REMINDERS)}
        className={`p-2 rounded-full transition-all duration-300 ${currentScreen === AppScreen.REMINDERS ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
      >
        <Bell size={24} strokeWidth={currentScreen === AppScreen.REMINDERS ? 2.5 : 2} />
      </button>
      <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1"></div>
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors"
        aria-label="Toggle Dark Mode"
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark h-screen w-full overflow-hidden text-text-main dark:text-white font-display selection:bg-primary selection:text-white transition-colors duration-300">
      {currentScreen === AppScreen.ONBOARDING ? (
        <Onboarding onComplete={handleOnboardingComplete} onSkip={handleOnboardingComplete} />
      ) : (
        <main className="max-w-md mx-auto h-full relative flex flex-col bg-background-light dark:bg-background-dark shadow-2xl shadow-black/5 overflow-hidden transition-colors duration-300">
             {/* Content Area - Scrollable */}
             <div className="flex-1 w-full overflow-y-auto overflow-x-hidden hide-scrollbar scroll-smooth pt-[env(safe-area-inset-top)]">
                <div className="min-h-full">
                  {currentScreen === AppScreen.DASHBOARD && <Dashboard stats={stats} recentWorkouts={workouts} meals={meals} />}
                  {currentScreen === AppScreen.MEALS && <MealTracker meals={meals} onAddMeal={handleAddMeal} onRemoveMeal={handleRemoveMeal} onClearMeals={handleClearMeals} />}
                  {currentScreen === AppScreen.WORKOUTS && <WorkoutTracker onAddWorkout={handleAddWorkout} />}
                  {currentScreen === AppScreen.REMINDERS && <Reminders />}
                </div>
             </div>
             
             {/* Floating Navigation */}
             <BottomNav />
        </main>
      )}
    </div>
  );
};

export default App;