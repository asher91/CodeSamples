//class GlobalVariable {
//    public baseServerUrl = "/";//"http://mediapp.ashcorp.co/";

//    public serverUrl: string = this.baseServerUrl;

//    public toaster: any;

//    public $window;

//    public static instance: GlobalVariable;

//    constructor($rootScope, $window) {
//        this.$window = $window;
//        $rootScope.GlobalVariable = this;
//        GlobalVariable.instance = this;
//    }
//}

//MediApp.service("GlobalVariable", [
//    '$rootScope'
//    , '$window'
//    , 'toaster'
//    , GlobalVariable
//]);

class ConnectionService {
    http: ng.IHttpService;
    q: ng.IQService;
    sessionVariable: any;
    DropZone: any;
    toaster: any;
    constructor($http: ng.IHttpService, $window, private $q: ng.IQService, toaster: any) {//, private GlobalVariable: GlobalVariable) {
        this.http = $http;
        this.q = $q;
        this.toaster = toaster;
    }

    public postRequest<T>(url: string, data: any): ng.IPromise<T> {
        return this.loadRequest('POST', url, data);
    }

    public loadRequest<T>(method: string, url: string, data: any): ng.IPromise<T> {
        var self = this;
        var deferred: any = this.q.defer();
        $(".page-loader-wrapper").fadeIn();
        this.http({
            method: method,
            url: "/" + url,
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            responseType: "application/json",
            timeout: 600000,
            data: data
        })
            .then(function (response: any) { // success function
                var result: APIResponseModel = response.data;
                if (result.Title != "" && result.Title != null && result.Message != "" && result.Message != null) {
                    self.toaster.pop(result.Status, result.Title, result.Message);
                }
                deferred.resolve(result.Payload);
            })
            .catch(function (err) {
                self.toaster.pop("error", "Error", "An internal error occured, kindly contact administrator.");
                deferred.reject(err);
            })
            .finally(function () {
                $(".page-loader-wrapper").fadeOut();
            });
        return deferred.promise;
    }
    /*
    public UploadFile(url: string, files: any[]) {
        var self = this;
        var deferred: any = this.q.defer();
        $(".page-loader-wrapper").fadeIn();
        this.upload.upload({
            url: this.GlobalVariable.serverUrl + url,
            file: files
        }).progress(
            function (evt) {
                var progressPercentage = parseInt((100 * (evt.loaded / evt.total)) + "");
            }
        ).success(
            function (response: APIResponseModel) {
                var result = response;
                if (result.Title != "" && result.Title != null && result.Message != "" && result.Message != null) {
                    self.toaster.pop(result.Status, result.Title, result.Message);
                }
                deferred.resolve(result.Payload);
            }
        ).error(
            function (err) {
                self.toaster.pop("error", "Error", "An internal error occured, kindly contact administrator.");
                deferred.reject(err);
            }
        ).finally(
            function () {
                $(".page-loader-wrapper").fadeOut();
            }
        );
        return deferred.promise;
    }
    */
}

MediApp.service("WebConnectionService", [
    "$http"
    , "$window"
    , "$q"
    , "toaster"
    //, "GlobalVariable"
    , ConnectionService
]);

class CoreWebService {
    ConnectionService: ConnectionService;

    constructor(ConnectionService: ConnectionService) {
        this.ConnectionService = ConnectionService;
    }

    public LoadUser(username: string, reload: boolean = false): ng.IPromise<any> {
        var url = "api/user/get";
        if (reload) {
            url = url + "?force=true";
        }
        return this.ConnectionService.postRequest(url, username);
    }
    public SaveUser(user: User): ng.IPromise<any> {
        var url = "api/user/set";
        return this.ConnectionService.postRequest(url, user);
    }
}

MediApp.service("CoreWebService", ["WebConnectionService", CoreWebService]);

class DropzoneService {
    ConnectionService: ConnectionService;

    static VERSION = "4.3.0";

    static ADDED = "added";
    static QUEUED = "queued";
    static ACCEPTED = DropzoneService.QUEUED;
    static UPLOADING = "uploading";
    static PROCESSING = DropzoneService.UPLOADING;
    static CANCELED = "canceled";
    static ERROR = "error";
    static SUCCESS = "success";

