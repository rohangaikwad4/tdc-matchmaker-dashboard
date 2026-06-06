/**
 * @fileoverview Matchmaking engine with gender-specific 16-dimension scoring.
 * Designed for Indian matchmaking context with cultural considerations
 * (caste, manglik, diet, family type, etc.).
 */

import profiles from '@/data/profiles';

/**
 * Scoring dimension configuration.
 * Each dimension has a max weight and gender-specific evaluation logic.
 */
const DIMENSIONS = {
  AGE: { max: 20, label: 'Age Compatibility' },
  INCOME: { max: 15, label: 'Financial Alignment' },
  HEIGHT: { max: 10, label: 'Height Compatibility' },
  RELIGION: { max: 15, label: 'Religious Alignment' },
  CASTE: { max: 8, label: 'Caste Background' },
  WANT_KIDS: { max: 10, label: 'Family Planning' },
  RELOCATION: { max: 8, label: 'Location Flexibility' },
  DIET: { max: 8, label: 'Dietary Compatibility' },
  EDUCATION: { max: 6, label: 'Educational Alignment' },
  LANGUAGE: { max: 5, label: 'Language Compatibility' },
  HOBBIES: { max: 5, label: 'Shared Interests' },
  MANGLIK: { max: 5, label: 'Manglik Compatibility' },
  PETS: { max: 3, label: 'Pet Preference' },
  FAMILY_TYPE: { max: 5, label: 'Family Values' },
  LIFESTYLE: { max: 6, label: 'Lifestyle Compatibility' },
  SIBLINGS: { max: 3, label: 'Family Size' },
};

/**
 * Ordered education levels for compatibility comparison.
 */
const EDU_LEVELS = [
  'High School', 'B.Com', 'BA', 'B.Sc', 'BBA',
  'LLB', 'B.Tech', 'MBBS', 'M.Sc', 'M.Tech',
  'MBA', 'CA', 'Pharma', 'PhD',
];

/**
 * Determines how well two lifestyles align based on smoking and drinking habits.
 */
function scoreLifestyle(customer, candidate) {
  const smokerMatch = customer.smoking === candidate.smoking ? 1 : 0;
  const drinkerMatch = customer.drinking === candidate.drinking ? 1 : 0;
  return (smokerMatch + drinkerMatch) * 3;
}

/**
 * Scores compatibility between a customer and a candidate across all dimensions.
 * Scoring logic is gender-specific for age, income, and height to reflect
 * traditional Indian matchmaking preferences while remaining modern and flexible.
 *
 * @param {Object} customer - The primary profile seeking matches.
 * @param {Object} candidate - A potential match candidate.
 * @returns {{ score: number, reasons: string[] }}
 */
