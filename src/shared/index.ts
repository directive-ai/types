/**
 * DTOs partagés pour la nouvelle CLI et les API REST
 * Utilisés par la CLI authentifiée et le serveur Core
 */

// ============================================================================
// AUTHENTIFICATION ET CONFIGURATION CLI
// ============================================================================

/**
 * Configuration globale Directive stockée côté serveur
 */
export interface GlobalConfig {
  version: string;
  preferences: {
    defaultAuthor: string;
    defaultDatabase: string;
  };
  server: {
    url: string;
    environment: 'local' | 'production';
  };
  cli: {
    version: string;
    lastUpdate: string;
  };
}

/**
 * Requête d'initialisation globale
 */
export interface InitRequest {
  author?: string;
  preferences?: Partial<GlobalConfig['preferences']>;
  force?: boolean;
}

/**
 * Configuration CLI locale (~/.directive/cli-config.json)
 */
export interface CliConfig {
  server: {
    url: string;
    environment: 'local' | 'production';
  };
  auth: {
    token?: string;
    user?: {
      id: string;
      email: string;
      name: string;
    };
  };
  preferences: {
    defaultAuthor?: string;
  };
}

// ============================================================================
// CRÉATION DE PROJETS ET APPLICATIONS
// ============================================================================

/**
 * Requête de création de projet/application
 */
export interface CreateProjectRequest {
  name: string;
  description: string;
  author: string;
  local?: boolean;
  skipInstall?: boolean;
  metadata?: {
    category?: string;
    tags?: string[];
  };
}

/**
 * Structure de fichier pour la génération de projet
 */
export interface ProjectFile {
  path: string;
  content: string;
  type: 'typescript' | 'json' | 'markdown' | 'config' | 'template';
}

/**
 * Structure complète d'un projet à générer
 */
export interface ProjectStructure {
  name: string;
  path: string;
  files: ProjectFile[];
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

/**
 * Réponse de création de projet
 */
export interface CreateProjectResponse {
  success: boolean;
  projectPath: string;
  applicationId: string;
  structure: ProjectStructure;
  message: string;
}

// ============================================================================
// CRÉATION D'AGENTS
// ============================================================================

/**
 * Requête de création d'agent
 */
export interface CreateAgentRequest {
  name: string;
  type: 'conversational' | 'workflow' | 'api' | 'custom';
  applicationId: string;
  description?: string;
  metadata?: {
    category?: string;
    tags?: string[];
  };
}

/**
 * Template d'agent avec variables
 */
export interface AgentTemplate {
  agentTs: string;
  agentJson: string;
  descMdx: string;
  variables: Record<string, string>;
}

/**
 * Réponse de création d'agent
 */
export interface CreateAgentResponse {
  success: boolean;
  agentId: string;
  agentType: string;
  files: ProjectFile[];
  message: string;
}

// ============================================================================
// DÉPLOIEMENT ET VERSIONING
// ============================================================================

/**
 * Métadonnées de build/compilation
 */
export interface BuildMetadata {
  buildHash: string;
  buildTime: string;
  bundleSize: number;
  dependencies: Record<string, string>;
  webpackVersion: string;
  nodeVersion: string;
}

/**
 * Requête de déploiement avec bundle
 */
export interface DeploymentRequest {
  agentId: string;
  bundleData: string; // Base64 du bundle JS compilé
  version?: string; // Si non fourni, auto-incrémenté
  force?: boolean;
  metadata: BuildMetadata;
}

/**
 * Réponse de déploiement
 */
export interface DeploymentResponse {
  success: boolean;
  deploymentId: string;
  agentId: string;
  version: string;
  previousVersion?: string;
  url?: string;
  activatedAt: string;
  metadata: BuildMetadata;
  message: string;
  warnings?: string[];
}

/**
 * Version d'un agent déployé
 */
export interface AgentVersion {
  id: string;
  agentId: string;
  version: string;
  bundleSize: number;
  deployedAt: string;
  status: 'active' | 'inactive' | 'rollback';
  metadata: BuildMetadata;
  deploymentId: string;
}

/**
 * Requête de rollback
 */
export interface RollbackRequest {
  agentId: string;
  targetVersion: string;
  force?: boolean;
}

/**
 * Réponse de rollback
 */
export interface RollbackResponse {
  success: boolean;
  agentId: string;
  fromVersion: string;
  toVersion: string;
  activatedAt: string;
  message: string;
}

// ============================================================================
// TEMPLATES ET GÉNÉRATION
// ============================================================================

/**
 * Requête de template d'agent
 */
export interface GetAgentTemplateRequest {
  type: 'conversational' | 'workflow' | 'api' | 'custom';
  variables?: Record<string, string>;
}

/**
 * Réponse de template d'agent
 */
export interface GetAgentTemplateResponse {
  template: AgentTemplate;
  defaultVariables: Record<string, string>;
}

/**
 * Requête de structure de projet
 */
export interface GetProjectStructureRequest {
  name: string;
  author: string;
  description?: string;
}

/**
 * Réponse de structure de projet
 */
export interface GetProjectStructureResponse {
  structure: ProjectStructure;
  templateVariables: Record<string, string>;
}

// ============================================================================
// LISTE ET FILTRAGE
// ============================================================================

/**
 * Options de listage avec filtrage
 */
export interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

/**
 * Réponse paginée générique
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Requête de liste d'applications
 */
export interface ListApplicationsRequest extends ListOptions {
  authorFilter?: string;
  categoryFilter?: string;
}

/**
 * Requête de liste d'agents
 */
export interface ListAgentsRequest extends ListOptions {
  applicationFilter?: string;
  typeFilter?: string;
  statusFilter?: string;
}

/**
 * Requête de liste de déploiements
 */
export interface ListDeploymentsRequest extends ListOptions {
  agentFilter?: string;
  versionFilter?: string;
  statusFilter?: string;
}

// ============================================================================
// STATUT ET MONITORING
// ============================================================================

/**
 * Statut d'un agent
 */
export interface AgentStatusInfo {
  agentId: string;
  agentType: string;
  status: 'active' | 'inactive' | 'error' | 'deploying';
  currentVersion: string;
  lastDeployment?: string;
  activeSessions?: number;
  errorMessage?: string;
  uptime?: string;
  performance?: {
    avgResponseTime: number;
    successRate: number;
    totalRequests: number;
  };
}

/**
 * Informations serveur
 */
export interface ServerInfo {
  version: string;
  environment: 'local' | 'production';
  uptime: string;
  status: 'healthy' | 'degraded' | 'down';
  features: {
    authentication: boolean;
    deployment: boolean;
    versioning: boolean;
    monitoring: boolean;
  };
  stats: {
    totalApplications: number;
    totalAgents: number;
    activeDeployments: number;
    activeSessions: number;
  };
}

// ============================================================================
// RÉPONSES API GÉNÉRIQUES
// ============================================================================

/**
 * Réponse API standard
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  warnings?: string[];
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

/**
 * Erreur API standardisée
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
} 