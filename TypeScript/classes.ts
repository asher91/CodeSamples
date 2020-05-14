class API_STATUS {
    static SUCCESS = "success";
    static INFO = "info";
    static WAIT = "wait";
    static WARNING = "warning";
    static ERROR = "error";
    static DOWNLOAD = "download";
    static REDIRECT = "redirect";
}

class ENTITY_STATUS {
    public STATES: any = {};

    public SetState(state: string) {
        var self = this;
        Object.keys(self.STATES).forEach(function (key) {
            self.STATES[key] = state === key;
        });
    }
    public IsState(state: string): boolean {
        var self = this;
        return self.STATES[state];
    }
    public GetState(): string {
        var self = this;
        Object.keys(self.STATES).forEach(function (key: string) {
            if (self.STATES[key]) {
                return key
            };
        });
        return "";
    }

    public SwitchState(states: Array<string>) {
        var self = this;
        var index = states.indexOf(this.GetState());
        this.SetState(states[(index + 1) % states.length]);
    }
}
class PAGE_STATE extends ENTITY_STATUS {
    static READ = "read";
    static CREATE = "create";
    static WRITE = "write";
    static ERROR = "error";
    static PRINT = "print";

    constructor() {
        super();
        this.STATES[PAGE_STATE.READ] = true;
        this.STATES[PAGE_STATE.CREATE] = false;
        this.STATES[PAGE_STATE.WRITE] = false;
        this.STATES[PAGE_STATE.PRINT] = false;
        this.STATES[PAGE_STATE.ERROR] = false;
    }

    public SwitchState() {
        if (this.STATES[PAGE_STATE.READ] || this.STATES[PAGE_STATE.WRITE]) {
            this.STATES[PAGE_STATE.WRITE] = !this.STATES[PAGE_STATE.READ];
            this.STATES[PAGE_STATE.READ] = !this.STATES[PAGE_STATE.READ];
        }
    }

    public Read() {
        this.SetState(PAGE_STATE.READ);
    }
    public Write() {
        this.SetState(PAGE_STATE.WRITE);
    }
    public Print() {
        this.SetState(PAGE_STATE.PRINT);
    }
    public Error() {
        this.SetState(PAGE_STATE.ERROR);
    }
    public New() {
        this.SetState(PAGE_STATE.CREATE);
    }

    public IsRead(): boolean {
        return this.STATES[PAGE_STATE.READ];
    }
    public IsWrite(): boolean {
        return this.STATES[PAGE_STATE.WRITE] || this.STATES[PAGE_STATE.CREATE];
    }
    public IsPrint(): boolean {
        return this.STATES[PAGE_STATE.PRINT];
    }
    public IsError(): boolean {
        return this.STATES[PAGE_STATE.ERROR];
    }
    public IsNew(): boolean {
        return this.STATES[PAGE_STATE.CREATE];
    }
}
class MODEL_STATE extends ENTITY_STATUS {
    static NEW = "new";
    static LOADED = "loaded";
    static DIRTY = "dirty";
    static SAVED = "save";

    constructor() {
        super();
        this.STATES[MODEL_STATE.NEW] = true;
        this.STATES[MODEL_STATE.LOADED] = false;
        this.STATES[MODEL_STATE.DIRTY] = false;
        this.STATES[MODEL_STATE.SAVED] = false;
    }

    public Dirty() {
        this.SetState(MODEL_STATE.DIRTY);
    }

    public IsDirty(): boolean {
        return this.STATES[MODEL_STATE.DIRTY];
    }
}

class GENDERS {
    static MALE = "Male";
    static FEMALE = "Female";
    static OTHER = "Other";
}
class TITLES {
    static MR = "Mr";
    static MRS = "Mrs";
    static MISS = "Miss";
    static DR = "Dr";
}
class BLOODGROUPS {
    static AP = "A+";
    static AN = "A-";
    static BP = "B+";
    static BN = "B-";
    static ABP = "AB+";
    static ABN = "AB-";
    static OP = "O+";
    static ON = "O-";
}

class LIBRARY {
    public GENDERS: string[] = [GENDERS.MALE, GENDERS.FEMALE, GENDERS.OTHER];
    public TITLES: string[] = [TITLES.DR, TITLES.MR, TITLES.MRS, TITLES.MISS];
    public BLOODGROUPS: string[] = [BLOODGROUPS.AP, BLOODGROUPS.AN, BLOODGROUPS.BP, BLOODGROUPS.BN, BLOODGROUPS.ABP, BLOODGROUPS.ABN, BLOODGROUPS.OP, BLOODGROUPS.ON];
}

class APIResponseModel {
    public Title: string = null;
    public Message: string = null;

    public Payload: any;

    public Status: API_STATUS;
    public Stack: any;

    constructor() {

    }
}
class APIRedirectModel {
    public Url: string = null;
    public Timeout: number;

    constructor() {

    }
}

class Entity {
    public Id: string;
    public Name: string;
    public Url: string;
    public Avatar: string;
    public Description: string;
    public StatusId: string;
    public StatusName: string;
    public StatusDescription: string;
    public Type: string;
    public Culture: string;

    public State: MODEL_STATE = new MODEL_STATE();

    constructor(state: string = null) {
        this.State = new MODEL_STATE();
        this.State.SetState(state == null ? MODEL_STATE.NEW : state);
    }
}

class User extends Entity {
    public UserName: string;

    public Password: string;
    public Password2: string;
    public PasswordSalt: string;
    public PasswordFormat: number;
    public PasswordHashAlgorithm: number;
}