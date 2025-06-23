/**
 * Types spécifiques au SDK Directive
 * Utilisés par les développeurs pour créer des agents
 */

import type { BaseAgentContext, BaseAgentEvent, AgentMetadata } from '../index.js';

// ============================================================================
// INTERFACES POUR DÉVELOPPEURS D'AGENTS
// ============================================================================

/**
 * Interface simplifiée pour développer des agents Directive
 * Utilisée dans les projets utilisateurs
 */
export interface DirectiveAgent<
  TContext extends BaseAgentContext = BaseAgentContext,
  TEvent extends BaseAgentEvent = BaseAgentEvent
> {
  /** Machine XState (simplifié pour éviter complexité v5) */
  machine: any;
  
  /** Métadonnées de l'agent */
  metadata: AgentMetadata;
}

// ============================================================================
// CONFIGURATION WEBPACK
// ============================================================================

/**
 * Options pour la configuration webpack Directive
 */
export interface WebpackConfigOptions {
  /** Mode de build */
  mode?: 'development' | 'production';
  
  /** Point d'entrée */
  entry?: string | string[];
  
  /** Configuration personnalisée */
  customize?: {
    /** Externals supplémentaires */
    externals?: Record<string, string>;
    
    /** Alias de résolution */
    alias?: Record<string, string>;
    
    /** Plugins webpack additionnels */
    plugins?: any[];
  };
} 