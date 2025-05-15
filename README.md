# Fountain Dashboard

Fountain Dashboard es una aplicación web moderna construida con Next.js y TypeScript que proporciona una interfaz de administración completa para gestionar campañas publicitarias, anunciantes y feeds personalizados.

## 🚀 Características

- **Panel de Administración**: Interfaz intuitiva y moderna para gestionar todos los aspectos del negocio
- **Gestión de Anunciantes**: Administración completa de anunciantes y sus campañas
- **Constructor de Campañas**: Herramienta integrada para crear y gestionar campañas publicitarias
- **Feeds Personalizados**: Sistema para crear y gestionar feeds de inventario personalizados
- **Sistema de Alertas**: Notificaciones en tiempo real para eventos importantes
- **Gestión de Usuarios**: Control de acceso y permisos para diferentes roles
- **Reportes de Facturación**: Seguimiento detallado de facturación y pagos
- **Soporte al Cliente**: Sistema integrado de tickets y guías de soporte

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Estado**: Zustand
- **Iconos**: Lucide Icons
- **Formularios**: React Hook Form
- **Validación**: Zod
- **Notificaciones**: React Hot Toast
- **Gráficos**: Recharts

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/your-username/fountain-dashboard.git
cd fountain-dashboard
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🏗️ Estructura del Proyecto

```
fountain-dashboard/
├── src/
│   ├── app/                 # Rutas y páginas de la aplicación
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes de UI base
│   │   ├── layout/         # Componentes de layout
│   │   └── dashboard/      # Componentes específicos del dashboard
│   ├── lib/                # Utilidades y configuraciones
│   ├── types/              # Definiciones de tipos TypeScript
│   └── constants/          # Constantes y configuraciones
├── public/                 # Archivos estáticos
└── package.json           # Dependencias y scripts
```

## 🎨 Sistema de Diseño

### Colores Corporativos

```typescript
const CORPORATE_COLORS = {
  yellow: "#FAAE3A",  // Color principal
  orange: "#F17625",  // Color secundario
  dark: "#404042",    // Color oscuro
}
```

### Componentes UI

El proyecto utiliza una combinación de componentes personalizados y shadcn/ui:

- **Sidebar**: Navegación principal con menús desplegables
- **Topbar**: Barra superior con búsqueda y acciones rápidas
- **Button**: Sistema de botones con múltiples variantes
- **Table**: Tablas con ordenamiento y paginación
- **Modal**: Sistema de modales para formularios y confirmaciones
- **Toast**: Notificaciones del sistema
- **Switch**: Interruptores para configuraciones
- **Stepper**: Indicador de progreso para procesos multi-paso

## 🔐 Autenticación

El sistema utiliza autenticación basada en roles con tres niveles:

1. **Admin**: Acceso completo a todas las funcionalidades
2. **Manager**: Acceso a gestión de campañas y anunciantes
3. **User**: Acceso básico a reportes y soporte

## 📱 Responsive Design

La aplicación está diseñada para ser completamente responsive:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests de integración
npm run test:integration

# Ejecutar tests e2e
npm run test:e2e
```

## 📈 Despliegue

El proyecto está configurado para despliegue en Vercel:

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. El despliegue se realizará automáticamente en cada push a main

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 📞 Soporte

Para soporte, por favor contacta a:
- Email: support@fountain.com
- Portal de Soporte: [support.fountain.com](https://support.fountain.com)
