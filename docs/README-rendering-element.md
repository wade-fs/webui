## Render Element

- 建立 React 應用程式最小的單位是 element，component 是由 element 組成的
- React element 是單純的 object 而不是 DOM element
- React element 是 immutable 的。一旦你建立一個 element，你不能改變它的 children 或是 attribute

### 更新被 Render 的 Element

- 更新 UI 唯一的方式是建立一個新的 element，並且將它傳入到 root.render
```javascript
  const root = ReactDOM.createRoot(
    document.getElementById('root')
  );
  
  function tick() {
    const element = (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
      </div>
    );
    root.render(element);
  }
  
  setInterval(tick, 1000);
```
- 在實踐中，大部分 React 應用程式只呼叫 root.render() 一次

### React 只更新必要的 Element

- React DOM 會將 element 和它的 children 與先前的狀態做比較，並且只更新必要的 DOM 達到理想的狀態。
- 即使我們在每秒建立一個 element 描述整個 UI tree，只有內容更改的 text node 才會被 React DOM 更新。<BR />
![React 只更新必要的 Element][2]

## 參考
[Render Element][1]

[1]: https://zh-hant.reactjs.org/docs/rendering-elements.html
[2]: granular-dom-updates.gif
