window.onload = function () {
    const tg = window.Telegram.WebApp;
    tg.ready();

    console.log("init tg ", tg)
    console.log("init data from TG ", tg.initData)

    const initData = window.appConfig.telegramWebApp.initData;
    const ref = window.appConfig.telegramWebApp.initDataUnsafe.start_param;
    const loader = document.getElementById("loader");
    const main = document.getElementById("app");
    const codeInput = document.getElementById("code-input");

    const testErrorBtn = document.getElementById("test-error-btn");

    console.log("initData ", initData)
    console.log("ref ", ref)

    window.appConfig.telegramWebApp.MainButton.setText("Login tg button");
    window.appConfig.telegramWebApp.MainButton.show();

    window.appConfig.telegramWebApp.MainButton.onClick(() => {
        window.appConfig.telegramWebApp.MainButton.showProgress();
    });

    
    testErrorBtn.addEventListener("click", () => {
        window.playHapticError();
        window.appConfig.telegramWebApp.showAlert("Введенный код неверный. Попробовать снова.", () => {
            window.location.reload();
        });
    });

    // отрисовать кастомную телеграм кнопку, которая умеет дизейблиться и превращаться в прогресс, который надо отображать после успешно введенного кода бесконечно
    document.getElementById("submit-btn").onclick = () => {
        window.playHapticNavigation();
        const code = codeInput.value.trim();
        let requiresPassword = false;
        if (requiresPassword) {
            window.playHapticError();
            window.appConfig.telegramWebApp.showAlert("Что-то пошло не так. Попробуйте снова позже.", () => {
                console.log("Something went wrong error(psw required)");
            });
            return
        }
        let inCorrectCode = false;
        if (inCorrectCode) {
            window.playHapticError();
            window.appConfig.telegramWebApp.showAlert("Введенный код неверный. Попробовать снова.", () => {
                window.location.reload();
            });
            return
        }

        // todo show loading
    };

      

    codeInput.addEventListener("input", () => {
        codeInput.value = codeInput.value.replace(/\D/g, "");
        const tgButton = window.appConfig.telegramWebApp.MainButton;
    
        if (codeInput.value.length === 6) {
            tgButton.enable();
        } else {
            tgButton.disable();
        }
    });

      loader.style.display = 'none';
      main.style.display = "block";

    // const message = "Could not load data. Reload MiniApp";
    //         const icon = "img/error.svg"
    //         loader.style.display = "none";
    //         main.style.display = "none";
    //         const delay = 20_000;
    //         playHapticError();
    //         showSnackbar(message, icon, delay);

};

