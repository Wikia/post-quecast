# API

## Presupposition

Let us consider a given setup:

- __App__ = actual site
- __Library__ = supplementary script loaded via script tag

## Action

`Action` is basically a message. It is a unit of communication that has its:
 
 - `type` - `string` identifier of an action, must be unique.
 - payload - serializable data you want to send alongside a given action.
 
### Usage
 
 ```typescript
import { Action } from '@wikia/post-quecast';

const myAction: Action = {
  type: '[Source of the Emission] Verb Describing Action',
  foo: {
    bar: 'foo bar',
  },
}
```
 

## setupPostQuecast

`setupPostQuecast` creates communication hub so that actions are properly propagated and queued.

### Usage

This method should be called only once and as soon as possible.

In our setup this means that `setupPostQuecast` should be called at the start of the __App__.

```typescript
import { setupPostQuecast } from '@wikia/post-quecast';

setupPostQuecast();
```

### Arguments

This method accepts one optional argument `coordinatorHost`. It is `window` by default and 99% of users want to leave it that way.

## Communicator

`Communicator` is a class that allows sending and listening actions.
It makes a use of library queueing capabilities and always returns full actions history.

### Usage
 
 ```typescript
import { Communicator, isActionOfType } from '@wikia/post-quecast';

const communicator = new Communicator();

// Listens for given actions
communicator.addListener(action => {
  if(isActionOfType(action, '[Docs] Test Action')) {
    console.log(action);
  }
});

// Dispatched an action
communicator.dispatch({ type: '[Docs] Test Action', foo: 'bar' });
```

### Arguments

Look at [PostQuecastOptions](#postquecastoptions)

## Transmitter

`Transmitter` is a lightweight version of `Communicator` that allows only to dispatch actions, not listen to them.

### Usage
 
 ```typescript
import { Transmitter } from '@wikia/post-quecast';

const transmitter = new Transmitter();

// Dispatched an action
transmitter.dispatch({ type: '[Docs] Test Action', foo: 'bar' });
```

### Arguments

Look at [PostQuecastOptions](#postquecastoptions)

## Operators

Operator is a method that modifies rxjs stream. `Communicators` `actions$` is such a stream.

### ofType

This operator helps to select given action from that stream. 
`actions$` stream emits actions of all types, so if we want to listen to one of them, we need to filter that stream.
This is what this operator is for.

Given example:

```typescript
communicator.dispatch({ type: '[A] a' });
communicator.dispatch({ type: '[A] a' });
communicator.dispatch({ type: '[B] b' });

communicator.addListener(action => {
  if(isActionOfType(action, '[A] a', '[C] c')) {
    console.log(action);
  }
});

communicator.dispatch({ type: '[C] c' });
```

We will see in the console: 
```
'[A] a'
'[A] a'
'[C] c'
```

## PostQuecastOptions

`PostQuecastOptions` options are all optional. They are:

- `coordinatorHost` - defaults to `window.top`
- `host` - defaults to `widnow`
- `channelId` - defaults to "default"

`coordinatorHost` and `host` are unlikely to change - they should stay default.

`channelId` allows to create different channels of communication:

```typescript
const communicatorA = new Communicator({channelId: 'a' });
const communicatorB = new Communicator({channelId: 'b' });

communicatorA.addListener(action => console.log(action));

communicatorB.dispatch({type: '[Docs] Test Action'});
```

Nothing will be printed because `communicatorA` and `communicatorB` are in different channels.
