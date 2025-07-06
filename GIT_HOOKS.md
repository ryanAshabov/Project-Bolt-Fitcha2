# 🎣 Git Hooks Configuration

## Pre-commit Hook Setup

### Install Husky
```bash
npm install --save-dev husky
npx husky install
```

### Create Pre-commit Hook
```bash
npx husky add .husky/pre-commit "npm run pre-commit"
```

### Pre-commit Script Content
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Check for merge conflict markers
if grep -r "<<<<<<< HEAD\|>>>>>>> \|=======" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/; then
  echo "❌ Merge conflict markers found. Please resolve conflicts before committing."
  exit 1
fi

# Run type checking
echo "📝 Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type check failed"
  exit 1
fi

# Run linting
echo "🧹 Linting code..."
npm run lint:check
if [ $? -ne 0 ]; then
  echo "❌ ESLint check failed"
  exit 1
fi

# Check code formatting
echo "💅 Checking code formatting..."
npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ Code formatting check failed. Run 'npm run format' to fix."
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test:run
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# Check for console.log statements (except console.warn and console.error)
if grep -r "console\.log" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/; then
  echo "❌ console.log statements found. Please remove them before committing."
  exit 1
fi

# Check for TODO comments in production
if [ "$NODE_ENV" = "production" ]; then
  if grep -r "TODO\|FIXME\|XXX" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/; then
    echo "❌ TODO/FIXME comments found in production build"
    exit 1
  fi
fi

echo "✅ All pre-commit checks passed!"
```

## Commit Message Convention

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples
```bash
feat(auth): add Google OAuth integration
fix(booking): resolve double booking conflict
docs(readme): update installation instructions
style(components): format Button component
refactor(hooks): extract useAuth logic
test(utils): add tests for date helpers
chore(deps): update dependencies
perf(images): optimize image loading
ci(github): add automated testing workflow
build(vite): update build configuration
```

### Commit Message Validation Hook
```bash
#!/bin/sh
# .husky/commit-msg

commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit message format!"
    echo "Format: type(scope): description"
    echo "Example: feat(auth): add Google OAuth integration"
    echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build"
    exit 1
fi

echo "✅ Commit message format is valid"
```

## Branch Protection Rules

### Main Branch Protection
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main branch
- Require signed commits

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat(feature): add new functionality"

# Push to remote
git push origin feature/new-feature

# Create pull request
# After review and approval, merge to main
```

## Git Ignore Best Practices

### Additional .gitignore entries
```bash
# Development files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Build outputs
dist/
build/
*.tsbuildinfo

# Firebase
.firebase/
firebase-debug.log*
firestore-debug.log*
ui-debug.log*

# Testing
.coverage/
coverage.lcov
```
