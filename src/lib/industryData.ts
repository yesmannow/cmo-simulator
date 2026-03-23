import { Industry } from '@/types';

export function getIndustryFactor(industry: Industry): number {
  const factors: Record<Industry, number> = {
    healthcare: 1.2,
    legal: 1.0,
    ecommerce: 0.8,
    saas: 1.1,
    fintech: 1.1,
    education: 1.0,
    'real-estate': 0.9,
    'food-delivery': 0.7,
    fitness: 0.9,
    automotive: 0.9,
    travel: 0.8,
    gaming: 0.8,
    fashion: 0.7,
    construction: 1.0,
    energy: 1.1,
    agritech: 1.2,
    manufacturing: 1.0,
    nonprofit: 1.1,
    music: 0.7,
    sports: 0.9,
    'pet-care': 1.0,
    'home-services': 0.8,
    cannabis: 0.9,
    space: 1.3
  };
  return factors[industry];
}

export function getAvgCustomerValue(industry: Industry): number {
  const values: Record<Industry, number> = {
    healthcare: 5000,
    legal: 8000,
    ecommerce: 150,
    saas: 2500,
    fintech: 1200,
    education: 800,
    'real-estate': 15000,
    'food-delivery': 35,
    fitness: 200,
    automotive: 25000,
    travel: 300,
    gaming: 60,
    fashion: 120,
    construction: 50000,
    energy: 8000,
    agritech: 10000,
    manufacturing: 75000,
    nonprofit: 250,
    music: 15,
    sports: 80,
    'pet-care': 180,
    'home-services': 150,
    cannabis: 90,
    space: 500000
  };
  return values[industry];
}
