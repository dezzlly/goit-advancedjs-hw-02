import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("#promise-form");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(form);
  const delay = Number(formData.get("delay"));
  const state = formData.get("state"); 

  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.warning({
      title: "Увага",
      message: "Вкажіть коректну затримку (0 або більше мілісекунд).",
      position: "topRight",
    });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then((d) => {
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${d}ms`,
        position: "topRight",
        timeout: 4000,
      });
    })
    .catch((d) => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${d}ms`,
        position: "topRight",
        timeout: 4000,
      });
    });
});
