# Guía de Contribución - CryptoMentor AI

¡Gracias por tu interés en contribuir a CryptoMentor AI! Esta guía te ayudará a empezar y entender cómo contribuir efectivamente al proyecto.

## 🚀 Cómo Contribuir

### 1. Fork del Proyecto
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/crypto-mentor-ai.git
cd crypto-mentor-ai
```

### 2. Configurar el Entorno
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Edita .env con tus API keys

# Ejecutar en modo desarrollo
npm run dev
```

### 3. Crear una Rama
```bash
# Crear rama para tu feature
git checkout -b feature/nueva-funcionalidad

# O para bugfix
git checkout -b fix/correccion-bug
```

### 4. Hacer Cambios
- Sigue las convenciones de código
- Agrega tests si es necesario
- Actualiza documentación
- Commit con mensajes descriptivos

### 5. Pull Request
```bash
# Push de tu rama
git push origin feature/nueva-funcionalidad

# Crear Pull Request en GitHub
```

## 📋 Tipos de Contribuciones

### 🐛 Reportar Bugs
1. Verifica que no esté reportado
2. Usa el template de bug report
3. Incluye pasos para reproducir
4. Adjunta logs y capturas

### ✨ Sugerir Funcionalidades
1. Verifica que no esté sugerido
2. Usa el template de feature request
3. Explica el caso de uso
4. Considera implementación

### 🔧 Mejorar Código
1. Identifica áreas de mejora
2. Sigue patrones existentes
3. Agrega tests
4. Documenta cambios

### 📚 Mejorar Documentación
1. Identifica contenido desactualizado
2. Mejora claridad
3. Agrega ejemplos
4. Corrige errores

## 🎯 Áreas de Contribución

### Prioridad Alta
- **Testing**: Agregar tests unitarios e integración
- **Performance**: Optimizar rendimiento
- **Accessibility**: Mejorar accesibilidad
- **Mobile**: Optimizar para móviles

### Prioridad Media
- **New Features**: Funcionalidades nuevas
- **UI/UX**: Mejoras de interfaz
- **Documentation**: Documentación técnica
- **Internationalization**: Soporte multi-idioma

### Prioridad Baja
- **Refactoring**: Mejoras de código
- **Optimization**: Optimizaciones menores
- **Style**: Mejoras de estilo
- **Examples**: Ejemplos de uso

## 🛠️ Estándares de Código

### JavaScript/React
```javascript
// Usar const/let, no var
const MyComponent = ({ prop1, prop2 }) => {
  // Usar hooks correctamente
  const [state, setState] = useState(initialState)
  
  // Funciones con nombres descriptivos
  const handleClick = () => {
    // Lógica aquí
  }
  
  return (
    <div className="component-name">
      {/* JSX aquí */}
    </div>
  )
}
```

