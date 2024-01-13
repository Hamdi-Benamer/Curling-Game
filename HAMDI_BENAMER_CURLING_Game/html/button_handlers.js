const socket = io('http://' + window.document.location.host);

function setButtonState(buttonId, disabled) {
    const btn = document.getElementById(buttonId);
    Object.assign(btn, { disabled, style: { backgroundColor: disabled ? 'lightgray' : '' } });
}

function configureButtonListener(buttonId, message) {
    let isButtonDisabled = false;

function handleReceivedMessage(msg) {
    if (msg === message && !isButtonDisabled) {
        setButtonState(buttonId, true);
        if (socket.buttonId === buttonId) {
            showPopup(message);
        }
        isButtonDisabled = true;
    }
}


    function handleButtonAvailability(availability) {
        setButtonState(buttonId, !availability[buttonId]);
    }

    function handleButtonClick() {
        console.log(`handle${buttonId}()`);
        socket.emit('sending', message);
    
        const buttonHandlers = {
            'JoinAsHomeButton': () => {
                if (!isHomePlayerAssigned) {
                    isHomePlayerAssigned = true;
                    isHomeClient = true;
                }
            },
            'JoinAsVisitorButton': () => {
                if (!isVisitorPlayerAssigned) {
                    isVisitorPlayerAssigned = true;
                    isVisitorClient = true;
                    socket.emit('buttonAvailability', { [buttonId]: false });
                }
            },
            'JoinAsSpectatorButton': () => {
                if (!isSpectatorClient) {
                    const btnSpectator = document.getElementById("JoinAsSpectatorButton");
                    setButtonState('JoinAsSpectatorButton', true);
                    isSpectatorClient = true;
                    socket.emit('updateLocations');
                }
            }
        };
    
        const handleButton = buttonHandlers[buttonId];
        if (handleButton) {
            handleButton();
        }
    }
    

    socket.on('Recieved', handleReceivedMessage);
    socket.on('buttonAvailability', handleButtonAvailability);
    socket.on('updateLocations', () => drawCanvas());

    return handleButtonClick;
}

// Usage
const handleJoinAsHomeButton = configureButtonListener('JoinAsHomeButton', 'Disable Home');
const handleJoinAsVisitorButton = configureButtonListener('JoinAsVisitorButton', 'Disable Visitor');
const handleJoinAsSpectatorButton = configureButtonListener('JoinAsSpectatorButton', 'Disable Spectator');
