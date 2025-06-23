/**
 * @directive/types - Types partagés pour l'écosystème Directive
 * 
 * Source unique de vérité pour tous les types utilisés par :
 * - @directive/core (serveur + CLI)
 * - @directive/sdk (outils développement)
 * - Projets utilisateurs (agents)
 */

// ============================================================================
// CONTRÔLE DE VERSION XSTATE
// ============================================================================

/**
 * Version XState requise pour l'écosystème Directive
 * Centralisée ici pour éviter les incompatibilités
 */
export const REQUIRED_XSTATE_VERSION = '^5.20.0';

/**
 * Réexporte des types XState essentiels avec contrainte de version
 */
export type { StateMachine, EventObject } from 'xstate';

// ============================================================================
// TYPES DE BASE AGENTS
// ============================================================================

/**
 * Contexte de base pour tous les agents Directive
 * Utilisé comme interface commune entre Core et SDK
 */
export interface BaseAgentContext {
  /** État actuel de l'agent */
  currentState: string;
  
  /** Données de la requête en cours */
  requestData?: any;
  
  /** Résultat du traitement */
  result?: any;
  
  /** Erreur éventuelle */
  error?: string;
  
  /** ID de session Directive */
  sessionId?: string;
  
  /** Métadonnées de session */
  sessionMetadata?: Record<string, any>;
}

/**
 * Événements de base pour tous les agents Directive
 * Pattern commun réutilisable entre agents
 */
export type BaseAgentEvent =
  | { type: 'START'; data?: any }
  | { type: 'PROCESS'; payload: any }
  | { type: 'SUCCESS'; result: any }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' }
  | { type: 'TIMEOUT' }
  | { type: 'CANCEL' };

// ============================================================================
// MÉTADONNÉES AGENTS
// ============================================================================

/**
 * Métadonnées d'agent - version simplifiée pour SDK/développeurs
 * Source de vérité pour les informations de base d'un agent
 */
export interface AgentMetadata {
  /** Nom lisible de l'agent */
  name: string;
  
  /** Description du comportement */
  description: string;
  
  /** Version sémantique */
  version: string;
  
  /** Auteur de l'agent */
  author?: string;
}

/**
 * Interface pour l'enregistrement d'un agent
 * Utilisée par registerAgent() dans le SDK
 */
export interface RegisterAgentOptions {
  /** Type unique de l'agent (format: "project/agent") */
  type: string;
  
  /** Machine XState (any pour éviter complexité v5) */
  machine: any;
  
  /** Métadonnées de base */
  metadata: AgentMetadata;
}

// ============================================================================
// HELPERS TYPES UTILITAIRES
// ============================================================================

/**
 * Helper pour étendre le contexte de base avec des types spécifiques
 */
export type AgentContext<T = {}> = BaseAgentContext & T;

/**
 * Helper pour étendre les événements de base
 */
export type AgentEvent<T extends Record<string, any> = {}> = BaseAgentEvent | T[keyof T];

/**
 * Configuration minimale d'un projet Directive
 * Utilisée dans directive-conf.ts
 */
export interface DirectiveProjectConfig {
  application: {
    name: string;
    description: string;
    author: string;
    version: string;
    metadata?: {
      category?: string;
      tags?: string[];
    };
  };
}

// ============================================================================
// INTERFACES SYSTÈME
// ============================================================================

/**
 * Interface pour le système d'enregistrement d'agents
 * Implémentée par @directive/core, utilisée par le SDK
 */
export interface IAgentRegistry {
  registerAgent(options: RegisterAgentOptions): void;
}

/**
 * Déclaration globale de la fonction registerAgent
 * Disponible quand l'agent est chargé par le serveur Directive
 */
declare global {
  function registerAgent(options: RegisterAgentOptions): void;
}

// ============================================================================
// EXPORTS ORGANISÉS
// ============================================================================

// Types pour développeurs d'agents (SDK)
export * from './sdk/index';

// Types pour infrastructure (Core)  
export * from './core/index'; 