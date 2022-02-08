//Дэлгэцтэй харицах хэсэг
var uiController = (function () {
    //private data and function code begin
    var DomString = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        totalIncome: ".budget__income--value",
        totalExpense: ".budget__expenses--value",
        huvi: ".budget__expenses--percentage",
        balance: ".budget__value",
        itemList: ".container clearfix",
        bottomDiv: ".bottom",
    };
    //private data and function code end

    // public service ийн code begin
    return {
        clearField: function () {
            var field = document.querySelectorAll(DomString.inputDescription + ", " + DomString.inputValue);
            var fieldArr = Array.prototype.slice.call(field);
            fieldArr.forEach((element) => {
                element.value = "";
            });
            fieldArr[0].focus();
        },
        getInput: function () {
            return {
                type: document.querySelector(DomString.inputType).value,
                description: document.querySelector(DomString.inputDescription).value,
                value: parseInt(document.querySelector(DomString.inputValue).value),
            };
        },
        getDOMString: function () {
            return DomString;
        },
        // Page рүү орлого зарлагын мэдээний нийт дүнг гаргана
        printAll: function (data) {
            document.querySelector(DomString.totalIncome).textContent = "+" + data.totalsInc;
            document.querySelector(DomString.totalExpense).textContent = "-" + data.totalsExp;
            document.querySelector(DomString.balance).textContent = "+" + data.balance;
            document.querySelector(DomString.huvi).textContent = data.huvi + "%";
            // console.log(document.querySelector(DomString.totalExpense).textContent);
        },
        // Page рүү орлого зарлагын мэдээний нийт дүнг гаргана
        whichDeleteItem: function () {
            // document.querySelector(DomString.incomeList).addEventListener("click", function (event) {
            //     var id = event.target.id;
            //     var idAndType = id.splite("-");
            //     if (idAndType[0] === "income") idAndType[0] = "inc";
            //     if (idAndType[0] === "expense") idAndType[0] = "exp";
            //     return {
            //         type: idAndType[0],
            //         id: idAndType[1],
            //     };
            // });
        },
        // Page рүү орлого зарлагын мэдээг гаргана
        addPrint: function (item, type) {
            var html, list;
            if (type === "inc") {
                list = DomString.incomeList;
                html =
                    '<div class="item clearfix" id="income-%id%"><div class="item__description">%%des%%</div><div class="right clearfix"><div class="item__value">+ %%val%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DomString.expenseList;
                html =
                    '<div class="item clearfix" id="expense-%id%"><div class="item__description">%%des%%</div><div class="right clearfix"><div class="item__value">- %%val%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            html = html.replace("%id%", item.id);
            html = html.replace("%%val%%", item.value);
            html = html.replace("%%des%%", item.description);
            document.querySelector(list).insertAdjacentHTML("beforeend", html);
        },
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
    var calcSum = function (type) {
        var sum = 0;
        data.wallet[type].forEach(function (el) {
            sum = sum + el.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        wallet: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
        balance: 0,
        huvi: 0,
    };

    //private data and function code end
    //public service ийн code begin
    return {
        deleteItem: function (id, type) {
            var idArr = data.wallet[type].map(function (el) {
                return el.id;
            });
            var index = idArr.indexOf(id);
            if (index !== -1) data.wallet[type].splice(index, 1);
        },
        calc: function () {
            calcSum("inc");
            calcSum("exp");
            data.balance = data.totals.inc - data.totals.exp;
            data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        addData: function (type, value, description) {
            var item, id;
            if (data.wallet[type].length === 0) id = 1;
            else id = data.wallet[type][data.wallet[type].length - 1].id + 1;
            if (type === "inc") item = new Income(id, value, description);
            else item = new Expense(id, value, description);
            data.wallet[type].push(item);
            console.log(data);

            return item;
        },
        seeData: function () {
            return data;
        },
        sendData: function () {
            return {
                totalsInc: data.totals.inc,
                totalsExp: data.totals.exp,
                balance: data.balance,
                huvi: data.huvi,
            };
        },
    };

    //public service ийн code end
})();

//main хэсэг
var appController = (function (uiController, financeController) {
    var addlistItem = function () {
        //1.Оруулах өгөгдөлийг унших
        var input = uiController.getInput();
        if (input.value !== "" && input.description !== "") {
            //оруулах өгөдлийг хоосонг шалгах
            //2.Уншсан өгөгдөлөө дамжуулна Finance controller луу
            var item = financeController.addData(input.type, input.value, input.description);
            //3. Уншсан өгөгдөлөө page рүү хэвлэнэ дахин өгөгдөл авхад бэлдэж цэвэрлэнэ
            uiController.addPrint(item, input.type);
            uiController.clearField();
            //4.Finance controller дээр өгөгдөлийн тооцоолол хийнэ
            financeController.calc();
            var data = financeController.sendData();
            //5.Тооцоолол хийсэн public data -г page рүү хэвлэнэ
            uiController.printAll(data);
        } else console.log("hooson");
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

        document.querySelector(DomString.bottomDiv).addEventListener("click", function (event) {
            var id = event.target.id;
            console.log(id);
        });
    };
    //public service code begin

    return {
        init: function () {
            console.log("Starting programm");
            setEventListner();
            uiController.printAll({ totalsInc: 0, totalsExp: 0, balance: 0, huvi: 0 });
        },
        hi: function () {
            console.log("Starting hi");
        },
    };

    //public service code end
})(uiController, financeController);

appController.init();
