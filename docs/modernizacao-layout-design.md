# Proposta de Modernização de Layout e Design System - EGR App

## 1. ANÁLISE DO ESTADO ATUAL

### Pontos Positivos Identificados
✓ Design System já implementado com tokens CSS (`--smc-egr-*`)
✓ Uso consistente de PrimeNG 19 em todos os componentes
✓ Prefixo `smc-egr-` aplicado corretamente
✓ Estrutura de componentes bem organizada
✓ Responsividade básica implementada

### Pontos de Melhoria Identificados
⚠ **Inconsistência visual:** Cada componente possui estilos próprios que não seguem um padrão visual unificado
⚠ **Falta de hierarquia visual:** Cards e seções não possuem elevação/profundidade clara
⚠ **Espaçamento irregular:** Valores hardcoded de margin/padding em vez de tokens do design system
⚠ **Cores não otimizadas:** Paleta de cores existe mas não é aplicada de forma harmoniosa
⚠ **Tipografia básica:** Hierarquia tipográfica pouco expressiva
⚠ **Layout não aproveita recursos modernos:** Grid e Flexbox poderiam ser melhor explorados
⚠ **Feedback visual limitado:** Estados de hover, focus e disabled poderiam ser mais expressivos

---

## 2. PROPOSTA DE MODERNIZAÇÃO

### 2.1. PRINCÍPIOS DE DESIGN

#### **Material Design 3 Inspirado (com identidade PUC Minas)**
- **Elevation System:** Uso de sombras e elevação para criar profundidade
- **Motion Design:** Transições suaves e micro-interações
- **Color Psychology:** Cores aplicadas com significado (sucesso, erro, info)
- **Spacing System:** Escala consistente de 4px base
- **Typography Scale:** Hierarquia visual clara

#### **Mobile-First & Responsive**
- Layout fluido que se adapta de mobile (320px) até desktop (1920px+)
- Breakpoints: `sm: 576px`, `md: 768px`, `lg: 992px`, `xl: 1200px`, `2xl: 1536px`

#### **Accessibility First**
- Contraste WCAG AAA onde possível (mínimo AA)
- Focus states visíveis e consistentes
- Touch targets mínimos de 44x44px

---

### 2.2. NOVA PALETA DE CORES (PUC Minas + Moderna)

```scss
// ========================================
// CORES PRIMÁRIAS E INSTITUCIONAIS
// ========================================

// Verde PUC (mantém identidade)
--smc-egr-primary-50: #e8f5e9;
--smc-egr-primary-100: #c8e6c9;
--smc-egr-primary-200: #a5d6a7;
--smc-egr-primary-300: #81c784;
--smc-egr-primary-400: #66bb6a;
--smc-egr-primary-500: #4caf50;  // PRINCIPAL
--smc-egr-primary-600: #43a047;
--smc-egr-primary-700: #388e3c;
--smc-egr-primary-800: #2e7d32;
--smc-egr-primary-900: #1b5e20;

// Azul Institucional (acento)
--smc-egr-secondary-50: #e3f2fd;
--smc-egr-secondary-100: #bbdefb;
--smc-egr-secondary-200: #90caf9;
--smc-egr-secondary-300: #64b5f6;
--smc-egr-secondary-400: #42a5f5;
--smc-egr-secondary-500: #2196f3;  // PRINCIPAL
--smc-egr-secondary-600: #1e88e5;
--smc-egr-secondary-700: #1976d2;
--smc-egr-secondary-800: #1565c0;
--smc-egr-secondary-900: #0d47a1;

// ========================================
// CORES SEMÂNTICAS
// ========================================

// Sucesso (Verde mais saturado)
--smc-egr-success: #10b981;
--smc-egr-success-light: #d1fae5;
--smc-egr-success-dark: #065f46;

// Erro/Perigo (Vermelho equilibrado)
--smc-egr-danger: #ef4444;
--smc-egr-danger-light: #fee2e2;
--smc-egr-danger-dark: #991b1b;

// Aviso (Amarelo âmbar)
--smc-egr-warning: #f59e0b;
--smc-egr-warning-light: #fef3c7;
--smc-egr-warning-dark: #92400e;

// Informação (Azul claro)
--smc-egr-info: #3b82f6;
--smc-egr-info-light: #dbeafe;
--smc-egr-info-dark: #1e3a8a;

// ========================================
// CORES NEUTRAS (Escala de Cinza Moderna)
// ========================================

--smc-egr-gray-50: #f9fafb;
--smc-egr-gray-100: #f3f4f6;
--smc-egr-gray-200: #e5e7eb;
--smc-egr-gray-300: #d1d5db;
--smc-egr-gray-400: #9ca3af;
--smc-egr-gray-500: #6b7280;
--smc-egr-gray-600: #4b5563;
--smc-egr-gray-700: #374151;
--smc-egr-gray-800: #1f2937;
--smc-egr-gray-900: #111827;

// ========================================
// CORES DE SUPERFÍCIE E BACKGROUND
// ========================================

--smc-egr-surface-0: #ffffff;
--smc-egr-surface-50: #fafafa;
--smc-egr-surface-100: #f5f5f5;
--smc-egr-surface-200: #eeeeee;
--smc-egr-surface-300: #e0e0e0;

--smc-egr-background: #f9fafb;
--smc-egr-surface: #ffffff;

// ========================================
// CORES DE TEXTO
// ========================================

--smc-egr-text-primary: #111827;
--smc-egr-text-secondary: #6b7280;
--smc-egr-text-tertiary: #9ca3af;
--smc-egr-text-disabled: #d1d5db;
--smc-egr-text-on-primary: #ffffff;
--smc-egr-text-on-secondary: #ffffff;

// ========================================
// CORES DE BORDA
// ========================================

--smc-egr-border-light: #e5e7eb;
--smc-egr-border-medium: #d1d5db;
--smc-egr-border-dark: #9ca3af;
--smc-egr-border-focus: var(--smc-egr-primary-500);
```

