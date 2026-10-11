const eventsSection = document.getElementById("events")
const eventsList = document.getElementById("events-list")

async function fetchEvents() {
  const response = await fetch("events.json")

  // stop if there's a problem and if the events.json file is missing
  if (!response.ok) {
    return false
  }

  return response.json()
}

fetchEvents().then((events) => {
  // if no events are found, we remove the events section altogether and stop the script
  if (!(events && events.length > 0)) {
    eventsSection.remove()

    return false
  }

  let nbPastEvents = 0
  events.forEach((event) => {
    const todayTime = new Date().getTime()
    const eventDateTime = new Date(event.date).getTime()
    // time is in milliseconds, there’s 86400000 of them in a day
    const diffInDays = Math.floor((todayTime - eventDateTime) / 8.64e7)

    // do not display the event if it happened more than 6 days ago
    // do not display the event if it takes place more than 32 days from now
    if ((diffInDays > 6) | (diffInDays < -32)) {
      nbPastEvents++
      return false
    }

    const listItem = document.createElement("li")

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

    // mark the event as having recently happened, if it was less than 6 days ago
    if (diffInDays > 0) {
      const expired = document.createElement("p")
      expired.classList.add("expired")
      expired.setHTML("<strong>Cet évènement a déja eu lieu.</strong>", {
        sanitizer: new Sanitizer({
          elements: ["strong"],
        }),
      })

      listItem.classList.add("past")
      listItem.appendChild(expired)
    }

    // if the event has not taken place yet and we have a flyer,
    // show a button to activate a dialog with the flyer image and alt text
    if (diffInDays <= 0 && event.flyer) {
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

    eventsList && eventsList.appendChild(listItem)
  })

  // if all the events have long since passed, we remove the events section altogether
  if (nbPastEvents === events.length) {
    eventsSection.remove()
  }
})
