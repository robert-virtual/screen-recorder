const stopScreen = document.getElementById("stopSharing");
const seleccionar = document.getElementById("seleccionar");
// const cambiar = document.getElementById("cambiar");
const grabar = document.getElementById("grabar");
const detener = document.getElementById("detener");
const preview = document.getElementById("preview");
//
const savePanel = document.getElementById("save-panel");
const guardar = document.getElementById("guardar");
const result = document.getElementById("result");
const cancelar = document.getElementById("cancelar");
//
let screenStream = new MediaStream();
let audioStream = new MediaStream();

function record(
  screenStream = new MediaStream(),
  audioStream = new MediaStream()
) {
  const stream = new MediaStream([
    ...screenStream.getTracks(),
    ...audioStream.getTracks(),
  ]);
  const options = { mimeType: "video/webm" };
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(stream, options);
  console.log(mediaRecorder);
  mediaRecorder.addEventListener("dataavailable", function ({ data }) {
    if (data.size > 0) recordedChunks.push(data);
  });

  mediaRecorder.addEventListener("stop", () => {
    guardar.href = URL.createObjectURL(new Blob(recordedChunks));
    guardar.download = `${new Date().toISOString()}.webm`;
    result.src = guardar.href;
  });

  detener.addEventListener("click", () => {
    if (mediaRecorder.state == "recording") {
      mediaRecorder.stop();
    }
    console.log("recorder stop:", mediaRecorder.state);
  });

  mediaRecorder.start();
  console.log("Grabando, estado:", mediaRecorder.state);
}

function showPreview(stream) {
  preview.srcObject = stream;
  preview.classList.remove("d-none");
  preview.play();
}

seleccionar.addEventListener("click", async () => {
  try {
    stopSharing(screenStream);
    stopSharing(audioStream);
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    stopScreen.addEventListener("click", () => {
      stopSharing(screenStream);
      stopSharing(audioStream);
    });
    showPreview(screenStream);
    mostrarBtnGrabar();

    grabar.addEventListener("click", () => record(screenStream, audioStream));
  } catch (error) {
    console.error(error);
  }
});

function stopSharing(stream) {
  stream.getTracks().forEach((track) => track.stop());
}

// mostar/esconder botones

function mostrarBtnGrabar() {
  grabar.classList.remove("d-none");
  seleccionar.classList.add("d-none");
  stopScreen.classList.remove("d-none");
}

grabar.addEventListener("click", () => {
  grabar.classList.add("d-none");
  detener.classList.remove("d-none");
  //   seleccionar.classList.add("d-none");
  stopScreen.classList.add("d-none");
});

detener.addEventListener("click", () => {
  //   grabar.classList.remove("d-none");
  detener.classList.add("d-none");
  savePanel.classList.remove("d-none");
});

guardar.addEventListener("click", () => {
  savePanel.classList.add("d-none");
  grabar.classList.remove("d-none");
  //   seleccionar.classList.remove("d-none");
  stopScreen.classList.remove("d-none");
});

cancelar.addEventListener("click", () => {
  savePanel.classList.add("d-none");
  grabar.classList.remove("d-none");
  //   seleccionar.classList.remove("d-none");
  stopScreen.classList.remove("d-none");
});

stopScreen.addEventListener("click", () => {
  stopScreen.classList.add("d-none");
  seleccionar.classList.remove("d-none");
  preview.classList.add("d-none");
  grabar.classList.add("d-none");
});
