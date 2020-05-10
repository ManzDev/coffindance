import { Howl } from "howler";
import mp3 from "./assets/astronomia-*.mp3";
import images from "./assets/bg-*.gif";
import sfx from "./assets/sfx.mp3";
import noise from "./assets/noise.gif";
import pallbearerImage from "./assets/pallbearer.png";
import authors from "./assets/authors.json";

const names = ["original", "medieval", "metal", "sad", "synthwave", "cumbia"];
const classes = ["", "", "veryfast", "still", "fast", "slow"];

const preloadImage = (image) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = image;
  link.as = "image";
  document.head.appendChild(link);
};

class Song {
  constructor() {
    this.currentSong = "original";

    this.songs = {};
    this.sfx = new Howl({ src: [sfx], volume: 4, onend: () => this.change() });
    names.forEach((name) => {
      this.songs[name] = new Howl({ src: [mp3[name]], loop: true });
      preloadImage(images[name]);
    });
    preloadImage(noise);
    preloadImage(pallbearerImage);
  }

  play() {
    this.songs[this.currentSong].play();
    const time = 5000 + Math.floor(Math.random() * 30000);
    this.timer = setTimeout(() => this.interference(), time);
  }

  stopAll() {
    Object.keys(this.songs).forEach((key) => this.songs[key].pause());
  }

  interference() {
    pallbearer.hidden = true;
    room.style.backgroundImage = `url(${noise})`;
    this.sfx.play();
    clearTimeout(this.timer);
  }

  change() {
    let n;
    do {
      n = Math.floor(Math.random() * names.length);
    } while (this.currentSong == names[n]);
    this.currentSong = names[n];
    pallbearer.hidden = false;

    this.stopAll();
    this.play();
    pallbearer.className = `pallbearer ${classes[n]}`;
    changeCredits(n);
    changeBackgroundImage(this.currentSong);
  }
}

const room = document.querySelector(".room");
const pallbearer = document.querySelector(".pallbearer");
const startButton = document.querySelector(".start");
const credits = document.querySelector(".credits");
const creditsLink = document.querySelector(".credits p");

const song = new Song();
const changeBackgroundImage = (image) => (room.style.backgroundImage = `url(${images[image]})`);

document.onkeydown = (ev) => {
  if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") song.interference();
};

pallbearer.style.backgroundImage = `url(${pallbearerImage})`;

changeBackgroundImage("original");

const changeCredits = (n) => (creditsLink.innerHTML = `♫ <a href="${authors[n].link}">${authors[n].name}</a>`);

startButton.onclick = () => {
  room.hidden = false;
  credits.hidden = false;
  startButton.remove();
  changeCredits(0);
  song.play();
};
