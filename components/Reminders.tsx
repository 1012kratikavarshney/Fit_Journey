import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X, Check, Clock } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  active: boolean;
}

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reminders');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse reminders", e);
        }
      }
    }
    return [
      { id: '1', title: 'Morning Jog', time: '07:00', active: true },
      { id: '2', title: 'Drink Water', time: '14:00', active: false },
    ];
  });
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!newReminderTitle || !newReminderTime) return;
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: newReminderTitle,
      time: newReminderTime,
      active: true,
    };
    setReminders([...reminders, newReminder]);
    setNewReminderTitle('');
    setNewReminderTime('');
    setShowAddReminder(false);
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="p-6 pb-32 min-h-screen bg-background-light dark:bg-background-dark animate-fade-in transition-colors duration-300">
      <div className="mb-6 flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-text-main dark:text-white mb-1">Reminders</h2>
           <p className="text-text-muted dark:text-gray-400 text-sm">Manage your daily tasks</p>
        </div>
        <button 
            onClick={() => setShowAddReminder(!showAddReminder)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform active:scale-90"
          >
            {showAddReminder ? <X size={20} /> : <Plus size={20} />}
          </button>
      </div>

      {/* Add Reminder Form */}
      {showAddReminder && (
        <div className="bg-white dark:bg-card-dark p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 mb-6 animate-slide-up">
          <h3 className="font-bold text-text-main dark:text-white mb-4">New Reminder</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-2 flex items-center px-4 border border-transparent focus-within:border-primary/50 transition-colors">
               <input 
                type="text" 
                placeholder="What do you need to do?" 
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                className="flex-1 bg-transparent border-none py-2 text-sm font-medium text-text-main dark:text-white placeholder-gray-400 focus:ring-0 outline-none"
              />
            </div>
            <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-2xl p-2 flex items-center px-4 border border-transparent focus-within:border-primary/50 transition-colors">
                   <Clock size={16} className="text-gray-400 mr-2"/>
                   <input 
                    type="time" 
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="flex-1 bg-transparent border-none py-2 text-sm font-medium text-text-main dark:text-white focus:ring-0 outline-none"
                  />
                </div>
            </div>
            <button 
              onClick={addReminder}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Set Reminder
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center py-16 px-4">
             <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <Bell size={24} />
             </div>
            <p className="text-text-muted dark:text-gray-500 font-medium">No reminders yet</p>
            <p className="text-xs text-gray-400 mt-1">Tap the + button to add one</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div 
              key={reminder.id} 
              className="flex items-center justify-between bg-white dark:bg-card-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                    reminder.active 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-200 dark:border-white/10 text-transparent hover:border-primary'
                  }`}
                >
                  <Check size={18} strokeWidth={3} className={reminder.active ? 'scale-100' : 'scale-0 transition-transform'} />
                </button>
                <div className={reminder.active ? 'opacity-100' : 'opacity-40'}>
                  <h4 className={`font-bold text-base text-text-main dark:text-white ${!reminder.active && 'line-through'}`}>{reminder.title}</h4>
                  <div className="flex items-center gap-1 mt-1">
                     <Clock size={12} className="text-primary"/>
                     <span className="text-xs font-bold text-primary">
                        {reminder.time}
                     </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteReminder(reminder.id)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reminders;