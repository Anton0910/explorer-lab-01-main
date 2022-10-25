import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg>g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg>g g:nth-child(1) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const color = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", color[type][0])
  ccBgColor02.setAttribute("fill", color[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")

const expiratioCodePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}

const expirationCodeMasked = IMask(expirationDate, expiratioCodePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foudMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foudMask)
    return foudMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  console.log("olá")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})
//TROCA DE NOME DO CARTAO
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerHTML =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})
/////////////////////////////////////TROCA DE CODIGO DE SEGURANÇA////////////////////////////////////////////////////////////////
securityCodeMasked.on("accept", ()=>
{
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code)
{
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerHTML = code.length ===0 ? "123" : code
}

///////////////////////////////////////////TROCA DE NUMERO DO CARTAO////////////////////////////////////////////////////////////////
 cardNumberMasked.on("accept",() => {
   const cardType = cardNumberMasked.masked.currentMask.cardtype
   setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
  }
)

function updateCardNumber(code) {
  const ccCardNumber = document.querySelector(".cc-number")
  ccCardNumber.innerHTML = code.length === 0 ? "1234 5678 9012 3456" : code
}
/////////////////////////////TROCA DE DATA DO CARTAO////////////////////////////////////////////////////////////////
expirationCodeMasked.on("accept", () => {
  updateexpirationCode(expirationCodeMasked.value)
})

function updateexpirationCode(code) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerHTML = code.length === 0 ? "02/32" : code
}