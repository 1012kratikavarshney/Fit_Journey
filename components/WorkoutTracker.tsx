import React, { useState } from 'react';
import { Dumbbell, Clock, Flame, Send, CheckCircle2, ChevronRight, Activity, Trophy, Battery, Users, Play } from 'lucide-react';
import { Workout } from '../types';
import { suggestWorkout } from '../services/geminiService';

interface WorkoutTrackerProps {
  onAddWorkout: (workout: Workout) => void;
}

const WORKOUT_TYPES = [
  "Full Body Strength",
  "HIIT Cardio",
  "Yoga Flow",
  "Pilates",
  "Core Blaster",
  "Upper Body Power",
  "Lower Body Burn",
  "Mobility & Stretch"
];

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ onAddWorkout }) => {
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('30 minutes');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any | null>(null);

  const handleGetSuggestion = async () => {
    if (!workoutType) return;
    setLoading(true);
    try {
      const result = await suggestWorkout(workoutType, duration);
      setSuggestion(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWorkout = () => {
    if (suggestion) {
      const newWorkout: Workout = {
        id: Date.now().toString(),
        type: suggestion.title,
        duration: parseInt(duration) || 30,
        caloriesBurned: suggestion.estimatedCalories,
        date: new Date()
      };
      onAddWorkout(newWorkout);
      setSuggestion(null);
      setWorkoutType('');
    }
  };

  return (
    <div className="p-6 pb-32 min-h-screen bg-background-light dark:bg-background-dark animate-fade-in transition-colors duration-300">
       <div className="mb-6">
        <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2">AI Coach</h2>
        <p className="text-text-muted dark:text-gray-400">Select a style and we'll build the plan.</p>
      </div>

      {!suggestion ? (
        <div className="space-y-8">
          <div className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-300">
             <label className="block text-sm font-bold text-text-main dark:text-white mb-3">Workout Style</label>
             <div className="grid grid-cols-2 gap-3 mb-6">
               {WORKOUT_TYPES.map((type) => (
                 <button
                   key={type}
                   onClick={() => setWorkoutType(type)}
                   className={`py-3 px-4 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between ${
                     workoutType === type
                       ? 'bg-text-main dark:bg-white text-white dark:text-background-dark shadow-lg ring-2 ring-primary/50'
                       : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                   }`}
                 >
                   {type}
                   {workoutType === type && <Activity size={16} className="text-primary" />}
                 </button>
               ))}
             </div>

             <label className="block text-sm font-bold text-text-main dark:text-white mt-6 mb-2">Duration</label>
             <div className="grid grid-cols-3 gap-3">
               {['15 mins', '30 mins', '45 mins'].map((d) => (
                 <button
                   key={d}
                   onClick={() => setDuration(d)}
                   className={`py-3 rounded-xl text-sm font-bold transition-all ${duration === d ? 'bg-text-main dark:bg-white text-white dark:text-background-dark shadow-lg' : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                 >
                   {d}
                 </button>
               ))}
             </div>

             <button 
               onClick={handleGetSuggestion}
               disabled={loading || !workoutType}
               className="w-full mt-8 h-14 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-95"
             >
               {loading ? (
                 <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Generating...</span>
               ) : (
                 <>Generate Workout <Send size={18} /></>
               )}
             </button>
          </div>

          {/* Active Challenges */}
          <div className="animate-slide-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
             <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Active Challenges</h3>
             <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold mb-1 inline-block">Day 12 / 30</span>
                        <h4 className="font-bold text-xl">Core Crusher</h4>
                      </div>
                      <Trophy className="text-yellow-300" />
                   </div>
                   <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mb-2">
                      <div className="w-[40%] bg-white h-full rounded-full"></div>
                   </div>
                   <p className="text-xs opacity-80">Keep going! You're almost halfway there.</p>
                </div>
             </div>
             <div className="bg-white dark:bg-card-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-500">
                      <Flame size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-text-main dark:text-white text-sm">5k Runner</h4>
                      <p className="text-xs text-gray-400">12km / 50km completed</p>
                   </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
             </div>
          </div>

          {/* Recovery Status */}
          <div className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 animate-slide-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
             <h3 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2"><Battery size={20} className="text-green-500"/> Recovery Status</h3>
             <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-green-500" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                   </svg>
                   <span className="absolute font-bold text-xl dark:text-white">85%</span>
                </div>
                <div className="flex-1">
                   <p className="font-bold text-text-main dark:text-white mb-1">Ready to train!</p>
                   <p className="text-xs text-text-muted dark:text-gray-400 leading-relaxed">
                      Your muscles are well recovered. Great day for High Intensity Interval Training.
                   </p>
                </div>
             </div>
          </div>

          {/* Trending Workouts */}
          <div className="animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
             <div className="flex justify-between items-center mb-4 px-1">
                 <h3 className="font-bold text-lg text-text-main dark:text-white">Trending Now</h3>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
                 {[
                   { title: "Morning Mobility", duration: "15 min", color: "bg-blue-100 text-blue-600" },
                   { title: "HIIT Blast", duration: "25 min", color: "bg-orange-100 text-orange-600" },
                   { title: "Power Yoga", duration: "45 min", color: "bg-purple-100 text-purple-600" }
                 ].map((item, i) => (
                   <div key={i} className="min-w-[160px] bg-white dark:bg-card-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:scale-105 transition-transform cursor-pointer">
                      <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center mb-3`}>
                         <Play size={16} fill="currentColor" />
                      </div>
                      <h4 className="font-bold text-text-main dark:text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.duration}</p>
                   </div>
                 ))}
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up">
           <div className="bg-white dark:bg-card-dark rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 mb-6 transition-colors duration-300">
              <div className="bg-text-main dark:bg-black/50 p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{suggestion.title}</h3>
                  <button onClick={() => setSuggestion(null)} className="text-gray-400 hover:text-white text-sm">Cancel</button>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                    <Flame size={14} className="text-orange-400"/> {suggestion.estimatedCalories} kcal
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                    <Clock size={14} className="text-blue-400"/> {duration}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Routine</h4>
                <div className="space-y-3">
                  {suggestion.exercises.map((ex: any, idx: number) => (
                    <div key={idx} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center font-bold text-sm mr-4 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-text-main dark:text-white">{ex.name}</p>
                        <p className="text-xs text-text-muted dark:text-gray-400">{ex.sets} • {ex.reps}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleCompleteWorkout}
                  className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all"
                >
                  <CheckCircle2 size={20} /> Log Completion
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;