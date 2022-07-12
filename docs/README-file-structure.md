## 目錄

- utils/
	- App.js
		- getAppResolution(data)
	- Check.js	// 比對資料是否修改/程入/重複/繼承等
		- checkEdit(data, oriData)
		- checkListEdit(list, oriList)
		- checkDuplicateName(name, parentId, list)
		- isDataUpdated(data, oriData) 跟 data.state 有關
		- isInheritedFromParent(parentTerminal, key)
	- Display.js	// 所有跟 display 有關的
		- generateDefaultDisplay(hardwareInfo, data)
		- generateScreenOfAppIds(data)
		- getResolutionOptions(hardwareInfo)
		- getColorDepthOptions(hardwareInfo, resIndex, hzIndex)
		- getRefreshOptions(hardwareInfo, resIndex)
		- getResolutionKey(monitorId)
		- getColorDepthKey(monitorId)
		- getRefreshRateKey(monitorId)
		- getVideoPortKey(monitorId)
		- getScreenWidthKey(monitorId)
		- getScreenWidthKey(monitorId)
		- getScreenHeightKey(monitorId)
		- getMonitorIdFromKey(field)
		- getScreenIdFromKey(field)
		- getNumberOfMonitors(terminal)
		- getNumberOfScreens(terminal)
		- dataToServerData(data)
		- dataToScreens(data)
		- serverDataToTerminal(data)
		- serverDataToScreens(data)
		- screensToData(screens, oldData)
		- changeScreens(data, screens, numberOfScreens, selectedMonitorArray)
		- changeMonitors(data, screens, numberOfMonitors, screenId, selectedMonitorArray)
	- MAC.js 因為 MAC 特殊要求，例如 :, 例如大寫
		- macFormatter(str)
		- macDeformatter(str)
	- Module.js
		- addModules(terminalId, modules)
	- Object.js
		- getObjectById(id, list)
		- deleteObjects([items, type]) 
		- getDataForBaseCard(data) 
		- getUpdatedIndex(list, newList, currentIdx)
	- Override.js
		- getAppOverride(editingId = 0)
		- findOverrideById(terminal, applications)
		- checkAppOverride(appOverrides)
	- Properties.js	// 供 ApplyAll 使用
		- getApplyAllProperties(editingTerminal)
		- getDisabledProperties(parentTerminal)
	- Schedule.js
		- updateApiSchedules(schedules, oriScheduleIds)
		- checkSchedule(schedules)
	- Status.js
		- getTerminalStatus(type, data)
		- getRdsServerStatus(type, data)
		- getAppStatus(type, data)
		- checkExpandTitleError(data)
		- checkExpandTerminalTitle(data)
	- String.js	// 供 DISPLAY 中的 screen A/B/C....
		- toLetter(id)
		- toNumber(letter)
	- Tree.js
		- const TREE_NO_GROUP
		- convertListToTree(objectList, groupList)
- middleware
	全部是給 store.js 使用，全部像底下這樣, 後者針對各個頁面動作(button)定義內容
	這種用法即 Redux Middleware，跟另一詞相關叫 reducer，請參考[Middleware][1]
