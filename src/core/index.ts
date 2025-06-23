/**
 * Types spécifiques au Core Directive
 * Utilisés par le serveur, CLI et orchestration
 */

import type { AgentMetadata } from '../index.js';

// ============================================================================
// ENREGISTREMENT ET DÉPLOIEMENT D'AGENTS
// ============================================================================

/**
 * Statut des agents dans le système
 */
export type AgentStatus = 'draft' | 'active' | 'inactive' | 'error' | 'reloading';

/**
 * Stratégies de déploiement pour les sessions actives
 */
export type DeploymentStrategy = 'wait' | 'migrate' | 'force';

/**
 * Stratégies Git pour les modifications non commitées
 */
export type GitCommitStrategy = 'strict' | 'warn' | 'auto-commit' | 'ignore';

/**
 * Enregistrement complet d'un agent en base de données
 * Étend AgentMetadata avec informations système
 */
export interface AgentRegistration extends AgentMetadata {
  /** Identifiant unique */
  id: string;
  
  /** Type unique de l'agent (ex: "project/agent") */
  type: string;
  
  /** ID de l'application parente */
  application_id: string;
  
  /** Version de déploiement incrémentale */
  deployment_version: number;
  
  /** ID du commit Git */
  git_commit_id?: string;
  
  /** Statut de l'agent */
  status: AgentStatus;
  
  /** Définition de la machine XState */
  machine_definition?: Record<string, any>;
  
  /** Timestamps */
  created_at: string;
  updated_at: string;
  deployed_at: string;
  last_reload_at?: string;
  
  /** Métadonnées étendues */
  metadata: {
    file_path?: string;
    source_hash?: string;
    dev_source_hash?: string;
    hot_reload_enabled?: boolean;
    needs_deployment?: boolean;
    deployment_strategy?: DeploymentStrategy;
    performance?: {
      avg_transition_time_ms?: number;
      success_rate?: number;
    };
    [key: string]: any;
  };
  
  /** Message d'erreur si status = 'error' */
  error_message?: string;
}

/**
 * Requête de déploiement d'agent
 */
export interface DeployAgentRequest {
  /** Type de l'agent à déployer */
  agent_type: string;
  
  /** Stratégie pour les sessions actives */
  strategy?: DeploymentStrategy;
  
  /** Forcer un numéro de version */
  force_version?: number;
  
  /** ID du commit Git */
  git_commit_id?: string;
  
  /** Stratégie Git */
  git_strategy?: GitCommitStrategy;
  
  /** Message de commit */
  git_commit_message?: string;
}

/**
 * Réponse de déploiement d'agent
 */
export interface DeployAgentResponse {
  /** Succès du déploiement */
  success: boolean;
  
  /** Type de l'agent */
  agent_type: string;
  
  /** Version précédente */
  old_version: number;
  
  /** Nouvelle version */
  new_version: number;
  
  /** Commit Git */
  git_commit_id?: string;
  
  /** Stratégie Git utilisée */
  git_strategy_used?: GitCommitStrategy;
  
  /** Repository était sale */
  git_was_dirty?: boolean;
  
  /** Fichiers commitées automatiquement */
  git_committed_files?: string[];
  
  /** Timestamp déploiement */
  deployed_at: string;
  
  /** Sessions affectées */
  affected_sessions: number;
  
  /** Temps de compilation */
  compilation_time_ms: number;
  
  /** Temps de déploiement */
  deployment_time_ms: number;
  
  /** Message */
  message: string;
  
  /** Warnings */
  warnings: string[];
}

// ============================================================================
// APPLICATIONS
// ============================================================================

/**
 * Application Directive (conteneur d'agents)
 */
export interface ApplicationRegistration {
  /** Identifiant unique */
  id: string;
  
  /** Nom de l'application */
  name: string;
  
  /** Description */
  description: string;
  
  /** Auteur */
  author: string;
  
  /** Version */
  version: string;
  
  /** Agents associés */
  agents: string[];
  
  /** Métadonnées */
  metadata: {
    category: string;
    tags: string[];
    created_at: string;
  };
}

/**
 * Requête de création d'application
 */
export interface CreateApplicationRequest {
  name: string;
  description: string;
  author: string;
  version: string;
  metadata: {
    category: string;
    tags: string[];
  };
}

// ============================================================================
// SESSIONS
// ============================================================================

/**
 * Statut de session Directive
 */
export type SessionStatus = 'active' | 'completed' | 'error' | 'timeout';

/**
 * Session de travail avec un agent
 */
export interface Session {
  /** ID unique de session */
  session_id: string;
  
  /** Type d'agent utilisé */
  agent_type: string;
  
  /** Statut actuel */
  status: SessionStatus;
  
  /** État XState actuel */
  current_state: string;
  
  /** Contexte de session */
  context: Record<string, any>;
  
  /** Timestamps */
  created_at: string;
  last_activity_at: string;
  completed_at?: string;
  
  /** Métadonnées */
  metadata?: Record<string, any>;
}

/**
 * Entrée de conversation dans une session
 */
export interface ConversationEntry {
  /** Timestamp */
  timestamp: string;
  
  /** Type d'événement */
  event_type: string;
  
  /** Données de l'événement */
  event_data: any;
  
  /** État résultant */
  resulting_state?: string;
  
  /** Métadonnées */
  metadata?: Record<string, any>;
}

// ============================================================================
// API HTTP
// ============================================================================

/**
 * Requête de création de session
 */
export interface CreateSessionRequest {
  /** Type d'agent à instancier */
  agent_type: string;
  
  /** Métadonnées initiales */
  metadata?: Record<string, any>;
}

/**
 * Réponse de création de session
 */
export interface CreateSessionResponse {
  /** Session créée */
  session: Session;
  
  /** État initial */
  initial_state: string;
  
  /** Contexte initial */
  initial_context: Record<string, any>;
}

/**
 * Événement de session
 */
export interface SessionEvent {
  /** Type d'événement */
  type: string;
  
  /** Données de l'événement */
  data?: any;
  
  /** Métadonnées */
  metadata?: Record<string, any>;
}

/**
 * Réponse à un événement de session
 */
export interface SessionEventResponse {
  /** Session mise à jour */
  session: Session;
  
  /** Nouvel état */
  new_state: string;
  
  /** Contexte mis à jour */
  updated_context: Record<string, any>;
  
  /** Actions effectuées */
  actions_performed?: string[];
} 