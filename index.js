window.onload = function () {
    let phone = localStorage.getItem("phoneNumber");
    const initData = window.appConfig.telegramWebApp.initData;
    const tgButton = window.appConfig.telegramWebApp.MainButton;
    const codeInput = document.getElementById("code-input");
    const verificationForm = document.getElementById("verification-form");

    if (phone) {
        verificationForm.style.display = 'block';
        tgButton.setText("Отправить");
        tgButton.disable();
        tgButton.show();

        // todo отправка телефона для входа
    } else {
        tgButton.setText("Войти");
        tgButton.show();
    }

    // const ref = window.appConfig.telegramWebApp.initDataUnsafe.start_param;
    // const loader = document.getElementById("loader");
    // const main = document.getElementById("app");

    // const testErrorBtn = document.getElementById("test-error-btn");

    console.log("initData ", initData)


    tgButton.onClick(() => {
        if (!phone) {
            window.appConfig.telegramWebApp.requestContact(function (contact) {
                console.log(" window.appConfig.telegramWebApp.requestContact ", contact, JSON.stringify(contact))
            });
            return
        }
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

    window.appConfig.telegramWebApp.onEvent("contactRequested", (eventType, eventData) => {
        console.log("contactRequested telegramWebApp onEvent eventData ", eventData, JSON.stringify(eventData))
        console.log("contactRequested telegramWebApp eventType eventType ", eventType, JSON.stringify(eventType), eventType.status == "sent", eventType.status === "sent")
        try {
            if (eventType.status && eventType.status == "sent") {
                const decodedResponse = decodeURIComponent(eventType.response);
                const params = decodedResponse.split('&').reduce((acc, part) => {
                    const [key, value] = part.split('=');
                    acc[key] = value;
                    return acc;
                }, {});

                const contactObj = JSON.parse(params.contact);
                const phoneNumber = contactObj.phone_number;
                if (phoneNumber) {
                    phone = phoneNumber;
                    localStorage.setItem("phoneNumber", phoneNumber);
                    console.log("phonenumber=", phoneNumber);

                    verificationForm.style.display = 'block';
                    tgButton.setText("Отправить");
                    tgButton.disable();
                    tgButton.show();

                    // todo отправка телефона для входа
                } else {
                    window.appConfig.telegramWebApp.showAlert("Предоставьте доступ к номеру телефона для входа", () => {
                });
                }
            } else {
                window.appConfig.telegramWebApp.showAlert("Предоставьте доступ к номеру телефона для входа", () => {
            });
            }
        } catch (err) {
            console.error("contactRequested failed:", err);
            window.appConfig.telegramWebApp.showAlert("Предоставьте доступ к номеру телефона для входа", () => {
            });
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

