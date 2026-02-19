const INSPIRATIONAL_QUOTES: string[] = [
  '"Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1." — Warren Buffett',
  '"The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett',
  '"Invert, always invert: Turn a situation or problem upside down." — Charlie Munger',
  '"Know what you own, and know why you own it." — Peter Lynch',
  '"The individual investor should act consistently as an investor and not as a speculator." — Benjamin Graham',
  '"The four most dangerous words in investing are: \'This time it\'s different.\'" — John Templeton',
  '"The game of speculation is the most uniformly fascinating game in the world." — Jesse Livermore',
  '"It\'s not whether you\'re right or wrong, but how much money you make when you\'re right." — George Soros',
  '"He who lives by the crystal ball will eat shattered glass." — Ray Dalio',
  '"You can\'t predict. You can prepare." — Howard Marks',
  '"Wealth is what you don\'t see." — Morgan Housel',
  '"A goal is a dream with a deadline." — Napoleon Hill',
  '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Winston Churchill',
  '"Compound interest is the eighth wonder of the world." — Albert Einstein',
  '"Our greatest glory is not in never falling, but in rising every time we fall." — Confucius',
  '"You have power over your mind – not outside events. Realize this, and you will find strength." — Marcus Aurelius',
  '"Luck is what happens when preparation meets opportunity." — Seneca',
  '"Buy value and wait." — Jim Rogers',
  '"The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge." — Paul Tudor Jones',
  '"In life and business, there are two cardinal sins. The first is to act precipitously without thought and the second is to not act at all." — Carl Icahn',
];

export function getRandomInspirationalQuote(): string {
  const index = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
  return INSPIRATIONAL_QUOTES[index];
}

export function getContextualAffiliateLinks(keywords: string[]): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];

  if (keywords.some(k => k.includes('금리') || k.includes('예금') || k.includes('rate') || k.includes('savings'))) {
    links.push({ text: 'Compare leading savings rates', url: 'https://example.com/parking-account' });
  }
  if (keywords.some(k => k.includes('주식') || k.includes('투자') || k.includes('AI') || k.includes('stock') || k.includes('invest'))) {
    links.push({ text: 'Recommended: The Psychology of Money', url: 'https://example.com/books' });
  }
  if (keywords.some(k => k.includes('부동산') || k.includes('real estate') || k.includes('property'))) {
    links.push({ text: 'Real estate investment guide', url: 'https://example.com/realestate' });
  }
  if (links.length === 0) {
    links.push({ text: 'Essential finance checklist', url: 'https://example.com/checklist' });
  }

  return links;
}
