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
import { Communicator, ofType } from '@wikia/post-quecast';

const communicator = new Communicator();

// Listens for given actions
communicator.actions$.pipe(ofType('[Docs] Test Action')).subscribe(action => console.log(action));

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

communicator.actions$.pipe(ofType('[A] a', '[C] c')).subscribe(action => console.log(action));

communicator.dispatch({ type: '[C] c' });
```

We will see in the console: 
```
'[A] a'
'[A] a'
'[C] c'
```

### onlyNew

Ad mentioned in `Communicator` description, `actions$` include all actions, new and old.
We can see that in the previous `ofType` example.

Let us consider this example again but now with `onlyNew` operator:

```typescript
communicator.dispatch({ type: '[A] a' });
communicator.dispatch({ type: '[A] a' });
communicator.dispatch({ type: '[B] b' });

communicator.actions$.pipe(onlyNew(), ofType('[A] a', '[C] c')).subscribe(action => console.log(action));

communicator.dispatch({ type: '[C] c' });
```

We will see in the console:
```
'[C] c'
```

Because only '[C] c' was an action emitted after subscription was made.

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

communicatorA.actions$.subscribe(action => console.log(action));

communicatorB.dispatch({type: '[Docs] Test Action'});
```

Nothing will be printed because `communicatorA` and `communicatorB` are in different channels.

# Good Practices

It is a common case to want to listen of an action only once and then forget about it.
To do so use rxjs's `take` operator:

```typescript
import { ofType } from '@wikia/post-quecast';
import { take } from 'rxjs/operators';

communicator.dispatch({ type: '[A] a' });
communicator.dispatch({ type: '[A] a' });
communicator.dispatch({ type: '[B] b' });

communicator.actions$.pipe(ofType('[A] a'), take(1)).subscribe(action => console.log(action));
```

We will see in the console:
```
'[A] a'
```

Because we said we want only one emittion.

__Warning__: order of the operators is not accidental `ofType` goes first, followed by `take`.
