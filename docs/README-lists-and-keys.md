## 列表與 Key

### Render 多個 Component

```javascript
  const numbers = [1, 2, 3, 4, 5];
  // 利用 map() 的方式跟 javascript 用法一致
  const listItems = numbers.map((numbers) =>
    <li>{numbers}</li>
  );

  const root = ReactDOM.createRoot(document.getElementById('root')); 
  root.render(<ul>{listItems}</ul>);
```

### 基本列表 Component

- 上面的範例沒怎麼善用 React 的 component, 請看底下等效範例
	封裝起來的好處是數不盡的，至少有OOP 的封裝概念，不易出錯
```javascript
  function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) =>
      <li>{number}</li>
    );
    return (
      <ul>{listItems}</ul>
    );
  }
  
  const numbers = [1, 2, 3, 4, 5];
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<NumberList numbers={numbers} />);
```
- 上述程式碼會出現『你應該提供 key 給每一個列表項目』的警告，先修程式如下
```javascript
  function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) =>
      <li key={number.toString()}>
        {number}
      </li>
    );
    return (
      <ul>{listItems}</ul>
    );
  }
  ...
```

### key

- Key 幫助 React 分辨哪些項目被改變、增加或刪除
- 在 array 裡面的每個 element 都應該要有一個 key，如此才能給予每個 element 一個固定的身份
- 選擇 key 最佳的方法是在列表中使用唯一識別字串來區別 sibling 項目, 例如 id

### 用 Key 抽離 Component

- Key 只有在周遭有 array 的情境中才有意義，請仔細比對下列兩者，前者是錯誤例
```javascript
  // 錯誤用例
  function ListItem(props) {
    const value = props.value;
    return (
      // 錯！你不需要在這裡指出 key，因為此處沒有被 map() 包住，它本身不在 array 中
      <li key={value.toString()}>
        {value}
      </li>
    );
  }
  
  function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) =>
      // 錯！你應該要在這裡指出 key：
      <ListItem value={number} />
    );
    return (
      <ul>
        {listItems}
      </ul>
    );
  }
  
  // 正確用例
  function ListItem(props) {
    // 正確！你不需要在這裡指出 key：
    return <li>{props.value}</li>;
  }
  
  function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) =>
      // 正確！Key 應該在 array 內被指定。
      <ListItem key={number.toString()} value={number} />
    );
    return (
      <ul>
        {listItems}
      </ul>
    );
  }
```

### 在 JSX 中嵌入 map()

```javascript
  // 上例中等效部份，請仔細比對
  function NumberList(props) {
    const numbers = props.numbers;
    return (
      <ul>
        {numbers.map((number) =>
          <ListItem key={number.toString()}
                    value={number} />
        )}
      </ul>
    );
  }
```

### Key 必須在 Sibling 中是唯一的

- 在 array 中使用的 key 應該要是唯一的值。然而，它們不必在全域中唯一
```javascript
  function Blog(props) {
    const sidebar = (
      <ul>
        {props.posts.map((post) =>
          <li key={post.id}>
            {post.title}
          </li>
        )}
      </ul>
    );
    const content = props.posts.map((post) =>
      <div key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>
    );
    return (
      <div>
        {sidebar}
        <hr />
        {content}
      </div>
    );
  }
  
  const posts = [
    {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
    {id: 2, title: 'Installation', content: 'You can install React from npm.'}
  ];
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Blog posts={posts} />);
```
- Key 的功能是提示 React，但它們不會被傳遞到你的 component, 也就是說，在 component 中無法讀取 key 值，卻可以用別的 props 設定相同的值來讀取
```javascript
  const content = posts.map((post) =>
    <Post
      key={post.id}
      id={post.id}
      title={post.title} />
  );
  // 上例中可以讀到 props.id 卻讀不到 props.key
```
- 在 component 中回傳 null 並不會影響 component 的生命週期方法。例如 componentDidUpdate 依然可以被呼叫

## 參考
[列表與 Key][1]

[1]: https://zh-hant.reactjs.org/docs/lists-and-keys.html