---

### 2.3. SISTEMA DE ELEVAÇÃO (SOMBRAS)

```scss
// ========================================
// ELEVATION SYSTEM (Material Design 3)
// ========================================

--smc-egr-shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--smc-egr-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--smc-egr-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--smc-egr-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--smc-egr-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--smc-egr-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--smc-egr-shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
--smc-egr-shadow-focus: 0 0 0 3px rgba(76, 175, 80, 0.15); // Verde com alpha
```

---

### 2.4. TIPOGRAFIA APRIMORADA

```scss
// ========================================
// FONT FAMILY
// ========================================

--smc-egr-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--smc-egr-font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

// ========================================
// FONT SIZE SCALE (Tailwind-inspired)
// ========================================

--smc-egr-text-xs: 0.75rem;    // 12px
--smc-egr-text-sm: 0.875rem;   // 14px
--smc-egr-text-base: 1rem;     // 16px (default)
--smc-egr-text-lg: 1.125rem;   // 18px
--smc-egr-text-xl: 1.25rem;    // 20px
--smc-egr-text-2xl: 1.5rem;    // 24px
--smc-egr-text-3xl: 1.875rem;  // 30px
--smc-egr-text-4xl: 2.25rem;   // 36px
--smc-egr-text-5xl: 3rem;      // 48px

// ========================================
// FONT WEIGHT
// ========================================

--smc-egr-font-light: 300;
--smc-egr-font-normal: 400;
--smc-egr-font-medium: 500;
--smc-egr-font-semibold: 600;
--smc-egr-font-bold: 700;

// ========================================
// LINE HEIGHT
// ========================================

--smc-egr-leading-none: 1;
--smc-egr-leading-tight: 1.25;
--smc-egr-leading-snug: 1.375;
--smc-egr-leading-normal: 1.5;
--smc-egr-leading-relaxed: 1.625;
--smc-egr-leading-loose: 2;
```

---

### 2.5. SPACING SYSTEM (Escala 4px base)

```scss
// ========================================
// SPACING SCALE
// ========================================

--smc-egr-space-0: 0;
--smc-egr-space-1: 0.25rem;   // 4px
--smc-egr-space-2: 0.5rem;    // 8px
--smc-egr-space-3: 0.75rem;   // 12px
--smc-egr-space-4: 1rem;      // 16px
--smc-egr-space-5: 1.25rem;   // 20px
--smc-egr-space-6: 1.5rem;    // 24px
--smc-egr-space-8: 2rem;      // 32px
--smc-egr-space-10: 2.5rem;   // 40px
--smc-egr-space-12: 3rem;     // 48px
--smc-egr-space-16: 4rem;     // 64px
--smc-egr-space-20: 5rem;     // 80px
--smc-egr-space-24: 6rem;     // 96px
```

---

### 2.6. BORDER RADIUS (Suavidade Moderna)

```scss
// ========================================
// BORDER RADIUS
// ========================================

--smc-egr-radius-none: 0;
--smc-egr-radius-sm: 0.25rem;   // 4px
--smc-egr-radius-md: 0.375rem;  // 6px
--smc-egr-radius-lg: 0.5rem;    // 8px
--smc-egr-radius-xl: 0.75rem;   // 12px
--smc-egr-radius-2xl: 1rem;     // 16px
--smc-egr-radius-full: 9999px;  // Pill shape
```

