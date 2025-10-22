# CryptoMentor AI Documentation 📚

This folder contains all technical and user documentation for the CryptoMentor AI project.

## 📖 Documentation Index

### 🚀 For Developers
- [Installation Guide](./installation.md) - Development environment setup
- [System Architecture](./architecture.md) - Project structure and design
- [Contributing Guide](./contributing.md) - How to contribute to the project
- [API Reference](./api-reference.md) - APIs and services documentation
- [Deployment Guide](./deployment.md) - How to deploy the application

### 👥 For Users
- [User Guide](./user-guide.md) - Complete user manual
- [FAQ](./faq.md) - Frequently asked questions
- [Troubleshooting](./troubleshooting.md) - Common problem solutions

### 🛠️ Technical
- [Components](./components.md) - React components documentation
- [Services](./services.md) - Services and APIs documentation
- [Contexts](./contexts.md) - State management with React Context
- [Styling](./styling.md) - TailwindCSS and design guide
- [Testing](./testing.md) - Testing strategies

### 📊 Project Specific
- [Web3 Integration](./web3-integration.md) - MetaMask integration details
- [AdEx AURA Integration](./aura-integration.md) - How AdEx AI works
- [Market Data](./market-data.md) - Data sources and APIs
- [Security](./security.md) - Security considerations

### 🎯 For Hackathon
- [Project Presentation](./hackathon-presentation.md) - Summary for judges
- [Demo Guide](./demo-guide.md) - How to make an effective demo
- [Roadmap](./roadmap.md) - Future project plans

## 🔧 Quick Setup

To get started quickly:

1. **Development**: See [Installation Guide](./installation.md)
2. **Usage**: See [User Guide](./user-guide.md)
3. **Contributing**: See [Contributing Guide](./contributing.md)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/crypto-mentor-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/crypto-mentor-ai/discussions)
- **Email**: support@cryptomentor.ai

---

*Documentation maintained by the CryptoMentor AI team*

## ⭐ AdEx AURA API and address-based recommendations

The app is powered by the AdEx AURA API. In addition to chat and portfolio analysis, the agent can take an account address and produce a list of recommendations and strategies in natural language, with a description of what each one does.

Example prompt (for Chat or Strategies tab):

```text
Analyze address 0x1C680f16b2270e324D5778305C9EC96784c832ab and give app recommendations and strategies in natural language form, with a description of what each one does.
```

Expected result:
- List of recommended strategies and apps
- Simple language description of what each one does
- (Optional) Group by time horizon/risk with actionable steps
