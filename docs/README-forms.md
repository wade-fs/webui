## 表單

- 先看看 HTML 範例
```html
  <form>
  <label>
        Name:
      <input type="text" name="name" />
    </label>
    <input type="submit" value="Submit" />
  </form>
```

### Controlled Component

- 在 HTML 中，表單的 element 像是 `<input>`、`<textarea>` 和 `<select>` 通常會維持它們自身的 state，並根據使用者的輸入來更新 state
- 在 React 中，可變的 state 通常是被維持在 component 中的 state property，並只能以 setState() 來更新<Br />
```javascript
  class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
    }
  
    handleChange = (event) => {
      this.setState({value: event.target.value});
    }
  
    handleSubmit = (event) => {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
```
- 上例中，form 的來源為 component 中的 state.value, 等於結合 <form> 的值的狀態 與 component 的 state，此時的 NameForm component 稱之為 Controlled Component
- 由於 form 的 value attribute 是被設定在我們的表單 element 上，顯示的 value 會永遠是 this.state.value，這使得 React 的 state 成為了資料來源
- 由於 handleChange 在每一次鍵盤被敲擊時都會被執行，並更新 React 的 state，因此被顯示的 value 將會在使用者打字的同時被更新
- 在這樣的 controlled component 中，顯示的 value 始終由 React 的 state 驅動，雖然這意味著你必須寫更多的 code，但現在你同時可以將 value 傳遞給其他的 UI element，或是從其他 event handler 重置

### Textarea 標籤

- 在 HTML 中，一個 `<textarea>` 的 element 是經由它的 children 來定義它的文字, 即
```html
	<textarea> Hello there, this is some text in a text area </textarea>
```
- 在 React 中，`<textarea>` 則是類似 Form 使用一個 value 的 attribute
```javascript
  class EssayForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: 'Please write an essay about your favorite DOM element.'
      };
    }
  
    handleChange = (event) => {
      this.setState({value: event.target.value});
    }
  
    handleSubmit = (event) => {
      alert('An essay was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Essay:
            <textarea value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
```

### Select 標籤

```html
  // html 範例
  <select>
    <option value="grapefruit">Grapefruit</option>
    <option value="lime">Lime</option>
    <option selected value="coconut">Coconut</option>
    <option value="mango">Mango</option>
  </select>
```
```javascript
  // React 範例
  class FlavorForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: 'coconut'};
    }
  
    handleChange = (event) => {
      this.setState({value: event.target.value});
    }
  
    handleSubmit = (event) => {
      alert('Your favorite flavor is: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Pick your favorite flavor:
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="grapefruit">Grapefruit</option>
              <option value="lime">Lime</option>
              <option value="coconut">Coconut</option>
              <option value="mango">Mango</option>
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
```
- 比較特別之處在於表達 selected 的地方，一樣是透過 state.value 的方式
- 關於 multiple values 的用法大致是 `<select multiple={true} value={['B', 'C']}>`

### 檔案 input 標籤

由於它的值是唯讀，它在 React 中是一個 uncontrolled component，請參考 [uncontrolled components][2]

### 處理多個輸入

當你需要處理多個 controlled input element，你可以在每個 element 中加入一個 name attribute，並讓 handler function 選擇基於 event.target.name 的值該怎麼做
```javascript
  class Reservation extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isGoing: true,
        numberOfGuests: 2
      };
    }
  
    // 利用 target.name 處理 isGoing 及 numberOfGuests
    handleInputChange = (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }
  
    render() {
      return (
        <form>
          <label>
            Is going:
            <input
              name="isGoing"
              type="checkbox"
              checked={this.state.isGoing}
              onChange={this.handleInputChange} />
          </label>
          <br />
          <label>
            Number of guests:
            <input
              name="numberOfGuests"
              type="number"
              value={this.state.numberOfGuests}
              onChange={this.handleInputChange} />
          </label>
        </form>
      );
    }
  }
```
- 上面使用 ES6 的 computed property name 語法來更新與輸入中的 name 相對應的 state key, 即 `[name]: value`


## 參考
- [表單][1]
- [uncontrolled components][2]

[1]: https://zh-hant.reactjs.org/docs/forms.html
[2]: https://zh-hant.reactjs.org/docs/uncontrolled-components.html
