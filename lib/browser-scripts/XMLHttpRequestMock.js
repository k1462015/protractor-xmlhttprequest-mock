class XMLHttpRequestMock extends XMLHttpRequest {
    constructor() {
        super();
        this.mockedRequest = false;
        this.mock = null;
        this.hash = Math.floor(Math.random() * 1000);
    }

    open(method, url, async, user, password) {
        if (async === undefined) {
            async = true;
        }
    
        super.open(method, url, async, user, password);
        let response = window.MockManager.getResponse(method, url);
        if (response) {
            this.url = url;
            this.mock = response;
            this.mockedRequest = true;
        }
    }

    send(data) {
        if (this.mockedRequest) {
            if(this.mock.headers) {
                this._setResponseHeaders(this.mock.headers);
            }

            this.readyState = this.LOADING;
            if (this.onreadystatechange) this.onreadystatechange();
            
            this.responseText = this.mock.data;
            this.response = this.mock.data;
            this.status = this.mock.status;

            this.readyState = this.DONE;
            if (this.onreadystatechange) this.onreadystatechange();
            if (this.onload) this.onload();
            if (this.onloadend) this.onloadend();
            this.dispatchEvent(new Event('load'));

            return;
        }

        super.send(data);
    }

    setResponseHeaders(headers) {
        this.responseHeaders = {};

        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.responseHeaders[header] = headers[header];
            }
        }

        this.readyState = this.HEADERS_RECEIVED;
    }

    getResponseHeader(header) {
        if (this.readyState < this.HEADERS_RECEIVED) {
            return null;
        }

        if (/^Set-Cookie2?$/i.test(header)) {
            return null;
        }

        header = header.toLowerCase();

        for (var h in this.responseHeaders) {
        if (h.toLowerCase() == header) {
            return this.responseHeaders[h];
        }
        }

        return null;
    }

    getAllResponseHeaders() {
        if (this.readyState < this.HEADERS_RECEIVED) {
            return "";
        }

        var headers = "";

        for (var header in this.responseHeaders) {
            if (this.responseHeaders.hasOwnProperty(header) && !/^Set-Cookie2?$/i.test(header)) {
                headers += header + ": " + this.responseHeaders[header] + "\r\n";
            }
        }

        return headers;
    }

    getStatus() {
        return typeof this._status === 'number' ? this._status : super.status;
    }

    getResponse() {
        return this._response || super.response;
    }

    getResponseText() {
        return this._responseText || super.responseText;
    }

    getReadyState() {
        return this._readyState|| super.readyState;
    }

    getResponseURL() {
        return this._responseURL || super.responseURL;
    }
}

Object.defineProperty(XMLHttpRequestMock.prototype, 'status', {
    set:function(value){
        this._status = value;
    }, 
    get: function(){
        return this.getStatus()
    }
});

Object.defineProperty(XMLHttpRequestMock.prototype, 'response', {
    set:function(value){
        this._response = value;
    }, 
    get: function(){
        return this.getResponse()
    }
});

Object.defineProperty(XMLHttpRequestMock.prototype, 'responseText', {
    set:function(value){
        this._responseText = value;
    }, 
    get: function(){
        return this.getResponseText()
    }
});

Object.defineProperty(XMLHttpRequestMock.prototype, 'readyState', {
    set:function(value){
        this._readyState = value;
    }, 
    get: function(){
        return this.getReadyState()
    }
});

Object.defineProperty(XMLHttpRequestMock.prototype, 'responseURL', {
    set:function(value){
        this._responseURL = value;
    }, 
    get: function(){
        return this.getResponseURL()
    }
});
