## 幾個相關的詞

- Redux
- Context API
- Hooks API
- reducer
- store
- action

## Redux middleware 優點

- 可預測（Predictable）：Redux 的運作基於三大原則，開發者可以清楚的知道狀態為何被更新而且如何被更新。
- 易除錯（Debuggable）：官方提供不同形式的 DevTools （例如 Chrome Extension）讓開發者使用圖形化介面除錯。
- 彈性大（Flexible）：輕量的 Redux 僅提供核心功能，開發者能夠從豐富的第三方套件中根據需求選擇合適的來進行擴充。

## Redux middleware 主要用途

- 非同步讀資料
- API requests
- Logging
- 透過 Middleware 我們可以延遲、記錄（log）、調整或停止 action

## Middleware 基本介紹

### Middleware 的功能是什麼？

- 針對接受到的 request 在進入 route 前進行解析、修改等動作。
- Middleware 可以在預先定義好的起、終點之下，針對所有從起點到終點的東西進行處理。
```text
                              API
                               ^
  Action --> dispatch --> Middleware --> Reducer --> Store --+
     ^---------------------- View ---------------------------|
```	
![redux middleware 流程圖][13]

### 如何使用 Middleware?

- 標準用法在 store.js 中
```javascript
  import { applyMiddleware, createStore } from 'redux';
  const enhancer = applyMiddleware(
    middlewareOne,
    middlewareTwo
  );
  const store = createStore(
    reducers,
    initialState,
    enhancer
  );
```

## Middleware 的使用方式

### 如何建立一個 middleware?

- 現行採用 ES6 的寫法如下
```javascript
const middleware = store => next => action => {  /* Code */  return next(action);
}
```

### Middleware 中的 next 是做什麼的？

- next 是用來將 Action 交給下一個 Middleware 的處理的函式
- 換句話說，每一個 Middleware 接到的 Action 都會是前一個 Middleware 呼叫 next 傳入的 Action
- 如果沒有下一個 Middleware 就會交由 Reducer 處理
```javascript
  const middleware1 = store => next => action => {
    next(action);
  };
  const middleware2 = store => next => action => {
    next(action);
  };
  const reducer = (state, action) => {}// 建立 store & 套用 middleware
  store.dispatch(action);
```
	- 當 store dispatch 一個 action，如果有 Middleware 則由第一個 Middleware 處理，否則直接交由 Reducer 來處理
	- middleware1 為第一個 Middleware，接到 store dispatch 的 action，呼叫 next 將 action 交給下一個 Middleware（middleware2）處理
	- middleware2 接到 middleware1 dispatch 的 action，呼叫 next 將 action 交給下一個 Middleware 處理
	- 因為 middleware2 是最後一個 Middleware，所以由 reducer 處理 middleware2 dispatch 的 action

### Middleware 中呼叫 next 的返回值是什麼？

- 每一個 Middleware return 的值會在前一個 Middleware 中呼叫 next 取得
- 也就是說，在 Middleware 中呼叫 next 的返回值會是下一個 Middleware return 的值
- 如果是在最後一個 Middleware 中呼叫 next，返回值會是傳入的 action 本身
```javascript
  const middleware1 = store => next => action => {
    const value = next(action);
    return value;
  };
  const middleware2 = store => next => action => {
    const value = next(action);
    return value;
  };
  // 建立 store & 套用 middleware
  const value = store.dispatch(action);
```
	- 最後一個 Middleware（middleware2）呼叫 next 會返回傳入的 action
	- middleware1 呼叫 next 會返回下一個 Middleware（middleware2）return 的值
	- 最後 store.dispatch 返回的會是第一個 Middleware（middleware1）return 的值

### 在 Middleware 中一定要有 return 嗎？

- 不一定要有 return, 但是...
- 如果 Middleware 中沒有 return，那在上一個 Middleware 中呼叫 next 就會返回 undefined
- 如果是第一個 Middleware 中沒有 return，那呼叫 store.dispatch 就會返回 undefined
- Middleware 可以 return 任何型態的資料, 建議直接 return 呼叫 next 返回的值, 確保呼叫 store.dispatch 可以取得 dispatch 的 action

### 可以在 Middleware 中取得當前的 state 嗎？

	Middleware 會寫成 store => next => action => {} 的其中一個原因就是讓開發者可以在 Middleware 取得 store 參數，透過 store.getState 來取得當前的 state。

### 在 Middleware 中呼叫 store.dispatch 會發生什麼事？

- Middleware 中的 store 參數除了可以呼叫 getState 來取得當前的 state 之外，也可以呼叫 dispatch 來發送一個 action
- 和呼叫 next 的不同之處在於：透過 next 來 dispatch 的 action 送往下一個 Middleware，而透過 store.dispatch 來 dispatch 的 action 則是會重新經過所有的 Middleware
![middle dispatch][1]

## Middleware 的運作原理

### 為什麼 Middleware 要宣告成 store => next => action => {} 的形式？

- Middleware 要能夠在 Action 被 dispatch 之後、進入 Reducer 之前去處理它，因此 Middleware 應該要是一個能夠取得 action 參數的函式：
```javascript
  function middleware(action) {}
```
- 為了取得當前的 state 或是重新 dispatch 一個 action，Middleware 需要取得 store 參數，因此再多包覆一層：
```javascript
  function storeWrapper(store)
    function middlewareWrapper(dispatch) {
      return function(action) {
        dispatch(action)
      }
    }
  }
```
- 用 ES6 Arrow Function 的形式來改寫：
```javascript
  const = storeWrapper = store => dispatch => action => {
    dispatch(action)
  }
```

### 目前 Q8 的 middleware src/store.js

```javascript
const middlewares = [
  promise,
  thunk,
  WsNotificationDispatcher,
  ApplicationDataLoader,
  DataLoader,
  ScheduleDataLoader,
  ServerDataLoader,
  SettingDataLoader,
  TerminalDataLoader,
];
```

### Redux 如何套用多個 Middleware？

- Redux 套用多個 Middleware 的邏輯，主要在 applyMiddleware 這個函式內
- 略過

## ref
- [Redux Middleware][3]
- [詳解 Redux Middleware][2]
- [Getting Started with Redux][12]
- [Redux Fundamentals, Part 1: Redux Overview][4]
- [Redux Fundamentals, Part 2: Concepts and Data Flow][5]
- [Redux Fundamentals, Part 3: State, Actions, and Reducers][6]
- [Redux Fundamentals, Part 4: Store][7]
- [Redux Fundamentals, Part 5: UI and React][8]
- [Redux Fundamentals, Part 6: Async Logic and Data Fetching][9]
- [Redux Fundamentals, Part 7: Standard Redux Patterns][10]
- [Redux Fundamentals, Part 8: Modern Redux with Redux Toolkit][11]

[1]: middleware-1.png
[2]: https://max80713.medium.com/%E8%A9%B3%E8%A7%A3-redux-middleware-efd6a506357e
[3]: https://github.com/max80713/notes/blob/master/redux/redux-middleware.md
[4]: https://redux.js.org/tutorials/fundamentals/part-1-overview
[5]: https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow
[6]: https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers
[7]: https://redux.js.org/tutorials/fundamentals/part-4-store#middleware
[8]: https://redux.js.org/tutorials/fundamentals/part-5-ui-react
[9]: https://redux.js.org/tutorials/fundamentals/part-6-async-logic
[10]: https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns
[11]: https://redux.js.org/tutorials/fundamentals/part-8-modern-redux
[12]: https://redux.js.org/introduction/getting-started
[13]: middleware-2.png
