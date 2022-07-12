# Terminals
[1]: middleware-2.png
[2]: README-middleware.md
![redux middleware 流程圖][1]
- "React(View)" > Calls an "Action Creator" > Returns a... "Action" > Sent to ... "Middleware" > Forwards action to ... "Reducers" > Produces new ... "State" > Sent to ... "React(View)"
- 複習[middleware][2]
```javascript
  const middleware1 = store => next => action => {
    const value = next(action);
    return value;
  };
  const middleware2 = store => next => action => {
    const value = next(action);
    return value;
  };
  const reducer = (state, action) => {}// 建立 store & 套用 middleware
  // 建立 store & 套用 middleware
  const value = store.dispatch(action);
```
	Middleware 會寫成 store => next => action => {} 的其中一個原因就是讓開發者可以在 Middleware 取得 store 參數，透過 store.getState 來取得當前的 state。
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
	WS 及 DataLoader 是 middleware 之一，定義在 src/store.js
	『每一個 Redux 應用都是一個 store』「Store 儲存應用程式的全域 state」

## reducers/TerminalReducer.js

### default

- OPEN_TERMINAL_EDITOR
	- editorOpened = true
	- editingId = payload.id
	- isGroup = payload.isGroup
	- originalEditingId = payload.id

- OPEN_TERMINAL_WIZARD
	- wizardOpened = true
	- isGroup = payload.id
	- defaultTerminal = payload.defaultTerminal
	- schedules = {}
	- modules = {}
	- moduleSettings = {}
	- msIdWrappers = {}

- CLOSE_TERMINAL_WIZARD
	- wizardOpened = false
	- parentTerminal = {}
	- defaultTerminal = null
	- verifyAuthUserResult = defaultObject
	- terminalSetting = defaultObject

- CLOSE_TERMINAL_EDITOR
	- editorOpened = false
	- editingId = ""
	- originalEditingId = ""
	- schedules = {}
	- editingTerminal = {}
	- parentTerminal = {}
	- modules = {}
	- moduleSettings = {}
	- msIdWrappers = {}
	- verifyAuthUserResult = defaultObject

- CLEAR_AUTH_VERIFY
	- verifyAuthUserResult = defaultObject

- CLEAR_TERMINAL_SETTING
	- terminalSetting = defaultObject

- CLEAR_PARENT_TERMINAL_GROUP
	- parentTerminal = defaultObject

- INITIAL_PENDING_TERMINALS
	- pendingTerminals = defaultArray

- WS_NOTIFICATION_TERMINAL

- WS_NOTIFICATION_TERMINAL_LIST

- WS_NOTIFICATION_TERMINAL_STATUS
	- 動作上應該是把 ws 傳上來的資料放到 terminals[t.Id] 中
	- 會跟 terminals 有關，需要 Id, Status 欄位

- UPDATE_TERMINAL_LIST
	- terminals = { data: { $set: payload.list } }
	- terminalMainTree = { data: { $set: payload.tree } },

- UPDATE_TERMINAL_GROUP_LIST
	- terminalGroups = { data: { $set: payload.list } },
	- terminalMainTree = { data: { $set: payload.tree } },

- WS_NOTIFICATION_PENDING_TERMINALS
	- pendingTerminals = payload
