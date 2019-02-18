import { TextEncoder } from 'text-encoding/lib/encoding';
import { utils } from './lib/jsUtils';

TextEncoder = utils.isSet(window.wrappedJSObject) ? XPCNativeWrapper(window.wrappedJSObject.TextEncoder): window.TextEncoder;

export default TextEncoder;