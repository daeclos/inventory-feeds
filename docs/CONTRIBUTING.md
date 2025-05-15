# Guía de Contribución - Fountain Dashboard

## 🎯 Antes de Empezar

### Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Git
- Editor de código (recomendamos VS Code)

### Configuración del Entorno

1. **Fork y Clone**
   ```bash
   git clone https://github.com/your-username/fountain-dashboard.git
   cd fountain-dashboard
   ```

2. **Instalación de Dependencias**
   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno**
   ```bash
   cp .env.example .env.local
   ```

4. **Iniciar Servidor de Desarrollo**
   ```bash
   npm run dev
   ```

## 📝 Flujo de Trabajo

### 1. Crear una Rama

```bash
git checkout -b feature/nombre-de-tu-feature
```

### 2. Desarrollo

- Sigue las convenciones de código
- Escribe tests para tu código
- Mantén los commits atómicos y descriptivos

### 3. Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests e2e
npm run test:e2e
```

### 4. Linting y Formateo

```bash
# Verificar linting
npm run lint

# Formatear código
npm run format
```

### 5. Pull Request

1. Actualiza tu rama con main
2. Resuelve conflictos si existen
3. Crea un Pull Request
4. Espera la revisión

## 🎨 Convenciones de Código

### Estructura de Archivos

```
components/
├── ui/           # Componentes base reutilizables
├── layout/       # Componentes de layout
└── dashboard/    # Componentes específicos del dashboard
```

### Nombrado

- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Componentes**: PascalCase
- **Funciones**: camelCase
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase con prefijo I
- **Types**: PascalCase

### Estilos

- Usar Tailwind CSS para estilos
- Seguir el sistema de diseño
- Mantener consistencia en espaciado y colores

### Componentes

```typescript
// Ejemplo de estructura de componente
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface IComponentProps {
  className?: string;
  // ... otros props
}

export const Component: FC<IComponentProps> = ({
  className,
  // ... otros props
}) => {
  return (
    <div className={cn('base-styles', className)}>
      {/* Contenido */}
    </div>
  );
};
```

### Hooks

```typescript
// Ejemplo de estructura de hook
import { useState, useEffect } from 'react';

export const useCustomHook = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Lógica del hook
  }, []);

  return {
    value,
    setValue,
  };
};
```

## 🧪 Testing

### Unit Tests

```typescript
// Ejemplo de test unitario
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// Ejemplo de test de integración
import { render, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component Integration', () => {
  it('handles user interaction correctly', () => {
    const { getByRole } = render(<Component />);
    fireEvent.click(getByRole('button'));
    // Verificar resultado
  });
});
```

## 📚 Documentación

### Comentarios

```typescript
/**
 * Descripción de la función/componente
 * @param {string} param1 - Descripción del parámetro
 * @returns {string} Descripción del valor de retorno
 */
```

### JSDoc

```typescript
/**
 * @interface IUser
 * @property {string} id - ID único del usuario
 * @property {string} name - Nombre del usuario
 * @property {string} email - Email del usuario
 */
```

## 🔍 Code Review

### Checklist

- [ ] Código sigue las convenciones
- [ ] Tests pasan
- [ ] No hay warnings de linting
- [ ] Documentación actualizada
- [ ] Código es performante
- [ ] No hay código muerto
- [ ] Manejo de errores apropiado

### Proceso de Review

1. Revisar cambios
2. Probar funcionalidad
3. Verificar tests
4. Comentar feedback
5. Aprobar o solicitar cambios

## 🚀 Despliegue

### Pre-despliegue

1. Verificar variables de entorno
2. Ejecutar tests
3. Build de producción
4. Verificar bundle size

### Despliegue

1. Merge a main
2. Vercel despliega automáticamente
3. Verificar despliegue
4. Monitorear errores

## 🆘 Soporte

### Recursos

- [Documentación](https://docs.fountain.com)
- [API Reference](https://api.fountain.com/docs)
- [Discord](https://discord.fountain.com)

### Contacto

- Email: dev@fountain.com
- Slack: #fountain-dev 