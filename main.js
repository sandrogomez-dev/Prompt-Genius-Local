async function init() {
  const status = document.querySelector("#status");
  const responseBox = document.querySelector("#response");
  const input = document.querySelector("#userInput");
  const askBtn = document.querySelector("#ask");

  status.innerHTML = "🔮 Comprobando si el Genio aparece...";

  try {
    const avail = await LanguageModel.availability();

    if (avail === "unavailable") {
      status.innerHTML = "🔮 Lo siento el Genio, esta durmiendo...💤";

      return;
    }

    const session = await LanguageModel.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          status.innerHTML = "⬇️Descargando Magia: " + e.loaded * 100 + "%";
        });
      },
    });

    status.innerHTML = "El genio esta preparado, pidele algo...💡";

    askBtn.addEventListener("click", async () => {
      const question = input.value.trim();

      if (!question) {
        status.innerHTML = "Al Genio, le falta tu pregunta...❓";
        input.focus();
        return;
      }

      status.innerHTML = "El Genio, esta pensando...🚚";
      responseBox.textContent = "";

      try {
        const result = await session.prompt(question);

        responseBox.textContent = result;

        status.innerHTML = "Deseo Concedido.";
        input.focus();
      } catch (error) {
        status.innerHTML = "El genio se a equivocado...❌";
        responseBox.textContent = "";
      } finally {
        input.focus();
      }
    });
  } catch (error) {
    status.innerHTML = "🔮 El genio esta cansado, intentalo mas tarde...❌";
    console.log(error);
  }
}

init();
