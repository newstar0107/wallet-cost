//Дэлгэцтэй харицах хэсэг
var uiController = (function () {})();
//Санхүүгийн тооцоо хийх хэсэг
var financeController = (function () {})();

//main хэсэг
var appController = (function (uiController, financeController) {
    var addlistItem = function () {
        console.log("clicked or enter pressed");
        //1.Оруулах өгөгдөлийг унших
        //2.Уншсан өгөгдөлөө дамжуулна Finance controller луу
        //3.Finance controller дээр тооцоолол хийнэ
        //4.Тооцоолол хийсэн өгөгдлийг Дэлгэцрүү хэвлэнэ uiController дотроос
    };
    window.document.querySelector(".add__btn").addEventListener("click", function () {
        addlistItem();
    });
    window.document.addEventListener("keypress", function (event) {
        if (event.code === "Enter" || event.which === 13) {
            addlistItem();
        }
    });
})(uiController, financeController);