### Naming Conventions
- **Componentes**: PascalCase (`MyComponent`)
- **Funciones**: camelCase (`handleClick`)
- **Variables**: camelCase (`userData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Archivos**: kebab-case (`my-component.jsx`)

### CSS/TailwindCSS
```css
/* Usar clases de TailwindCSS */
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

/* Para estilos personalizados */
.custom-class {
  @apply bg-primary-500 text-white;
}
```

### Imports
```javascript
// Orden de imports
// 1. React y librerías externas
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// 2. Componentes internos
import Dashboard from './components/Dashboard'
import { useWallet } from './contexts/WalletContext'

// 3. Servicios y utilidades
import { walletService } from './services/walletService'

// 4. Estilos
import './MyComponent.css'
```

## 🧪 Testing

### Escribir Tests
```javascript
// Component.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  test('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### Ejecutar Tests
```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📝 Commits

### Formato de Mensajes
```
type(scope): descripción breve

Descripción más detallada si es necesario

- Cambio específico 1
- Cambio específico 2

Fixes #123
```

### Tipos de Commit
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato/estilo
- `refactor`: Refactoring de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en build/configuración

### Ejemplos
```bash
git commit -m "feat(portfolio): agregar análisis de riesgo"
git commit -m "fix(chat): corregir error de conexión con AURA"
git commit -m "docs(api): actualizar documentación de endpoints"
```

## 🔄 Pull Request Process

### Antes de Crear PR
1. **Actualiza tu fork** con los últimos cambios
2. **Ejecuta tests** para asegurar que todo funciona
3. **Revisa tu código** para errores obvios
4. **Actualiza documentación** si es necesario

### Template de PR
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Testing
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración agregados/actualizados
- [ ] Tests manuales ejecutados

## Screenshots (si aplica)
[Agregar capturas de pantalla]

## Checklist
- [ ] Código sigue estándares del proyecto
- [ ] Self-review completado
- [ ] Documentación actualizada
- [ ] Tests pasan
```

### Review Process
1. **Automated checks** deben pasar
2. **Review de código** por maintainers
3. **Feedback** y cambios si es necesario
4. **Approval** y merge

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/
├── components/          # Componentes React
│   ├── common/         # Componentes reutilizables
│   ├── features/       # Componentes específicos
│   └── layout/         # Componentes de layout
├── contexts/           # React Contexts
├── services/           # Servicios y APIs
├── hooks/              # Custom hooks
├── utils/              # Utilidades
├── constants/          # Constantes
└── types/              # TypeScript types
```

### Patrones de Diseño
- **Component Composition**: Composición sobre herencia
- **Custom Hooks**: Lógica reutilizable
- **Context API**: Estado global
- **Service Layer**: Separación de lógica de negocio

## 🎨 Diseño y UI

### Design System
- **Colores**: Usar tokens de TailwindCSS
- **Tipografía**: Sistema de tipografía consistente
- **Espaciado**: Usar scale de TailwindCSS
- **Componentes**: Seguir patrones existentes

### Responsive Design
```jsx
// Mobile first approach
<div className="flex flex-col md:flex-row lg:flex-col">
  <div className="w-full md:w-1/2 lg:w-full">
    {/* Contenido */}
  </div>
</div>
```

### Accessibility
- **Semantic HTML**: Usar elementos apropiados
- **ARIA labels**: Para elementos interactivos
- **Keyboard navigation**: Soporte completo de teclado
- **Color contrast**: Cumplir WCAG guidelines

## 🔒 Seguridad

### Principios de Seguridad
- **Never trust client**: Validación en servidor
- **Input validation**: Validar todas las entradas
- **Secure defaults**: Configuración segura por defecto
- **Principle of least privilege**: Mínimos permisos

### Web3 Security
- **No private keys**: Nunca almacenar claves privadas
- **Address validation**: Validar direcciones
- **Contract verification**: Verificar contratos
- **User warnings**: Advertencias de seguridad

## 📊 Performance

### Optimizaciones
- **Code splitting**: Cargar código cuando se necesita
- **Lazy loading**: Cargar componentes bajo demanda
- **Memoization**: Usar React.memo y useMemo
- **Bundle analysis**: Analizar tamaño de bundle

### Monitoring
- **Web Vitals**: Monitorear métricas de performance
- **Error tracking**: Rastrear errores en producción
- **Analytics**: Métricas de uso
- **Performance budgets**: Límites de performance

## 🌍 Internationalization

### Preparación para i18n
```javascript
// Usar keys para texto
const messages = {
  'welcome.title': 'Bienvenido a CryptoMentor AI',
  'welcome.subtitle': 'Tu asistente de trading Web3'
}

// Componente preparado para i18n
const Welcome = () => (
  <div>
    <h1>{t('welcome.title')}</h1>
    <p>{t('welcome.subtitle')}</p>
  </div>
)
```

## 🚀 Deployment

### Environments
- **Development**: Local development
- **Staging**: Testing environment
- **Production**: Live environment

### CI/CD
```yaml
# GitHub Actions example
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

## 📞 Comunicación

### Canales
- **GitHub Issues**: Bugs y feature requests
- **GitHub Discussions**: Discusiones generales
- **Discord**: Chat en tiempo real
- **Email**: Contacto directo

### Code of Conduct
- **Respeto**: Tratar a todos con respeto
- **Inclusión**: Ambiente inclusivo para todos
- **Colaboración**: Trabajar juntos constructivamente
- **Profesionalismo**: Comportamiento profesional

## 🏆 Reconocimiento

### Contributors
- **GitHub Contributors**: Reconocimiento automático
- **README**: Lista de contributors principales
- **Release Notes**: Créditos en releases
- **Community**: Reconocimiento en comunidad

### Incentivos
- **Swag**: Merchandise para contributors
- **Certificates**: Certificados de contribución
- **Mentorship**: Oportunidades de mentoría
- **Career**: Referencias y networking

---

¡Gracias por contribuir a CryptoMentor AI! Tu contribución hace que el proyecto sea mejor para todos. 🚀

¿Tienes preguntas? ¡Únete a nuestro Discord o crea un issue en GitHub!
