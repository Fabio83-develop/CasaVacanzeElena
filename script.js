
i18next
  .use(i18nextHttpBackend)
  .init({
    lng: 'it', // lingua di default
    debug: true,
    backend: {
      // Specifica il percorso dei file JSON; usa i placeholder {{lng}} per la lingua
      loadPath: '/locales/{{lng}}/translation.json'
    },
    interpolation: {
      escapeValue: false
    }
  }, function(err, t) {
    updateContent();
  });

// Funzione che aggiorna tutti gli elementi con attributo data-i18n
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var attr  = el.getAttribute('data-i18n');
    // Se c'è la notazione [attr]key, estrae l'attributo e la chiave
    if (attr.indexOf('[') > -1) {
      // Esempio: "[placeholder]contacts.namePlaceholder"
      var parts = attr.split(']');
      var attribute = parts[0].replace('[', '');
      var key = parts[1].trim();
      el.setAttribute(attribute, i18next.t(key));
    } else {
      // Aggiorna l'HTML per elementi con testo
      el.innerHTML = i18next.t(attr);
    }
  });
}

// Funzione per ottenere il valore di un cookie
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

document.addEventListener('DOMContentLoaded', function () {
  // Aggiorna l'anno corrente nel footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Aggiungi l'event listener per il selettore della lingua
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.addEventListener('change', function() {
      var selectedLang = this.value;
      i18next.changeLanguage(selectedLang, function(err, t) {
        updateContent();
        document.documentElement.lang = selectedLang; // Aggiorna l'attributo lang nel tag <html>
      });
    });
  }

  document.querySelectorAll('nav ul li a').forEach(link => {
    const href = link.getAttribute('href');
    // Se l'href inizia con '#' significa che è un'ancora interna, altrimenti non si applica il preventDefault.
    if (href && href.startsWith('#')) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  console.log("Il sito di Casa Vacanze Elena è caricato e pronto!");

  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    // Se l'href inizia con '#' è un'ancora interna: applica lo scroll fluido.
    if (href && href.startsWith('#')) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    // Altrimenti (se il link è esterno o punta a una pagina diversa) non fare nulla,
    // così il comportamento di default (navigazione) verrà eseguito.
  });

  // Toggle del menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const navMenu = document.querySelector('nav ul');
      navMenu.classList.toggle('active');
    });
  }

  // Chiudiamo il menu al click di ogni link
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function () {
      const navMenu = document.querySelector('nav ul');
      navMenu.classList.remove('active');
    });
  });

  // Funzionalità del pulsante "Torna all'inizio"
  const backToTopBtn = document.getElementById('back-to-top');

  // Mostra o nasconde il pulsante in base allo scroll
  window.addEventListener('scroll', function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  // Scorrimento fluido verso l'inizio al click del pulsante
  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const toggleDettagli = document.getElementById('toggle-dettagli');
  if (toggleDettagli) {
    toggleDettagli.addEventListener('click', function () {
      const dettagli = document.getElementById('dettagli');
      if (dettagli) {
        if (dettagli.style.display === 'none' || dettagli.style.display === '') {
          dettagli.style.display = 'block';
          this.innerHTML = i18next.t('dettagli.buttonHide');
        } else {
          dettagli.style.display = 'none';
          this.innerHTML = i18next.t('dettagli.buttonShow');
        }
      }
    });
  }
  const toggleMuoversi = document.getElementById('toggle-muoversi');
  if (toggleMuoversi) {
    toggleMuoversi.addEventListener('click', function () {
      const muoversiContent = document.getElementById('muoversi-content');
      if (muoversiContent) {
        if (muoversiContent.style.display === 'none' || muoversiContent.style.display === '') {
          muoversiContent.style.display = 'block';
          //this.textContent = 'Nascondi dettagli';
          this.innerHTML = i18next.t('contacts.buttonHide');
        } else {
          muoversiContent.style.display = 'none';
          //this.textContent = 'Scopri come muoversi in zona';
          this.innerHTML = i18next.t('contacts.toggleHowToReach');
        }
      }
    });
  }

  if (getCookie("cookieConsent") !== "true") {
    document.getElementById("cookie-banner").style.display = "block";
  } else {
    document.getElementById("cookie-banner").style.display = "none";
  }

  // Funzione per accettare i cookies
  function acceptCookies() {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 anno
    const expires = "expires=" + d.toUTCString();
    // Imposta il cookie di consenso per un anno
    document.cookie = "cookieConsent=true; " + expires + "; path=/";
    document.getElementById("cookie-banner").style.display = "none";
  }
  window.acceptCookies = acceptCookies;

  // Funzione per aprire le impostazioni dei cookies (puoi espandere questa funzione)
  function openCookieSettings() {
    alert("Qui potrai personalizzare le impostazioni dei cookie.");
    // Qui potresti mostrare un modal o una sezione con ulteriori opzioni
  }

  window.openCookieSettings = openCookieSettings;

  // Funzione per mostrare la modale
  function showModal(message, isSuccess) {
    // Seleziono gli elementi
    const modal = document.getElementById("form-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalIcon = document.getElementById("modal-icon");

    // Imposto testo
    modalMessage.textContent = message;

    // Svuoto eventuali classi precedenti dell’icona
    modalIcon.className = "modal-icon";

    // Se isSuccess è true, icona verde con check
    // altrimenti icona rossa con X
    if (isSuccess) {
      modalIcon.classList.add("success");
      modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
      modalIcon.classList.add("error");
      modalIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    }

    // Mostro la modale
    modal.classList.remove("hidden");
  }

  // Funzione per nascondere la modale
  function hideModal() {
    const modal = document.getElementById("form-modal");
    modal.classList.add("hidden");
  }

  // Chiudi la modale al click sulla X
  const modalClose = document.getElementById("modal-close");
  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  // FORM
  const form = document.querySelector("form"); 
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        // Se OK -> apri modale di SUCCESSO
        if (response.ok) {
          showModal("Grazie! La tua richiesta è stata inviata.", true);
          form.reset();
        } else {
          showModal("Errore nell'invio del modulo, riprova.", false);
        }
      } catch (error) {
        showModal("Errore, riprova più tardi.", false);
      }
    });
  }

});
