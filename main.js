const socket = io('http://localhost:3100/');

// HuynhPVd tạo kết nối video 
function openStream() {
    const config = {audio : true, video : true};
    return navigator.mediaDevices.getUserMedia(config);
}
// HuynhPVd đưa video lên web 
function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream("localStream",stream));

var peer = new Peer({key: 'peerjs', host: 'mypeer0107.herokuapp.com', secure: true, port: 443});
peer.on('open', function(id) {
    $('#my_peer').append(id);
});

//Caller
$('#buttonCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#buttonCreatPass').click(() => {
    const pass = $('#creatPassWord').val();
    socket.emit('passCaller' , pass);
    console.log(pass);
})
