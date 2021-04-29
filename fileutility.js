class FileUtility {
  constructor(file) {
    this.id = file.id;
    this.displayType = file.displayType;
    this.mimeType = file.mimeType;
    this.size = file.size;
    this.title = file.title;
    this.uri = file.uri;
    this.url = file.url;
    this.permissions = window.cordova.plugins.permissions;
    this.fileOpener = window.cordova.plugins.fileOpener2;
    this.fileTransfer = new window.FileTransfer();
    this.externalDownloadDir =
      window.cordova.file.externalRootDirectory + "Download/";
    this.storageType = "PERSISTENT";
  }

  getEncodedUri() {
    console.log("getEncodedUri");
    return encodeURI(decodeURIComponent(this.url));
  }

  fail(error) {
    console.log(error);
  }

  tryPermission(permission, successFn) {
    console.log("tryPermission");
    console.log(permission);
    return this.permissions.checkPermission(permission, successFn, this.fail);
  }

  requestFs(systemType = this.storageType, successFn) {
    console.log("requestFs");
    return window.requestFileSystem(
      LocalFileSystem[systemType],
      0,
      successFn,
      this.fail
    );
  }

  download(successFn) {
    console.log("download");
    const filePathFull = this.externalDownloadDir + this.title;
    const encodedUri = this.getEncodedUri();
    console.log(encodedUri);
    console.log(filePathFull);

    this.fileTransfer.download(encodedUri, filePathFull, successFn, this.fail);
  }

  inquirePermission(neededPermission, successFn) {
    console.log("inquirePermission");
    const permissionName = this.permissions[neededPermission];
    return this.permissions.requestPermission(
      permissionName,
      successFn,
      this.fail
    );
  }

  openFile(fileEntry) {
    this.fileOpener.open(fileEntry.nativeURL, this.mimeType, {
      error: this.fail,
      success: () => console.log("file opened succesfully")
    });
  }

  async permissionGate(neededPermission) {
    console.log("permissionGate");
    return new Promise((resolve, reject) => {
      this.tryPermission(neededPermission, status => {
        if (status.hasPermission) {
          resolve(status);
        } else {
          this.inquirePermission(neededPermission, status => {
            if (status.hasPermission) {
              resolve(status);
            } else {
              reject(status);
            }
          });
        }
      });
    });
  }
  async requestAndDownload() {
    console.log("requestAndDownload");
    return new Promise((resolve, reject) => {
      this.requestFs(
        this.storageType,
        this.download(entry => {
          console.log("Downloaded file, full path is " + entry.fullPath);
          console.log(entry);
          if (entry) {
            resolve(entry);
          } else {
            reject(entry);
          }
        })
      );
    });
  }
}

async function downlodOpenFile(file) {
  console.log(file);
  let fileEntry = null;
  const fileUtility = new FileUtility(file);
  const writePermissions = await fileUtility.permissionGate(
    "WRITE_EXTERNAL_STORAGE"
  );
  const readPermissions = await fileUtility.permissionGate(
    "READ_EXTERNAL_STORAGE"
  );

  if (writePermissions) {
    fileEntry = await fileUtility.requestAndDownload();
  }
  if (readPermissions) {
    fileUtility.openFile(fileEntry);
  }
}


export {  downlodOpenFile, FileUtility };
