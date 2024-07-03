// ########### NETWORK SPEED TEST ###################

//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
const imageAddr = "https://images.pexels.com/photos/26049751/pexels-photo-26049751/free-photo-of-a-black-and-white-photo-of-a-kangaroo-standing-in-the-grass.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const downloadSize = 7300000; //bytes

function ShowProgressMessage(msg) {
    if (console) {
        if (typeof msg == "string") {
            console.log(msg);
        } else {
            for (var i = 0; i < msg.length; i++) {
                console.log(msg[i]);
            }
        }
    }

    const oProgress = document.getElementById("progress");
    if (oProgress) {
        oProgress.innerHTML = (typeof msg == "string") ? msg : msg.join("<br />");
    }
}

export function InitiateSpeedDetection() {
    ShowProgressMessage("Checking network speed, please wait...");
    window.setTimeout(MeasureConnectionSpeed, 1);
}

function MeasureConnectionSpeed() {
    let startTime, endTime;
    const download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }

    download.onerror = function (err, msg) {
        ShowProgressMessage("Error while checking network speed");
    }

    startTime = (new Date()).getTime();
    const cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;

    function showResults() {
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = downloadSize * 8;
        const speedBps = (bitsLoaded / duration).toFixed(2);
        const speedKbps = (speedBps / 1024).toFixed(2);
        const speedMbps = (speedKbps / 1024).toFixed(2);
        ShowProgressMessage([
            "Your network speed is:",
            speedBps + " bps",
            speedKbps + " kbps",
            speedMbps + " Mbps"
        ]);
    }
}

// ##############################