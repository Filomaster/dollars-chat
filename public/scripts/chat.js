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
  newMessage.style.marginTop = "2vh";
  newMessage.style.marginBottom = "2vh";
  newMessage.style.display = "flex";
  newMessage.style.fontFamily = `"Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva,
  Verdana, sans-serif`;
  switch (data.type) {
    case "message":
      let name = document.createElement("div");
      name.innerText = data.name;
      name.style.color = "white";
      name.style.textAlign = "center";
      let avatar = document.createElement("div");
      avatar.style.height = "6vh";
      avatar.style.width = "6vh";
      avatar.style.backgroundColor = `hsl(${data.color}, 100%, 45%)`;
      avatar.style.backgroundSize = `6vh 6vh`;
      avatar.style.backgroundImage = `url("/images/avatar.png")`;
      avatar.style.border = "3px solid white";

      let userContainer = document.createElement("div");
      userContainer.style.display = "flex";
      userContainer.style.flexDirection = "column";
      userContainer.style.alignContent = "center";
      userContainer.style.height = "9vh";
      userContainer.style.width = "6vh";
      userContainer.append(avatar);
      userContainer.append(name);

      let bubbleContainer = document.createElement("div");

      let messageBubble = document.createElement("div");
      let gradient = `linear-gradient(to top, hsl(${data.color}, 100%, 25%) 0%, hsl(${data.color}, 100%, 45%) 50%, hsl(${data.color}, 100%, 55%) 100%)`;
      console.log(gradient);
      messageBubble.style.background = gradient;
      // messageBubble.style.position = "absolute";
      messageBubble.style.border = "3px solid white";
      messageBubble.style.borderRadius = "25px";
      messageBubble.style.marginLeft = "10px";
      messageBubble.style.paddingTop = "1vh";
      messageBubble.style.paddingBottom = "1vh";
      messageBubble.style.paddingLeft = "2vh";
      messageBubble.style.paddingRight = "2vh";
      messageBubble.style.height = "65%";
      messageBubble.style.display = "flex";
      messageBubble.style.flexDirection = "column";
      messageBubble.style.justifyContent = "center";
      messageBubble.innerText = data.content;

      let arrow = document.createElement("div");
      arrow.style.position = "absolute";
      arrow.style.left = 0;

      arrow.style.height = "20px";
      arrow.style.width = "20px";
      arrow.style.top = "30%";
      arrow.style.borderLeft = "3px solid white";
      arrow.style.borderBottom = "3px solid white";
      arrow.style.transform = "rotate(45deg)";
      arrow.style.backgroundColor = `hsl(${data.color}, 100%, 45%)`;

      bubbleContainer.style.display = "flex";
      bubbleContainer.style.marginLeft = "3vh";
      bubbleContainer.style.position = "relative";

      newMessage.append(userContainer);
      bubbleContainer.append(messageBubble);
      bubbleContainer.append(arrow);
      newMessage.append(bubbleContainer);

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
    // Commands implementation
    if (text.value == "/color") {
      $.post("/color").then((res) => {
        console.log(res);
        let newMessage = document.createElement("div");
        newMessage.style.marginTop = "1vh";
        newMessage.style.color = `hsl(${res.color}, 100%, 45%)`;
        newMessage.innerText = "-- You changed your color";
        messageWindow.insertBefore(newMessage, messageWindow.firstChild);
      });
      return (text.value = "");
    }
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
