const eventsList = document.getElementById("events-list")
const events = Array.from(eventsList.children)

const todayTime = new Date().getTime()

events.forEach((event) => {
  const eventDateTime = new Date(event.getAttribute("data-date")).getTime()
  const diff = Math.floor((todayTime - eventDateTime) / 8.64e7)

  // remove the event if it happened more than 10 days ago
  if (diff > 0) {
    event.classList.add("past")
    const text = document.createElement("p")
    text.classList.add("expired")
    text.setHTML("<strong>Cet évènement a déja eu lieu.</strong>", {
      sanitizer: new Sanitizer({
        elements: ["strong"],
      }),
    })
    event.appendChild(text)
  }
  // remove the event if it happened more than 10 days ago
  // remove the event if it takes place more than 30 days from now
  if ((diff > 10) | (diff < -30)) {
    event.remove()
  }
})

function displayCookiesCount() {
  const nbCookies = document.cookie ? Object.keys(document.cookie.split("; ").map((cookie) => cookie.split("="))).length : 0

  const footer = document.getElementById("footer")
  const text = document.createElement("p")
  text.textContent = nbCookies > 0 ? `${nbCookies} cookie${nbCookies === 1 ? "" : "s"}` : "Aucun cookie"
  footer.appendChild(text)
}

displayCookiesCount()
