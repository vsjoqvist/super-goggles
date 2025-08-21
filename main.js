window.onload = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // initial sizing

  init(ctx, canvas);
};
