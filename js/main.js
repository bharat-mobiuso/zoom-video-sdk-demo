import {InitiateSpeedDetection} from "./speed-test.js";
import uitoolkit from '@zoom/videosdk-ui-toolkit';
import '@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css';
import {generateSignature} from "../backend.js";
import {asyncHandler} from "./asyncHandler.js";

const ZoomVideo = window.WebVideoSDK.default;
ZoomVideo.preloadDependentAssets();

// const VideoQuality = window.VideoQuality;

const sessionContainer = document.getElementById('sessionContainer');

let topic = "SomeTopicName";
let role = 1;
let token = 'jwt';
let username = `User-${new Date().getTime().toString().slice(6)}`;

const client = ZoomVideo.createClient();
await client.init("en-US", "Global", {patchJsMedia: true});

const config = {
    videoSDKJWT: '',
    sessionName: 'SessionA',
    userName: 'UserA',
    sessionPasscode: 'abc123',
    features: ['video', 'audio', 'share', 'chat', 'users', 'settings', 'view']
};

let isPreviewOpen = false;

const startBtn = document.querySelector("#start-btn");
const previewContainer = document.getElementById('previewContainer');
const messageContainer = document.getElementById('messageContainer');

// Not in use as using zoom video ui toolkit
// const toggleVideoBtn = document.querySelector("#toggle-video-btn");
// const viewPreviewBtn = document.querySelector("#view-preview-btn");

const startCall = async () => {
    // client.on("peer-video-state-change", renderVideo);

    await client.join(topic, token, username);

    config.videoSDKJWT = token;
    config.sessionName = topic;
    config.userName = '-';
    console.log('Config', config)
    console.log('TOKEN', token)

    uitoolkit.joinSession(sessionContainer, config)

    attachSessionHandler();


    client.on('user-added', (payload) => {
        console.log(payload + ' joined the session')
    })

    client.on('user-removed', (payload) => {
        console.log(payload + ' left the session')
    })

    client.on('user-left', (payload) => {
        console.log(payload + ' left the session')
    })

    client.on('user-updated', (payload) => {
        console.log(payload + ' properties were updated')
    })

    client.on('video-active-change', (payload) => {
        console.log(payload, ' video-active-change')
    })

    client.on('active-speaker', (payload) => {
        console.log(payload, ' active-speaker')
    })

    client.on('host-ask-unmute-audio', (payload) => {
        console.log(payload, ' host-ask-unmute-audio')
    })

    client.on('current-audio-change', (payload) => {
        console.log(payload, ' current-audio-change')
    })

    client.on('current-audio-change', (payload) => {
        console.log(payload, ' current-audio-change')
    })


    client.on('connection-change', (payload) => {
        if (payload.state === 'Closed') {
            // the session ended by the host or the SDK kicked the user from the session (use payload.reason to see why the SDK kicked the user)
            console.log(payload, 'CLOSED:: the session ended by the host or the SDK kicked the user from the session (use payload.reason to see why the SDK kicked the user)')
        } else if (payload.state === 'Reconnecting') {
            // the client side has lost connection with the server (like when driving through a tunnel)
            // will try to reconnect for a few minutes
            console.log(payload, 'Reconnecting:: the client side has lost connection with the server (like when driving through a tunnel) // will try to reconnect for a few minutes')
        } else if (payload.state === 'Connected') {
            // SDK reconnected the session after a reconnecting state
            console.log(payload, 'Connected:: SDK reconnected the session after a reconnecting state')
        } else if (payload.state === 'Fail') {
            // session failed to reconnect after a few minutes
            // user flushed from Zoom Video SDK session
            console.log(payload, 'Fail:: session failed to reconnect after a few minutes // user flushed from Zoom Video SDK session');

            // show an error component
            displayMessage(`Oops, Something went wrong!`, payload.reason);
        }
    })


    // await renderVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
}

// renderVideo - Not in use as using zoom video ui toolkit
// const renderVideo = async (event) => {
//   const mediaStream = client.getMediaStream();
//   if (event.action === 'Start') {
//     const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_360P);
//
// const personNode = document.getElementById(event.userId);
//
// if (personNode) {
//   personNode.appendChild(userVideo);
//   return;
// }
//
// const personDiv = document.createElement("div");
// personDiv.setAttribute('id', `parent-${event.userId}`);
// personDiv.classList.add("person");
// personDiv.classList.add("border-round");
//
// const nameHeading = document.createElement("h3");
// nameHeading.classList.add("margin-0");
// nameHeading.classList.add("padding-0");
// nameHeading.textContent = event.userId;
//
// const indicatorDiv = document.createElement("div");
// indicatorDiv.classList.add("indicator");
// const micDiv = document.createElement("p");
// micDiv.classList.add("mic");
// micDiv.classList.add("margin-0");
// micDiv.classList.add("padding-0");
//
// micDiv.textContent = 'Unmute'
//
// let personInfoDiv = document.createElement("div");
// personInfoDiv.classList.add("person-info");
// personInfoDiv.classList.add("border-round");
//
// indicatorDiv.appendChild(micDiv);
// personInfoDiv.appendChild(indicatorDiv);
// personInfoDiv.appendChild(nameHeading);
//
// let videoDiv = document.createElement("div");
// videoDiv.setAttribute('id', event.userId);
// videoDiv.classList.add("video-container");
// videoDiv.appendChild(userVideo);
//
// personDiv.appendChild(personInfoDiv);
// personDiv.appendChild(videoDiv);
//
// videoContainer.appendChild(personDiv);
// } else {
//   const element = await mediaStream.detachVideo(event.userId);
//   Array.isArray(element) ? element.forEach((el) => el.remove()) : element.remove();
// }
// };

