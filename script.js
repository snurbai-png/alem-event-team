const translations = {
    kk: {
        greeting: "Қайырлы күн,",
        name: "Сапар!",
        importantTasks: "Бүгін 3 маңызды тапсырма бар",

        currentEvent: "Ағымдағы іс-шара",
        preparation: "Дайындық деңгейі",

        tasks: "Тапсырмалар",
        waiting: "5 орындау күтуде",

        guests: "Қонақтар",
        confirmed: "Расталған",

        budget: "Бюджет",
        paid: "2% төленген",

        upcomingTasks: "Жақын тапсырмалар",
        all: "Барлығы",

        decoratorMeeting: "Декоратормен кездесу",
        advancePayment: "Площадкаға алдын ала төлем",
        updateGuests: "Қонақтар тізімін жаңарту",

        today: "Бүгін",

        upcomingMeetings: "Жақын кездесулер",
        photographerMeeting: "Фотографпен кездесу",

        home: "Басты бет",
        estimate: "Смета",
        timing: "Тайминг",
        more: "Тағы"
    },

    ru: {
        greeting: "Добрый день,",
        name: "Сапар!",
        importantTasks: "Сегодня 3 важные задачи",

        currentEvent: "Текущее мероприятие",
        preparation: "Уровень готовности",

        tasks: "Задачи",
        waiting: "5 ожидают выполнения",

        guests: "Гости",
        confirmed: "Подтверждено",

        budget: "Бюджет",
        paid: "Оплачено 2%",

        upcomingTasks: "Ближайшие задачи",
        all: "Все",

        decoratorMeeting: "Встреча с декоратором",
        advancePayment: "Предоплата площадки",
        updateGuests: "Обновить список гостей",

        today: "Сегодня",

        upcomingMeetings: "Ближайшие встречи",
        photographerMeeting: "Встреча с фотографом",

        home: "Главная",
        estimate: "Смета",
        timing: "Тайминг",
        more: "Ещё"
    }
};

let currentLanguage = localStorage.getItem("alemLanguage") || "kk";

function changeLanguage(language) {
    currentLanguage = language;
    localStorage.setItem("alemLanguage", language);

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;

        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    document.querySelectorAll(".language-btn").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.lang === language
        );
    });
}

document.addEventListener("DOMContentLoaded", () => {
    changeLanguage(currentLanguage);

    document.querySelectorAll(".language-btn").forEach((button) => {
        button.addEventListener("click", () => {
            changeLanguage(button.dataset.lang);
        });
    });
});

/* ALEM EVENT — Навигация */

document.querySelectorAll(
  ".bottom-nav button"
).forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(
      ".bottom-nav button"
    ).forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const page = button.dataset.page;

    if (page === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    if (page === "tasks") {
      document.querySelector(".tasks")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }

    if (page === "estimate") {
     window.location.href = "estimate.html";
    }

    if (page === "timing") {
      alert("Тайминг бөлімі әзірленуде");
    }

    if (page === "more") {
      alert("Қосымша бөлім әзірленуде");
    }

  });

});

document.querySelectorAll('[data-page="estimate"]').forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "estimate.html";
  });
});
function updateHomeBudget() {
  let events = [];

  try {
    const saved = JSON.parse(
      localStorage.getItem("alemEstimateV1") || "[]"
    );
    events = Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Сметаны оқу қатесі:", error);
  }

  let total = 0;
  let paid = 0;

  events.forEach(event => {
    if (!Array.isArray(event.expenses)) return;

    event.expenses.forEach(expense => {
      total += Number(expense.amount) || 0;
      paid += Number(expense.paid) || 0;
    });
  });

  const percent = total > 0
    ? Math.round((paid / total) * 100)
    : 0;

  const budgetEl = document.getElementById("homeBudget");
  const paidEl = document.getElementById("homePaid");

  if (budgetEl) {
    budgetEl.textContent =
      total.toLocaleString("ru-RU") + " ₸";
  }

  if (paidEl) {
    paidEl.textContent = percent + "% төленген";
  }
}

