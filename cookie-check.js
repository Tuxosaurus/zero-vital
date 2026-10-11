function buildCookieCheck(nbCookies) {
  const cookies = document.cookie.split("; ").map((cookie) => cookie.split("="))

  const footer = document.getElementById("footer")

  const button = document.createElement("button")
  button.setAttribute("type", "button")
  button.setAttribute("popovertarget", "cookie-popover")
  button.textContent = nbCookies > 1 ? `${nbCookies} cookies !` : `1 cookie !`

  const popover = document.createElement("dialog")
  popover.setAttribute("popover", "auto")
  popover.setAttribute("aria-labelledby", "cookie-popover-title")
  popover.setAttribute("id", "cookie-popover")

  const popoverTitle = document.createElement("h2")
  popoverTitle.setAttribute("id", "cookie-popover-title")
  popoverTitle.textContent = nbCookies > 1 ? `${nbCookies} cookies trouvés` : `1 cookie trouvé`

  const popoverIntro = document.createElement("p")
  popoverIntro.textContent = "Ce site ne se sert d’aucun cookie pour fonctionner, or il semble qu’un ou plusieurs aient été détectés."

  const popoverReview = document.createElement("p")
  popoverReview.textContent = "Veuillez trouver la liste ci-dessous. Vous pouvez les supprimer dans votre navigateur sans aucun souci."

  const cookiesList = document.createElement("ul")
  cookiesList.setAttribute("aria-label", "Cookies")

  cookies.forEach(([name, value]) => {
    const listItem = document.createElement("li")
    listItem.setHTML(`Nom du cookie : ${name}, valeur du cookie : ${value}`, {
      sanitizer: new Sanitizer({
        elements: [],
      }),
    })
    cookiesList.appendChild(listItem)
  })

  const popoverClose = document.createElement("div")
  popoverClose.classList.add("close")

  const popoverCloseButton = document.createElement("button")
  popoverCloseButton.setAttribute("type", "button")
  popoverCloseButton.setAttribute("popovertarget", "cookie-popover")
  popoverCloseButton.setAttribute("popovertargetaction", "hide")
  popoverCloseButton.textContent = "Fermer"

  footer.appendChild(button)
  popoverClose.appendChild(popoverCloseButton)
  popover.appendChild(popoverClose)
  popover.appendChild(popoverTitle)
  popover.appendChild(popoverIntro)
  popover.appendChild(popoverReview)
  popover.appendChild(cookiesList)
  footer.appendChild(popover)
}

function displayCookiesCount() {
  const nbCookies = document.cookie ? document.cookie.split("; ").length : 0

  if (nbCookies > 0) {
    buildCookieCheck(nbCookies)
  } else {
    const text = document.createElement("p")
    text.textContent = "Aucun cookie"
    footer.appendChild(text)
  }
}

displayCookiesCount()
