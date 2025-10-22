# Contributing Guide - CryptoMentor AI

Thank you for your interest in contributing to CryptoMentor AI! This guide will help you get started and understand how to contribute effectively to the project.

## 🚀 How to Contribute

### 1. Fork the Project
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/crypto-mentor-ai.git
cd crypto-mentor-ai
```

### 2. Set Up Environment
```bash
# Install dependencies
npm install

# Configure environment variables
cp env.example .env
# Edit .env with your API keys

# Run in development mode
npm run dev
```

### 3. Create a Branch
```bash
# Create branch for your feature
git checkout -b feature/new-functionality

# Or for bugfix
git checkout -b fix/bug-correction
```

### 4. Make Changes
- Follow code conventions
- Add tests if necessary
- Update documentation
- Commit with descriptive messages

### 5. Pull Request
```bash
# Push your branch
git push origin feature/new-functionality

# Create Pull Request on GitHub
```

## 📋 Types of Contributions

### 🐛 Report Bugs
1. Check that it hasn't been reported
2. Use the bug report template
3. Include steps to reproduce
4. Attach logs and screenshots

### ✨ Suggest Features
1. Check that it hasn't been suggested
2. Use the feature request template
3. Explain the use case
4. Consider implementation

### 🔧 Improve Code
1. Identify areas for improvement
2. Follow existing patterns
3. Add tests
4. Document changes

### 📚 Improve Documentation
1. Identify outdated content
2. Improve clarity
3. Add examples
4. Fix errors

## 🎯 Contribution Areas

### High Priority
- **Testing**: Add unit and integration tests
- **Performance**: Optimize performance
- **Accessibility**: Improve accessibility
- **Mobile**: Optimize for mobile

### Medium Priority
- **New Features**: New functionality
- **UI/UX**: Interface improvements
- **Documentation**: Technical documentation
- **Internationalization**: Multi-language support

### Low Priority
- **Refactoring**: Code improvements
- **Optimization**: Minor optimizations
- **Style**: Style improvements
- **Examples**: Usage examples

## 🛠️ Code Standards

### JavaScript/React
```javascript
// Use const/let, not var
const MyComponent = ({ prop1, prop2 }) => {
  // Use hooks correctly
  const [state, setState] = useState(initialState)
  
  // Functions with descriptive names
  const handleClick = () => {
    // Logic here
  }
  
  return (
    <div className="component-name">
      {/* JSX here */}
    </div>
  )
}
```

### Naming Conventions
- **Components**: PascalCase (`MyComponent`)
- **Functions**: camelCase (`handleClick`)
- **Variables**: camelCase (`userData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: kebab-case (`my-component.jsx`)

### CSS/TailwindCSS
```css
/* Use TailwindCSS classes */
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

/* For custom styles */
.custom-class {
  @apply bg-primary-500 text-white;
}
```

### Imports
```javascript
// Import order
// 1. React and external libraries
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// 2. Internal components
import Dashboard from './components/Dashboard'
import { useWallet } from './contexts/WalletContext'

// 3. Services and utilities
import { walletService } from './services/walletService'

// 4. Styles
import './MyComponent.css'
```

## 🧪 Testing

### Writing Tests
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

### Running Tests
```bash
# All tests
npm test

# Tests in watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📝 Commits

### Message Format
```
type(scope): brief description

More detailed description if necessary

- Specific change 1
- Specific change 2

Fixes #123
```

### Commit Types
- `feat`: New functionality
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Format/style changes
- `refactor`: Code refactoring
- `test`: Add or modify tests
- `chore`: Build/configuration changes

### Examples
```bash
git commit -m "feat(portfolio): add risk analysis"
git commit -m "fix(chat): fix AURA connection error"
git commit -m "docs(api): update endpoint documentation"
```

## 🔄 Pull Request Process

### Before Creating PR
1. **Update your fork** with latest changes
2. **Run tests** to ensure everything works
3. **Review your code** for obvious errors
4. **Update documentation** if necessary

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New functionality
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual tests executed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Feedback** and changes if necessary
4. **Approval** and merge

## 🏗️ Project Architecture

### Folder Structure
```
src/
├── components/          # React components
│   ├── common/         # Reusable components
│   ├── features/       # Specific components
│   └── layout/         # Layout components
├── contexts/           # React Contexts
├── services/           # Services and APIs
├── hooks/              # Custom hooks
├── utils/              # Utilities
├── constants/          # Constants
└── types/              # TypeScript types
```

### Design Patterns
- **Component Composition**: Composition over inheritance
- **Custom Hooks**: Reusable logic
- **Context API**: Global state
- **Service Layer**: Business logic separation

## 🎨 Design and UI

### Design System
- **Colors**: Use TailwindCSS tokens
- **Typography**: Consistent typography system
- **Spacing**: Use TailwindCSS scale
- **Components**: Follow existing patterns

### Responsive Design
```jsx
// Mobile first approach
<div className="flex flex-col md:flex-row lg:flex-col">
  <div className="w-full md:w-1/2 lg:w-full">
    {/* Content */}
  </div>
</div>
```

### Accessibility
- **Semantic HTML**: Use appropriate elements
- **ARIA labels**: For interactive elements
- **Keyboard navigation**: Full keyboard support
- **Color contrast**: Meet WCAG guidelines

## 🔒 Security

### Security Principles
- **Never trust client**: Server-side validation
- **Input validation**: Validate all inputs
- **Secure defaults**: Secure configuration by default
- **Principle of least privilege**: Minimum permissions

### Web3 Security
- **No private keys**: Never store private keys
- **Address validation**: Validate addresses
- **Contract verification**: Verify contracts
- **User warnings**: Security warnings

## 📊 Performance

### Optimizations
- **Code splitting**: Load code when needed
- **Lazy loading**: Load components on demand
- **Memoization**: Use React.memo and useMemo
- **Bundle analysis**: Analyze bundle size

### Monitoring
- **Web Vitals**: Monitor performance metrics
- **Error tracking**: Track errors in production
- **Analytics**: Usage metrics
- **Performance budgets**: Performance limits

## 🌍 Internationalization

### i18n Preparation
```javascript
// Use keys for text
const messages = {
  'welcome.title': 'Welcome to CryptoMentor AI',
  'welcome.subtitle': 'Your Web3 trading assistant'
}

// Component prepared for i18n
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

## 📞 Communication

### Channels
- **GitHub Issues**: Bugs and feature requests
- **GitHub Discussions**: General discussions
- **Discord**: Real-time chat
- **Email**: Direct contact

### Code of Conduct
- **Respect**: Treat everyone with respect
- **Inclusion**: Inclusive environment for all
- **Collaboration**: Work together constructively
- **Professionalism**: Professional behavior

## 🏆 Recognition

### Contributors
- **GitHub Contributors**: Automatic recognition
- **README**: List of main contributors
- **Release Notes**: Credits in releases
- **Community**: Community recognition

### Incentives
- **Swag**: Merchandise for contributors
- **Certificates**: Contribution certificates
- **Mentorship**: Mentorship opportunities
- **Career**: References and networking

---

Thank you for contributing to CryptoMentor AI! Your contribution makes the project better for everyone. 🚀

Have questions? Join our Discord or create an issue on GitHub!
