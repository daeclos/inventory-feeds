# Documentación Técnica - Fountain Dashboard

## Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas protegidas que requieren autenticación
│   ├── (public)/          # Rutas públicas
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   ├── layout/           # Componentes de layout
│   └── dashboard/        # Componentes específicos del dashboard
├── lib/                  # Utilidades y configuraciones
│   ├── utils.ts         # Funciones de utilidad
│   └── validations.ts   # Esquemas de validación
├── types/               # Definiciones de tipos TypeScript
└── constants/          # Constantes y configuraciones
```

### Componentes Principales

#### 1. Layout Components

##### Sidebar (`components/layout/Sidebar.tsx`)
- Navegación principal de la aplicación
- Menús desplegables para cada sección
- Responsive con modo móvil y desktop
- Integración con el sistema de autenticación

```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'manager' | 'user';
}
```

##### Topbar (`components/layout/Topbar.tsx`)
- Barra superior con búsqueda global
- Notificaciones y mensajes
- Acciones rápidas
- Integración con el tema oscuro/claro

#### 2. UI Components

##### Button (`components/ui/button.tsx`)
Variantes disponibles:
- default: Botón principal
- destructive: Acciones peligrosas
- outline: Botón con borde
- secondary: Botón secundario
- ghost: Botón sin fondo
- link: Enlace estilizado como botón

##### Table (`components/ui/table.tsx`)
Características:
- Ordenamiento por columnas
- Paginación
- Selección de filas
- Filtros personalizados

##### Modal (`components/ui/modal.tsx`)
Tipos:
- Formularios
- Confirmaciones
- Información detallada
- Alertas

### Sistema de Estado

#### Zustand Store

```typescript
interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  
  // Data State
  campaigns: Campaign[];
  advertisers: Advertiser[];
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}
```

### Sistema de Autenticación

#### Roles y Permisos

```typescript
type UserRole = 'admin' | 'manager' | 'user';

interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: '*', action: '*' }
  ],
  manager: [
    { resource: 'campaigns', action: '*' },
    { resource: 'advertisers', action: '*' },
    { resource: 'reports', action: 'read' }
  ],
  user: [
    { resource: 'campaigns', action: 'read' },
    { resource: 'reports', action: 'read' }
  ]
};
```

### API Routes

#### Estructura de Endpoints

```
/api
├── auth/              # Autenticación
│   ├── login
│   ├── logout
│   └── refresh
├── campaigns/         # Gestión de campañas
│   ├── [id]
│   └── stats
├── advertisers/       # Gestión de anunciantes
│   └── [id]
└── reports/          # Reportes y estadísticas
    ├── billing
    └── performance
```

### Validación de Datos

#### Esquemas Zod

```typescript
// Validación de Campaña
const campaignSchema = z.object({
  name: z.string().min(3).max(100),
  advertiserId: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.number().positive(),
  status: z.enum(['draft', 'active', 'paused', 'completed'])
});

// Validación de Anunciante
const advertiserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional()
});
```

### Sistema de Notificaciones

#### Toast Notifications

```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

// Uso
toast({
  title: "Campaña creada",
  description: "La campaña se ha creado exitosamente",
  type: "success"
});
```

### Optimización y Rendimiento

#### Estrategias Implementadas

1. **Code Splitting**
   - Rutas dinámicas
   - Componentes lazy-loaded

2. **Caching**
   - SWR para datos del servidor
   - LocalStorage para preferencias

3. **Imágenes**
   - Next/Image para optimización
   - Lazy loading de imágenes

4. **Bundle Size**
   - Tree shaking
   - Dynamic imports

### Testing

#### Configuración de Tests

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

#### Tipos de Tests

1. **Unit Tests**
   - Componentes UI
   - Utilidades
   - Hooks personalizados

2. **Integration Tests**
   - Flujos de usuario
   - Interacciones entre componentes

3. **E2E Tests**
   - Flujos completos
   - Cypress para testing E2E

### Despliegue

#### Configuración de Vercel

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

#### Variables de Entorno

```env
# .env.example
NEXT_PUBLIC_API_URL=https://api.fountain.com
NEXT_PUBLIC_APP_URL=https://app.fountain.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

### Monitoreo y Logging

#### Implementación

1. **Error Tracking**
   - Sentry para errores en producción
   - Logging estructurado

2. **Performance Monitoring**
   - Vercel Analytics
   - Custom metrics

3. **User Analytics**
   - Google Analytics
   - Custom events tracking

### Seguridad

#### Implementaciones

1. **Autenticación**
   - JWT con refresh tokens
   - CSRF protection
   - Rate limiting

2. **Autorización**
   - Role-based access control
   - Resource-level permissions

3. **Data Protection**
   - Input sanitization
   - XSS prevention
   - SQL injection protection 