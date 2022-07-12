## 底下是舊版 q8webui 有寫的 code, 看來現在寫法完全不同

```javascript
export function postUploadFile(formdata, type) {
  let pathParams = { type };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = formdata;
  let contentType = 'multipart/form-data';
  let accept = 'application/json';
  let returnType = 'json';

  return ApiClient.callApi(
    '/upload/{type}', 'POST',
    pathParams, queryParams, headerParams, formParams, postBody, contentType, accept, returnType
  );
}

export function uploadFile(type, data) {
  let pathParams = {type};
  let queryParams = {};
  let headerParams = {};
  let formParams = data;
  let postBody = null;
  let contentType = 'multipart/form-data';
  let accept = 'application/json';
  let returnType = 'json';

  return ApiClient.callApi(
    '/upload/{type}', 'POST',
    pathParams, queryParams, headerParams, formParams, postBody, contentType, accept, returnType
  );
}
```

- src/actions/UserActions.js
```javascript
export function uploadUpdateFileAsync(formdata, type) {
  return (dispatch, getState) => {
    dispatch({
      type: actiontypes.SETTINGS_POST_UPLOAD_FILE_ASYNC,
      payload: {
        loader: api.postUploadFile,
        formdata,
        type,
      },
    });
  };
}
```

- src/actions/UploadActions.js
export function uploadFile(type, data) {
  return {
    type: UPLOAD_FILE,
    payload:{
      loader: apiUploadFile,
      path: 'uploads.uploading',
      type, data,
    }
  };
} 
```

- src/components/Settings/FirmwarePackage/index.js
```javascript
    this.fileUpload = React.createRef();
    this.fileUploadTermcap = React.createRef();
    this.multiFileUpload = React.createRef();
	...
	onFileUploadChange(e) {...}
	onFileUploadChangeTermcap(e) {...}
	onMultiFileUploadChange(e) {...}
	uploadFirmware() {...}
	uploadTermcap() {...}
	uploadModules() {...}
```

- src/components/Settings/MigrateDatabase.js
```javascript
	this.fileUpload = React.createRef();
	...
	onFileUploadChange(e) {...}
	......同上，一堆
	uploadDatabase() {...}
```
