const eventsList = document.getElementById("events-list")
const todayTime = new Date().getTime()

async function fetchEvents() {
  const response = await fetch("events.json")

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  return response.json()
}

fetchEvents().then((events) => {
  events.forEach((event) => {
    const eventDateTime = new Date(event.date).getTime()
    const diff = Math.floor((todayTime - eventDateTime) / 8.64e7)

    // do not display the event if it happened more than 6 days ago
    // do not display the event if it takes place more than 32 days from now
    if ((diff > 6) | (diff < -32)) {
      return false
    }

    const listItem = document.createElement("li")
    // mark the event as having recently happened, if it was less than 6 days ago
    if (diff > 0) {
      listItem.classList.add("past")
    }

    const title = document.createElement("h3")
    title.setHTML(`${event.type} <strong>${event.game}</strong>`, {
      sanitizer: new Sanitizer({
        elements: ["strong"],
      }),
    })
    const text = document.createElement("p")
    text.setHTML(event.text.replaceAll("\n", "<br>"), {
      sanitizer: new Sanitizer({
        elements: ["br"],
      }),
    })

    listItem.appendChild(title)
    listItem.appendChild(text)

    // mark the event as having recently happened, if it was less than 10 days ago
    if (diff > 0) {
      const expired = document.createElement("p")
      expired.classList.add("expired")
      expired.setHTML("<strong>Cet évènement a déja eu lieu.</strong>", {
        sanitizer: new Sanitizer({
          elements: ["strong"],
        }),
      })

      listItem.appendChild(expired)
    }

    if (diff <= 0 && event.flyer) {
      const id = `${event.date}-flyer`

      const flyer = document.createElement("div")
      flyer.classList.add("flyer")

      const buttonShow = document.createElement("button")
      buttonShow.setAttribute("type", "button")
      buttonShow.setAttribute("command", "show-modal")
      buttonShow.setAttribute("commandfor", id)
      buttonShow.textContent = "Voir le flyer"

      const dialog = document.createElement("dialog")
      dialog.setAttribute("id", id)

      const close = document.createElement("div")
      close.classList.add("close")

      const buttonClose = document.createElement("button")
      buttonClose.setAttribute("type", "button")
      buttonClose.setAttribute("command", "close")
      buttonClose.setAttribute("commandfor", id)
      buttonClose.textContent = "Fermer"

      const image = document.createElement("img")
      image.setAttribute("alt", "")
      image.setAttribute("src", `./flyer/${event.flyer.img}`)

      const altText = document.createElement("p")
      altText.classList.add("visually-hidden")
      altText.setHTML(event.flyer.alt.replaceAll("\n", "<br>"), {
        sanitizer: new Sanitizer({
          elements: ["br"],
        }),
      })

      close.appendChild(buttonClose)
      dialog.appendChild(close)
      dialog.appendChild(image)
      dialog.appendChild(altText)

      flyer.appendChild(buttonShow)
      flyer.appendChild(dialog)
      listItem.appendChild(flyer)
    }

    eventsList.appendChild(listItem)
  })
})
