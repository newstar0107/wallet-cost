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
        itemLabel: ".container",
        bottomDiv: ".bottom",
        expenseLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
        selectBox: ".add__type",
    };
    //private data and function code end
    var nodeListOfForeach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    var tooFormat = function (data) {
        data = data + "";
        var a = data.split("").reverse();
        for (var i = 3; i < a.length; i = i + 4) {
            a.splice(i, 0, ",");
        }
        a = a.reverse();
        a = a.join("");
        return a;
    };

    // public service ийн code begin
    return {
        datePrint: function () {
            var realD = new Date();
            realD.getTime;
            document.querySelector(DomString.dateLabel).textContent = realD.getFullYear() + " oны " + realD.getMonth() + "-р cарын ";
        },
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
            document.querySelector(DomString.totalIncome).textContent = "+" + tooFormat(data.totalsInc);
            document.querySelector(DomString.totalExpense).textContent = "-" + tooFormat(data.totalsExp);
            document.querySelector(DomString.balance).textContent = "+" + tooFormat(data.balance);
            document.querySelector(DomString.huvi).textContent = data.huvi + "%";
            // console.log(document.querySelector(DomString.totalExpense).textContent);
        },
        // Page дээрх элемэнтээс сонгогдсон id гаар устгана
        changeType: function () {
            var fields = document.querySelectorAll(DomString.inputType + ", " + DomString.inputDescription + ", " + DomString.inputValue);
            nodeListOfForeach(fields, function (el) {
                el.classList.toggle("red-focus");
            });
            document.querySelector(DomString.addBtn).classList.toggle("red");
        },
        // Page дээрх элемэнтээс сонгогдсон id гаар устгана
        deleteItem: function (id) {
            var e = document.getElementById(id);
            e.parentNode.removeChild(e);
        },
        // Page рүү орлого зарлагын мэдээг гаргана
        addPercentage: function (perArr) {
            var perList = document.querySelectorAll(DomString.expenseLabel);
            nodeListOfForeach(perList, function (el, index) {
                el.textContent = perArr[index] + "%";
            });
        },
        // Page рүү орлого зарлагын мэдээг гаргана
        addPrint: function (item, type) {
            var html, list;
            if (type === "inc") {
                list = DomString.incomeList;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%%des%%</div><div class="right clearfix"><div class="item__value">+ %%val%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DomString.expenseList;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%%des%%</div><div class="right clearfix"><div class="item__value">- %%val%%</div><div class="item__percentage">50%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            html = html.replace("%id%", item.id);
            html = html.replace("%%val%%", tooFormat(item.value));
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
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) this.percentage = Math.round((this.value / totalIncome) * 100);
        else this.percentage = 0;
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
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
        calcPercentages: function () {
            data.wallet.exp.forEach(function (el) {
                el.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPercentage = data.wallet.exp.map(function (el) {
                return el.getPercentage();
            });
            return allPercentage;
        },

        deleteItem: function (type, id) {
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
            if (data.totals.inc > 0) data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
            else data.huvi = 0;
        },
        addData: function (type, value, description) {
            var item, id;
            if (data.wallet[type].length === 0) id = 1;
            else id = data.wallet[type][data.wallet[type].length - 1].id + 1;
            if (type === "inc") item = new Income(id, value, description);
            else item = new Expense(id, value, description);
            data.wallet[type].push(item);
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
    var update = function () {
        financeController.calc();
        var data = financeController.sendData();
        //5.Тооцоолол хийсэн public data -г page рүү хэвлэнэ
        uiController.printAll(data);
        financeController.calcPercentages();
        var per = financeController.getPercentages();
        //console.log(per);
        uiController.addPercentage(per);
    };
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
            update();
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
        document.querySelector(DomString.selectBox).addEventListener("change", function (event) {
            uiController.changeType();
        });
        document.querySelector(DomString.itemLabel).addEventListener("click", function (event) {
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if (id) {
                var arr = [];
                arr = id.split("-");
                var type = arr[0];
                var itemId = parseInt(arr[1]);
                //financeController дээрээс өгөгдлийг устгах
                financeController.deleteItem(type, itemId);
                //Дэлгэц дээрээс хэвлэгдсэн зарлага орлогыг устгах
                uiController.deleteItem(id);
                update();
            }
        });
    };
    //public service code begin

    return {
        init: function () {
            console.log("Starting programm");
            uiController.datePrint();
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
