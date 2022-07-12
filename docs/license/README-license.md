## License 認證流程:
	[認證流程][1]

## License File 加解密工具
	[加解密工具][2]

## keytest

### keytest.jar 的源碼
	[keytest.jar](https://bitbucket.org/goarista/keytest)

### keytest.jar 用法:

Function                        |                 Command
:-------------------------------|:-----------------------
To encrypt with private key     |java -jar keytest.jar -encrypt -private_key arista-test.private -in_file <your_test_file> -out_file <new_encrypted_file
To decrypt with public key      |java -jar keytest.jar -decrypt -private_key arista-test.private -in_file <encrypted_file> -out_file <new_decrypted_file>
To encrypt with public key      |java -jar keytest.jar -encrypt -public_key arista-test.public -in_file <your_test_file> -out_file <new_encrypted_file>
To decrypt with private key     |java -jar keytest.jar -decrypt -private_key arista-test.private -in_file <encrypted_file> -out_file <new_decrypted_file>


### 用 go 重寫 keytest.jar
	keytest.go 參考上面的語法，它是具有 main() 單獨存在的執行檔, 可以用 go run keytest.go -h 取得說明

### 請改用 licenseUtils

## licenseUtils

- 透過 keytest 的話，需要準備 input file, 上面的參考網址有範例
- 用法請見 gen-lic

## license 資訊

- product        : "Q8 Vista"
- version        : 目前不用做確認，資料庫也有版本，目前是 1.0
- licenseId      : 這個是透過 email 由 Arista 管理部發出
- customerId     : 客戶的 id, 由 Arista 管理部管理
- installationId : 由 licenseUtils -gen_install ${licenseId} 產生
- licenseType    : perpetual|subscription|evaluation = 永久|訂閱|評估
- expiration     : 有效期限，見[#expiration]說明
- items          : 定義各種屬性，目前支援 clients|redundant
	- clients  : 定義可用數量
	- redundant: 忘了老闆的定義，目前全為 true

## expiration

- licenseType
	1. perpetual 不必看 expiration
	1. subscription 在日期到達 expiration 之後，可繼續使用，但是 WebUI 剩唯讀
	1. evaluation 完全不受有效期限或數量限制，建議上限為 5
- 這邊比較複雜的情況有幾個
	1. 加簽怎麼處理？
	1. 前後兩次不同的 License 怎麼處理？
	1. 不同的 License 的有效期限怎麼處理？
- 建議原則是
	1. 不管允不允許多簽，只會有一種 licenseType
	1. 建議業務管理部不進行多簽流程，而是採用合併加簽的作法。
		也就是多次簽發合併成一筆，費用在簽發時計算。
	1. 目前採用先清空再插入的作法，只允許單簽

## license 的計算

- 應該先想想 terminal 的狀態
	1. OFF  當然不列入計算
	1. BOOTING 為了讓 terminal 顯示豐富的資訊，應該在 GET root+usr 之後，所以 BOOTING 不算
	1. ACTIVE 當然算
	1. DISABLED 在我們的設計中是不列入計算的，所以在 Enable 時要檢查是否足夠 license

[1]: https://arista.atlassian.net/wiki/spaces/QV/pages/118358020/License+Management
[2]: https://arista.atlassian.net/wiki/spaces/QV/pages/442597413/Test+Encryption+Decryption
