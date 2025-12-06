window.onload = function () {
    const initData = window.appConfig.telegramWebApp.initData;
    const tgButton = window.appConfig.telegramWebApp.MainButton;
    const codeInput = document.getElementById("code-input");

    // const ref = window.appConfig.telegramWebApp.initDataUnsafe.start_param;
    // const loader = document.getElementById("loader");
    // const main = document.getElementById("app");

    // const testErrorBtn = document.getElementById("test-error-btn");

    console.log("initData ", initData)

    tgButton.setText("Login");
    tgButton.disable();
    tgButton.show();

    tgButton.onClick(() => {
        const code = codeInput.value.trim().replace(/\D/g, "");
        if (code !== 6) {
            const message = "Could not load data. Reload MiniApp";
            const icon = "img/error.svg"
            loader.style.display = "none";
            main.style.display = "none";
            const delay = 20_000;
            playHapticError();
            showSnackbar(message, icon, delay);
            return
        }
        tgButton.showProgress(false);
        let requiresPassword = false;
        if (requiresPassword) {
            window.playHapticError();
            window.appConfig.telegramWebApp.showAlert("Что-то пошло не так. Попробуйте снова.", () => {
                console.log("Something went wrong error(psw required)");
            });
            return
        }
        let inCorrectCode = false;
        if (inCorrectCode) {
            window.playHapticError();
            window.appConfig.telegramWebApp.showAlert("Неверный код. Попробуйте снова.", () => {
                console.log("Incorrect code");
            });
            return
        }

    });

    codeInput.addEventListener("input", () => {
        codeInput.value = codeInput.value.replace(/\D/g, "");
    
        if (codeInput.value.length === 6) {
            tgButton.enable();
        } else {
            tgButton.disable();
        }
    });

    
    // testErrorBtn.addEventListener("click", () => {
    //     window.playHapticError();
    //     window.appConfig.telegramWebApp.showAlert("Введенный код неверный. Попробовать снова.", () => {
    //         window.location.reload();
    //     });
    // });

    // отрисовать кастомную телеграм кнопку, которая умеет дизейблиться и превращаться в прогресс, который надо отображать после успешно введенного кода бесконечно
    // document.getElementById("submit-btn").onclick = () => {
    //     window.playHapticNavigation();
        // const code = codeInput.value.trim();
        // let requiresPassword = false;
        // if (requiresPassword) {
        //     window.playHapticError();
        //     window.appConfig.telegramWebApp.showAlert("Что-то пошло не так. Попробуйте снова позже.", () => {
        //         console.log("Something went wrong error(psw required)");
        //     });
        //     return
        // }
        // let inCorrectCode = false;
        // if (inCorrectCode) {
        //     window.playHapticError();
        //     window.appConfig.telegramWebApp.showAlert("Введенный код неверный. Попробовать снова.", () => {
        //         window.location.reload();
        //     });
        //     return
        // }

    //     // todo show loading
    // };

        //   const message = "Could not load data. Reload MiniApp";
        //     const icon = "img/error.svg"
        //     loader.style.display = "none";
        //     main.style.display = "none";
        //     const delay = 20_000;
        //     playHapticError();
        //     showSnackbar(message, icon, delay);





};

