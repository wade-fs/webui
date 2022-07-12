## 條件 Render

- 在 React 中，你可以建立不同的 component 來封裝你需要的行為。接著，你可以根據你的應用程式的 state，來 render 其中的一部份
```javascript
  function UserGreeting(props) { // component UserGreeting
    return <h1>Welcome back!</h1>;
  }
  
  function GuestGreeting(props) { // component GuestGreeting
    return <h1>Please sign up.</h1>;
  }
  
  function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) { // 依據 isLoggedIn 改變 UI rendering
      return <UserGreeting />;
    }
    return <GuestGreeting />;
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  // 試改為 isLoggedIn={true}:
  root.render(<Greeting isLoggedIn={false} />);
```

### Element 變數

- 你可以用變數來儲存 element。它可以幫助你有條件地 render 一部份的 component，而保持其他輸出不變
```javascript
  function LoginButton(props) { // component LoginButton
    return (
      <button onClick={props.onClick}>
        Login
      </button>
    );
  }
  
  function LogoutButton(props) { // component LogoutButton
    return (
      <button onClick={props.onClick}>
        Logout
      </button>
    );
  }
  
  class LoginControl extends React.Component {
    constructor(props) {
      super(props);
      this.state = {isLoggedIn: false};
    }
  
    handleLoginClick = () => {
      this.setState({isLoggedIn: true});
    }
  
    handleLogoutClick = () => {
      this.setState({isLoggedIn: false});
    }
  
    render() {
      const isLoggedIn = this.state.isLoggedIn;
      let button;	// 用變數的方式，依 state 來改變 UI render
      if (isLoggedIn) {
        button = <LogoutButton onClick={this.handleLogoutClick} />;
      } else {
        button = <LoginButton onClick={this.handleLoginClick} />;
      }
  
      return (
        <div>
          <Greeting isLoggedIn={isLoggedIn} />
          {button}
        </div>
      );
    }
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<LoginControl />);
```

### Inline If 與 && 邏輯運算子

- 上面的式子明確易讀，但是下面使用 ?: 等效程式碼更簡潔
```javascript
  ....
    render() {
      const isLoggedIn = this.state.isLoggedIn;
      let button;   // 用變數的方式，依 state 來改變 UI render
      isLoggedIn ?
        button = <LogoutButton onClick={this.handleLogoutClick} />
      :
        button = <LoginButton onClick={this.handleLoginClick} />;

      return (
        <div>
          <Greeting isLoggedIn={isLoggedIn} />
          {button}
        </div> 
      );
    }
  } 
  ...
```
- 底下使用 inline if 更簡潔
```javascript
  ...
  render() {
    const isLoggedIn = this.state.isLoggedIn;

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {isLoggedIn ? <LogoutButton onClick={this.handleLogoutClick} />
         :
         <LoginButton onClick={this.handleLoginClick} />}
      </div>
    );
  }
  ...
```

### 防止 Component Render

- 在少數的情況下，你可能希望 component 隱藏自己本身，即便它是由另一個 component 被 render。可以透過回傳 null 而不是它的 render 輸出
- 下例由 props.warn 控制 <WarningBanner> component
- 在 component 中回傳 null 並不會影響 component 的生命週期方法。例如 componentDidUpdate 依然可以被呼叫
```javascript
  function WarningBanner(props) {
    if (!props.warn) {
      return null;
    }
  
    return (
      <div className="warning">
        Warning!
      </div>
    );
  }
  
  class Page extends React.Component {
    constructor(props) {
      super(props);
      this.state = {showWarning: true};
    }
  
    handleToggleClick = () => {
      this.setState(state => ({
        showWarning: !state.showWarning
      }));
    }
  
    render() {
      return (
        <div>
          <WarningBanner warn={this.state.showWarning} />
          <button onClick={this.handleToggleClick}>
            {this.state.showWarning ? 'Hide' : 'Show'}
          </button>
        </div>
      );
    }
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Page />);
```

## 參考
- [條件 Render][1]

[1]: https://zh-hant.reactjs.org/docs/conditional-rendering.html