function scoreCompatibility(customer, candidate) {
  let score = 0;
  const reasons = [];

  // --- AGE COMPATIBILITY ---
  // Male customers: prefer younger female partners (traditional Indian context).
  // Female customers: prefer partners within a narrow age band (maturity alignment).
  if (customer.gender === 'male') {
    if (candidate.age < customer.age) {
      const diff = customer.age - candidate.age;
      if (diff <= 5) {
        score += DIMENSIONS.AGE.max;
        reasons.push('Ideal age gap (2–5 years younger)');
      } else {
        score += 14;
        reasons.push('Age compatible (younger match)');
      }
    } else if (candidate.age === customer.age) {
      score += DIMENSIONS.AGE.max - 5;
      reasons.push('Same age — shared generational context');
    } else {
      score += 5;
      reasons.push('Age difference noted — open-minded choice');
    }
  } else {
    const ageDiff = Math.abs(customer.age - candidate.age);
    if (ageDiff <= 3) {
      score += DIMENSIONS.AGE.max;
      reasons.push('Well-matched age group — strong life stage alignment');
    } else if (ageDiff <= 6) {
      score += 12;
      reasons.push('Acceptable age difference');
    } else {
      score += 4;
      reasons.push('Significant age gap — may affect life stage alignment');
    }
  }

  // --- INCOME COMPATIBILITY ---
  // Male customers: traditional preference for partner with stable but lower income.
  // Female customers: value financial parity or independence.
  if (customer.gender === 'male') {
    if (candidate.income < customer.income) {
      score += DIMENSIONS.INCOME.max;
      reasons.push('Traditional income alignment');
    } else if (candidate.income >= customer.income) {
      score += 8;
      reasons.push('Independent professional — modern partnership');
    }
  } else {
    const incomeRatio =
      Math.min(customer.income, candidate.income) /
      Math.max(customer.income, candidate.income);
    if (incomeRatio > 0.7) {
      score += DIMENSIONS.INCOME.max;
      reasons.push('Similar income bracket — financial harmony');
    } else {
      score += 8;
      reasons.push('Financially stable — complementary earning');
    }
  }

  // --- HEIGHT COMPATIBILITY ---
  // Male customers: prefer shorter female partners (Indian cultural norm).
  // Female customers: prefer similar height for comfort and compatibility.
  if (customer.gender === 'male') {
    if (candidate.height < customer.height) {
      const diff = customer.height - candidate.height;
      if (diff >= 5 && diff <= 20) {
        score += DIMENSIONS.HEIGHT.max;
        reasons.push('Height compatible — ideal difference');
      } else {
        score += 7;
        reasons.push('Height compatible');
      }
    } else {
      score += 3;
      reasons.push('Height difference noted');
    }
  } else {
    const heightDiff = Math.abs(customer.height - candidate.height);
    if (heightDiff <= 15) {
      score += DIMENSIONS.HEIGHT.max;
      reasons.push('Well-matched height');
    } else if (heightDiff <= 25) {
      score += 6;
      reasons.push('Acceptable height difference');
    } else {
      score += 2;
    }
  }

  // --- RELIGION ---
  if (customer.religion === candidate.religion) {
    score += DIMENSIONS.RELIGION.max;
    reasons.push('Same religion — strong cultural alignment');
  } else {
    score += 3;
    reasons.push('Open to inter-faith — progressive outlook');
  }

  // --- CASTE (progressive — inter-caste rewarded) ---
  if (customer.caste === candidate.caste) {
    score += 5;
    reasons.push('Same caste background');
  } else {
    score += DIMENSIONS.CASTE.max;
    reasons.push('Open to inter-caste match — progressive choice');
  }

  // --- WANT KIDS ---
  if (customer.wantKids === candidate.wantKids) {
    score += DIMENSIONS.WANT_KIDS.max;
    reasons.push('Agree on children — shared family vision');
  } else if (
    customer.wantKids === 'Maybe' ||
    candidate.wantKids === 'Maybe'
  ) {
    score += 5;
    reasons.push('Open discussion on children');
  }

  // --- RELOCATION ---
  if (
    customer.openToRelocate === 'Yes' ||
    candidate.openToRelocate === 'Yes'
  ) {
    score += DIMENSIONS.RELOCATION.max;
    reasons.push('Flexible on relocation — broadens possibilities');
  } else if (customer.city === candidate.city) {
    score += DIMENSIONS.RELOCATION.max;
    reasons.push('Same city — no relocation needed');
  }

  // --- DIET ---
  if (customer.diet === candidate.diet) {
    score += DIMENSIONS.DIET.max;
    reasons.push('Same dietary preference — effortless meals');
  } else if (
    customer.diet === 'Vegetarian' &&
    candidate.diet !== 'Non-Vegetarian'
  ) {
    score += 4;
    reasons.push('Compatible dietary habits');
  }

  // --- EDUCATION ---
  const custEduIdx = EDU_LEVELS.indexOf(customer.degree);
  const candEduIdx = EDU_LEVELS.indexOf(candidate.degree);
  if (Math.abs(custEduIdx - candEduIdx) <= 2) {
    score += DIMENSIONS.EDUCATION.max;
    reasons.push('Similar education background — intellectual alignment');
  } else {
    score += 2;
  }

  // --- LANGUAGE ---
  const commonLang = customer.languagesKnown.filter((l) =>
    candidate.languagesKnown.includes(l)
  );
  if (commonLang.length > 0) {
    score += Math.min(DIMENSIONS.LANGUAGE.max, commonLang.length * 2);
    reasons.push(`Share ${commonLang.length} common language(s)`);
  }

  // --- HOBBIES ---
  const commonHobbies = customer.hobbies.filter((h) =>
    candidate.hobbies.includes(h)
  );
  if (commonHobbies.length > 0) {
    score += Math.min(DIMENSIONS.HOBBIES.max, commonHobbies.length * 2);
    reasons.push(`Share ${commonHobbies.length} common hobby(ies)`);
  }

  // --- MANGLIK ---
  if (customer.manglik === candidate.manglik) {
    score += DIMENSIONS.MANGLIK.max;
    reasons.push('Manglik compatibility — astrological alignment');
  } else {
    score += 2;
  }

  // --- PETS ---
  if (customer.openToPets === candidate.openToPets) {
    score += DIMENSIONS.PETS.max;
    reasons.push('Agree on pets');
  }

  // --- FAMILY TYPE (joint vs nuclear preference) ---
  if (customer.familyType === candidate.familyType) {
    score += DIMENSIONS.FAMILY_TYPE.max;
    reasons.push('Same family type preference');
  } else {
    score += 2;
    reasons.push('Flexible on family structure');
  }

  // --- LIFESTYLE (smoking + drinking alignment) ---
  const lifestyleScore = scoreLifestyle(customer, candidate);
  if (lifestyleScore > 0) {
    score += lifestyleScore;
    if (lifestyleScore === DIMENSIONS.LIFESTYLE.max) {
      reasons.push('Aligned lifestyle habits — reduced daily friction');
    } else {
      reasons.push('Partially aligned lifestyle habits');
    }
  }

  // --- SIBLINGS (similar family size) ---
  if (Math.abs(customer.siblings - candidate.siblings) <= 1) {
    score += DIMENSIONS.SIBLINGS.max;
    reasons.push('Similar family size background');
  }

  // Normalize to 0–100 cap
  const normalizedScore = Math.min(100, Math.round(score));

  return { score: normalizedScore, reasons };
}