```javascript
  const loadData = (path, loaderPromise) => (dispatch) => {....}
  export default (store) => (next) => (action) => {...}
```
- actions 按讀 Redux 的心得，算 Redux 的一環，第一步就是 dispatch(action)
	- ApplicationActions.js
		- loadApplications()
		- loadApplicationGroups()
		- loadApplicationsAndGroups()
		- addApplication(data, isGroup)
		- getApplication(id, isGroup)
		- updateApplication(id, data, isGroup, urlPath)
		- deleteApplication(id, isGroup)
		- copyApplication(id, name, parentId, isGroup)
		- openApplicationEditor(id, isGroup)
		- openSubAppEditor(id, isGroup)
		- closeSubAppEditor()
		- closeApplicationEditor()
		- openApplicationWizard(isGroup)
		- closeApplicationWizard()
		- updateAppList(appGroupList)
		- updateAppGroupList(appList)
	- AuthActions.js
		- login(data)
		- logout(data)
		- loadUsers()
		- getUserInfo(id)
		- addUser(data)
		- deleteUser(id)
		- updateUser(data)
		- resetExpireTime()
	- InfobarActions.js
		- showInfoBar(infoMessage, infoType = "info")
		- hideInfoBar()
	- OtherActions.js
		- loadAdUsers(path, data)
		- verifyAuthAdUser(path, data)
		- getProductInfo()
		- getWatchdog()
		- wsNotification(payload)
		- productInfo(
	- ScheduleActions.js
		- loadSchedules(scheduleIds, path)
		- updateSchedules(
	- ServerActions.js
		- loadServers()
		- loadServerGroups()
		- loadServersAndGroups()
		- addServer(data, schedules, isGroup)
		- getServer(id, isGroup)
		- updateServer(id, data, isGroup, urlPath)
		- deleteServer(id, isGroup)
		- copyServer(id, name, parentId, isGroup)
		- openEditor(id, isGroup)
		- closeEditor()
		- openWizard(isGroup)
		- closeWizard()
		- clearAuthVerify()
		- updateServerList(serverGroupList)
		- updateServerGroupList(serverList)
	- SettingActions.js
		- copyPackage(id, name)
		- deletePackage(id)
		- downloadPackage(id)
		- loadPackages()
		- lockPackage(id, lock)
		- renamePackage(id, name)
		- loadFirmwareSettings(manufacturer, model)
		- updateFirmwareSettings(manufacturer, model, data)
		- loadLicenses()
		- requestLicense(licenseId)
		- clearInstalledId()
	- TerminalActions.js
		- loadTerminals()
		- loadTerminalGroups()
		- loadTerminalsAndGroups()
		- addTerminal(
		- getTerminal(id, isGroup)
		- updateTerminal(id, data, isGroup, urlPath)
		- deleteTerminal(id, isGroup)
		- copyTerminal(id, name, parentId, isGroup)
		- getParentTerminal(id)
		- clearParentTerminal()
		- getTerminalSetting(id)
		- clearAuthVerify()
		- clearTerminalSetting()
		- loadModules(ids)
		- loadModuleSettings()
		- getDefaultKeyboardMapping()
		- getDefaultMouseMapping()
		- getDisplayOptions(manufacturer, model)
		- getFirmwarePackage()
		- getModelMap()
		- operateTerminal(editingId, action)
		- openTerminalEditor(id, isGroup)
		- openTerminalWizard(isGroup, defaultTerminal)
		- closeTerminalWizard()
		- closeTerminalEditor()
		- initPendingTerminals()
		- updateTerminalList(terminalGroupList)
		- updateTerminalGroupList(terminalList)
- const	定義常數，感覺很直覺(蠢)，略過
- reducers
	reducer 全部長的像底下這樣，請參考[middleware][1], 主要針對 UI 各種按鍵動作進行資料的處理
```javascript
  export default (
    state = {...},
    action
  ) => { ... };
```
- css	當然就是影響 layout
- lib	算雜項函式
- pages	index.html, index.js, 主頁面
- components 參考[React 介紹][2]

Directory							|File						| component
:-----------------------------------|:--------------------------|:----------
pages/ layout | index.js | Page
components/ WsNotification | index.js | WsNotification
components/ Servers/ Editor/ Configuration | LoadBalanceCard.js |LoadBalanceCard
 . | index.js | Configuration
 . | DataGatheringCard.js | DataGatheringCard
 . | InfoCard.js | InfoCard
 . | UserAccessCard.js | UserAccessCard
components/ Servers/ Editor | index.js | Editor
 . | Header.js | Header
components/ Servers | index.js | Servers
components/ Servers/ Wizzard | LoadBalanceCard.js | LoadBalanceCard
 . | index.js | Wizzard
 . | DataGatheringCard.js | DataGatheringCard
 . | InfoCard.js | InfoCard
 . | UserAccessCard.js | UserAccessCard
components/ Module | ModuleEditor.js | ModuleEditor
components/ Schedule | ScheduleEditor.js | ScheduleEditor
 . | ScheduleWizzard.js | ScheduleWizzard
 . | ScheduleTable.js | ScheduleTable
components/ Applications/ Editor/ Configuration | LoadBalance.js | LoadBalance
 . | Info.js | Info
 . | Property.js | Property
 . | Server.js | Server
 . | index.js | Configuration
 . | ScalingResolution.js | ScalingResolution
 . | Connection.js | Connection
components/ Applications/ Editor | index.js | Editor
 . | Header.js | Header
components/ Applications | index.js | Applications
components/ Applications/ Wizzard | index.js | Wizzard
components/ Alert | DeleteObjectAlert.js | DeleteObjectAlert
 . | index.js | Alert
 . | CloseEditorAlert.js | CloseEditorAlert
 . | TabSwitchAlert.js | TabSwitchAlert
 . | CloseWizardAlert.js | CloseWizardAlert
 . | CopyObjectAlert.js | CopyObjectAlert
components/ Header | index.js | Header
 . | ConfigSelection.js | ConfigSelection
components/ Terminals/ Editor/ Shadow | index.js | Shadow
 . | VNCClient2.js | VNCClient2
components/ Terminals/ Editor/ Configuration | ControlCard.js | ControlCard
 . | index.js | Configuration
 . | HardwareCard.js | HardwareCard
 . | PropertiesCard.js | PropertiesCard
 . | InfoCard.js | InfoCard
 . | DisplayAndMonitorCard.js | DisplayAndMonitorCard
 . | ApplicationCard.js | ApplicationCard
 . | UserAccessCard.js | UserAccessCard
components/ Terminals/ Editor/ About | HardwareModelCard.js | HardwareModelCard
 . | index.js | About
components/ Terminals/ Editor/ Module | ModuleTable.js | ModuleTable
 . | index.js | ModuleCard
components/ Terminals/ Editor | index.js | Editor
 . | Header.js | Header
 . | QuickSwitch.js | QuickSwitch
components/ Terminals | index.js | Terminals
components/ Terminals/ Wizzard | ControlCard.js | ControlCard
 . | ModuleCard.js | ModuleCard
 . | index.js | Wizzard
 . | HardwareCard.js | HardwareCard
 . | PropertiesCard.js | PropertiesCard
 . | DisplayCard.js | DisplayCard
 . | InfoCard.js | InfoCard
 . | ApplicationCard.js | ApplicationCard
 . | UserAccessCard.js | UserAccessCard
components/ Other | Spinner.js | Spinner
 . | Search.js | Search
 . | Timer.js | Timer
 . | Table.js | Table
 . | InfoBar.js | InfoBar
 . | SearchUser.js | SearchUser
components/ Form | Checkbox.js | Checkbox
 . | Input.js | Input
 . | Slider.js | Slider
 . | Counter.js | Counter
 . | Textarea.js | Textarea
 . | RadioButton.js | RadioButton
components/ MonitorCard | index.js | MonitorCard
 . | MouseButtonMapSettings.js | MouseButtonMapSettings
 . | MultistationSettings.js | MultistationSettings
components/ AppOverride | index.js | AppOverride
components/ Login | index.js | Login
components/ Settings/ License | LicenseIdInput.js | LicenseIdInput
 . | index.js | License
components/ Settings/ PackageSetting/ ManageFirmware | index.js | ManageFirmware
 . | CopyFirmwareSettings.js | CopyFirmwareSettings
 . | EditFirmwareSettings.js | EditFirmwareSettings
components/ Settings/ PackageSetting | index.js | PackageSetting
components/ Settings | index.js | Settings
components/ Settings/ Database | index.js | Database
components/ Settings/ AdminSetting | index.js | AdminSetting
 . | UserInput.js | UserInput
components/ Settings/ ServerSetting/ Dhcp | DhcpOption.js | DhcpOption
 . | DhcpInput.js | DhcpInput
components/ Settings/ ServerSetting | index.js | ServerSetting
components/ Settings/ ServerSetting/ ActiveDirectory | index.js | ActiveDirectory
 . | ActiveDirectoryInput.js | ActiveDirectoryInput
components/ Footer | index.js | Header
components/ ControlCard | MouseCard.js | MouseCard
 . | KeyboardCard.js | KeyboardCard
components/ ObjectCommon | ObjectPicker.js | ObjectPicker
 . | AddObjectToGroup.js | AddObjectToGroup
 . | ObjectTitles.js | ObjectTitles
 . | EditorTopbar.js | EditorTopbar
 . | WizardSidebar.js | WizardSidebar
 . | ObjectDashboard.js | ObjectDashboard
- api 本身並沒有多大研究價值，最重要的都在上面

[1]: README-middleware.md
[2]: README-intro-react.md
