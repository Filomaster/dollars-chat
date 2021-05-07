const text = document.getElementById("message-text");
const messageWindow = document.getElementById("messages-window");
const button = document.getElementById("send-message");

window.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && !e.shiftKey) {
    e.preventDefault();
    button.click();
  }
});

function addMessage(data) {
  let newMessage = document.createElement("div");
  // newMessage.style.width = "100%";
  newMessage.style.marginTop = "1vh";
  switch (data.type) {
    case "message":
      let name = document.createElement("div");
      name.innerText = data.name;
      name.style.color = "white";
      name.style.textAlign = "center";
      let avatar = document.createElement("div");
      avatar.style.height = "6vh";
      avatar.style.width = "6vh";
      avatar.style.backgroundColor = data.color;
      avatar.style.backgroundSize = `6vh 6vh`;
      avatar.style.backgroundImage = `url("/images/avatar.png")`;
      avatar.style.border = "3px solid white";

      let userContainer = document.createElement("div");
      userContainer.style.display = "flex";
      userContainer.style.flexDirection = "column";
      userContainer.style.alignContent = "center";
      userContainer.style.height = "10vh";
      userContainer.style.width = "6vh";
      userContainer.append(avatar);
      userContainer.append(name);
      newMessage.append(userContainer);
      newMessage.style.color = data.color;

      break;
    case "system":
      newMessage.innerText = "-- " + data.content;
      newMessage.style.color = "white";
      break;
  }
  messageWindow.insertBefore(newMessage, messageWindow.firstChild);
}

function post() {
  if (text.value && text.value.trim().length > 0) {
    $.ajax({
      url: "/message",
      method: "post",
      data: { message: text.value },
    });
    text.value = "";
  }
}

function poll() {
  $.ajax({
    url: "/poll",
    success: function (data) {
      addMessage(data);
      console.log(data);
      poll();
    },
    error: function () {
      poll();
    },
    timeout: 30000,
  });
}

poll();