---

### 2.7. TRANSIÇÕES E ANIMAÇÕES

```scss
// ========================================
// TRANSITIONS
// ========================================

--smc-egr-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--smc-egr-transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--smc-egr-transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--smc-egr-transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);

// Easing functions
--smc-egr-ease-in: cubic-bezier(0.4, 0, 1, 1);
--smc-egr-ease-out: cubic-bezier(0, 0, 0.2, 1);
--smc-egr-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 3. COMPONENTES REDESENHADOS

### 3.1. CARDS MODERNOS

```scss
// ========================================
// MODERN CARD COMPONENT
// ========================================

.smc-egr-card {
  background: var(--smc-egr-surface);
  border-radius: var(--smc-egr-radius-xl);
  box-shadow: var(--smc-egr-shadow-sm);
  border: 1px solid var(--smc-egr-border-light);
  padding: var(--smc-egr-space-6);
  transition: all var(--smc-egr-transition-base);

  &:hover {
    box-shadow: var(--smc-egr-shadow-md);
    transform: translateY(-2px);
  }

  &-header {
    font-size: var(--smc-egr-text-xl);
    font-weight: var(--smc-egr-font-semibold);
    color: var(--smc-egr-text-primary);
    margin-bottom: var(--smc-egr-space-4);
    padding-bottom: var(--smc-egr-space-4);
    border-bottom: 2px solid var(--smc-egr-primary-500);
  }

  &-body {
    color: var(--smc-egr-text-secondary);
    line-height: var(--smc-egr-leading-relaxed);
  }

  &-footer {
    margin-top: var(--smc-egr-space-6);
    padding-top: var(--smc-egr-space-4);
    border-top: 1px solid var(--smc-egr-border-light);
    display: flex;
    justify-content: flex-end;
    gap: var(--smc-egr-space-3);
  }

  // Variante elevated
  &--elevated {
    box-shadow: var(--smc-egr-shadow-lg);
  }

  // Variante flat
  &--flat {
    box-shadow: none;
    border: 1px solid var(--smc-egr-border-medium);
  }
}
```

### 3.2. FORMULÁRIOS PROFISSIONAIS

```scss
// ========================================
// FORM COMPONENTS
// ========================================

.smc-egr-form-section {
  margin-bottom: var(--smc-egr-space-8);

  &-header {
    font-size: var(--smc-egr-text-lg);
    font-weight: var(--smc-egr-font-semibold);
    color: var(--smc-egr-primary-700);
    margin-bottom: var(--smc-egr-space-4);
    padding-bottom: var(--smc-egr-space-3);
    border-bottom: 2px solid var(--smc-egr-primary-200);
    display: flex;
    align-items: center;
    gap: var(--smc-egr-space-2);

    // Ícone decorativo (opcional)
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 24px;
      background: var(--smc-egr-primary-500);
      border-radius: var(--smc-egr-radius-full);
    }
  }
}

