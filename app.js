//Дэлгэцтэй харицах хэсэг
var uiController = (function () {
    //private data and function code begin
    var DomString = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
    };
    //private data and function code end

    // public service ийн code begin
    return {
        getInput: function () {
            return {
                type: document.querySelector(DomString.inputType).value,
                description: document.querySelector(DomString.inputDescription).value,
                value: document.querySelector(DomString.inputValue).value,
            };
        },
        getDOMString: function () {
            return DomString;
        },
        // Page рүү орлого зарлагын мэдээг гаргана
        addPrint: function (item, type) {},
    };
    //public service ийн code end
})();
//Санхүүгийн тооцоо хийх хэсэг
var financeController = (function () {
    //private data and function code begin
    var Income = function (id, value, description) {
        this.id = id;
        this.value = value;
        this.description = description;
    };
    var Expense = function (id, value, description) {
        this.id = id;
        this.value = value;
        this.description = description;
    };
    var i1 = new Income(0, 158000, "Цалин");
    var i2 = new Income(1, 10000, "Сугалаа");

    var data = {
        wallet: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 10000,
            exp: 123,
        },
    };
    // data.wallet.inc.push(i1);
    // data.wallet.inc.push(i2);
    // console.log(data.wallet.inc);
    //private data and function code end
    //public service ийн code begin
    return {
        addData: function (type, value, description) {
            var item, id;
            if (data.wallet[type].length === 0) id = 1;
            else id = data.wallet[type][data.wallet[type].length - 1].id + 1;
            if (type === "inc") item = new Income(id, value, description);
            else item = new Expense(id, value, description);
            data.wallet[type].push(item);
            console.log(data.wallet[type]);
            return item;
        },
    };
    //public service ийн code end
})();

//main хэсэг
var appController = (function (uiController, financeController) {
    var addlistItem = function () {
        console.log(uiController.getInput());
        //1.Оруулах өгөгдөлийг унших
        var input = uiController.getInput();
        //2.Уншсан өгөгдөлөө дамжуулна Finance controller луу
        //3.Finance controller дээр тооцоолол хийнэ
        var item = financeController.addData(input.type, input.value, input.description);
        //4.Тооцоолол хийсэн өгөгдлийг Дэлгэцрүү хэвлэнэ uiController дотроос
        uiController.addPrint(item, input.type);
    };
    var setEventListner = function () {
        var DomString = uiController.getDOMString();
        window.document.querySelector(DomString.addBtn).addEventListener("click", function () {
            addlistItem();
        });
        window.document.addEventListener("keypress", function (event) {
            if (event.code === "Enter" || event.which === 13) {
                addlistItem();
            }
        });
    };
    //public service code begin

    return {
        init: function () {
            console.log("Starting programm");
            setEventListner();
        },
        hi: function () {
            console.log("Starting hi");
        },
    };

    //public service code end
})(uiController, financeController);

appController.init();
