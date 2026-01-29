import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  onButtonClick: () => void;
  isCurrentPlan?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  buttonText,
  onButtonClick,
  isCurrentPlan = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl transition-all duration-300 ${
        highlighted
          ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-105 hover:scale-110'
          : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
          추천
        </div>
      )}

      <div className="flex-1 p-8">
        <h3
          className={`text-2xl font-bold mb-2 ${
            highlighted
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400'
              : 'text-white'
          }`}
        >
          {name}
        </h3>
        <p className="text-slate-400 text-sm mb-6">{description}</p>

        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-5xl font-extrabold ${
                highlighted ? 'text-white' : 'text-slate-200'
              }`}
            >
              {price === 0 ? '무료' : `$${price}`}
            </span>
            {price > 0 && (
              <span className="text-slate-400 text-sm">/ {period}</span>
            )}
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  highlighted
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                    : 'bg-white/10'
                }`}
              >
                <Check
                  className={`w-3 h-3 ${
                    highlighted ? 'text-white' : 'text-emerald-400'
                  }`}
                />
              </div>
              <span className="text-slate-300 text-sm leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-8 pt-0">
        <button
          type="button"
          onClick={onButtonClick}
          disabled={isCurrentPlan}
          className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${
            isCurrentPlan
              ? 'bg-white/10 text-slate-400 cursor-not-allowed'
              : highlighted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transform hover:-translate-y-0.5'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-emerald-500/50'
          }`}
        >
          {isCurrentPlan ? '현재 플랜' : buttonText}
        </button>
      </div>
    </div>
  );
}
