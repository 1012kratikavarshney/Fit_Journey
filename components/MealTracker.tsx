import React, { useState } from 'react';
import { Plus, Loader2, Sparkles, Utensils, Trash2, Edit3, Wand2, X, Coffee, Carrot, Apple, Pizza, ChevronRight, Leaf, Info } from 'lucide-react';
import { Meal } from '../types';
import { estimateMealNutrition } from '../services/geminiService';

interface MealTrackerProps {
  meals: Meal[];
  onAddMeal: (meal: Meal) => void;
  onRemoveMeal: (id: string) => void;
  onClearMeals: () => void;
}

const MealTracker: React.FC<MealTrackerProps> = ({ meals, onAddMeal, onRemoveMeal, onClearMeals }) => {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const handleAnalyze = async (overrideInput?: string) => {
    const textToAnalyze = overrideInput || input;
    if (!textToAnalyze.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const estimatedData = await estimateMealNutrition(textToAnalyze);
      if (estimatedData) {
        const newMeal: Meal = {
          id: Date.now().toString(),
          name: estimatedData.name,
          calories: estimatedData.calories,
          protein: estimatedData.protein,
          carbs: estimatedData.carbs,
          fats: estimatedData.fats,
          timestamp: new Date(),
        };
        onAddMeal(newMeal);
        setInput('');
      }
    } catch (err) {
      setError("Could not analyze meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!manualForm.name || !manualForm.calories) {
        setError("Please enter at least a name and calories.");
        return;
    }

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: manualForm.name,
      calories: Number(manualForm.calories) || 0,
      protein: Number(manualForm.protein) || 0,
      carbs: Number(manualForm.carbs) || 0,
      fats: Number(manualForm.fats) || 0,
      timestamp: new Date(),
    };
    onAddMeal(newMeal);
    setManualForm({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    setError(null);
  };

  // Calculate Totals
  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = meals.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = meals.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFats = meals.reduce((acc, curr) => acc + curr.fats, 0);

  // Targets (Mock)
  const GOAL_CALORIES = 2500;
  const GOAL_PROTEIN = 150;
  const GOAL_CARBS = 300;
  const GOAL_FATS = 70;

  const ProgressBar = ({ current, max, color, label, unit = "g" }: any) => {
    const percentage = Math.min((current / max) * 100, 100);
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between text-xs font-semibold text-white/90">
          <span>{label}</span>
          <span>{current}<span className="text-white/60 text-[10px] ml-0.5">{unit}</span></span>
        </div>
        <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const QUICK_ADDS = [
    { name: 'Coffee', icon: Coffee, calories: '5 kcal' },
    { name: 'Banana', icon: Apple, calories: '105 kcal' },
    { name: 'Oatmeal', icon: Leaf, calories: '150 kcal' },
    { name: 'Salad', icon: Carrot, calories: '120 kcal' },
  ];

  return (
    <div className="p-6 pb-32 min-h-screen bg-background-light dark:bg-background-dark animate-fade-in transition-colors duration-300">
      <div className="mb-6 flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-text-main dark:text-white mb-1">Nutrition</h2>
           <p className="text-text-muted dark:text-gray-400 text-sm">Track your daily intake</p>
        </div>
      </div>

      {/* Stats Summary Card */}
      <div className="bg-text-main dark:bg-card-dark text-white p-6 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 mb-8 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[60px] transform translate-x-20 -translate-y-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[50px] transform -translate-x-10 translate-y-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-sm font-medium opacity-80 block mb-1">Calories Remaining</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{Math.max(GOAL_CALORIES - totalCalories, 0)}</span>
                <span className="text-lg opacity-60">kcal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs opacity-60 block uppercase tracking-wider mb-1">Eaten</span>
              <span className="text-xl font-bold">{totalCalories}</span>
              <span className="text-sm opacity-60"> / {GOAL_CALORIES}</span>
            </div>
          </div>

          <div className="space-y-4">
             {/* Main Calorie Bar */}
             <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                 <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-green-300 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((totalCalories / GOAL_CALORIES) * 100, 100)}%` }}
                 />
             </div>
             
             {/* Macros */}
             <div className="grid grid-cols-3 gap-4 pt-2">
                <ProgressBar current={totalProtein} max={GOAL_PROTEIN} color="bg-blue-400" label="Protein" />
                <ProgressBar current={totalCarbs} max={GOAL_CARBS} color="bg-orange-400" label="Carbs" />
                <ProgressBar current={totalFats} max={GOAL_FATS} color="bg-purple-400" label="Fats" />
             </div>
          </div>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="bg-white dark:bg-card-dark p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex gap-1 mb-6 transition-colors duration-300">
          <button 
            onClick={() => setMode('ai')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'ai' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
          >
            <Sparkles size={16} /> AI Auto
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'manual' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
          >
            <Edit3 size={16} /> Manual
          </button>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        {mode === 'ai' ? (
            <div className="space-y-6">
               <div className="bg-white dark:bg-card-dark p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-300">
                  <div className="flex items-center gap-3 p-2">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary">
                          <Wand2 size={20} />
                      </div>
                      <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="What did you eat? (e.g. 2 eggs & toast)"
                          className="flex-1 bg-transparent border-none outline-none text-text-main dark:text-white placeholder-gray-400 font-medium text-base"
                          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      />
                  </div>
                  <button
                      onClick={() => handleAnalyze()}
                      disabled={loading || !input}
                      className="w-full mt-2 bg-text-main dark:bg-primary hover:bg-opacity-90 dark:hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white p-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-bold"
                  >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : "Log Meal"}
                  </button>
               </div>

               {/* Quick Add Grid */}
               <div>
                  <h4 className="font-bold text-text-main dark:text-white mb-3 text-sm">Quick Add</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {QUICK_ADDS.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnalyze(item.name)}
                        className="bg-white dark:bg-card-dark p-3 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 dark:border-white/5 hover:scale-105 transition-transform"
                      >
                         <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary">
                           <item.icon size={20} />
                         </div>
                         <span className="text-xs font-bold text-text-main dark:text-white">{item.name}</span>
                         <span className="text-[10px] text-gray-400">{item.calories}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
        ) : (
            <div className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-300 animate-fade-in">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={manualForm.name}
                        onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                        placeholder="Meal Name (e.g. Grilled Chicken)"
                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3.5 text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input
                                type="number"
                                value={manualForm.calories}
                                onChange={(e) => setManualForm({...manualForm, calories: e.target.value})}
                                placeholder="Calories"
                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3.5 pr-8 text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">kcal</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={manualForm.protein}
                                onChange={(e) => setManualForm({...manualForm, protein: e.target.value})}
                                placeholder="Protein"
                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3.5 pr-6 text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                            />
                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">g</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={manualForm.carbs}
                                onChange={(e) => setManualForm({...manualForm, carbs: e.target.value})}
                                placeholder="Carbs"
                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3.5 pr-6 text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                            />
                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">g</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={manualForm.fats}
                                onChange={(e) => setManualForm({...manualForm, fats: e.target.value})}
                                placeholder="Fats"
                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3.5 pr-6 text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                            />
                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">g</span>
                        </div>
                    </div>
                    <button
                        onClick={handleManualSubmit}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        Add Entry
                    </button>
                </div>
            </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          {error}
        </div>
      )}

      {/* Meals List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-text-main dark:text-white">Today's Logs</h3>
            {meals.length > 0 && (
                <button 
                    onClick={onClearMeals}
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Clear All
                </button>
            )}
        </div>
        
        {meals.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5 transition-colors duration-300">
            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Utensils size={24} />
            </div>
            <p className="text-text-main dark:text-white font-bold text-lg mb-1">Your plate is empty</p>
            <p className="text-text-muted dark:text-gray-400 text-sm">Log your first meal to start tracking nutrition</p>
          </div>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 group relative overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up">
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex-1">
                    <h4 className="font-bold text-base text-text-main dark:text-white capitalize leading-tight mb-1">{meal.name}</h4>
                    <p className="text-xs text-text-muted dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        {meal.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                     <span className="font-display font-bold text-lg text-text-main dark:text-white">
                        {meal.calories} <span className="text-xs font-normal text-text-muted dark:text-gray-400">kcal</span>
                     </span>
                     <button 
                        onClick={() => onRemoveMeal(meal.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                     >
                        <X size={18} />
                     </button>
                </div>
              </div>
              
              {/* Macro Pills */}
              <div className="flex gap-2 relative z-10">
                 <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{meal.protein}g</span>
                 </div>
                 <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{meal.carbs}g</span>
                 </div>
                 <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{meal.fats}g</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dietary Insights & Recipes */}
      <div className="space-y-8 animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
         {/* Badges */}
         <div className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
             <h3 className="font-bold text-text-main dark:text-white mb-3 flex items-center gap-2"><Info size={16}/> Daily Insights</h3>
             <div className="flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-bold">High Protein</span>
                 <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs font-bold">Balanced Fats</span>
                 <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-bold">Low Sugar</span>
             </div>
             <p className="text-xs text-text-muted dark:text-gray-400 mt-3 leading-relaxed">
               You are hitting your protein goals consistently! Consider adding more fiber to your dinner for better digestion.
             </p>
         </div>

         {/* Recipe Recommendations */}
         <div>
            <div className="flex justify-between items-center mb-4 px-1">
               <h3 className="font-bold text-lg text-text-main dark:text-white">Healthy Recipes</h3>
               <button className="text-primary text-xs font-bold">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
               {[
                 { title: 'Quinoa Bowl', cal: 450, time: '20m', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },
                 { title: 'Avocado Toast', cal: 320, time: '10m', img: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=500&auto=format&fit=crop&q=60' },
                 { title: 'Grilled Salmon', cal: 560, time: '35m', img: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=500&auto=format&fit=crop&q=60' }
               ].map((recipe, idx) => (
                  <div key={idx} className="min-w-[200px] bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 group">
                     <div className="h-28 overflow-hidden">
                        <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     </div>
                     <div className="p-3">
                        <h4 className="font-bold text-text-main dark:text-white text-sm mb-1">{recipe.title}</h4>
                        <div className="flex gap-3 text-xs text-text-muted dark:text-gray-400">
                           <span className="flex items-center gap-1"><Sparkles size={10} /> {recipe.cal} kcal</span>
                           <span>•</span>
                           <span>{recipe.time}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default MealTracker;