.smc-egr-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--smc-egr-space-6);
  margin-bottom: var(--smc-egr-space-6);

  // Grid de 2 colunas fixas em desktop
  &--cols-2 {
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  // Grid de 3 colunas fixas em desktop
  &--cols-3 {
    @media (min-width: 992px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.smc-egr-form-field {
  display: flex;
  flex-direction: column;
  gap: var(--smc-egr-space-2);

  label {
    font-size: var(--smc-egr-text-sm);
    font-weight: var(--smc-egr-font-medium);
    color: var(--smc-egr-text-primary);
    display: flex;
    align-items: center;
    gap: var(--smc-egr-space-1);

    &.smc-egr-label-required::after {
      content: '*';
      color: var(--smc-egr-danger);
      margin-left: 2px;
    }
  }

  // Input group (ex: DDD + Telefone)
  &-group {
    display: flex;
    gap: var(--smc-egr-space-2);
  }

  // Mensagens de erro
  .smc-egr-field-error {
    font-size: var(--smc-egr-text-xs);
    color: var(--smc-egr-danger);
    display: flex;
    align-items: center;
    gap: var(--smc-egr-space-1);
    margin-top: var(--smc-egr-space-1);

    &::before {
      content: '⚠';
      font-size: var(--smc-egr-text-sm);
    }
  }

  // Mensagens de ajuda
  .smc-egr-field-hint {
    font-size: var(--smc-egr-text-xs);
    color: var(--smc-egr-text-secondary);
  }
}

.smc-egr-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--smc-egr-space-3);
  padding-top: var(--smc-egr-space-6);
  border-top: 1px solid var(--smc-egr-border-light);
  margin-top: var(--smc-egr-space-6);
}
```

### 3.3. BOTÕES MODERNIZADOS

```scss
// ========================================
// BUTTON COMPONENTS (PrimeNG Override)
// ========================================

.p-button {
  font-family: var(--smc-egr-font-sans);
  font-weight: var(--smc-egr-font-medium);
  border-radius: var(--smc-egr-radius-lg);
  transition: all var(--smc-egr-transition-base);
  box-shadow: var(--smc-egr-shadow-xs);
  border: none;
  cursor: pointer;

  // Tamanho padrão
  padding: var(--smc-egr-space-3) var(--smc-egr-space-6);
  font-size: var(--smc-egr-text-base);

  // Hover state
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--smc-egr-shadow-md);
  }

  // Active state
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--smc-egr-shadow-xs);
  }

  // Disabled state
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  // Primary variant (default)
  &.p-button-primary {
    background: linear-gradient(135deg, var(--smc-egr-primary-500), var(--smc-egr-primary-600));
    color: var(--smc-egr-text-on-primary);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--smc-egr-primary-600), var(--smc-egr-primary-700));
    }
  }

  // Secondary variant
  &.p-button-secondary {
    background: var(--smc-egr-gray-100);
    color: var(--smc-egr-text-primary);

    &:hover:not(:disabled) {
      background: var(--smc-egr-gray-200);
    }
  }

  // Outlined variant
  &.p-button-outlined {
    background: transparent;
    border: 2px solid var(--smc-egr-primary-500);
    color: var(--smc-egr-primary-600);
    box-shadow: none;

    &:hover:not(:disabled) {
      background: var(--smc-egr-primary-50);
      box-shadow: none;
    }
  }

  // Text variant (ghost)
  &.p-button-text {
    background: transparent;
    color: var(--smc-egr-primary-600);
    box-shadow: none;

    &:hover:not(:disabled) {
      background: var(--smc-egr-primary-50);
      box-shadow: none;
    }
  }

  // Tamanhos
  &.p-button-sm {
    padding: var(--smc-egr-space-2) var(--smc-egr-space-4);
    font-size: var(--smc-egr-text-sm);
  }

  &.p-button-lg {
    padding: var(--smc-egr-space-4) var(--smc-egr-space-8);
    font-size: var(--smc-egr-text-lg);
  }

  // Ícones
  .p-button-icon {
    font-size: 1.2em;
  }
}
```

### 3.4. INPUTS E DROPDOWNS ESTILIZADOS

```scss
// ========================================
// INPUT COMPONENTS (PrimeNG Override)
// ========================================

.p-inputtext,
.p-dropdown,
.p-calendar {
  font-family: var(--smc-egr-font-sans);
  border-radius: var(--smc-egr-radius-lg);
  border: 1px solid var(--smc-egr-border-light);
  background: var(--smc-egr-surface);
  transition: all var(--smc-egr-transition-base);
  font-size: var(--smc-egr-text-base);
  color: var(--smc-egr-text-primary);

  // Focus state
  &:focus,
  &.p-focus {
    border-color: var(--smc-egr-primary-500);
    box-shadow: var(--smc-egr-shadow-focus);
    outline: none;
  }

  // Hover state
  &:hover:not(:disabled):not(.p-disabled) {
    border-color: var(--smc-egr-border-medium);
  }

  // Error state
  &.ng-invalid.ng-dirty,
  &.p-invalid {
    border-color: var(--smc-egr-danger);
    background: var(--smc-egr-danger-light);

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }
  }

  // Success state (opcional)
  &.smc-egr-input-success {
    border-color: var(--smc-egr-success);
    background: var(--smc-egr-success-light);
  }

  // Disabled state
  &:disabled,
  &.p-disabled {
    background: var(--smc-egr-gray-100);
    color: var(--smc-egr-text-disabled);
    cursor: not-allowed;
  }
}

.p-inputtext {
  padding: var(--smc-egr-space-3) var(--smc-egr-space-4);
  width: 100%;
}

.p-dropdown {
  width: 100%;

  .p-dropdown-trigger {
    color: var(--smc-egr-text-secondary);
  }

  .p-dropdown-label {
    padding: var(--smc-egr-space-3) var(--smc-egr-space-4);
  }

  &.p-dropdown-open {
    border-color: var(--smc-egr-primary-500);
    box-shadow: var(--smc-egr-shadow-focus);
  }
}

