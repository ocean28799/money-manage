# Contributing to Money Management App

Thank you for your interest in contributing to the Money Management App! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](https://github.com/ocean28799/money-manage/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features
1. Check existing [Issues](https://github.com/ocean28799/money-manage/issues) for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/money-manage.git
   cd money-manage
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines
- Follow the existing code style and conventions
- Use TypeScript for type safety
- Write meaningful commit messages
- Test your changes thoroughly
- Ensure the app builds without errors: `npm run build`
- Run linting: `npm run lint`

#### Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

#### Commit Messages
Use conventional commit format:
```
type(scope): description

feat: add dark mode toggle
fix: resolve transaction filtering bug
docs: update installation instructions
style: improve button hover effects
```

#### Pull Request Process
1. Ensure your branch is up to date with main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```
2. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots of UI changes
   - List of changes made

#### Review Process
- All PRs require review before merging
- Address feedback promptly
- Keep discussions constructive and respectful
- Update your PR based on feedback

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run in different modes
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

### Project Structure
- `src/app/` - Next.js pages using App Router
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and configurations
- `src/store/` - Zustand state management
- `src/types/` - TypeScript type definitions

### Testing
Currently, the project doesn't have automated tests, but we welcome contributions to add:
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

## 📋 Areas for Contribution

### High Priority
- [ ] Add comprehensive test suite
- [ ] Implement dark mode
- [ ] Add data export/import functionality
- [ ] Improve mobile responsiveness

### Medium Priority
- [ ] Add more chart types and visualizations
- [ ] Implement recurring transactions
- [ ] Add budget planning features
- [ ] Improve accessibility (a11y)

### Low Priority
- [ ] Add more UI themes
- [ ] Implement advanced filtering
- [ ] Add keyboard shortcuts
- [ ] Performance optimizations

## 🎯 Feature Guidelines

### UI/UX
- Maintain consistency with existing design
- Ensure responsive design for all screen sizes
- Follow accessibility best practices
- Use existing UI components when possible

### State Management
- Use Zustand for state management
- Keep stores focused and well-organized
- Implement proper TypeScript types
- Use React Hook Form for form handling

### Code Quality
- Write self-documenting code
- Add TypeScript types for all data
- Use Zod for data validation
- Follow React best practices

## 📞 Getting Help

- Check the [README.md](README.md) for setup instructions
- Browse existing [Issues](https://github.com/ocean28799/money-manage/issues)
- Create a new issue for questions
- Join discussions in existing PRs

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person
- Follow GitHub's Community Guidelines

Thank you for contributing to the Money Management App! 🚀