document.addEventListener("DOMContentLoaded", updateHomeBudget);
function updateHomeTasks() {
  const tasks = JSON.parse(
    localStorage.getItem('alem_tasks') || '[]'
  );

  const total = tasks.length;

  const waiting = tasks.filter(task => !task.done).length;

  const countEl = document.getElementById('homeTaskCount');
  const waitingEl = document.getElementById('homeTaskWaiting');

  if (countEl) {
    countEl.textContent = total;
  }

  if (waitingEl) {
    waitingEl.textContent = currentLanguage === 'ru'
      ? `${waiting} ожидают выполнения`
      : `${waiting} орындалу күтуде`;
  }
}

document.addEventListener('DOMContentLoaded', updateHomeTasks);
function updateUpcomingTasks() {
  const container = document.getElementById('homeUpcomingTasks');
  if (!container) return;

  const tasks = JSON.parse(
    localStorage.getItem('alem_tasks') || '[]'
  );

  const language = localStorage.getItem('alemLanguage') || 'kk';

  const upcoming = tasks
    .filter(task => !task.done)
    .sort((a, b) =>
      new Date(a.date || '9999-12-31') -
      new Date(b.date || '9999-12-31')
    )
    .slice(0, 3);

  container.replaceChildren();

  if (upcoming.length === 0) {
    container.textContent = language === 'ru'
      ? 'Нет предстоящих задач'
      : 'Алдағы тапсырмалар жоқ';
    return;
  }

  upcoming.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task';

    const check = document.createElement('div');
    check.className = 'check';

    const info = document.createElement('div');

    const title = document.createElement('strong');
    title.textContent = task.name;

    const date = document.createElement('p');

    date.textContent = task.date
      ? new Date(task.date).toLocaleString(
          language === 'ru' ? 'ru-RU' : 'kk-KZ'
        )
      : '';

    info.append(title, date);

    const person = document.createElement('div');
    person.className = 'person';
    person.textContent = task.person || '';

    card.append(check, info, person);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', updateUpcomingTasks);
function loadHomeMeetings() {
  const container = document.getElementById('homeUpcomingMeetings');
  if (!container) return;

  let meetings = [];

  try {
    meetings = JSON.parse(
      localStorage.getItem('alem_meetings') || '[]'
    );
    if (!Array.isArray(meetings)) meetings = [];
  } catch (e) {
    meetings = [];
  }

  container.replaceChildren();

  const upcoming = meetings
    .filter(m => m.date && new Date(m.date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (!upcoming.length) {
    container.textContent =
      localStorage.getItem('alemLanguage') === 'ru'
        ? 'Нет предстоящих встреч'
        : 'Алдағы кездесулер жоқ';
    return;
  }

  upcoming.forEach(m => {
    const card = document.createElement('div');
    card.className = 'meeting-card';

    const icon = document.createElement('div');
    icon.className = 'calendar-icon';
    icon.textContent = '▣';

    const info = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = m.name || '';

    const date = document.createElement('p');
    date.textContent = m.date
      ? new Date(m.date).toLocaleString(
          localStorage.getItem('alemLanguage') === 'ru'
            ? 'ru-RU'
            : 'kk-KZ'
        )
      : '';

    info.append(title, date);
    
if (m.address) {
  const address = document.createElement('p');
  address.textContent = '📍 ' + m.address;
  info.appendChild(address);
}

if (m.gisLink && /^https?:\/\//i.test(m.gisLink)) {
  const link = document.createElement('a');
  link.href = m.gisLink;
  link.textContent = '🗺 2GIS арқылы бару →';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  link.style.display = 'inline-block';
  link.style.marginTop = '8px';
  link.style.color = '#FFD700';
  link.style.fontWeight = 'bold';

  info.appendChild(link);
}

    card.append(icon, info);
    container.appendChild(card);
  });
}

loadHomeMeetings();