# Post Quecast

<p align="center">
    <a href="https://www.npmjs.com/package/@wikia/post-quecast">
        <img src="https://img.shields.io/npm/v/@wikia/post-quecast.svg" alt="npm version">
    </a>
    <a href="https://www.npmjs.com/package/@wikia/post-quecast">
        <img src="https://img.shields.io/npm/dm/@wikia/post-quecast.svg" alt="npm downloads">
    </a>
    <a href="https://github.com/prettier/prettier">
        <img alt="Travis" src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg">
    </a>
    <a href="https://github.com/semantic-release/semantic-release">
        <img alt="Travis" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
    </a>
</p>

<p align="center">
    <a href="https://travis-ci.org/Wikia/post-quecast">
        <img alt="Travis" src="https://travis-ci.org/Wikia/post-quecast.svg?branch=master">
    </a>
    <a href="https://coveralls.io/github/Wikia/post-quecast?branch=master">
        <img alt="Travis" src="https://coveralls.io/repos/github/Wikia/post-quecast/badge.svg?branch=master">
    </a>
    <a href="https://snyk.io/test/github/Wikia/post-quecast?targetFile=package.json">
        <img alt="Travis" src="https://snyk.io/test/github/Wikia/post-quecast/badge.svg?targetFile=package.json">
    </a>
</p>

Post Quecast - **Post** Message based **Que**ued Broad**cast**.

It is RxJs powered lib for creating semi-distributed communication system between iframes and window instances.
The distinct feature of the lib is ability to remember (queue) messages so that it doesn't matter when a communicator is instantiated it will get full message history.

It is heavily inspired by [Redux](https://redux.js.org/) and [NgRx](https://ngrx.io/) and aims to create similar API.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Restrictions](#restrictions)

## Installation


To install post-quecast:

```bash
npm install @wikia/post-quecast
```

## Usage

The most basic usage is:

```typescript
// top window that loads first
import { setupPostQuecast } from '@wikia/post-quecast';

setupPostQuecast();
```

```typescript
// anywhere, including iframes
import { Communicator } from '@wikia/post-quecast';

const communicator = new Communicator();

communicator.actions$.subscribe(console.log);
communicator.emit({ type: 'action name', ...payload });
```

## Restrictions

- `setupPostQuecast` needs to be called before anything else.
- `setupPostQuecast` needs to be called on top level window.
