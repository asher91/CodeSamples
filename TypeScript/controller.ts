class CoreController {
    CoreWebService: CoreWebService;

    Math: any;
    scope: any;
    window: any;
    toaster: any;

    Culture: string;
    Page: string;

    Library: LIBRARY = new LIBRARY();
    State: PAGE_STATE;

    User: User;

    constructor($scope, toaster: any, CoreWebService: CoreWebService) {
        this.CoreWebService = CoreWebService;

        this.Math = Math;
        this.scope = $scope;
        this.window = window;
        this.toaster = toaster;

        this.scope.CoreController = this;

        this.State = new PAGE_STATE();
    }


    public showToast(toasterType: API_STATUS, toasterTitle: string, toasterText: string = "") {
        this.toaster.pop(toasterType, toasterTitle, toasterText, 10000, 'trustedHtml');
    }

    public Pop(object: Array<any>, parent: Entity, index: number) {
        parent.State.Dirty();
        object.splice(index, 1);
    }
    public Push(object: Array<any>, parent: Entity, value: Array<any>) {
        if (value == null) {
            this.showToast(API_STATUS.ERROR, "Error", "Please enter a valid value.");
        } else if (this.IsNullOrEmptyString(value[0])) {
            this.showToast(API_STATUS.ERROR, "Error", "Please enter a valid value.");
        } else if (object.indexOf(value[0]) > 0) {
            this.showToast(API_STATUS.ERROR, "Error", "Value already exists.");
        } else {
            parent.State.Dirty();
            object.push(value[0]);
            value[0] = "";
        }
    }

    public Print() {
        window.print();
    }

    public Init(page, culture) {
        this.Page = page;
        this.Culture = culture;
        this.LoadUser(null);
    }

    public LoadUser(username: string, reload: boolean = false) {
        var self = this;

        this.CoreWebService
            .LoadUser(username, reload)
            .then(function (response: User) {
                self.User = response;
            }, function (error: any) {

            });
    }

    public SaveUser() {
        var self = this;

        this.CoreWebService
            .SaveUser(self.User)
            .then(function (response: User) {
                self.User = response;
            }, function (error: any) {

            });
    }

    public IsNullOrEmptyString(value: string) {
        return value == undefined || value == null || value.trim() == "";
    }

    public Step(controller: any, name: string) {
        return controller.Step == name ? "active" : "";
    }
    public StepCompletion(controller: any): number {
        var len = controller.Steps.length;
        if (len == 1) {
            len++;
        }
        return this.Math.ceil((controller.Steps.indexOf(controller.Step) * 100) / (len - 1));
    }
    public IsFirstPage(controller: any): string {
        if (this.StepCompletion(controller) <= 0) {
            return "disabled"
        }
        return "";
    }
    public IsLastPage(controller: any): boolean {
        return this.StepCompletion(controller) >= 100;
    }

    public GoToStep(controller: any, name: string) {
        if (controller.Steps.indexOf(name) >= 0) {
            controller.Step = name;
        }
    }
    public GoToUrl(url: string) {
        if (url !== null && url !== "" && url !== "#") {
            window.location.href = url;
        }
    }
    public PreviousStep(controller: any) {
        var index = controller.Steps.indexOf(controller.Step) - 1;
        if (index <= 0) {
            index = 0;
        }
        controller.Step = controller.Steps[index];
    }
    public NextStep(controller: any) {
        var index = controller.Steps.indexOf(controller.Step) + 1;
        if (index >= controller.Steps.length) {
            index = controller.Steps.length - 1;
        }
        controller.Step = controller.Steps[index];
    }

    public AddStep(controller: any, name: string, previous: string, goto: boolean) {
        if (controller.Steps.indexOf(name) < 0) {
            controller.Steps.splice(controller.Steps.indexOf(previous) + 1, 0, name);
        }
        if (goto) {
            controller.Step = name;
        }
    }
    public RemoveStep(controller: any, name: string) {
        if (controller.Steps.indexOf(name) >= 0) {
            var index = controller.Steps.indexOf(name);
            controller.Steps.splice(index, 1);
            controller.Step = controller.Steps[index - 1];
        }
    }
}

MediApp.controller("CoreController", ["$scope", "toaster", "CoreWebService", CoreController]);