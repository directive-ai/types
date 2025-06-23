# @directive/types

> **Source unique de vérité** pour tous les types de l'écosystème Directive

## 🎯 Objectif

Ce package résout le **problème de duplication des types** entre `@directive/core` et `@directive/sdk` en centralisant tous les types partagés dans une source unique.

## 🏗️ Architecture

```
@directive/types (Source de vérité)
├── Types de base (AgentMetadata, BaseAgentContext, etc.)
├── Interfaces partagées (registerAgent, IAgentRegistry)
├── Contrainte version XState centralisée
└── Types organisés par domaine

@directive/core                    @directive/sdk
├── import from @directive/types ←  ├── import from @directive/types
├── Implémente IAgentRegistry       ├── Réexporte types essentiels
└── Types internes seulement        └── Configuration webpack
```

## 🔧 Installation

### Automatique (recommandé)
```bash
# Le package est installé automatiquement via peerDependencies
npm install @directive/sdk
# ✅ @directive/types installé automatiquement
```

### Manuelle
```bash
npm install @directive/types
```

## 📦 Contenu du package

### Types pour développeurs d'agents
```typescript
import type { 
  BaseAgentContext,
  BaseAgentEvent, 
  AgentMetadata,
  RegisterAgentOptions,
  AgentContext,
  AgentEvent,
  DirectiveProjectConfig
} from '@directive/types';
```

### Types pour infrastructure (Core)
```typescript
import type {
  AgentRegistration,
  DeployAgentRequest,
  DeployAgentResponse,
  ApplicationRegistration,
  Session,
  CreateSessionRequest
} from '@directive/types/core';
```

### Types pour SDK
```typescript
import type {
  DirectiveAgent,
  WebpackConfigOptions
} from '@directive/types/sdk';
```

## 🎨 Usage

### 1. Développer un agent (utilise SDK qui réexporte types)
```typescript
import { createMachine } from 'xstate';
import type { BaseAgentContext, BaseAgentEvent, registerAgent } from '@directive/sdk';

interface MyContext extends BaseAgentContext {
  customData: string;
}

type MyEvent = BaseAgentEvent | { type: 'CUSTOM'; payload: string };

export const myMachine = createMachine<MyContext, MyEvent>({
  id: 'my-agent',
  initial: 'idle',
  context: {
    currentState: 'idle',
    customData: ''
  },
  states: {
    idle: {
      on: {
        START: 'processing'
      }
    },
    processing: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: { type: 'final' },
    error: { type: 'final' }
  }
});

// Interface standardisée pour enregistrer l'agent
registerAgent({
  type: 'my-project/my-agent',
  machine: myMachine,
  metadata: {
    name: 'My Agent',
    description: 'Description de mon agent',
    version: '1.0.0',
    author: 'Mon équipe'
  }
});
```

### 2. Core utilise les types (évite duplication)
```typescript
// Core peut maintenant importer au lieu de redéfinir
import { 
  AgentRegistration, 
  DeployAgentRequest,
  IAgentRegistry 
} from '@directive/types';

class AgentDirecteurFactory implements IAgentRegistry {
  async registerAgent(options: RegisterAgentOptions): Promise<void> {
    // Implémentation utilisant les types standardisés
  }
}
```

## 🔒 Gestion de version XState

Le package centralise la **contrainte de version XState** :

```json
{
  "peerDependencies": {
    "xstate": "^5.20.0"
  }
}
```

### Vérification automatique
```typescript
import { REQUIRED_XSTATE_VERSION } from '@directive/types';

// Version XState centralisée pour tout l'écosystème
console.log(REQUIRED_XSTATE_VERSION); // "^5.20.0"
```

### Exports XState sécurisés
```typescript
// Types XState avec contrainte de version
import type { StateMachine, EventObject } from '@directive/types';
```

## 📋 Avant/Après

### ❌ Avant (duplications)
```typescript
// 4 définitions différentes d'AgentMetadata !

// SDK/src/types/index.ts
interface AgentMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
}

// Core/src/dto/api.dto.ts  
interface AgentMetadata {
  name: string;
  description: string; 
  version: string;
  author?: string;
  created_at?: string;  // ← Différence !
}

// Core/src/cli/commands/create.ts
interface AgentMetadata {
  id: string;           // ← Beaucoup de différences !
  name: string;
  type: string;
  // ... 10+ fields
}

// Core/src/cli/commands/list.ts 
interface AgentMetadata {
  // ... encore différent !
}
```

### ✅ Après (source unique)
```typescript
// @directive/types/src/index.ts - UNE SEULE DÉFINITION
export interface AgentMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
}

// @directive/types/src/core/index.ts - Étend la base
export interface AgentRegistration extends AgentMetadata {
  id: string;
  type: string;
  // ... fields spécifiques Core
}

// Tous les packages importent depuis @directive/types
import { AgentMetadata } from '@directive/types';
```

## 🔄 Migration path

### 1. Core
```typescript
// Avant
interface AgentMetadata { ... }  // Défini localement

// Après  
import { AgentMetadata, AgentRegistration } from '@directive/types';
```

### 2. SDK
```typescript
// Avant
export interface AgentMetadata { ... }  // Duppliqué

// Après
export * from '@directive/types';  // Réexporte source unique
```

## 📊 Bénéfices

### ✅ **Élimination des duplications**
- **4 définitions d'AgentMetadata** → **1 seule**
- **Types context/event dupliqués** → **Patterns centralisés**
- **registerAgent() manquant** → **Interface définie + implémentée**

### ✅ **Cohérence garantie**
- **Évolution centralisée** : Modifier un type = mis à jour partout
- **Versioning XState** : Une seule version pour tout l'écosystème
- **Interfaces standardisées** : Core et SDK utilisent les mêmes contrats

### ✅ **Maintenabilité**
- **Source unique de vérité** : Plus d'incohérences possibles  
- **Séparation claire** : Types partagés vs logique métier
- **Tests centralisés** : Valider les types une seule fois

### ✅ **Developer Experience**
- **IntelliSense cohérent** : Même autocomplétion partout
- **Documentation centralisée** : Une seule source de doc
- **Migration facilitée** : Types évoluent de façon coordonnée

## 🚀 Roadmap

### v1.0.0 (actuel)
- ✅ Types de base centralisés
- ✅ Élimination duplications Core/SDK
- ✅ Contrainte version XState

### v1.1.0 (futur)
- 🔄 Types pour plugins/extensions
- 🔄 Validation runtime optionnelle
- 🔄 Schemas OpenAPI générés automatiquement

## 📚 API Reference

### Exports principaux
```typescript
// Types de base
export interface BaseAgentContext
export type BaseAgentEvent  
export interface AgentMetadata
export interface RegisterAgentOptions

// Helpers
export type AgentContext<T>
export type AgentEvent<T>
export interface DirectiveProjectConfig

// Système
export interface IAgentRegistry
export const REQUIRED_XSTATE_VERSION

// XState réexports
export type { StateMachine, EventObject } from 'xstate'
```

### Exports par domaine
```typescript
// Types Core (infrastructure)
import type { ... } from '@directive/types/core'

// Types SDK (développement)  
import type { ... } from '@directive/types/sdk'
```

---

**@directive/types v1.0.0** - La fin des duplications de types ! 🎯 