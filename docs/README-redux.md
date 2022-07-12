[1]: https://redux.js.org/tutorials/fundamentals/part-1-overview

## 參考[Redux 基礎 - 概論][1]

- Redux 透過使用稱之為 "actions" 的事件來管理與更新應用程式的 state 的函式庫,
- 它充當需要在整個應用程序中使用的狀態的集中式 store，其規則確保狀態只能以可預測的方式更新。
- Redux 使用時機與場合
	- Redux 可幫助您處理共享狀態管理
	- 您在應用程序的許多地方都需要大量的應用程序狀態
	- 應用程序狀態會隨著時間的推移而頻繁更新
	- 更新該狀態的邏輯可能很複雜
	- 該應用程序具有中型或大型代碼庫，並且可能由許多人開發
- store
	- "store" 是保存應用程序全局狀態的容器。
	- 不應該直接更改 state, 導致狀態更新的唯一方法是  
		創建一個描述“應用程序中發生的事情”的普通操作對象，然後將操作 dispatch 到 store 以告訴它發生了什麼。
	- 當 display action之後， store 執行 reducer 函式，讓它根據 action 及舊 state 計算新 state
