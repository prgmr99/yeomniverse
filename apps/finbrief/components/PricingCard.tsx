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
          ? 'bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-purple-500/20 border-2 shadow-2xl scale-105 hover:scale-110'
          : 'bg-white/70 border border-white/30 hover:bg-white/80 hover:border-white/40 hover:scale-105'
      }`}
      style={
        highlighted
          ? {
              borderColor: 'rgba(0, 113, 227, 0.5)',
              boxShadow:
                '0 20px 25px -5px rgba(41, 151, 255, 0.2), 0 8px 10px -6px rgba(0, 113, 227, 0.2)',
              background: 'rgba(255, 255, 255, 0.85)',
            }
          : {}
      }
    >
      {highlighted && (
        <div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 text-white text-xs font-bold rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #0071E3 0%, #5E5CE6 100%)',
          }}
        >
          추천
        </div>
      )}

      <div className="flex-1 p-8">
        <h3
          className={`text-2xl font-bold mb-2 ${
            highlighted ? 'text-gradient' : 'text-finbrief-black'
          }`}
        >
          {name}
        </h3>
        <p className="text-finbrief-gray-500 text-sm mb-6">{description}</p>

        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-5xl font-extrabold ${
                highlighted ? 'text-finbrief-black' : 'text-finbrief-black'
              }`}
            >
              {price === 0 ? '무료' : `$${price}`}
            </span>
            {price > 0 && (
              <span className="text-finbrief-gray-500 text-sm">/ {period}</span>
            )}
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  highlighted ? '' : 'bg-finbrief-blue-500/20'
                }`}
                style={
                  highlighted
                    ? {
                        background:
                          'linear-gradient(135deg, #0071E3 0%, #5E5CE6 100%)',
                      }
                    : {}
                }
              >
                <Check
                  className="w-3 h-3"
                  style={{
                    color: highlighted ? '#FFFFFF' : '#2997FF',
                  }}
                />
              </div>
              <span className="text-finbrief-gray-600 text-sm leading-relaxed">
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
              ? 'bg-finbrief-gray-500/20 text-finbrief-gray-500 cursor-not-allowed'
              : highlighted
                ? 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-finbrief-blue-500/10 text-finbrief-blue-500 hover:bg-finbrief-blue-500/20 border border-finbrief-blue-500/30'
          }`}
          style={
            highlighted && !isCurrentPlan
              ? {
                  background:
                    'linear-gradient(135deg, #0071E3 0%, #5E5CE6 100%)',
                  boxShadow:
                    '0 4px 6px -1px rgba(41, 151, 255, 0.3), 0 2px 4px -2px rgba(0, 113, 227, 0.3)',
                }
              : !highlighted && !isCurrentPlan
                ? { borderColor: 'rgba(0, 113, 227, 0.3)' }
                : {}
          }
          onMouseEnter={(e) => {
            if (highlighted && !isCurrentPlan) {
              e.currentTarget.style.boxShadow =
                '0 10px 15px -3px rgba(41, 151, 255, 0.4), 0 4px 6px -4px rgba(0, 113, 227, 0.4)';
            } else if (!isCurrentPlan) {
              e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (highlighted && !isCurrentPlan) {
              e.currentTarget.style.boxShadow =
                '0 4px 6px -1px rgba(41, 151, 255, 0.3), 0 2px 4px -2px rgba(0, 113, 227, 0.3)';
            } else if (!isCurrentPlan) {
              e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.3)';
            }
          }}
        >
          {isCurrentPlan ? '현재 플랜' : buttonText}
        </button>
      </div>
    </div>
  );
}
