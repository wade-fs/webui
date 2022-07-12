## 事件處理

- 使用 React element 處理事件跟使用 DOM element 處理事件是十分相似的。它們有一些語法上的差異：
	- 事件的名稱在 React 中都是 camelCase，而在 HTML DOM 中則是小寫。
	- 事件的值在 JSX 中是一個 function，而在 HTML DOM 中則是一個 string。
```javascript
  /// HTML 範例
  <button onclick="activateLasers()">
    Activate Lasers
  </button>

  /// React 範例
  <button onClick={activateLasers}>
    Activate Lasers
  </button>
```
- 在 React 中，你不能夠使用 return false 來避免瀏覽器預設行為。你必須明確地呼叫 preventDefault
```javascript
  /// HTML 範例
  <form onsubmit="console.log('You clicked submit.'); return false">
    <button type="submit">Submit</button>
  </form>

  /// React 範例
  function Form() {
    function handleSubmit(e) {
      e.preventDefault();
      console.log('You clicked submit.');
    }

    return (
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    );
  }
```
- 當使用 React 時，只需要在這個 element 剛開始被 render 時就提供一個 listener
```javascript
  class Toggle extends React.Component {
    constructor(props) {
      super(props);
      this.state = {isToggleOn: true};
  
      // 為了讓 `this` 能在 callback 中被使用，這裡的綁定是必要的：
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }
  
    render() {
      return (
        <button onClick={this.handleClick}> // 剛開始就提供一個 listener
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      );
    }
  }
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Toggle />);
```
- 特別注意上面在 constructor 中的 bind 綁定 callback
- 下面是等效的簡化寫法，在 constructor 中不必 bind
```javascript
  class Toggle extends React.Component {
    constructor(props) {
      super(props);
      this.state = {isToggleOn: true};
    }
  
    handleClick = () => {
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }
  
    render() {
      return (
        <button onClick={this.handleClick}> // 剛開始就提供一個 listener
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      );
    }
  }
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Toggle />);
```

### 將參數傳給 Event Handler

以下兩個用法有相同效果，建議採用第一個語法
```javascript
  <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
  <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

## 參考
[事件處理][1]

[1]: https://zh-hant.reactjs.org/docs/handling-events.html