/**
 * Generates a plain-language compatibility summary for the top match.
 * Highlights strengths and flags considerations for the matchmaker.
 *
 * @param {Object} customer - The primary profile.
 * @param {Object} topMatch - The highest-scoring match result.
 * @returns {{ strengths: string[], considerations: string[], overallVerdict: string }}
 */
function getCompatibilitySummary(customer, topMatch) {
  const { profile: match, score, reasons } = topMatch;
  const strengths = [];
  const considerations = [];

  // Extract strengths from high-scoring dimensions
  if (customer.religion === match.religion) {
    strengths.push('Strong religious alignment — families likely to approve');
  }
  if (customer.city === match.city) {
    strengths.push('Same city — easy to meet and build connection');
  }
  if (
    Math.abs(customer.age - match.age) <= 3
  ) {
    strengths.push('Close in age — natural life stage alignment');
  }
  if (
    customer.languagesKnown.some((l) => match.languagesKnown.includes(l))
  ) {
    strengths.push('Share common languages — communication flows naturally');
  }
  if (customer.wantKids === match.wantKids) {
    strengths.push('Aligned on family planning — avoids future conflict');
  }
  if (customer.diet === match.diet) {
    strengths.push('Dietary compatibility — daily life harmony');
  }

  // Flag considerations
  if (customer.religion !== match.religion) {
    considerations.push('Different religious backgrounds — may need family discussion');
  }
  if (customer.city !== match.city) {
    considerations.push('Different cities — relocation conversation needed');
  }
  if (customer.manglik !== match.manglik) {
    considerations.push('Manglik mismatch — some families may have concerns');
  }
  if (
    Math.abs(customer.age - match.age) > 6
  ) {
    considerations.push('Age gap may require open conversation about life stage expectations');
  }
  if (customer.familyType !== match.familyType) {
    considerations.push('Different family type preferences — discuss living arrangements');
  }
  if (customer.diet !== match.diet) {
    considerations.push('Dietary differences — may need mutual accommodation');
  }

  let overallVerdict;
  if (score >= 80) {
    overallVerdict = 'Excellent match with strong alignment across most dimensions. Highly recommended for introduction.';
  } else if (score >= 65) {
    overallVerdict = 'Strong match with good alignment. A few considerations to discuss, but overall very promising.';
  } else if (score >= 45) {
    overallVerdict = 'Decent match with some compatible areas. Worth exploring with open communication on differences.';
  } else {
    overallVerdict = 'Moderate compatibility. Proceed only if the customer is open to significant differences.';
  }

  return { strengths, considerations, overallVerdict };
}

/**
 * Finds the top 20 most compatible matches for a given customer profile.
 * Filters candidates to opposite gender only, scores each, sorts descending.
 *
 * @param {string} customerId - The customer profile ID.
 * @returns {Array<{ profile: Object, score: number, reasons: string[] }>}
 */
function getMatchesForCustomer(customerId) {
  const customer = profiles.find((p) => p.id === customerId);
  if (!customer) return [];

  const oppositeGender = customer.gender === 'male' ? 'female' : 'male';
  const candidates = profiles.filter((p) => p.gender === oppositeGender);

  const matches = candidates.map((candidate) => {
    const { score, reasons } = scoreCompatibility(customer, candidate);
    return { profile: candidate, score, reasons };
  });

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 20);
}

export { getMatchesForCustomer, getCompatibilitySummary, DIMENSIONS };
