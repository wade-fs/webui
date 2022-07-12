## 以 React 思考

### 第一步: 從 UI/UX 的視覺稿開始拆解 component 層級

- 假如UI 如下圖<BR />
	![UI 範例][2]
- 其資料如下
```json
  [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
  ];
```
- component 的層級可以如下思考（供參考）<BR />
	![以 React Component 思考 UI][3]
- 如果你在跟設計師合作的話，他們可能已經幫你做好這一步了，所以跟他們聊聊吧！
	設計師通常也會為 component 命名，直接採用會比較好溝通與追蹤
- 單一職責原則，它的意思是：在我們的理想中，一個 component應該只負責做一件事情。
- 如果你的模式是正確地被建立的話，你的 UI（以及你的 component 結構）會很好的與繫結的 JSON 資料相互對應。

- 以上圖為例，總共有5個 components
	- FilterableProductTable（橘色）： 包含整個範例
		- SearchBar（藍色）： 接收所有 使用者的輸入
		- ProductTable（綠色）： 展示並過濾根據使用者輸入的資料集
			- ProductCategoryRow（土耳其藍色）： 為每個列別展示標題
			- ProductRow（紅色）： 為每個產品展示一列

### 第二步: 在 React 中建立一個靜態版本

- 完整靜態 component 範例
```javascrips
  class ProductCategoryRow extends React.Component {
    render() {
      const category = this.props.category;
      return (
        <tr>
          <th colSpan="2">
            {category}
          </th>
        </tr>
      );
    }
  }
  
  class ProductRow extends React.Component {
    render() {
      const product = this.props.product;
      const name = product.stocked ?
        product.name :
        <span style={{color: 'red'}}>
          {product.name}
        </span>;
  
      return (
        <tr>
          <td>{name}</td>
          <td>{product.price}</td>
        </tr>
      );
    }
  }
  
  class ProductTable extends React.Component {
    render() {
      const rows = [];
      let lastCategory = null;
      
      this.props.products.forEach((product) => {
        if (product.category !== lastCategory) {
          rows.push(
            <ProductCategoryRow
              category={product.category}
              key={product.category} />
          );
        }
        rows.push(
          <ProductRow
            product={product}
            key={product.name} />
        );
        lastCategory = product.category;
      });
  
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );
    }
  }
  
  class SearchBar extends React.Component {
    render() {
      return (
        <form>
          <input type="text" placeholder="Search..." />
          <p>
            <input type="checkbox" />
            {' '}
            Only show products in stock
          </p>
        </form>
      );
    }
  }
  
  class FilterableProductTable extends React.Component {
    render() {
      return (
        <div>
          <SearchBar />
          <ProductTable products={this.props.products} />
        </div>
      );
    }
  }
  
  
  const PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
  ];
   
  const root = ReactDOM.createRoot(document.getElementById('container'));
  root.render(<FilterableProductTable products={PRODUCTS} />);
```
	- 最簡單的方式是為你的應用程式建立一個接收資料模型、render UI 且沒有互動性的版本
	- 請完全不要使用 state 來建立這個靜態版本, State 是保留給互動性的，也就是會隨時間改變的資料
	- 小型專案的話，由上到下比較簡單，大型專案則由下到上容易模組化開發除錯測試
	- 靜態版本只有含有 render() 方法

### 第三步: 找出最少（但完整）的 UI State 的代表

- 避免重複代碼原則: 譬如可以用 array 就不要用一堆相同性質的變數，甚至不用再添『數量』的變數
- 對於每一個資料，問你自己這三個問題：
	1. 這個資料是從 parent 透過 props 傳下來的嗎？如果是的話，那它很可能不是 state。
	1. 這個資料是否一直保持不變呢？如果是的話，那它很可能不是 state。
	1. 你是否可以根據你的 component 中其他的 state 或 prop 來計算這個資料呢？如果是的話，那它一定不是 state。
- 以本例，state 應該只有二個
	1. 使用者輸入的搜尋關鍵字
	1. checkbox 的值

### 第四步: 找出你的 State 應該在哪裡

- React 的核心精神是單向資料流，從 component 的層級從高往下流
- 請跟著以下的步驟來思考, 在你的應用程式中的每個 state：
	1. 指出每個根據 state 來 render 某些東西的 component。
	1. 找出一個共同擁有者 component（在層級中單一一個需要 state 的、在所有的 component 之上的 component）。
	1. 應該擁有 state 的會是共同擁有者 component 或另一個更高層級的 component。
	1. 如果你找不出一個應該擁有 state 的 component 的話，那就建立一個新的 component 來保持 state，並把它加到層級中共同擁有者 component 之上的某處。
- 結果是
	- ProductTable 需要根據 state 來篩選產品列表，而 SearchBar 需要展示搜尋關鍵字和 checkbox 的 state。
	- 這兩個 component 的共同擁有者 component 是 FilterableProductTable。
	- 概念上來說，篩選過的文字和復選框的值存在於 FilterableProductTable 中是合理的。
- 應用上面的結果到前面的靜態 components
	- 把 property this.state = {filterText: '', inStockOnly: false} 加到 FilterableProductTable 的 constructor 裡面以反映你的應用程式的初始 state
	- 把 filterText 和 inStockOnly 作為 prop 傳給 ProductTable 和 SearchBar
	- 用這些 prop 來篩選 ProductTable 中的列，並設定 SearchBar 中的表格欄的值
```javascript
class ProductCategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="2">
          {category}
        </th>
      </tr>
    );
  }
}

class ProductRow extends React.Component {
  render() {
    const product = this.props.product;
    const name = product.stocked ?
      product.name :
      <span style={{color: 'red'}}>
        {product.name}
      </span>;

    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const rows = [];
    let lastCategory = null;

    this.props.products.forEach((product) => {
      if (product.name.indexOf(filterText) === -1) {
        return;
      }
      if (inStockOnly && !product.stocked) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category} />
        );
      }
      rows.push(
        <ProductRow
          product={product}
          key={product.name}
        />
      );
      lastCategory = product.category;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }
  
  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleInStockChange(e) {
    this.props.onInStockChange(e.target.checked);
  }
  
  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockChange}
          />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    };
    
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }
  
  handleInStockChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly
    })
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockChange={this.handleInStockChange}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}


const PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

const root = ReactDOM.createRoot(document.getElementById('container'));
root.render(<FilterableProductTable products={PRODUCTS} />);
```

### 第五步：加入相反的資料流

- 如果你嘗試在上一個版本的範例（第四步）中輸入或勾選 checkbox，你會看到 React 忽略你的輸入
- 我們把 input 的 value prop 設定為永遠和從 FilterableProductTable 傳下來的 state ㄧ樣。
- 我們想確保當使用者改變這個表格時，我們會更新 state 以反映使用者的輸入
- 既然 component 只應該更新它自己本身的 state， FilterableProductTable 將會把 callback 傳給 SearchBar，而它們則會在 state 該被更新的時候被觸發
- 可以在輸入上使用 onChange 這個 event 來 接收通知
- 被 FilterableProductTable 傳下來的 callback 則會呼叫 setState()，之後應用程式就會被更新

## 參考文獻
[用 React 思考][1]

[1]: https://zh-hant.reactjs.org/docs/thinking-in-react.html
[2]: component-1.png
[3]: thinking-in-react-components.png
