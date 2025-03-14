let currentSong = new Audio()
let songs;
let currFolder;
function formatTimeFromSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"

  }
  let roundedSeconds = Math.floor(seconds); // Remove decimal part
  let minutes = Math.floor(roundedSeconds / 60);
  let secs = roundedSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
   songs = []

  for (let index = 0; index < as.length; index++) {
    const element = as[index]
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
  
  <img class="bc" src="music-note-03-stroke-standard.svg" alt="">
  <div class="info">
    <div> ${song.replaceAll("%20", " ")}</div>
    <div> Shashank </div>
  </div>
  <div class="playnow">
    <span class="Iam">Play now</span>
    <img class="hero" width="34px" src="anoplayer.svg" alt="">
  </div>
 
    
  
  
  
  </li>`

  }
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })

  })
  
  


}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currFolder}/` + track
  if (!pause) {

    currentSong.play()
    play.src = "pause.svg"

  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.getElementById("myH2").style.color = "white";
  document.querySelector(".timeline").innerHTML = "00:00 / 00:00"
  document.getElementById("myP").style.color = "magenta";
  
 

}
async function main() {

  // This is to get the list fo all songs

  await getsongs("songs/ncs")
  playMusic(songs[0], true)
  console.log(songs)
  
  // Attach an event listener to previous and next button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "player.svg"
    }
  })



  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".timeline").innerHTML = `${formatTimeFromSeconds(currentSong.currentTime)} / ${formatTimeFromSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
  })

  // Putting seek to seekbar
  document.querySelector(".seek").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  // Add an event listener to hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"

  })
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"


  })


  previous.addEventListener("click", () => {
    console.log("Previous clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

    console.log(songs, index)
    if ((index - 1) >= 0) {

      playMusic(songs[index - 1])
    }
  })

  next.addEventListener("click", () => {
    console.log("Next clicked")
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

    console.log(songs, index)
    if ((index + 1) < songs.length) {

      playMusic(songs[index + 1])
    }


  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
    console.log(e ,e.target , e.target.value)
    currentSong.volume = parseInt(e.target.value)/100
  })
  Array.from(document.getElementsByClassName("carded")).forEach(e=>{
    
    e.addEventListener("click" ,async item=>{
      console.log(item, item.currentTarget.dataset)
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      
    })
  })


}


main()

