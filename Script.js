document.addEventListener("DOMContentLoaded", () => {
    const registernButton = document.getElementById("register");
    const Loginghost= document.getElementById("Login");
    const Container = document.getElementById("container");
    var Passwordinput = document.getElementById("Password");
    var Userinput = document.getElementById("Username");
    const loginButton= document.getElementById("Loginbutton");

    registernButton.addEventListener("click",()=>{
            Container.classList.add("right-panel-active");
    });
    Loginghost.addEventListener("click",()=>{
        Container.classList.remove("right-panel-active");
    });
    loginButton.addEventListener("click",(event)=>{
        event.preventDefault();
        const credentials = {
            "abraj@maliks.com": { password: "Abraj@101", page: "branches-index.html" },
        };
        const username = Userinput.value.toLowerCase();
        const password = Passwordinput.value;
        if (credentials[username] && credentials[username].password === password) {
            window.location.href = credentials[username].page;
        } else {
            alert("Invalid username or password!");
        }
    });
});
