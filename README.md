# Tag Checker

A TypeScript solution for checking proper HTML tag nesting and matching.

## Installation

```bash
yarn install
```

## Usage

### Run with sample tests

```bash
yarn build
node dist/bundle.js
```

### Interactive mode

```bash
yarn build
node dist/bundle.js --interactive
```

### Development mode

```bash
yarn dev
# or interactive
yarn dev:interactive
```

## Project Structure

```
src/
├── index.ts              # Entry point
├── models/
│   └── TagToken.ts       # Tag token model
└── services/
    ├── TagChecker.ts     # Main tag checking logic
    ├── TagParser.ts      # Tag parsing utilities
    └── TagValidator.ts   # Tag validation rules
```

## Scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `yarn build`           | Build the project             |
| `yarn build:dev`       | Build in development mode     |
| `yarn dev`             | Run in dev mode               |
| `yarn dev:interactive` | Run in dev mode (interactive) |
| `yarn test`            | Run tests                     |
| `yarn test:watch`      | Run tests in watch mode       |
| `yarn test:coverage`   | Run tests with coverage       |
| `yarn lint`            | Lint code                     |
| `yarn lint:fix`        | Lint and fix code             |
| `yarn format`          | Format code                   |
| `yarn format:check`    | Check code formatting         |
| `yarn clean`           | Remove build artifacts        |

## License

MIT
