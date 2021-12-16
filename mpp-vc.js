let mute = true;
MPP.client.sendArray([{ m: "+custom" }]);

window.msgBox = (title, text, html) => {
    new MPP.Notification({
        id: "hri-bot-msg",
        title: title,
        text: text,
        target: "#piano",
        duration: 7000,
        html: html
    });
}

MPP.client.on("ch", () => {
  MPP.client.sendArray([{ m: "custom", data: { m: "userJoinedVC" }, target: { mode: "subscribed", global: false } }]);
})

let a;

let audioIN = { audio: true };

    navigator.mediaDevices.getUserMedia({ audio: true })

      .then(function(mediaStreamObj) {

        document.addEventListener("keypress", evt => {
            if (evt.key == "\\") {
                if (mute == true) {
                    msgBox("Voice Chat", "Voice chat is now enabled.");
                    a = setInterval(() => {
                        let mediaRecorder = new MediaRecorder(mediaStreamObj);
                        mediaRecorder.start();
                        mediaRecorder.ondataavailable = function(ev) {
                            var reader = new FileReader();
                            reader.readAsDataURL(ev.data);
                            reader.onloadend = function() {
                                var base64data = reader.result;
                                MPP.client.sendArray([{ m: "custom", data: { m: "vc", "vcData": base64data.toString() }, target: { mode: "subscribed", global: false } }]);
                            }
                            // if (mediaRecorder.state == "recording") mediaRecorder.stop();
                        }
                        setTimeout(() => {
                            mediaRecorder.stop();
                        }, 1050);
                    }, 1000);
                    mute = false;
                } else if (mute == false) {
                    msgBox("Voice Chat", "Voice chat is now disabled.");
                    clearInterval(a);
                    // mediaRecorder.stop();
                    mute = true;
                }
            }
        });

        let dataArray = [];
      })

      // If any error occurs then handles the error
      .catch(function(err) {
        console.error(err);
      });

        setTimeout(() => {
            MPP.client.sendArray([{m: "+custom"}]);
        }, 3000);

        MPP.client.on("custom", cu => {
            if (cu.p == MPP.client.getOwnParticipant()._id) return;
            let p = Object.values(MPP.client.ppl).find(p => p._id === cu.p);
            if (cu.data.m == "userJoinedVC") {
                var vanishDiv = document.createElement("div");
                vanishDiv.className = "nametag";
                vanishDiv.textContent = 'VC';
                vanishDiv.style.backgroundColor = '#ffff00';
                vanishDiv.id = 'namevanish-' + p._id;
                p.nameDiv.appendChild(vanishDiv);
            }
            // play audio from msg
            if (!('m' in cu)) {
                return;
            }

            let msg = cu.data;

            if (msg.m == "vc") {

                // convert msg.vcData from string to blob
                let audio = new Audio(msg.vcData);

                // play audio when loaded
                audio.addEventListener('loadeddata', () => {
                    audio.play();
                    $(p.nameDiv).addClass("play");
                });

                setTimeout(() => {
                    $(p.nameDiv).removeClass("play");
                }, 5000);
            }
        });