.p-calendar {
  width: 100%;

  .p-inputtext {
    width: 100%;
  }

  .p-datepicker-trigger {
    color: var(--smc-egr-text-secondary);
  }
}

// Dropdown panel
.p-dropdown-panel {
  border-radius: var(--smc-egr-radius-lg);
  box-shadow: var(--smc-egr-shadow-xl);
  border: 1px solid var(--smc-egr-border-light);

  .p-dropdown-item {
    padding: var(--smc-egr-space-3) var(--smc-egr-space-4);
    transition: all var(--smc-egr-transition-fast);

    &:hover {
      background: var(--smc-egr-primary-50);
      color: var(--smc-egr-primary-700);
    }

    &.p-highlight {
      background: var(--smc-egr-primary-500);
      color: var(--smc-egr-text-on-primary);
    }
  }
}
```

---

## 4. LAYOUT DE APLICAÇÃO MODERNIZADO

### 4.1. CONTAINER PRINCIPAL

```scss
// ========================================
// LAYOUT CONTAINERS
// ========================================

.smc-egr-app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--smc-egr-background);
}

.smc-egr-main-content {
  flex: 1;
  padding: var(--smc-egr-space-6);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: var(--smc-egr-space-8);
  }

  @media (min-width: 1200px) {
    padding: var(--smc-egr-space-10);
  }
}

.smc-egr-page-container {
  max-width: 900px;
  margin: 0 auto;

  &--wide {
    max-width: 1200px;
  }

  &--narrow {
    max-width: 600px;
  }
}
```

### 4.2. HEADER MODERNIZADO

```scss
// ========================================
// HEADER COMPONENT
// ========================================

