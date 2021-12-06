const paintCanvas = document.querySelector('.blob');
const smoothness = document.querySelector('#smoothness');
const variance = document.querySelector('#variance');
const points = document.querySelector('#num-points');
const fill = document.querySelector('#fill');

function updateBlobProps(target, value){
  paintCanvas.style.setProperty(`--blob-${target}`, value);
}

smoothness.addEventListener('change', (event) => {
   event.preventDefault();
   updateBlobProps(event.target.id, event.target.value)
  });

variance.addEventListener('change', (event) => {
  event.preventDefault();
  updateBlobProps(event.target.id, event.target.value)
});

points.addEventListener('change', (event) => {
  event.preventDefault();
  updateBlobProps(event.target.id, event.target.value)
});

fill.addEventListener('change', (event) => {
  event.preventDefault();
  updateBlobProps(event.target.id, event.target.value)
});

updateBlobProps('seed', Math.random() * 10000);

if (CSS["paintWorklet"] !== undefined) {
  CSS.paintWorklet.addModule("./bloblet.bundle.js");
}