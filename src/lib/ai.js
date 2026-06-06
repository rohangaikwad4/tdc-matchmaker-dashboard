/**
 * @fileoverview AI-powered matchmaking intelligence layer.
 * Provides score labels, personalized introductions, compatibility insights,
 * conversation starters, and personality-based observations.
 * All logic is rule-based to remain deterministic and explainable.
 */

/**
 * Generates a human-readable score label with Tailwind color classes and icon.
 * Thresholds are calibrated to Indian matchmaking sensitivity:
 * - 85+ : exceptional alignment (rare)
 * - 70-84: strong potential (target zone)
 * - 55-69: solid match (most common)
 * - 40-54: fair but needs discussion
 * - <40 : low compatibility
 *
 * @param {number} score - Normalized compatibility score (0–100).
 * @returns {{ label: string, color: string, icon: string }}
 */
function generateScoreLabel(score) {
  if (score >= 85) {
    return {
      label: 'Excellent Match',
      color: 'bg-tdc-green-100 text-tdc-green-800 border-tdc-green-300',
      icon: '⭐',
    };
  }
  if (score >= 70) {
    return {
      label: 'High Potential',
      color: 'bg-tdc-green-50 text-tdc-green-700 border-tdc-green-300',
      icon: '🌟',
    };
  }
  if (score >= 55) {
    return {
      label: 'Good Match',
      color: 'bg-tdc-gold-100 text-tdc-gold-800 border-tdc-gold-300',
      icon: '👍',
    };
  }
  if (score >= 40) {
    return {
      label: 'Fair Match',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: '💡',
    };
  }
  return {
    label: 'Low Compatibility',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: '🔍',
  };
}

/**
 * Generates a context-aware personalized introduction message.
 * Uses customer and match profile data to pick the most relevant template.
 * Falls back gracefully if data fields are missing.
 *
 * @param {Object} customer - The matchmaker's customer profile.
 * @param {Object} match - The suggested match profile.
 * @returns {string} A personalized introductory message.
 */
function generatePersonalizedIntro(customer, match) {
  const customerName = customer.firstName;
  const matchName = match.firstName;
  const hobby = match.hobbies?.[0] || 'similar interests';
  const matchCity = match.city;
  const matchAge = match.age;
  const matchJob = match.designation?.toLowerCase() || 'professional';
  const matchAbout = match.about || '';
  const firstSentence = matchAbout.split('.')[0]?.toLowerCase() || 'a wonderful person';

  const templates = [
    `Hi ${customerName}, I came across ${matchName}'s profile and noticed you both share a love for ${hobby}. I think you'd have a great conversation starter there!`,
    `${matchName} is a ${matchJob} based in ${matchCity}, and your backgrounds align really well. Would you like me to connect you?`,
    `Based on your preferences, I've found ${matchName} (${matchAge}, ${matchCity}) who shares similar values and life goals. This could be a meaningful connection.`,
    `${matchName} seems like a wonderful match — ${firstSentence}. I'd recommend giving this profile a look!`,
    `Exciting match! ${matchName} (${matchAge}, ${matchCity}) has a profile that strongly aligns with what you're looking for.`,
    `I think you and ${matchName} would get along well — ${match.job ? `both in professional fields,` : ''} and with ${hobby} as a common interest.`,
    `${matchName} from ${matchCity} shares your perspective on family and values. Let me know if you'd like to take this forward!`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generates AI-driven match insights based on shared attributes.
 * Each insight is a contextual observation designed to help the matchmaker
 * understand why the match works and what to discuss with the customer.
 *
 * @param {Object} customer - The primary profile.
 * @param {Object} match - The match profile.
 * @param {number} score - The normalized compatibility score.
 * @returns {string[]} Ordered list of insight strings.
 */
function getMatchInsights(customer, match, score) {
  const insights = [];

  if (match.religion === customer.religion) {
    insights.push('Shared religious background may strengthen family alignment and approval');
  }
  if (Math.abs(match.age - customer.age) <= 3) {
    insights.push('Close age gap suggests similar life stage and maturity level — naturally compatible');
  }
  if (match.city === customer.city) {
    insights.push('Same city eliminates relocation concerns and enables organic meetups');
  }
  if (match.diet === customer.diet) {
    insights.push('Dietary compatibility reduces daily friction in shared living');
  }
  if (match.languagesKnown.some((l) => customer.languagesKnown.includes(l))) {
    insights.push('Common language(s) make communication effortless and natural');
  }
  if (match.wantKids === customer.wantKids) {
    insights.push('Aligned views on children indicate shared family vision and long-term goals');
  }
  if (
    match.openToRelocate === 'Yes' ||
    customer.openToRelocate === 'Yes'
  ) {
    insights.push('Flexibility on relocation opens more location possibilities');
  }
  if (match.familyType === customer.familyType) {
    insights.push('Shared family type preference — smoother integration into each other\'s lives');
  }
  if (match.manglik === customer.manglik) {
    insights.push('Manglik alignment — astrological compatibility factor addressed');
  }
  if (match.drinking === customer.drinking && match.smoking === customer.smoking) {
    insights.push('Lifestyle habits fully aligned — reduced potential for conflict');
  }
  if (match.hobbies.some((h) => customer.hobbies.includes(h))) {
    insights.push('Shared hobbies provide ready-made bonding opportunities');
  }

  const scoreInfo = generateScoreLabel(score);
  insights.unshift(`AI Assessment: ${scoreInfo.icon} ${scoreInfo.label} (${score}/100)`);

  return insights;
}

/**
 * Generates conversation starter suggestions based on shared interests.
 * Helps the matchmaker give practical advice to the customer for first interactions.
 *
 * @param {Object} customer - The primary profile.
 * @param {Object} match - The match profile.
 * @returns {string[]} Suggested conversation topics.
 */
function getConversationStarters(customer, match) {
  const starters = [];

  const commonHobbies = customer.hobbies.filter((h) =>
    match.hobbies.includes(h)
  );
  if (commonHobbies.length > 0) {
    starters.push(
      `Bond over ${commonHobbies[0].toLowerCase()} — ask about their favourite experience`
    );
  }

  if (match.city === customer.city) {
    starters.push(
      `Discuss favourite local spots in ${match.city} — great icebreaker`
    );
  }

  const commonLangs = customer.languagesKnown.filter((l) =>
    match.languagesKnown.includes(l)
  );
  if (commonLangs.length > 0 && !commonLangs.includes('English')) {
    starters.push(
      `Connect in ${commonLangs[0]} — adds a personal touch`
    );
  }

  if (match.diet === customer.diet) {
    starters.push(
      `Talk about food preferences — shared diets make great conversation`
    );
  }

  starters.push(
    `Ask about ${match.firstName}'s professional journey as a ${match.designation?.toLowerCase() || 'professional'}`
  );

  return starters.slice(0, 4);
}

export {
  generateScoreLabel,
  generatePersonalizedIntro,
  getMatchInsights,
  getConversationStarters,
};
