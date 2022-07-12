## Uncontrolled Component

```javascript
  // Uncontrolled component 範例
  class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.input = React.createRef();
    }
  
    handleSubmit = (event) => {
      alert('A name was submitted: ' + this.input.current.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" ref={this.input} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
```
- 上例在 `<input ...ref=../>` 中建立一個ref 到 this.input, 
	此變數在 constructor 中透過 `this.input = React.createRef();` 設定
- 這樣一來，就不用為此 `<input` 建立 event handler, 
- 需要引用時，透過 `this.input.current.value` 來取值
- 這樣的好處在於減少 event handler, 但是讓程式碼不純粹，不建議使用

### 預設值

- 在 React 的 render 生命週期裡，表單上的 value attribute 會覆寫掉 DOM 的值
- 所以要給預設值（初始值）必須透過像 `<input defaultValue="XXXX" ...` 的方式
- 除 `<input type="text"` 支援 defaultValue 外，`<select>`, `<textarea>` 也支援 defaultValue
- `<input type="radio"` 支援 defaultChecked

### 檔案輸入標籤

- 在 React 裡，`<input type="file" />` 永遠都是 uncontrolled component，因為它的值只能被使用者設定，而無法由程式碼來設定
```javascript
  // <input type="file" 永遠是 uncontrolled component
  class FileInput extends React.Component {
    constructor(props) {
      super(props);
      this.fileInput = React.createRef();
    }
    handleSubmit = (event) => {
      event.preventDefault();
      alert(
        `Selected file - ${this.fileInput.current.files[0].name}`
      );
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Upload file:
            <input type="file" ref={this.fileInput} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      );
    }
  }
  
  const root = ReactDOM.createRoot(
    document.getElementById('root')
  );
  root.render(<FileInput />);
```


## 參考
[Uncontrolled Component][1]

[1]: https://zh-hant.reactjs.org/docs/uncontrolled-components.html
