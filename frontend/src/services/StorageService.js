import { STORAGE, STORAGE_SPLITTER } from "../base/constants/storage";

const DEFAULT_STORAGE = localStorage;
const storageMap = {
    [STORAGE.LOCAL]: localStorage,
    [STORAGE.SESSION]: sessionStorage
};
const storageList = Object.values(storageMap);

class Observable {
    constructor() {
        this.handlers = {}
    }

    set(key, val) {
        const handlers = this.handlers;
        (handlers[key] || []).forEach(handler => handler(val));
    }

    subscribe(key, func) {
        let handlers = this.handlers[key];

        if (!handlers) {
            handlers = this.handlers[key] = [];
        }

        handlers.push(func);
        return () => this.unsubscribe(key, func);
    }

    unsubscribe(key, func) {
        this.handlers[key] = (this.handlers[key] || []).filter(handler => handler !== func);
    }

}

const observable = new Observable();

class StorageService {
    constructor({
        version = "v1"
    } = {}) {
        this._version = version;
        this._scope = "";
        this.observable = observable;
    }

    static $displayName = "StorageService";

    getStorage(key) {
        const [keyStorage] = key.split(STORAGE_SPLITTER);
        return storageMap[keyStorage] || DEFAULT_STORAGE;
    }

    _decorateKey(key) {
        return `${key}&ver=${this._version}`;
    }

    _objectToString(obj) {
        return JSON.stringify(obj);
    }

    _parseString(str) {
        if (str) {
            return JSON.parse(str);
        }

        return str;
    }

    get(key, _default) {
        try {
            const strData = this.getStorage(key).getItem(this._decorateKey(key));

            const data = this._parseString(strData);

            const result = arguments.length === 1 ? data : data || _default;
            return result;
        } catch (e) {
            return _default;
        }
    }

    set(key, value) {
        this.getStorage(key).setItem(this._decorateKey(key), this._objectToString(value));
        this.observable.set(key, value);
    }

    merge(key, value) {
        const keyName = this._decorateKey(key);

        const oldValue = this.get(key);
        const newValue = Object.assign(oldValue, value);
        this.getStorage(key).setItem(keyName, this._objectToString(newValue));
    }

    remove(key) {
        this.getStorage(key).removeItem(this._decorateKey(key));
    }

    clear() {
        storageList.forEach(storage => {
            this.clearStorage(storage);
        });
    }

    clearStorage(storage) {
        storage.clear();
    }

    clearSession() {
        this.clearStorage(storageMap[STORAGE.SESSION]);
    }

    clearByScope(scope) {
        storageList.forEach(storage => {
            this.clearByScopeStorage(scope, storage);
        });
    }

    clearByScopeStorage(scope, storage) {
        const PATTERN = new RegExp(scope);
        Object.keys(storage).filter(key => PATTERN.test(key)).map(key => storage.removeItem(key));
    }

    onChange(key, func) {
        return this.observable.subscribe(key, func);
    }

    onChangeDataInSiblingTab(key, func) {
        const listener = event => {
            if (event.key !== this._decorateKey(key)) return;
            func(this.get(key));
        };

        window.addEventListener("storage", listener);
        return () => window.removeEventListener("storage", listener);
    }

    clearPreviousVersions() {
        const actualVersion = this._version;
        const storage = storageMap[STORAGE.LOCAL];
        Object.keys(storage).forEach(key => {
            if (key.includes(`&ver=${actualVersion}`)) return; // Clear old data

            storage.removeItem(key);
        });
    }

}
export default StorageService;
