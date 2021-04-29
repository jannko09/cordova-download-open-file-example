# cordova-download-open-file-example

JavaScript utility Class for downloading and opening files on Apache Cordova with Android.

Plugins used:
```
<plugin name="cordova-plugin-android-permissions" source="npm" spec="~0.10.0" />
<plugin name="cordova-plugin-file-transfer" source="npm" spec="~0.5.0" />
<plugin name="cordova-plugin-file" source="npm" spec="~1.3.3" />
```

Uses legacy storage ("/downloads") folder.
```
  <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application">
      <application android:requestLegacyExternalStorage="true" />
 </edit-config>
 ```