.smc-egr-header {
  background: linear-gradient(135deg, var(--smc-egr-primary-600), var(--smc-egr-primary-700));
  color: var(--smc-egr-text-on-primary);
  box-shadow: var(--smc-egr-shadow-md);
  padding: var(--smc-egr-space-4) var(--smc-egr-space-6);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);

  &-inner {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-logo {
    display: flex;
    align-items: center;
    gap: var(--smc-egr-space-3);

    img {
      height: 40px;
      width: auto;
    }

    &-text {
      font-size: var(--smc-egr-text-xl);
      font-weight: var(--smc-egr-font-bold);
      color: var(--smc-egr-text-on-primary);
    }
  }

  &-nav {
    display: flex;
    gap: var(--smc-egr-space-4);
  }

  &-link {
    color: var(--smc-egr-text-on-primary);
    text-decoration: none;
    padding: var(--smc-egr-space-2) var(--smc-egr-space-3);
    border-radius: var(--smc-egr-radius-md);
    transition: all var(--smc-egr-transition-fast);
    font-weight: var(--smc-egr-font-medium);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &--active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
```

### 4.3. FOOTER MODERNIZADO

```scss
// ========================================
// FOOTER COMPONENT
// ========================================

.smc-egr-footer {
  background: var(--smc-egr-gray-900);
  color: var(--smc-egr-gray-300);
  padding: var(--smc-egr-space-8) var(--smc-egr-space-6);
  margin-top: auto;
  border-top: 4px solid var(--smc-egr-primary-500);

  &-inner {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--smc-egr-space-8);
  }

  &-section {
    h3 {
      color: var(--smc-egr-gray-100);
      font-size: var(--smc-egr-text-lg);
      font-weight: var(--smc-egr-font-semibold);
      margin-bottom: var(--smc-egr-space-4);
    }

    p, a {
      font-size: var(--smc-egr-text-sm);
      line-height: var(--smc-egr-leading-relaxed);
      color: var(--smc-egr-gray-400);
    }

    a {
      text-decoration: none;
      transition: color var(--smc-egr-transition-fast);

      &:hover {
        color: var(--smc-egr-primary-400);
      }
    }
  }

  &-logo {
    img {
      height: 60px;
      width: auto;
      margin-bottom: var(--smc-egr-space-4);
    }
  }

  &-bottom {
    margin-top: var(--smc-egr-space-6);
    padding-top: var(--smc-egr-space-6);
    border-top: 1px solid var(--smc-egr-gray-800);
    text-align: center;
    font-size: var(--smc-egr-text-xs);
    color: var(--smc-egr-gray-500);
  }
}
```

---

## 5. PÁGINAS ESPECÍFICAS - REDESIGN

### 5.1. LOGIN PAGE

**Conceito:** Card centralizado com fundo gradiente e glassmorphism

```scss
.smc-egr-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    var(--smc-egr-primary-500),
    var(--smc-egr-secondary-500)
  );
  padding: var(--smc-egr-space-6);

  .smc-egr-login-card {
    max-width: 480px;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: var(--smc-egr-radius-2xl);
    box-shadow: var(--smc-egr-shadow-2xl);
    padding: var(--smc-egr-space-8);

    &-header {
      text-align: center;
      margin-bottom: var(--smc-egr-space-6);

      h1 {
        font-size: var(--smc-egr-text-3xl);
        font-weight: var(--smc-egr-font-bold);
        color: var(--smc-egr-text-primary);
        margin-bottom: var(--smc-egr-space-2);
      }

      p {
        color: var(--smc-egr-text-secondary);
        font-size: var(--smc-egr-text-sm);
      }
    }

    .smc-egr-login-logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--smc-egr-space-6);

      img {
        height: 80px;
        width: auto;
      }
    }
  }
}
```

### 5.2. BUSCA ALUNO PAGE

**Conceito:** Layout limpo com instruções claras

```scss
.smc-egr-busca-page {
  .smc-egr-page-header {
    text-align: center;
    margin-bottom: var(--smc-egr-space-8);

    h1 {
      font-size: var(--smc-egr-text-3xl);
      font-weight: var(--smc-egr-font-bold);
      color: var(--smc-egr-text-primary);
      margin-bottom: var(--smc-egr-space-3);
    }

    p {
      font-size: var(--smc-egr-text-lg);
      color: var(--smc-egr-text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .smc-egr-busca-card {
    max-width: 700px;
    margin: 0 auto;
  }
}
```

### 5.3. CADASTRO ALUNO PAGE

**Conceito:** Stepper visual ou accordion para organizar seções

```scss
.smc-egr-cadastro-page {
  .smc-egr-page-header {
    margin-bottom: var(--smc-egr-space-8);
    padding-bottom: var(--smc-egr-space-4);
    border-bottom: 2px solid var(--smc-egr-primary-200);

    h1 {
      font-size: var(--smc-egr-text-3xl);
      font-weight: var(--smc-egr-font-bold);
      color: var(--smc-egr-text-primary);
      display: flex;
      align-items: center;
      gap: var(--smc-egr-space-3);

      .smc-egr-badge {
        background: var(--smc-egr-primary-100);
        color: var(--smc-egr-primary-700);
        padding: var(--smc-egr-space-2) var(--smc-egr-space-4);
        border-radius: var(--smc-egr-radius-full);
        font-size: var(--smc-egr-text-sm);
        font-weight: var(--smc-egr-font-medium);
      }
    }
  }

  .smc-egr-cadastro-card {
    max-width: 1000px;
    margin: 0 auto;
  }

  // Indicador de progresso (opcional)
  .smc-egr-progress-bar {
    height: 4px;
    background: var(--smc-egr-gray-200);
    border-radius: var(--smc-egr-radius-full);
    margin-bottom: var(--smc-egr-space-6);
    overflow: hidden;

    &-fill {
      height: 100%;
      background: linear-gradient(90deg,
        var(--smc-egr-primary-500),
        var(--smc-egr-primary-600)
      );
      transition: width var(--smc-egr-transition-slow);
    }
  }
}
```

---

## 6. UTILITÁRIOS ADICIONAIS

### 6.1. LOADING STATES

```scss
// ========================================
// LOADING & SKELETON
// ========================================

.smc-egr-skeleton {
  background: linear-gradient(
    90deg,
    var(--smc-egr-gray-200) 25%,
    var(--smc-egr-gray-300) 50%,
    var(--smc-egr-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: smc-egr-skeleton-loading 1.5s infinite;
  border-radius: var(--smc-egr-radius-md);

  &--text {
    height: 1em;
    width: 100%;
  }

  &--title {
    height: 2em;
    width: 60%;
  }

  &--circle {
    border-radius: var(--smc-egr-radius-full);
    width: 40px;
    height: 40px;
  }
}

@keyframes smc-egr-skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.smc-egr-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid var(--smc-egr-gray-300);
  border-top-color: var(--smc-egr-primary-500);
  border-radius: var(--smc-egr-radius-full);
  animation: smc-egr-spin 0.8s linear infinite;

  &--lg {
    width: 40px;
    height: 40px;
    border-width: 4px;
  }
}

@keyframes smc-egr-spin {
  to {
    transform: rotate(360deg);
  }
}
```

### 6.2. BADGES E TAGS

```scss
// ========================================
// BADGES & TAGS
// ========================================

.smc-egr-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--smc-egr-space-1) var(--smc-egr-space-3);
  border-radius: var(--smc-egr-radius-full);
  font-size: var(--smc-egr-text-xs);
  font-weight: var(--smc-egr-font-semibold);
  line-height: 1;

  &--primary {
    background: var(--smc-egr-primary-100);
    color: var(--smc-egr-primary-700);
  }

  &--success {
    background: var(--smc-egr-success-light);
    color: var(--smc-egr-success-dark);
  }

  &--danger {
    background: var(--smc-egr-danger-light);
    color: var(--smc-egr-danger-dark);
  }

  &--warning {
    background: var(--smc-egr-warning-light);
    color: var(--smc-egr-warning-dark);
  }

  &--info {
    background: var(--smc-egr-info-light);
    color: var(--smc-egr-info-dark);
  }
}
```

### 6.3. ALERTS E TOASTS

```scss
// ========================================
// ALERTS
// ========================================

.smc-egr-alert {
  padding: var(--smc-egr-space-4);
  border-radius: var(--smc-egr-radius-lg);
  border-left: 4px solid;
  display: flex;
  align-items: start;
  gap: var(--smc-egr-space-3);

  &-icon {
    font-size: var(--smc-egr-text-xl);
    flex-shrink: 0;
  }

  &-content {
    flex: 1;

    h4 {
      font-weight: var(--smc-egr-font-semibold);
      margin-bottom: var(--smc-egr-space-1);
    }

    p {
      font-size: var(--smc-egr-text-sm);
      line-height: var(--smc-egr-leading-relaxed);
    }
  }

  &--success {
    background: var(--smc-egr-success-light);
    border-color: var(--smc-egr-success);
    color: var(--smc-egr-success-dark);
  }

  &--danger {
    background: var(--smc-egr-danger-light);
    border-color: var(--smc-egr-danger);
    color: var(--smc-egr-danger-dark);
  }

  &--warning {
    background: var(--smc-egr-warning-light);
    border-color: var(--smc-egr-warning);
    color: var(--smc-egr-warning-dark);
  }

  &--info {
    background: var(--smc-egr-info-light);
    border-color: var(--smc-egr-info);
    color: var(--smc-egr-info-dark);
  }
}
```

---

## 7. RESPONSIVIDADE APRIMORADA

### 7.1. BREAKPOINTS E MEDIA QUERIES

```scss
// ========================================
// BREAKPOINTS
// ========================================

$smc-egr-breakpoints: (
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  '2xl': 1536px
);

// Mixin para media queries
@mixin smc-egr-respond-to($breakpoint) {
  @if map-has-key($smc-egr-breakpoints, $breakpoint) {
    @media (min-width: map-get($smc-egr-breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Uso:
// .example {
//   @include smc-egr-respond-to('md') {
//     font-size: 1.5rem;
//   }
// }
```

### 7.2. CLASSES UTILITÁRIAS RESPONSIVAS

```scss
// ========================================
// RESPONSIVE UTILITIES
// ========================================

// Hide/Show em diferentes breakpoints
.smc-egr-hide-mobile {
  @media (max-width: 767px) {
    display: none !important;
  }
}

.smc-egr-hide-desktop {
  @media (min-width: 768px) {
    display: none !important;
  }
}

// Text alignment responsivo
.smc-egr-text-center-mobile {
  @media (max-width: 767px) {
    text-align: center;
  }
}

// Stack em mobile
.smc-egr-stack-mobile {
  @media (max-width: 767px) {
    flex-direction: column !important;
  }
}
```

---

## 8. DARK MODE (PREPARAÇÃO FUTURA)

```scss
// ========================================
// DARK MODE TOKENS (Opcional - Futuro)
// ========================================

[data-theme='dark'] {
  --smc-egr-background: #111827;
  --smc-egr-surface: #1f2937;
  --smc-egr-text-primary: #f9fafb;
  --smc-egr-text-secondary: #d1d5db;
  --smc-egr-border-light: #374151;
  --smc-egr-border-medium: #4b5563;
  // ... outros tokens
}
```

---

## 9. CHECKLIST DE IMPLEMENTAÇÃO

### FASE 1: ATUALIZAÇÃO DO DESIGN SYSTEM
- [ ] Atualizar `smc-egr-design-system.scss` com novos tokens de cores
- [ ] Adicionar sistema de elevação (sombras)
- [ ] Atualizar tipografia (font-family, sizes, weights)
- [ ] Adicionar spacing system aprimorado
- [ ] Adicionar border-radius tokens
- [ ] Adicionar transições e animações
- [ ] Adicionar componentes de card modernizados
- [ ] Adicionar componentes de formulário
- [ ] Adicionar overrides PrimeNG
- [ ] Adicionar utilitários (skeleton, spinner, badges, alerts)
- [ ] Adicionar classes responsivas
- [ ] Adicionar mixins e helpers

### FASE 2: ATUALIZAÇÃO DO LAYOUT GLOBAL
- [ ] Redesenhar `LayoutComponent` com novo container system
- [ ] Modernizar `HeaderComponent` (gradiente, sticky, glassmorphism)
- [ ] Modernizar `FooterComponent` (grid layout, visual aprimorado)
- [ ] Adicionar classe `.smc-egr-app-container` no layout principal
- [ ] Adicionar classe `.smc-egr-main-content` para área de conteúdo

### FASE 3: ATUALIZAÇÃO DA PÁGINA DE LOGIN
- [ ] Redesenhar `login.component.html` com novo layout centrado
- [ ] Aplicar classes `.smc-egr-login-page` e `.smc-egr-login-card`
- [ ] Atualizar `login.component.scss` com novos estilos
- [ ] Adicionar fundo gradiente
- [ ] Aplicar glassmorphism no card
- [ ] Testar responsividade

### FASE 4: ATUALIZAÇÃO DA PÁGINA DE BUSCA
- [ ] Redesenhar `busca-aluno.component.html` com page header
- [ ] Aplicar nova estrutura de form grid
- [ ] Atualizar `busca-aluno.component.scss`
- [ ] Aplicar novos estilos de card e inputs
- [ ] Testar responsividade

### FASE 5: ATUALIZAÇÃO DA PÁGINA DE CADASTRO
- [ ] Redesenhar `cadastro-aluno.component.html` com page header
- [ ] Aplicar nova estrutura de form sections
- [ ] Atualizar `cadastro-aluno.component.scss`
- [ ] Aplicar novos estilos de card, inputs e botões
- [ ] Adicionar indicadores visuais de seções
- [ ] Testar responsividade

### FASE 6: TESTES E AJUSTES FINAIS
- [ ] Testar em diferentes resoluções (mobile, tablet, desktop)
- [ ] Testar em diferentes navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Validar contraste de cores (WCAG AA)
- [ ] Validar estados de focus, hover e disabled
- [ ] Testar navegação por teclado
- [ ] Ajustar detalhes visuais e espaçamentos
- [ ] Documentar componentes customizados

---

## 10. RESULTADO ESPERADO

### Visual Moderno e Profissional
✅ Interface limpa com hierarquia visual clara
✅ Uso inteligente de espaçamento e elevação
✅ Cores harmoniosas respeitando identidade PUC Minas
✅ Tipografia expressiva e legível
✅ Transições suaves e micro-interações

### Performance
✅ CSS otimizado com variáveis nativas
✅ Sem dependências externas além do PrimeNG
✅ Carregamento rápido e responsivo

### Acessibilidade
✅ Contraste adequado (WCAG AA/AAA)
✅ Focus states visíveis
✅ Navegação por teclado funcional
✅ Touch targets adequados (44x44px)

### Manutenibilidade
✅ Design System como fonte única de verdade
✅ Tokens CSS facilmente customizáveis
✅ Componentes reutilizáveis
✅ Código SCSS organizado e documentado

---

## 11. CÓDIGO PROPOSTO - ARQUIVO PRINCIPAL

O arquivo `src/assets/styles/smc-egr-design-system.scss` será completamente reescrito com todos os tokens e componentes propostos acima, organizados da seguinte forma:

```scss
// ==================================================
// SMC EGR DESIGN SYSTEM v2.0 - MODERNIZADO
// ==================================================

// 1. Tokens de Design
//    - Cores
//    - Tipografia
//    - Spacing
//    - Elevação (Sombras)
//    - Border Radius
//    - Transições

// 2. Reset e Base Styles
//    - Box sizing
//    - Smooth scrolling
//    - Font smoothing

// 3. Componentes Base
//    - Cards
//    - Buttons
//    - Forms (inputs, labels, errors)
//    - Badges
//    - Alerts

// 4. Layout Components
//    - Containers
//    - Grid systems
//    - Header
//    - Footer

// 5. Overrides PrimeNG
//    - p-button
//    - p-inputtext
//    - p-dropdown
//    - p-calendar
//    - p-card

// 6. Utilitários
//    - Spacing (margin, padding)
//    - Text (size, weight, color, alignment)
//    - Display e Flexbox
//    - Responsividade
//    - Loading states

// 7. Animações
//    - Keyframes
//    - Transition helpers
```

---

**Essa proposta está pronta para aprovação. Podemos prosseguir com a implementação?**