// toggleVideo - Not in use as using zoom video ui toolkit
// const toggleVideo = async () => {
//   const mediaStream = client.getMediaStream();
//   if (mediaStream.isCapturingVideo()) {
//     await mediaStream.stopVideo();
//     await renderVideo({ action: 'Stop', userId: client.getCurrentUserInfo().userId });
//   } else {
//     await mediaStream.startVideo();
//     await renderVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
//   }
// };

// leaveCall - Not in use as using zoom video ui toolkit
// const leaveCall = async () => {
//     client.off("peer-video-state-change", renderVideo);
//     const mediaStream = client.getMediaStream();
//     for (const user of client.getAllUser()) {
//         const element = await mediaStream.detachVideo(user.userId);
//         Array.isArray(element) ? element.forEach((el) => el.remove()) : element.remove();
//         const personNode = document.querySelector(`#parent-${user.userId}`);
//         if (personNode) {
//             personNode.remove();
//         }
//     }
//     console.log(client.getAllUser())
//     await client.leave();
// }

const startCallListener = asyncHandler(async () => {
    uitoolkit.closePreview(previewContainer);
    // viewPreviewBtn.textContent = 'View Preview';
    // viewPreviewBtn.style.display = 'none';

    startBtn.innerHTML = "Connecting...";
    startBtn.disabled = true;
    await startCall();
    startBtn.innerHTML = "Connected";
    startBtn.style.display = "none";
    // stopBtn.style.display = "block";
    // toggleVideoBtn.style.display = "block";
}, displayMessage);

// stopCallListener - Not in use as using zoom video ui toolkit
// const stopCallListener = async () => {
//   toggleVideoBtn.style.display = "none";
//   await leaveCall();
//   stopBtn.style.display = "none";
//   startBtn.style.display = "block";
//   startBtn.innerHTML = "Join";
//   startBtn.disabled = false;
// }

// previewListener - Not in use as using zoom video ui toolkit
// const previewListener = async () => {
//     isPreviewOpen = !isPreviewOpen;
//
//     if (isPreviewOpen) {
//         viewPreviewBtn.textContent = 'View Preview';
//         uitoolkit.closePreview(previewContainer)
//     } else {
//         viewPreviewBtn.textContent = 'Close Preview';
//         uitoolkit.openPreview(previewContainer)
//     }
// }

startBtn.addEventListener("click", startCallListener);

// Not in use as using zoom video ui toolkit
// stopBtn.addEventListener("click", stopCallListener);
// viewPreviewBtn.addEventListener("click", previewListener);

const onSessionJoined = (event) => {
    console.log(event, "ON SESSION JOINED")
}

const onSessionClosed = (event) => {
    console.log(event, "ON SESSION CLOSED");

    // show call ended text
    displayMessage('This call has ended', '');

    // unsubscribe events
    uitoolkit.offSessionJoined(onSessionJoined)
    uitoolkit.offSessionClosed(onSessionClosed)

    ZoomVideo.destroyClient();
}

function attachSessionHandler() {
    uitoolkit.onSessionJoined(onSessionJoined);
    uitoolkit.onSessionClosed(onSessionClosed);
}

function displayMessage(heading = 'Oops, Something went wrong!', description = '') {
    console.log(messageContainer.childNodes)
    messageContainer.childNodes[1].textContent = heading;
    messageContainer.childNodes[3].textContent = description;
    messageContainer.style = "display: block !important;";

    startBtn.disabled = true;
    startBtn.style.display = "none";
    previewContainer.style.display = "none";
    sessionContainer.style.display = "none";
}

async function extractMeetingDetailsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const topicNameFromUrl = urlParams.get('topicName');
    const usernameFromUrl = urlParams.get('username');

    if (window.location.pathname === '/zoom/getToken') {
        const roleFromUrl = urlParams.get('role') === '1' ? 1 : 0;

        const tokenFromUrl = generateSignature(topicNameFromUrl, roleFromUrl);

        topic = topicNameFromUrl;
        token = tokenFromUrl;
        username = usernameFromUrl;

        console.log('JOIN_URL :: ', `${window.location.origin}?topicName=${topic}&token=${token}&username=${username}`)
    } else {
        const tokenFromUrl = urlParams.get('token');

        topic = topicNameFromUrl;
        token = tokenFromUrl;
        username = usernameFromUrl
    }

    if (!(topic && token && username)) {
        alert('Invalid Link, missing required parameters');
        return;
    }

    uitoolkit.openPreview(previewContainer)
}

const onUnload = (event) => {
    const confirmationMessage = "tab close";

    client.leave(true)
        .catch((error) => {
            console.error('ERROR', error)
        });


    (event || window.event).returnValue = confirmationMessage;     //Gecko + IE
    return confirmationMessage;                                //Webkit, Safari, Chrome etc.
}

if (window.addEventListener) {
    window.addEventListener('load', async () => {
        InitiateSpeedDetection();
        await extractMeetingDetailsFromUrl();
    }, false);

    window.addEventListener('beforeunload', onUnload, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', async () => {
        InitiateSpeedDetection();
        await extractMeetingDetailsFromUrl();
    });

    window.attachEvent('beforeunload', onUnload);
}
