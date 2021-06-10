const text = document.getElementById("message-text");
const messageWindow = document.getElementById("messages-window");
const button = document.getElementById("send-message");
// let emoticons;

// $.getJSON("/lib/emoticons.json").then((data) => {
//   emoticons = data;
//   // emoticons = JSON.parse(data);
//   data.forEach((x) => {
//     console.log(x[0], x[1]);
//   });
//   console.log(data);
// });

window.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && !e.shiftKey) {
    e.preventDefault();
    button.click();
  }
});
function insertEmoji(message) {
  let regexp;
  for (let i = 0; i < emoticons.length; i++) {
    regexp = new RegExp(`(?![[:space:]])(` + emoticons[i][0] + `)([[:space:]]|$)`, "gmi");
    console.log(regexp, message.search(regexp));
    if (message.search(regexp) != -1)
      console.log(`fund: ${emoticons[i][0]}, replacing with ${emoticons[i][1]}`);
    message.replaceAll(regexp, emoticons[i][1]);
  }
  return message;
}
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
      if (data.content.length > 60) {
        let message = data.content.match(/(.{1,60})/g);
        data.content = "";
        for (let i = 0; i < message.length - 1; i++) data.content += message[i] + "\n";
        data.content += message[message.length - 1];
      }
      let name = document.createElement("div");
      name.innerText = data.name;
      name.style.color = "white";
      name.style.textAlign = "center";
      let avatar = document.createElement("div");
      avatar.style.height = "6vh";
      avatar.style.width = "6vh";
      avatar.style.background =
        data.color.type == "generated" ? `hsl(${data.color.color}, 100%, 45%)` : data.color.color;
      avatar.style.backgroundSize = `6vh 6vh`;
      console.log(data);
      avatar.style.backgroundImage = `url("${!data.avatar ? "/images/avatar.png" : data.avatar}")`;
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
      messageBubble.classList.add(".emoticons");
      let gradient =
        data.color.type == "generated"
          ? `linear-gradient(to top, hsl(${data.color.color}, 100%, 25%) 0%, hsl(${data.color.color}, 100%, 45%) 50%, hsl(${data.color.color}, 100%, 55%) 100%)`
          : data.color.color;
      // console.log(gradient);
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
      // messageBubble.emoticonize();

      let mcDouble = document.createElement("div");
      mcDouble.innerText = data.content;
      mcDouble.classList.add("emoticon");
      messageBubble.append(mcDouble);

      let arrow = document.createElement("div");
      arrow.style.position = "absolute";
      arrow.style.left = 0;

      arrow.style.height = "20px";
      arrow.style.width = "20px";
      arrow.style.top = "30%";
      arrow.style.borderLeft = "3px solid white";
      arrow.style.borderBottom = "3px solid white";
      arrow.style.transform = "rotate(45deg)";
      arrow.style.backgroundColor =
        data.color.type == "generated" ? `hsl(${data.color.color}, 100%, 45%)` : data.color.color;

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
  newMessage;
  messageWindow.insertBefore(newMessage, messageWindow.firstChild);
  $(".emoticon").emoticonize(); //data.content;
}

function post() {
  if (text.value && text.value.trim().length > 0) {
    // Commands implementation
    console.log(text.value.match(/^\/([a-z]*)( [a-zA-Z0-9#]*)*/));
    let command = text.value.match(/^\/([a-z]+)( [a-zA-Z0-9\#\;\,\-\%\)\(\"\:\/\.]*)*/);
    let newMessage = document.createElement("div");
    newMessage.style.marginTop = "1vh";
    if (command) {
      switch (command[1]) {
        case "color":
          if (command.length > 3) {
            //     newMessage.style.color = `hsl(${res.color}, 100%, 45%)`;
            newMessage.innerText = "-- Too many arguments for /color";
          } else {
            data = { color: null };
            if (command[2]) data.color = command[2].trim();
            $.ajax({
              url: "/color",
              method: "post",
              data,
            }).then((res) => {
              console.log(res.color);
              newMessage.style.color =
                res.color.type == "generated"
                  ? `hsl(${res.color.color}, 100%, 45%)`
                  : res.color.color;
              newMessage.innerText = "-- You changed your color";
            });
          }
          break;
        case "avatar":
          if (command.length > 3) {
            //     newMessage.style.color = `hsl(${res.color}, 100%, 45%)`;
            newMessage.innerText = "-- Too many arguments for /avatar";
          } else {
            data = { avatar: null };
            if (command[2]) data.avatar = command[2].trim();
            $.ajax({
              url: "/avatar",
              method: "post",
              data,
            }).then((res) => {
              console.log(res.avatar);
              newMessage.innerText = "-- You changed your avatar";
            });
          }
          break;
        case "nick":
          if (command.length > 3) {
            //     newMessage.style.color = `hsl(${res.color}, 100%, 45%)`;
            newMessage.innerText = "-- This command require exactly 1 argument";
          } else {
            data = { nick: null };
            data.nick = command[2].trim();
            $.ajax({
              url: "/nick",
              method: "post",
              data,
            });
          }
          break;
        default:
          newMessage.innerText += "-- Unknown command\n";
        case "help":
          newMessage.innerText +=
            "-- All available commands: \n" +
            "   help - shows all commands\n" +
            "   color - changes user color to any valid css color; random color if used without param\n" +
            "   avatar - changes user avatar to any image from url\n" +
            "   nick - changes user nickname to given";
          break;
      }
      messageWindow.insertBefore(newMessage, messageWindow.firstChild);
      return (text.value = "");
    }
    // if (text.value == "/color") {
    //   $.post("/color").then((res) => {
    //     console.log(res);
    //     let newMessage = document.createElement("div");
    //     newMessage.style.marginTop = "1vh";
    //     newMessage.style.color = `hsl(${res.color}, 100%, 45%)`;
    //     newMessage.innerText = "-- You changed your color";
    //     messageWindow.insertBefore(newMessage, messageWindow.firstChild);
    //   });
    //   return (text.value = "");
    // }
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
      // console.log(data);
      poll();
    },
    error: function () {
      poll();
    },
    timeout: 30000,
  });
}

poll();
