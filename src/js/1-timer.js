import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked) {
      refs.startBtn.disabled = true;
      return;
    }

    if (picked <= new Date()) {
      refs.startBtn.disabled = true;
      iziToast.error({
        title: "Invalid date",
        message: "Please choose a date in the future",
        position: "topRight",
        timeout: 3000,
      });
    } else {
      userSelectedDate = picked;
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.input, options);

refs.startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  clearInterval(timerId);
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  tick();

  timerId = setInterval(tick, 1000);
});

function tick() {
  const now = new Date();
  const msLeft = userSelectedDate - now;

  if (msLeft <= 0) {
    clearInterval(timerId);
    updateTimerUI(convertMs(0));
    refs.input.disabled = false;
    refs.startBtn.disabled = true;

    iziToast.success({
      title: "Done",
      message: "Countdown finished.",
      position: "topRight",
      timeout: 2500,
    });
    return;
  }

  updateTimerUI(convertMs(msLeft));
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days).padStart(2, "0");
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}