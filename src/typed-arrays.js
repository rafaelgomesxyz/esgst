import { utils } from './lib/jsUtils';

ArrayBuffer = utils.isSet(window.wrappedJSObject) ? XPCNativeWrapper(window.wrappedJSObject.ArrayBuffer): window.ArrayBuffer;
Uint8Array = utils.isSet(window.wrappedJSObject) ? XPCNativeWrapper(window.wrappedJSObject.Uint8Array): window.Uint8Array;
Uint16Array = utils.isSet(window.wrappedJSObject) ? XPCNativeWrapper(window.wrappedJSObject.Uint16Array): window.Uint16Array;
Int32Array = utils.isSet(window.wrappedJSObject) ? XPCNativeWrapper(window.wrappedJSObject.Int32Array): window.Int32Array;
Uint32Array = utils.isSet(window.wrappedJSObject) ? XPCNativeWrapper(window.wrappedJSObject.Uint32Array): window.Uint32Array;