    static BlacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];
    static IsBrowserSupported = function () {
        var capableBrowser, regex, i, len, _ref;
        capableBrowser = true;
        if (window["File"] && window["FileReader"] && window["FileList"] && window.Blob && window["FormData"] && document.querySelector) {
            if (!("classList" in document.createElement("a"))) {
                capableBrowser = false;
            } else {
                _ref = DropzoneService.BlacklistedBrowsers;
                for (i = 0, len = _ref.length; i < len; i++) {
                    regex = _ref[i];
                    if (regex.test(navigator.userAgent)) {
                        capableBrowser = false;
                        continue;
                    }
                }
            }
        } else {
            capableBrowser = false;
        }
        return capableBrowser;
    };

    static Options = {
        IsAvailable: true,
        IsRemoveAvailable: true,
        IsthumbnailsActive: true,
        ThumbnailFilesize: 330,
        LimitFilesize: 256,

        withCredentials: false,
        parallelUploads: 1,
        uploadMultiple: false,

        paramName: "file",
        createImagethumbnails: true,

        MaxThumbnailFilesize: 330,
        ThumbnailWidth: 310,
        ThumbnailHeight: 310,

        maxFilesize: 256,
        filesizeBase: 1000,
        maxFiles: 1,
        params: {},
        clickable: true,
        ignoreHiddenFiles: true,
        acceptedFiles: null,
        acceptedMimeTypes: null,
        autoProcessQueue: true,
        autoQueue: true,
        capture: null,
        renameFilename: null,

        dictDefaultMessage: "Drop files here to upload",
        dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
        dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
        dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
        dictInvalidFileType: "You can't upload files of this type.",
        dictResponseError: "Server responded with {{statusCode}} code.",
        dictCancelUpload: "Cancel upload",
        dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
        dictRemoveFileConfirmation: null,
        dictMaxFilesExceeded: "You can not upload any more files.",
        accept: function (file, done) {
            return done();
        },
        init: function () {
            return DropzoneService.NoOp;
        },
        headers: {
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "X-Requested-With": "XMLHttpRequest"
        },

        Method: "POST",
        PreviewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",
    };

    static NoOp = function () { };
    static HoldPropagation = function (e) {
        e.stopPropagation();
        if (e.preventDefault) {
            return e.preventDefault();
        } else {
            return e.returnValue = false;
        }
    };
    $SafeApply = function () {
        var phase = this.scope.$root.$$phase;
        if (phase !== '$apply' && phase !== '$digest') {
            this.scope.$apply();
        }
    };
    ElementClick() {
        this.InputElement.click();
    }

    scope: any;
    URL: any;

    IsActive = true;
    IsHover = false;
    IsStarted = false;
    IsFull = false;

    enable = function () {
        var self = this;
        this.IsActive = true;
    }
    hover = function (value) {
        this.IsHover = value;
        this.$SafeApply();
    };
    started = function (value) {
        this.IsStarted = value;
        this.$SafeApply();
    };
    full = function (value) {
        this.IsFull = value;
        this.$SafeApply();
    };

    InputElement: any;
    ClickElement: any;
    PreviewElement: any;

    FilesQ: any = [];
    ThumbnailsQ: any = [];

    constructor(ConnectionService: ConnectionService) {
        var self = this;
        self.ConnectionService = ConnectionService;
        DropzoneService.Options.IsAvailable = DropzoneService.IsBrowserSupported();
    }

    Init = function (scope: any, url: string, filetypes: any, multilple: boolean) {
        var self: DropzoneService = this;
        self.scope = scope;
        self.URL = url;

        self.ClickElement = $(".dropzone")[0];
        self.InputElement = $(".dropzone-input")[0];
        self.InputElement.accept = filetypes;
        if (multilple) {
            self.InputElement.multilple = "multilple";
        }

        self.InputElement.addEventListener("change", function () {
            self.addedfiles(self.FilesQ);
            self.browse(self.InputElement.files);
        });

        self.ClickElement.addEventListener("dragstart", (function (self) { return function (e) { return self.dragstart(e); }; })(this));
        self.ClickElement.addEventListener("dragenter", (function (self) { return function (e) { DropzoneService.HoldPropagation(e); return self.dragenter(e); }; })(this));
        self.ClickElement.addEventListener("dragover", (function (self) { return function (e) { var efct; try { efct = e.dataTransfer.effectAllowed; } catch (_error) { } e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy'; DropzoneService.HoldPropagation(e); return self.dragover(e); }; })(this));
        self.ClickElement.addEventListener("dragleave", (function (self) { return function (e) { return self.dragleave(e); }; })(this));
        self.ClickElement.addEventListener("dragend", (function (self) { return function (e) { return self.dragend(e); }; })(this));
        self.ClickElement.addEventListener("drop", (function (element) { return function (e) { DropzoneService.HoldPropagation(e); return self.drop(e); }; })(this));

        this.enable();
        return this;
    };
    /*
    UploadFile(fileid: string, filename: string, files: any[], filetype: string) {
        if (files !== null && files.length > 0) {
            var valid = false;
            var filetypes = filetype.split("|");
            for (var typeind in filetypes) {
                for (var fileind in files) {
                    if (files[fileind].name.endsWith("." + filetypes[typeind])) {
                        valid = true;
                        break;
                    }
                }
            }
            if (valid) {
                var url = 'api/file-manager/upload/' + fileid + "/" + filename.toLowerCase().replace(/\s/g, "_");
                return this.ConnectionService.UploadFile(url, files);
            }
        }
        return null;
    }
    */
    addedfiles = function (element) { }//DropzoneService.NoOp
    completemultiple = DropzoneService.NoOp
    maxfilesexceeded = DropzoneService.NoOp
    maxfilesreached = DropzoneService.NoOp
    queuecomplete = DropzoneService.NoOp
    canceledmultiple = DropzoneService.NoOp
    totaluploadprogress = DropzoneService.NoOp
    sending = DropzoneService.NoOp
    sendingmultiple = DropzoneService.NoOp
    successmultiple = DropzoneService.NoOp
    errormultiple = DropzoneService.NoOp
    dragstart = DropzoneService.NoOp
    _paste = DropzoneService.NoOp
    processingmultiple = DropzoneService.NoOp

    getAcceptedFiles = function () {
        var file, i, len, _ref, _results;
        _ref = this.FilesQ;
        _results = [];
        for (i = 0, len = _ref.length; i < len; i++) {
            file = _ref[i];
            if (file.accepted) {
                _results.push(file);
            }
        }
        return _results;
    };
    getRejectedFiles = function () {
        var file, i, len, _ref, _results;
        _ref = this.FilesQ;
        _results = [];
        for (i = 0, len = _ref.length; i < len; i++) {
            file = _ref[i];
            if (!file.accepted) {
                _results.push(file);
            }
        }
        return _results;
    };
    getFilesWithStatus = function (status) {
        var file, i, len, _ref, _results;
        _ref = this.FilesQ;
        _results = [];
        for (i = 0, len = _ref.length; i < len; i++) {
            file = _ref[i];
            if (file.status === status) {
                _results.push(file);
            }
        }
        return _results;
    };
    getQueuedFiles = function () {
        return this.getFilesWithStatus(DropzoneService.QUEUED);
    };
    getUploadingFiles = function () {
        return this.getFilesWithStatus(DropzoneService.UPLOADING);
    };
    getAddedFiles = function () {
        return this.getFilesWithStatus(DropzoneService.ADDED);
    };
    getActiveFiles = function () {
        var file, i, len, _ref, _results;
        _ref = this.FilesQ;
        _results = [];
        for (i = 0, len = _ref.length; i < len; i++) {
            file = _ref[i];
            if (file.status === DropzoneService.UPLOADING || file.status === DropzoneService.QUEUED) {
                _results.push(file);
            }
        }
        return _results;
    };

    browse = function (files) {
        var items;
        this.addedfiles(files);
        if (files.length) {
            this.handleFiles(files);
        }
    }
    drop = function (e) {
        var files, items;
        if (!e.dataTransfer) {
            return;
        }
        this._drop(e);
        files = e.dataTransfer.files;
        this.addedfiles(files);
        if (files.length) {
            items = e.dataTransfer.items;
            if (items && items.length && (items[0].webkitGetAsEntry != null)) {
                this._addFilesFromItems(items);
            } else {
                this.handleFiles(files);
            }
        }
    };
    _drop = function (e) { return this.hover(false); };

    dragend = function (e) { return this.hover(false); };
    dragenter = function (e) { return this.hover(true); };
    dragover = function (e) { return this.hover(true); };
    dragleave = function (e) { return this.hover(false); };

    resize = function (file) {
        var info, srcRatio, trgRatio;
        info = {
            srcX: 0,
            srcY: 0,
            srcWidth: file.width,
            srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = DropzoneService.Options.ThumbnailWidth;
        info.optHeight = DropzoneService.Options.ThumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
            info.optWidth = info.srcWidth;
            info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
            info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
            info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
            info.trgHeight = info.srcHeight;
            info.trgWidth = info.srcWidth;
        } else {
            if (srcRatio > trgRatio) {
                info.srcHeight = file.height;
                info.srcWidth = info.srcHeight * trgRatio;
            } else {
                info.srcWidth = file.width;
                info.srcHeight = info.srcWidth / trgRatio;
            }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
    }




    reset = function () {
        this.started(false);
    }
    addedfile = function (file) {
        var node, removeFileEvent, removeLink, i, _j, _k, len, len1, len2, _ref, _ref1, _ref2, _results;
        this.PreviewElement = this.ClickElement;
        if (this.ClickElement === this.PreviewElement) {
            this.started(true);
        }
        if (this.PreviewElement) {
            file.previewElement = this.createElement(DropzoneService.Options.PreviewTemplate.replace(/\n*/g, "").trim());
            file.previewTemplate = file.previewElement;
            this.PreviewElement.appendChild(file.previewElement);
            _ref = file.previewElement.querySelectorAll("[data-dz-name]");
            for (i = 0, len = _ref.length; i < len; i++) {
                node = _ref[i];
                node.textContent = this._renameFilename(file.name);
            }
            _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
            for (_j = 0, len1 = _ref1.length; _j < len1; _j++) {
                node = _ref1[_j];
                node.innerHTML = this.filesize(file.size);
            }
            if (DropzoneService.Options.IsRemoveAvailable) {
                file._removeLink = this.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>Remove</a>");
                file.previewElement.appendChild(file._removeLink);
            }
            removeFileEvent = (function (self) {
                return function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (file.status === DropzoneService.UPLOADING) {
                        return this.confirm(DropzoneService.Options.dictCancelUploadConfirmation, function () {
                            return self.removeFile(file);
                        });
                    } else {
                        if (DropzoneService.Options.dictRemoveFileConfirmation) {
                            return this.confirm(DropzoneService.Options.dictRemoveFileConfirmation, function () {
                                return self.removeFile(file);
                            });
                        } else {
                            return self.removeFile(file);
                        }
                    }
                };
            })(this);
            _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
            _results = [];
            for (_k = 0, len2 = _ref2.length; _k < len2; _k++) {
                removeLink = _ref2[_k];
                _results.push(removeLink.addEventListener("click", removeFileEvent));
            }
            return _results;
        }
    }
    removedfile = function (file) {
        var _ref;
        if (file.previewElement) {
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
        return this._updateMaxFilesReachedClass();
    }
    thumbnail = function (file, dataUrl) {
        var thumbnailElement, i, len, _ref;
        if (file.previewElement) {
            file.previewElement.classList.remove("dz-file-preview");
            _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
            for (i = 0, len = _ref.length; i < len; i++) {
                thumbnailElement = _ref[i];
                thumbnailElement.alt = file.name;
                thumbnailElement.src = dataUrl;
            }
            return setTimeout(((function (self) {
                return function () {
                    return file.previewElement.classList.add("dz-image-preview");
                };
            })(this)), 1);
        }
    }
    error = function (file, message) {
        var node, i, len, _ref, _results;
        if (file.previewElement) {
            file.previewElement.classList.add("dz-error");
            if ($.type(message) !== "String" && message.error) {
                message = message.error;
            }
            _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
            _results = [];
            for (i = 0, len = _ref.length; i < len; i++) {
                node = _ref[i];
                _results.push(node.textContent = message);
            }
            return _results;
        }
    }
    processing = function (file) {
        if (file.previewElement) {
            file.previewElement.classList.add("dz-processing");
            if (file._removeLink) {
                return file._removeLink.textContent = DropzoneService.Options.dictCancelUpload;
            }
        }
    }
    uploadprogress = function (file, progress, bytesSent) {
        var node, i, len, _ref, _results;
        if (file.previewElement) {
            _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
            _results = [];
            for (i = 0, len = _ref.length; i < len; i++) {
                node = _ref[i];
                if (node.nodeName === 'PROGRESS') {
                    _results.push(node.value = progress);
                } else {
                    _results.push(node.style.width = "" + progress + "%");
                }
            }
            return _results;
        }
    }
    success = function (file) {
        if (file.previewElement) {
            return file.previewElement.classList.add("dz-success");
        }
    }
    canceled = function (file) {
        return this.error(file, "Upload canceled.");
    }
    complete = function (file, result) {
        this.scope.Controller.UploadComplete(result);
        this.$SafeApply();
        if (file._removeLink) {
            //file._removeLink.textContent = "Remove";
            file._removeLink = this.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>Remove</a>");
        }
        if (file.previewElement) {
            return file.previewElement.classList.add("dz-complete");
        }
    }





    forElement = function (element) {
        if (typeof element === "string") {
            element = document.querySelector(element);
        }
        if ((element != null ? element.dropzone : void 0) == null) {
            throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your DropzoneService.");
        }
        return element.dropzone;
    };
    isValidFile = function (file, acceptedFiles) {
        var baseMimeType, mimeType, validType, i, len;
        if (!acceptedFiles) {
            return true;
        }
        acceptedFiles = acceptedFiles.split(",");
        mimeType = file.type;
        baseMimeType = mimeType.replace(/\/.*$/, "");
        for (i = 0, len = acceptedFiles.length; i < len; i++) {
            validType = acceptedFiles[i];
            validType = validType.trim();
            if (validType.charAt(0) === ".") {
                if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
                    return true;
                }
            } else if (/\/\*$/.test(validType)) {
                if (baseMimeType === validType.replace(/\/.*$/, "")) {
                    return true;
                }
            } else {
                if (mimeType === validType) {
                    return true;
                }
            }
        }
        return false;
    };
    destroy = function () {
        var _ref;
        this.disable();
        this.removeAllFiles(true);
        if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
            this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
            this.hiddenFileInput = null;
        }
        delete this.ClickElement.dropzone;
        //return DropzoneService.instances.splice(DropzoneService.instances.indexOf(this), 1);
    };
    updateTotalUploadProgress = function () {
        var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, i, len, _ref;
        totalBytesSent = 0;
        totalBytes = 0;
        activeFiles = this.getActiveFiles();
        if (activeFiles.length) {
            _ref = this.getActiveFiles();
            for (i = 0, len = _ref.length; i < len; i++) {
                file = _ref[i];
                totalBytesSent += file.upload.bytesSent;
                totalBytes += file.upload.total;
            }
            totalUploadProgress = 100 * totalBytesSent / totalBytes;
        } else {
            totalUploadProgress = 100;
        }
        return this.totaluploadprogress(totalUploadProgress, totalBytes, totalBytesSent);
    };
    _getParamName = function (n) {
        if (typeof DropzoneService.Options.paramName === "function") {
            return DropzoneService.Options.paramName(n);
        } else {
            return "" + DropzoneService.Options.paramName + (DropzoneService.Options.uploadMultiple ? "[" + n + "]" : "");
        }
    };
    _renameFilename = function (name) {
        if (typeof DropzoneService.Options.renameFilename !== "function") {
            return name;
        }
        return DropzoneService.Options.renameFilename(name);
    };

    removeEventListeners = function () {
        var elementListeners, event, listener, i, len, _ref, _results;
        _ref = this.listeners;
        _results = [];
        for (i = 0, len = _ref.length; i < len; i++) {
            elementListeners = _ref[i];
            _results.push((function () {
                var _ref1, _results1;
                _ref1 = elementListeners.events;
                _results1 = [];
                for (event in _ref1) {
                    listener = _ref1[event];
                    _results1.push(elementListeners.element.removeEventListener(event, listener, false));
                }
                return _results1;
            })());
        }
        return _results;
    };
    disable = function () {
        var self = this, file, i, len, _ref, _results;
        this.clickableElements.forEach(function (element) {
            return self.ClickElement.element.classList.remove("dz-clickable");
        });
        this.removeEventListeners();
        _ref = this.FilesQ;
        _results = [];
        for (i = 0, len = _ref.length; i < len; i++) {
            file = _ref[i];
            _results.push(this.cancelUpload(file));
        }
        return _results;
    };
    filesize = function (size) {
        var cutoff, i, selectedSize, selectedUnit, unit, units, i, len;
        selectedSize = 0;
        selectedUnit = "b";
        if (size > 0) {
            units = ['TB', 'GB', 'MB', 'KB', 'b'];
            for (i = i = 0, len = units.length; i < len; i = ++i) {
                unit = units[i];
                cutoff = Math.pow(DropzoneService.Options.filesizeBase, 4 - i) / 10;
                if (size >= cutoff) {
                    selectedSize = size / Math.pow(DropzoneService.Options.filesizeBase, 4 - i);
                    selectedUnit = unit;
                    break;
                }
            }
            selectedSize = Math.round(10 * selectedSize) / 10;
        }
        return "<strong>" + selectedSize + "</strong> " + selectedUnit;
    };
    _updateMaxFilesReachedClass = function () {
        if ((DropzoneService.Options.maxFiles != null) && this.getAcceptedFiles().length >= DropzoneService.Options.maxFiles) {
            if (this.getAcceptedFiles().length === DropzoneService.Options.maxFiles) {
                this.maxfilesreached(this.FilesQ);
            }
            return this.full(true);
        } else {
            return this.full(false);
        }
    };

    paste = function (e) {
        var items, _ref;
        if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
            return;
        }
        this._paste(e);
        items = e.clipboardData.items;
        if (items.length) {
            return this._addFilesFromItems(items);
        }
    };
    handleFiles = function (files) {
        var file, i, len, _results;
        _results = [];
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            _results.push(this.addFile(file));
        }
        return _results;
    };
    _addFilesFromItems = function (items) {
        var entry, item, i, len, _results;
        _results = [];
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
                if (entry.isFile) {
                    _results.push(this.addFile(item.getAsFile()));
                } else if (entry.isDirectory) {
                    _results.push(this._addFilesFromDirectory(entry, entry.name));
                } else {
                    _results.push(void 0);
                }
            } else if (item.getAsFile != null) {
                if ((item.kind == null) || item.kind === "file") {
                    _results.push(this.addFile(item.getAsFile()));
                } else {
                    _results.push(void 0);
                }
            } else {
                _results.push(void 0);
            }
        }
        return _results;
    };
    _addFilesFromDirectory = function (directory, path) {
        var dirReader, errorHandler, readEntries;
        dirReader = directory.createReader();
        errorHandler = function (error) {
            return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
        };
        readEntries = (function (self) {
            return function () {
                return dirReader.readEntries(function (entries) {
                    var entry, i, len;
                    if (entries.length > 0) {
                        for (i = 0, len = entries.length; i < len; i++) {
                            entry = entries[i];
                            if (entry.isFile) {
                                entry.file(function (file) {
                                    if (DropzoneService.Options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                                        return;
                                    }
                                    file.fullPath = "" + path + "/" + file.name;
                                    return self.addFile(file);
                                });
                            } else if (entry.isDirectory) {
                                self._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
                            }
                        }
                        readEntries();
                    }
                    return null;
                }, errorHandler);
            };
        })(this);
        return readEntries();
    };
    accept = function (file, done) {
        if (file.size > DropzoneService.Options.maxFilesize * 1024 * 1024) {
            return done(DropzoneService.Options.dictFileTooBig.replace("{{filesize}}", Math.round((file.size / 1024 / 10.24) / 100).toString()).replace("{{maxFilesize}}", DropzoneService.Options.maxFilesize.toString()));
        } else if (!this.isValidFile(file, DropzoneService.Options.acceptedFiles)) {
            return done(DropzoneService.Options.dictInvalidFileType);
        } else if ((DropzoneService.Options.maxFiles != null) && this.getAcceptedFiles().length >= DropzoneService.Options.maxFiles) {
            done(DropzoneService.Options.dictMaxFilesExceeded.replace("{{maxFiles}}", DropzoneService.Options.maxFiles.toString()));
            return this.maxfilesexceeded(file);
        } else {
            return DropzoneService.Options.accept.call(this, file, done);
        }
    };
    addFile = function (file) {
        file.upload = { progress: 0, total: file.size, bytesSent: 0 };
        this.FilesQ.push(file);
        file.status = DropzoneService.ADDED;
        this.addedfile(file);
        this._enqueueThumbnail(file);
        return this.accept(file, (function (self) {
            return function (error) {
                if (error) {
                    file.accepted = false;
                    self._errorProcessing([file], error);
                } else {
                    file.accepted = true;
                    if (DropzoneService.Options.autoQueue) {
                        self.enqueueFile(file);
                    }
                }
                return self._updateMaxFilesReachedClass();
            };
        })(this));
    };
    enqueueFiles = function (files) {
        var file, i, len;
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            this.enqueueFile(file);
        }
        return null;
    };
    enqueueFile = function (file) {
        if (file.status === DropzoneService.ADDED && file.accepted === true) {
            file.status = DropzoneService.QUEUED;
            if (DropzoneService.Options.autoProcessQueue) {
                return setTimeout(((function (self) {
                    return function () {
                        return self.processQueue();
                    };
                })(this)), 0);
            }
        } else {
            throw new Error("This file can't be queued because it has already been processed or was rejected.");
        }
    };
    _enqueueThumbnail = function (file) {
        if (DropzoneService.Options.createImagethumbnails && file.type.match(/image.*/) && file.size <= DropzoneService.Options.MaxThumbnailFilesize * 1024 * 1024) {
            this.ThumbnailsQ.push(file);
            return setTimeout(((function (self) {
                return function () {
                    return self._processThumbnailQueue();
                };
            })(this)), 0);
        }
    };
    _processThumbnailQueue = function () {
        if (this._processingThumbnail || this.ThumbnailsQ.length === 0) {
            return;
        }
        this._processingThumbnail = true;
        return this.createThumbnail(this.ThumbnailsQ.shift(), (function (self) {
            return function () {
                self._processingThumbnail = false;
                return self._processThumbnailQueue();
            };
        })(this));
    };
    removeFile = function (file) {
        if (file.status === DropzoneService.UPLOADING) {
            this.cancelUpload(file);
        }
        this.FilesQ = this.without(this.FilesQ, file);
        this.removedfile(file);
        if (this.FilesQ.length === 0) {
            return this.reset();
        }
    };
    removeAllFiles = function (cancelIfNecessary) {
        var file, i, len, _ref;
        if (cancelIfNecessary == null) {
            cancelIfNecessary = false;
        }
        _ref = this.FilesQ.slice();
        for (i = 0, len = _ref.length; i < len; i++) {
            file = _ref[i];
            if (file.status !== DropzoneService.UPLOADING || cancelIfNecessary) {
                this.removeFile(file);
            }
        }
        return null;
    };
    createThumbnail = function (file, callback) {
        var fileReader;
        fileReader = new FileReader;
        fileReader.onload = (function (self) {
            return function () {
                if (file.type === "image/svg+xml") {
                    self.thumbnail(file, fileReader.result);
                    if (callback != null) {
                        callback();
                    }
                    return;
                }
                return self.createThumbnailFromUrl(file, fileReader.result, callback);
            };
        })(this);
        return fileReader.readAsDataURL(file);
    };
    createThumbnailFromUrl = function (file, imageUrl, callback, crossOrigin) {
        var img;
        var self = this;
        img = document.createElement("img");
        if (crossOrigin) {
            img.crossOrigin = crossOrigin;
        }
        img.onload = (function (element) {
            return function () {
                var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
                file.width = img.width;
                file.height = img.height;
                resizeInfo = self.resize.call(self, file);
                if (resizeInfo.trgWidth == null) {
                    resizeInfo.trgWidth = resizeInfo.optWidth;
                }
                if (resizeInfo.trgHeight == null) {
                    resizeInfo.trgHeight = resizeInfo.optHeight;
                }
                canvas = document.createElement("canvas");
                ctx = canvas.getContext("2d");
                canvas.width = resizeInfo.trgWidth;
                canvas.height = resizeInfo.trgHeight;
                self.drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
                thumbnail = canvas.toDataURL("image/png");
                self.thumbnail(file, thumbnail);
                if (callback != null) {
                    return callback();
                }
            };
        })(this);
        if (callback != null) {
            img.onerror = callback;
        }
        return img.src = imageUrl;
    };
    processQueue = function () {
        var i, parallelUploads, processingLength, queuedFiles;
        parallelUploads = DropzoneService.Options.parallelUploads;
        processingLength = this.getUploadingFiles().length;
        i = processingLength;
        if (processingLength >= parallelUploads) {
            return;
        }
        queuedFiles = this.getQueuedFiles();
        if (!(queuedFiles.length > 0)) {
            return;
        }
        if (DropzoneService.Options.uploadMultiple) {
            return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
        } else {
            while (i < parallelUploads) {
                if (!queuedFiles.length) {
                    return;
                }
                this.processFile(queuedFiles.shift());
                i++;
            }
        }
    };
    processFile = function (file) {
        return this.processFiles([file]);
    };
    processFiles = function (files) {
        var file, i, len;
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            file.processing = true;
            file.status = DropzoneService.UPLOADING;
            this.processing(file);
        }
        if (DropzoneService.Options.uploadMultiple) {
            this.processingmultiple(files);
        }
        return this.uploadFiles(files);
    };
    _getFilesWithXhr = function (xhr) {
        var file, files;
        return files = (function () {
            var i, len, _ref, _results;
            _ref = this.FilesQ;
            _results = [];
            for (i = 0, len = _ref.length; i < len; i++) {
                file = _ref[i];
                if (file.xhr === xhr) {
                    _results.push(file);
                }
            }
            return _results;
        }).call(this);
    };
    cancelUpload = function (file) {
        var groupedFile, groupedFiles, i, _j, len, len1, _ref;
        if (file.status === DropzoneService.UPLOADING) {
            groupedFiles = this._getFilesWithXhr(file.xhr);
            for (i = 0, len = groupedFiles.length; i < len; i++) {
                groupedFile = groupedFiles[i];
                groupedFile.status = DropzoneService.CANCELED;
            }
            file.xhr.abort();
            for (_j = 0, len1 = groupedFiles.length; _j < len1; _j++) {
                groupedFile = groupedFiles[_j];
                this.canceled(groupedFile);
            }
            if (DropzoneService.Options.uploadMultiple) {
                this.canceledmultiple(groupedFiles);
            }
        } else if ((_ref = file.status) === DropzoneService.ADDED || _ref === DropzoneService.QUEUED) {
            file.status = DropzoneService.CANCELED;
            this.canceled(file);
            if (DropzoneService.Options.uploadMultiple) {
                this.canceledmultiple([file]);
            }
        }
        if (DropzoneService.Options.autoProcessQueue) {
            return this.processQueue();
        }
    };
    uploadFile = function (file) {
        return this.uploadFiles([file]);
    };
    uploadFiles = function (files) {
        var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, method, option, progressObj, response, updateProgress, url, value, xhr, i, _j, _k, _l, len, len1, len2, len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        xhr = new XMLHttpRequest();
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            file.xhr = xhr;
        }
        method = DropzoneService.Options.Method;
        url = this.URL, files;
        xhr.open(method, url, true);
        xhr.withCredentials = !!DropzoneService.Options.withCredentials;
        response = null;
        handleError = (function (self) {
            return function () {
                var _j, len1, _results;
                _results = [];
                for (_j = 0, len1 = files.length; _j < len1; _j++) {
                    file = files[_j];
                    _results.push(self._errorProcessing(files, response || DropzoneService.Options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
                }
                return _results;
            };
        })(this);
        updateProgress = (function (self) {
            return function (e) {
                var allFilesFinished, progress, _j, _k, _l, len1, len2, len3, _results;
                if (e != null) {
                    progress = 100 * e.loaded / e.total;
                    for (_j = 0, len1 = files.length; _j < len1; _j++) {
                        file = files[_j];
                        file.upload = {
                            progress: progress,
                            total: e.total,
                            bytesSent: e.loaded
                        };
                    }
                } else {
                    allFilesFinished = true;
                    progress = 100;
                    for (_k = 0, len2 = files.length; _k < len2; _k++) {
                        file = files[_k];
                        if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                            allFilesFinished = false;
                        }
                        file.upload.progress = progress;
                        file.upload.bytesSent = file.upload.total;
                    }
                    if (allFilesFinished) {
                        return;
                    }
                }
                _results = [];
                for (_l = 0, len3 = files.length; _l < len3; _l++) {
                    file = files[_l];
                    _results.push(self.uploadprogress(file, progress, file.upload.bytesSent));
                }
                return _results;
            };
        })(this);
        xhr.onload = (function (self) {
            return function (e) {
                var _ref;
                if (files[0].status === DropzoneService.CANCELED) {
                    return;
                }
                if (xhr.readyState !== 4) {
                    return;
                }
                response = xhr.responseText;
                if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
                    try {
                        response = JSON.parse(response);
                    } catch (_error) {
                        e = _error;
                        response = "Invalid JSON response from server.";
                    }
                }
                updateProgress();
                if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
                    return handleError();
                } else {
                    return self._finished(files, response, e);
                }
            };
        })(this);
        xhr.onerror = (function (self) {
            return function () {
                if (files[0].status === DropzoneService.CANCELED) {
                    return;
                }
                return handleError();
            };
        })(this);
        progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
        progressObj.onprogress = updateProgress;
        headers = {
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "X-Requested-With": "XMLHttpRequest"
        };
        for (headerName in headers) {
            headerValue = headers[headerName];
            if (headerValue) {
                xhr.setRequestHeader(headerName, headerValue);
            }
        }
        formData = new FormData();
        if (DropzoneService.Options.params) {
            _ref1 = DropzoneService.Options.params;
            for (key in _ref1) {
                value = _ref1[key];
                formData.append(key, value);
            }
        }
        for (_j = 0, len1 = files.length; _j < len1; _j++) {
            file = files[_j];
            this.sending(file, xhr, formData);
        }
        if (DropzoneService.Options.uploadMultiple) {
            this.sendingmultiple(files, xhr, formData);
        }
        if (this.ClickElement.tagName === "FORM") {
            _ref2 = this.ClickElement.querySelectorAll("input, textarea, select, button");
            for (_k = 0, len2 = _ref2.length; _k < len2; _k++) {
                input = _ref2[_k];
                inputName = input.getAttribute("name");
                inputType = input.getAttribute("type");
                if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
                    _ref3 = input.options;
                    for (_l = 0, len3 = _ref3.length; _l < len3; _l++) {
                        option = _ref3[_l];
                        if (option.selected) {
                            formData.append(inputName, option.value);
                        }
                    }
                } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
                    formData.append(inputName, input.value);
                }
            }
        }
        for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
            formData.append(this._getParamName(i), files[i], this._renameFilename(files[i].name));
        }
        return this.submitRequest(xhr, formData, files);
    };
    submitRequest = function (xhr, formData, files) {
        return xhr.send(formData);
    };
    _finished = function (files, responseText, e) {
        var file, i, len;
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            file.status = DropzoneService.SUCCESS;
            this.success(file, responseText, e);
            this.complete(file, responseText);
        }
        if (DropzoneService.Options.uploadMultiple) {
            this.successmultiple(files, responseText, e);
            this.completemultiple(files, responseText);
        }
        if (DropzoneService.Options.autoProcessQueue) {
            return this.processQueue();
        }
    };
    _errorProcessing = function (files, message, xhr) {
        var file, i, len;
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            file.status = DropzoneService.ERROR;
            this.error(file, message, xhr);
            var result = new APIResponseModel();
            result.Title = "Error";
            result.Message = message;
            result.Status = API_STATUS.ERROR;
            this.complete(file, result);
        }
        if (DropzoneService.Options.uploadMultiple) {
            this.errormultiple(files, message, xhr);
            this.completemultiple(files);
        }
        if (DropzoneService.Options.autoProcessQueue) {
            return this.processQueue();
        }
    };

    detectVerticalSquash = function (img) {
        var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
        iw = img.naturalWidth;
        ih = img.naturalHeight;
        canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = ih;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        data = ctx.getImageData(0, 0, 1, ih).data;
        sy = 0;
        ey = ih;
        py = ih;
        while (py > sy) {
            alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        ratio = py / ih;
        if (ratio === 0) {
            return 1;
        } else {
            return ratio;
        }
    };
    drawImageIOSFix = function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio;
        vertSquashRatio = this.detectVerticalSquash(img);
        return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
    };

    camelize = function (str) {
        return str.replace(/[\-_](\w)/g, function (match) {
            return match.charAt(1).toUpperCase();
        });
    };


    createElement = function (string) {
        var div;
        div = document.createElement("div");
        div.innerHTML = string;
        return div.childNodes[0];
    };
    confirm = function (question, accepted) {//, rejected) {
        if (window.confirm(question)) {
            return accepted();
        }/* else if (rejected != null) {
            return rejected();
        }*/
    };
    getElement = function (el, name) {
        var element;
        if (typeof el === "string") {
            element = document.querySelector(el);
        } else if (el.nodeType != null) {
            element = el;
        }
        if (element == null) {
            throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
        }
        return element;
    };
    getElements = function (els, name) {
        var e, el, elements, i, _j, len, len1, _ref;
        if (els instanceof Array) {
            elements = [];
            try {
                for (i = 0, len = els.length; i < len; i++) {
                    el = els[i];
                    elements.push(this.getElement(el, name));
                }
            } catch (_error) {
                e = _error;
                elements = null;
            }
        } else if (typeof els === "string") {
            elements = [];
            _ref = document.querySelectorAll(els);
            for (_j = 0, len1 = _ref.length; _j < len1; _j++) {
                el = _ref[_j];
                elements.push(el);
            }
        } else if (els.nodeType != null) {
            elements = [els];
        }
        if (!((elements != null) && elements.length)) {
            throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
        }
        return elements;
    };
    elementInside = function (element, container) {
        if (element === container) {
            return true;
        }
        while (element = element.parentNode) {
            if (element === container) {
                return true;
            }
        }
        return false;
    };
    without(list, rejectedItem) {
        var item, i, len, _results;
        _results = [];
        for (i = 0, len = list.length; i < len; i++) {
            item = list[i];
            if (item !== rejectedItem) {
                _results.push(item);
            }
        }
        return _results;
    };
}

MediApp.service("DropzoneService", ["WebConnectionService", DropzoneService]);