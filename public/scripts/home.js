const input = document.getElementById("nickname-field");
const button = document.getElementById("send");

window.addEventListener("keydown", (e) => {
  if (e.key == "Enter") button.click();
});

function send() {
  if (input.value) {
    fetch("/login", {
      method: "POST",
      redirect: "manual",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input.value }),
    }).then((response) => {
      window.open(
        "/chat",
        "_self", //"chat",
        "height=1000, width=800, menubar=no, toolbar=no, location=no, status=0, titlebar=0"
      );
    });
  } else window.alert("Username can not be empty!");
}
