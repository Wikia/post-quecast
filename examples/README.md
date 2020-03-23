# Post Quecast Example Pages

This apps aim to simulate production environment to test correctness of the library.

## Usage

- `npm run examples:dev`
  - It will serve all three applications on port 8080.
  - Main application can be found here http://localhost:8080/main/
  - Runs in `dev` mode by default.
    - To run in `prod` mode run `npm run examples:prod`
- `npm run examples:build`
  - It will build examples. Can be useful for inspecting bundle size.
  - Runs in `prod` mode by default.

## Environment

Aside from usual differences between `dev` and `prod` mode application will:

- In `dev` mode - use `@wikia/post-quecast` code from `src/index.ts`.
- In `prod` mode - use `@wikia/post-quecast` code from `dist/module/index.js`.

It has been done to better simulate conditions of end user.

## e2e Tests

To run wdio e2e tests:

- `npm run examples:dev`
- `npm run e2e`
