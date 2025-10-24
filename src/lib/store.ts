import { createStore } from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware';
import { SimulationState, PlayerInput, MarketConditions } from '../types/engine';
import { runSimulationTick, initializeSimulationState } from '../engine';

interface SimulationSlice {
  simulationState: SimulationState;
  isRunning: boolean;
  advanceTick: (playerInputs: PlayerInput, marketConditions: MarketConditions) => void;
  reset: () => void;
  play: () => void;
  pause: () => void;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  currentQuarter: 'setup' | 'strategy' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'completed';
  simulationId: string;
}

interface InputSlice {
  channelBudgets: Record<string, number>; // Use string for simplicity
  plannedPromotions: any[]; // TODO: define Promotion type
  setBudget: (channel: string, value: number) => void;
  addPromotion: (promo: any) => void;
  clearInputs: () => void;
}

interface UiSlice {
  activeTab: 'dashboard' | 'planning';
  modal: { isOpen: boolean; content: any };
  setActiveTab: (tab: 'dashboard' | 'planning') => void;
  openModal: (content: any) => void;
  closeModal: () => void;
}

type StoreState = SimulationSlice & InputSlice & UiSlice;

const initialSimulationState = initializeSimulationState();

export const vanillaStore = createStore<StoreState>()(
  subscribeWithSelector((set, get) => ({
    // Simulation Slice
    simulationState: initialSimulationState,
    isRunning: false,
    status: 'not_started',
    currentQuarter: 'setup',
    simulationId: '',
    advanceTick: (playerInputs, marketConditions) => {
      const { simulationState } = get();
      const newState = runSimulationTick(simulationState, playerInputs, marketConditions);
      set({ 
        simulationState: newState,
        currentQuarter: newState.tick === 0 ? 'Q1' : 'Q2' // Simple mapping, adjust as needed
      });
    },
    reset: () => {
      set({ 
        simulationState: initializeSimulationState(), 
        isRunning: false,
        status: 'not_started',
        currentQuarter: 'setup'
      });
    },
    play: () => {
      set({ isRunning: true, status: 'in_progress' });
    },
    pause: () => {
      set({ isRunning: false });
    },

    // Input Slice
    channelBudgets: { tv: 0, radio: 0, print: 0, digital: 0, social: 0, seo: 0, events: 0, pr: 0 },
    plannedPromotions: [],
    setBudget: (channel, value) => {
      set(state => ({
        channelBudgets: { ...state.channelBudgets, [channel]: value }
      }));
    },
    addPromotion: (promo) => {
      set(state => ({
        plannedPromotions: [...state.plannedPromotions, promo]
      }));
    },
    clearInputs: () => {
      set({
        channelBudgets: { tv: 0, radio: 0, print: 0, digital: 0, social: 0, seo: 0, events: 0, pr: 0 },
        plannedPromotions: []
      });
    },

    // UI Slice
    activeTab: 'dashboard',
    modal: { isOpen: false, content: null },
    setActiveTab: (tab) => set({ activeTab: tab }),
    openModal: (content) => set({ modal: { isOpen: true, content } }),
    closeModal: () => set({ modal: { isOpen: false, content: null } })
  }))
);

// React hook
import { useStore } from 'zustand';
export const useGameStore = <T>(selector: (state: StoreState) => T) =>
  useStore(vanillaStore, selector);
