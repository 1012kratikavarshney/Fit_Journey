import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, ComposedChart, Legend 
} from 'recharts';
import { Activity, Flame, Timer, ArrowUpRight, Droplets, Moon, ChevronRight, Zap } from 'lucide-react';
import { UserStats, Workout, Meal } from '../types';

interface DashboardProps {
  stats: UserStats;
  recentWorkouts: Workout[];
  meals: Meal[];
}

type ChartTab = 'activity' | 'nutrition' | 'workouts' | 'weight';

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const CountUpDisplay = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const count = useCountUp(value);
  return <>{count}{suffix}</>;
};

const StatCard = ({ icon: Icon, label, value, unit, colorClass, index = 0 }: any) => {
  const count = useCountUp(value);

  return (
    <div 
      className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-slide-up opacity-0"
      style={{ 
        animationDelay: `${index * 100}ms`, 
        animationFillMode: 'forwards' 
      }}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${colorClass}`}></div>
      <div className="flex justify-between items-start z-10">
        <div className={`p-2 rounded-xl ${colorClass} bg-opacity-20 text-current`}>
          <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <span className="flex items-center text-xs font-medium text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} className="mr-1" /> +2.4%
        </span>
      </div>
      <div className="z-10 mt-2">
        <span className="text-2xl font-bold text-text-main dark:text-white block tabular-nums">
          {count.toLocaleString()}
        </span>
        <span className="text-xs text-text-muted dark:text-gray-400 uppercase font-semibold tracking-wider">{label} {unit && `(${unit})`}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ stats, recentWorkouts, meals }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('activity');
  const [waterIntake, setWaterIntake] = useState(4); // Glasses
  
  // Generate chart data: mix real "today" data with mock history
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Mon=0, Sun=6

    // Calculate Today's totals from real data
    const todayCaloriesIn = meals
      .filter(m => new Date(m.timestamp).toDateString() === today.toDateString())
      .reduce((acc, curr) => acc + curr.calories, 0);

    const todayWorkoutCals = recentWorkouts
      .filter(w => new Date(w.date).toDateString() === today.toDateString())
      .reduce((acc, curr) => acc + curr.caloriesBurned, 0);

    const todayWorkoutMins = recentWorkouts
      .filter(w => new Date(w.date).toDateString() === today.toDateString())
      .reduce((acc, curr) => acc + curr.duration, 0);

    return days.map((day, index) => {
      // Mock historical data for previous days
      if (index !== currentDayIndex) {
        return {
          name: day,
          steps: Math.floor(Math.random() * (5000 - 2000) + 2000),
          caloriesIn: Math.floor(Math.random() * (2400 - 1800) + 1800),
          caloriesBurned: Math.floor(Math.random() * (600 - 200) + 200),
          duration: Math.floor(Math.random() * (60 - 20) + 20),
          weight: 70 + (Math.random() * 0.5 - 0.25),
        };
      }
      // Real data for today (if available) or baseline mock for demo if empty
      return {
        name: 'Today',
        steps: stats.steps, // Using current steps
        caloriesIn: todayCaloriesIn || 2100, // Fallback for demo visual
        caloriesBurned: todayWorkoutCals || stats.caloriesBurned,
        duration: todayWorkoutMins || stats.activeMinutes,
        weight: 69.5,
      };
    });
  }, [stats, meals, recentWorkouts]);

  return (
    <div className="p-6 space-y-8 pb-32 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20 py-2 -mx-6 px-6 transition-colors duration-300">
        <div className="animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h2 className="text-3xl font-bold text-text-main dark:text-white">Hello, Kratika</h2>
          <p className="text-text-muted dark:text-gray-400 text-sm font-medium">You're doing great today!</p>
        </div>
        <div className="relative group">
            <img 
            src="https://picsum.photos/100/100" 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-white dark:border-white/10 shadow-md animate-slide-up opacity-0 cursor-pointer hover:scale-105 transition-transform"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={Activity} 
          label="Steps" 
          value={stats.steps} 
          colorClass="bg-blue-500 text-blue-600"
          index={0}
        />
        <StatCard 
          icon={Flame} 
          label="Calories" 
          value={stats.caloriesBurned} 
          unit="kcal" 
          colorClass="bg-orange-500 text-orange-600"
          index={1}
        />
        <StatCard 
          icon={Timer} 
          label="Active" 
          value={stats.activeMinutes} 
          unit="min" 
          colorClass="bg-primary text-primary-dark"
          index={2}
        />
         <div 
           className="bg-primary p-5 rounded-2xl shadow-lg shadow-primary/20 flex flex-col justify-center items-center text-white relative overflow-hidden animate-slide-up opacity-0 transition-all duration-300 hover:scale-[1.02]"
           style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
         >
           <div className="absolute inset-0 bg-black/10"></div>
           <div className="z-10 text-center">
             <span className="text-3xl font-bold tabular-nums">
               <CountUpDisplay value={85} suffix="%" />
             </span>
             <span className="text-xs font-bold uppercase tracking-wider opacity-90 block mt-1">Daily Goal</span>
           </div>
         </div>
      </div>

      {/* Charts Section */}
      <div 
        className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-300 animate-slide-up opacity-0"
        style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-text-main dark:text-white">Analytics</h3>
          <div className="flex space-x-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
             {['Activity', 'Nutrition', 'Workouts', 'Weight'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as ChartTab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all duration-300 ${
                    activeTab === tab.toLowerCase() 
                    ? 'bg-white dark:bg-white/10 text-text-main dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
             ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'activity' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38e07b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38e07b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                  cursor={{ stroke: '#38e07b', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#38e07b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSteps)" 
                  animationDuration={1500}
                />
              </AreaChart>
            ) : activeTab === 'nutrition' ? (
              <BarChart data={chartData}>
                 <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                 />
                 <Legend verticalAlign="top" height={36} iconType="circle"/>
                 <Bar dataKey="caloriesIn" name="Calories Intake" fill="#f97316" radius={[6, 6, 0, 0]} animationDuration={1500} />
              </BarChart>
            ) : activeTab === 'workouts' ? (
              <ComposedChart data={chartData}>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle"/>
                <Bar dataKey="caloriesBurned" name="Burned (kcal)" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
                <Line type="monotone" dataKey="duration" name="Duration (min)" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} animationDuration={1500} />
              </ComposedChart>
            ) : (
              <LineChart data={chartData}>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <XAxis dataKey="name" hide />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                <Line type="monotone" dataKey="weight" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff'}} animationDuration={1500} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20 animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Hydration</h3>
            <p className="text-blue-100 text-sm">Daily Goal: 8 glasses</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Droplets size={24} className="text-white" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
           <span className="text-4xl font-bold">{waterIntake} <span className="text-lg font-normal opacity-80">/ 8</span></span>
           <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{Math.round((waterIntake/8)*100)}%</span>
        </div>

        <div className="grid grid-cols-8 gap-2">
           {[...Array(8)].map((_, i) => (
             <button 
               key={i} 
               onClick={() => setWaterIntake(i + 1)}
               className={`h-12 rounded-lg transition-all duration-300 ${i < waterIntake ? 'bg-white shadow-sm scale-100' : 'bg-black/10 scale-90 hover:bg-black/20'}`}
             >
             </button>
           ))}
        </div>
        <p className="text-center mt-4 text-xs font-medium text-blue-100 opacity-80">Tap to update your intake</p>
      </div>

       {/* Sleep Analysis */}
       <div className="bg-[#1e1b4b] dark:bg-black p-6 rounded-3xl text-white shadow-lg relative overflow-hidden animate-slide-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
         <div className="absolute top-0 right-0 p-8 opacity-20">
           <Moon size={120} />
         </div>
         <div className="relative z-10">
           <h3 className="text-lg font-bold text-indigo-200 mb-6 flex items-center gap-2"><Moon size={18}/> Sleep Analysis</h3>
           <div className="flex items-end gap-4 mb-4">
             <span className="text-5xl font-bold">7<span className="text-2xl text-indigo-300">h</span> 30<span className="text-2xl text-indigo-300">m</span></span>
           </div>
           <div className="w-full bg-indigo-900/50 h-2 rounded-full overflow-hidden mb-2">
             <div className="w-[85%] bg-indigo-400 h-full rounded-full"></div>
           </div>
           <p className="text-xs text-indigo-300">You slept better than 85% of users today.</p>
         </div>
      </div>

      {/* Today's Schedule */}
      <div className="animate-slide-up opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-main dark:text-white">Schedule</h3>
            <button className="text-primary text-sm font-bold">View All</button>
         </div>
         <div className="space-y-3">
            {[
              { time: '07:00 AM', title: 'Morning Yoga', type: 'Workout', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
              { time: '08:30 AM', title: 'Breakfast', type: 'Meal', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
              { time: '05:30 PM', title: 'HIIT Cardio', type: 'Workout', icon: Flame, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white dark:bg-card-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                 <div className="flex flex-col items-center min-w-[60px]">
                    <span className="text-xs font-bold text-text-muted dark:text-gray-400">{item.time.split(' ')[0]}</span>
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{item.time.split(' ')[1]}</span>
                 </div>
                 <div className="w-0.5 h-10 bg-gray-100 dark:bg-white/10 rounded-full"></div>
                 <div className={`p-2.5 rounded-xl ${item.bg}`}>
                    <item.icon size={18} className={item.color} />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-text-main dark:text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-text-muted dark:text-gray-400">{item.type}</p>
                 </div>
                 <ChevronRight size={16} className="text-gray-300" />
              </div>
            ))}
         </div>
      </div>

      {/* Recent Workouts */}
      <div className="animate-slide-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
        <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentWorkouts.map((workout) => (
            <div 
              key={workout.id} 
              className="bg-white dark:bg-card-dark p-4 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-white/5 hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white">{workout.type}</h4>
                  <p className="text-xs text-text-muted dark:text-gray-400">{workout.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-text-main dark:text-white">{workout.caloriesBurned} kcal</span>
                <span className="text-xs text-text-muted dark:text-gray-400">{workout.duration} min</span>
              </div>
            </div>
          ))}
          {recentWorkouts.length === 0 && (
            <div className="text-center text-text-muted dark:text-gray-400 py-8 bg-white dark:bg-card-dark rounded-2xl border border-dashed border-gray-200 dark:border-white/10 transition-colors duration-300">
              No recent workouts
            </div>
          )}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-500/20 flex gap-4 animate-slide-up opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
        <div className="text-2xl">💡</div>
        <div>
           <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-sm mb-1">Daily Wellness Tip</h4>
           <p className="text-xs text-yellow-700 dark:text-yellow-300/80 leading-relaxed">
             Consistent small efforts beat occasional herculean ones. Try to walk for just 10 mins after lunch today!
           </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;