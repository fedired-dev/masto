import './public-path';
import ready from '../fedired/ready';

ready(() => {
  const image = document.querySelector<HTMLImageElement>('img');

  if (!image) return;

  image.addEventListener('mouseenter', () => {
    image.src = '/https://raw.githubusercontent.com/fedired-dev/img/refs/heads/main/custom/error.webp';
  });

  image.addEventListener('mouseleave', () => {
    image.src = 'https://raw.githubusercontent.com/fedired-dev/img/refs/heads/main/custom/error.webp';
  });
}).catch((e: unknown) => {
  console.error(e);
});
