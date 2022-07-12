## React 簡單介紹

- 重要基礎: component, prop, state
	- component 底下會簡單說明，想成 View 的部份
	- prop 是 UI 上的變量用來傳給 component 存取的
	- state 是 component 內部使用的資料儲存, ***使用 setState() 時是非同步的***
- [React-Intro][1]中提到的 index.js 應該略等於 pages/layout/index.js
- 上面的檔案中有 render() {...} 即為入口
- 建議修改物件值的方式是透過 copy > 修改 > assign()
	- 不會有意外，就是想改卻沒改到
	- 明確
	- 可以用前後差異來偵測改變
	- 建立 pure component, 讓 react 決定當有值改變時就 render
```javascript
	const squares = this.state.squares.slice();	// 先把 this.state.squares 複製出來
	....	// 對 squares 修改
	this.setState({squares: squares, last: last}); // 透過 setState() 設定值
```
- 底下兩行同義
```javascript
    var newPlayer = Object.assign({}, player, {score: 2});
    var newPlayer = {...player, score: 2}; // 稱為 object spread 語法
```
- 底下兩個片斷同義, 後者叫做 function component === pure component
```javascript
  class Square extends React.Component {
    render() {
      return (
        <button
          className="square"
          onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button>
      );
    }
  }
```
```javascript
  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
```
	前者可以完成複雜的機制，後者通常用來實作 pure-component

## components

- 主要用來告訴 UI 要看到什麼，也就是 UI 定義區
- 資料改變時，React 會自動透過 render() 告訴 component
- component 透過 props 傳參數，也就是 UI 的變量都存在 this.props 中
- 在 render() 中，可以像 {this.props.name} 的方式引用變數
- render() 中的 return 傳回一個 React element, 通常是 JSX 語法
- 引用 component 大約是 <Square valueI={i} />，此時會傳入 valueI 進 Square
	在 Square 中要引用 valueI 需要透過 { this.props.valueI }

### component 生命週期

- 當 component 被加入 DOM 時的主要方法
	- constructor(props): 有初始化 state 或綁定其他方法時需要, 配合 super(props);
		- 透過指定一個 this.state 物件來初始化內部 state
		- 為 event handler 方法綁定 instance
		- 請不要在 constructor() 中呼叫 setState()，而是直接用 this.state，其它地方反過來
	- static getDerivedStateFromProps(props, state)
	- render()
	- componentDidMount() 通常用來初始化 DOM node, 
		- 適合呼叫 setState()，
		- 理解成 constructor() 是孤僻的，而 componentDidMount() 是用來當社會性的  
	PS: render() 時機: prop 或 state 有變化時會呼叫 render()
- 當 UI component 更新時會呼叫的方法
	- static getDerivedStateFromProps(props, state)
		- 很少用，通常用於像動畫中 state 是依 prop 改變而改變
		- 通常在 componentDidUpdate() 實作相同功能
	- shouldComponentUpdate(nextProps, nextState) 為真時會觸發 componentDidUpdate()
		- 這個方法很少用，想改善效能應該是透過 pure-component
		- 未來可能會放棄這個方法
	- render()
	- getSnapshotBeforeUpdate(prevProps, prevState) 其傳回值會當做 componentDidUpdate() 的第三個參數
		- 在 DOM 改變之前觸發
		- 通常用於滾動軸的應用上
```javascript
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }
```
	- componentDidUpdate(prevProps, prevState, snapshot) 畫面資料的更動適合在此實作，
		- 適合呼叫 setState()，但是 setState() 會引發 render()
		- 所以這邊通常會像下面這樣，在 if 裡面
```javascript
  componentDidUpdate(prevProps) {
    // 常見用法, 別忘了比較前後 prop 有差異才做事，才不會因為引發 render() 變成無限更新
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
    }
  }
```
- 當 component 從 UI DOM 上移除時會呼叫的方法
	- componentWillUnmount() 用來清理 timer 或非同步的 request
		- 不應該在此呼叫 setState()
- 上述發生錯誤時會呼叫的方法
	- static getDerivedStateFromError(error) 返回 state, 請見下例
```javascript
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // 更新 state，如此下次 render 時 React 才能顯示 fallback UI
      return { hasError: true };
    }
  
    render() {
      if (this.state.hasError) {
        // 你可以 render 任何自訂的 fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children;
    }
  }
```
	- componentDidCatch(error, info) 在某個錯誤被一個 descendant component 拋出後被呼叫
		- 在開發模式會被觸發，以便 debug, 例如 window.onerror 或 window.addEventListener('error', callback)
		- 在產品模式則忽略
```javascript
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // 更新 state，如此下次 render 時 React 才能顯示 fallback UI
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      // ComponentStack 的範例：
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      logComponentStackToMyService(info.componentStack);
    }
  
    render() {
      if (this.state.hasError) {
        // 你可以 render 任何自訂的 fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children;
    }
  }
```
- 額外輔助方法
	- setState(updater, [callback])
		- 很重要一點，它是非同步的
		- 很重要第二點，不能在 constructor 中呼叫
		- setState 後會觸發 render()
		- 如果想『強制 setState()』，可以呼叫 flushSync()，但不建議這樣用
		- 可以在 callback 中取得最新的 state
		- 或在 componentDidUpdate() 中取得最新的 state, 它是批次處理後的結果
		- 一般 updater 是 new state, 但是可以是個 func, 好處是 state, props 都是最新的
```javascript
  this.setState((state, props) => {
    return {counter: state.counter + props.step};
  });
```
	- forceUpdate() 通常是因為 render() 可能被延遲時，它用來強制更新
		- 應避免使用此方法
- Class 屬性
	- defaultProps 直接看範例
```javascript
  class CustomButton extends React.Component {
    // ...
  }

  CustomButton.defaultProps = {
    color: 'blue'
  };
```
	- displayName 供 debug 用
- Instance 屬性
	- props 要強調的是，props 是唯讀的
		- 所有的 React component 都必須像 Pure function 一般保護他的 props
	- state

## ref
- [React實用介紹][1]
- [Courses][2]
	- [Glitch: React Starter Kit][3]
	- [Codecademy: React 101][4]
	- [Egghead.io: Start Learning React][5]
	- [React Crash Course 2018 youtube][6]
	- [Frontend Armory: React Fundamentals][7]
	- [Egghead.io: The Beginner’s Guide to ReactJS][8]
	- [Free React Bootcamp][9]
	- [Scrimba: Learn React for free][10]
	- [University of Helsinki: Full Stack Open MOOC][11]

[1]: https://zh-hant.reactjs.org/tutorial/tutorial.html
[2]: https://zh-hant.reactjs.org/community/courses.html
[3]: https://glitch.com/glimmer/post/react-starter-kit
[4]: https://www.codecademy.com/learn/react-101
[5]: https://egghead.io/courses/start-learning-react
[6]: https://www.youtube.com/watch?v=Ke90Tje7VS0
[7]: https://frontarm.com/courses/react-fundamentals/
[8]: https://egghead.io/courses/the-beginner-s-guide-to-react
[9]: https://tylermcginnis.com/free-react-bootcamp/
[10]: https://scrimba.com/g/glearnreact
[11]: https://fullstackopen.com/en/
