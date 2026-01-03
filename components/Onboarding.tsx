import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const ONBOARDING_STEPS = [
  {
    title: "Begin Your Journey",
    description: "Track your workouts, log your meals, and watch your progress unfold. Let's get started.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3v0SPXuAKkZZV4eKWpHae4371pYqVeyGCIpwcri-sZ0XPyZM66LIACmxAIUJnyXphzblQ5QzRncnA4woLJ19-f98X1OaSGv2ptcnhrIsydl6cHMjxRMwP2u00eRBfRDtV0i628v5UAWTT21EXoAwgSokeueOOfVkvR5nIMPwyUNyFM9PHUDdjpT1kv_p31FL9Apu3JHsaocNfdgfVWH79AOBwqmhatHrtcXM9I6kK3Pf9uYYSorqHBpf31iu54zsptEpGHLeUQuw",
    color: "bg-[#0b8a5c]" // Fallback color if image fails
  },
  {
    title: "Eat Smart, Live Better",
    description: "Use AI to instantly analyze your meals. Just type what you ate, and we'll handle the macros.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop",
    color: "bg-orange-400"
  },
  {
    title: "Achieve Your Goals",
    description: "Visualize your progress with beautiful charts and get personalized workout plans.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    color: "bg-blue-500"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleContinue = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden transition-colors duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-sm">
           {/* Placeholder for logo icon */}
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-dark dark:text-primary"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
        </div>
        <button 
          onClick={onSkip}
          className="text-primary text-base font-bold hover:opacity-80 transition-opacity"
        >
          Skip
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-4 pb-8">
        
        {/* Image Container */}
        <div className="w-full relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg mb-8 group transition-all duration-500">
           <div 
             className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
             style={{ backgroundImage: `url("${ONBOARDING_STEPS[currentStep].image}")` }}
           />
           {/* Overlay gradient for better text contrast if needed, mostly stylistic */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center text-center mt-auto animate-slide-up key={currentStep}">
          <h1 className="text-text-main dark:text-white text-[32px] font-bold leading-tight mb-4 tracking-tight">
            {ONBOARDING_STEPS[currentStep].title}
          </h1>
          <p className="text-text-muted dark:text-gray-400 text-base font-normal leading-relaxed px-4 mb-8">
            {ONBOARDING_STEPS[currentStep].description}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2 mb-8">
          {ONBOARDING_STEPS.map((_, index) => (
            <div 
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleContinue}
          className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-display text-lg font-bold rounded-full shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center"
        >
          {currentStep === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;