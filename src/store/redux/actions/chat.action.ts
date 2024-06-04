import { chatConstant } from "../constants";


export function startChannel() {
    return {
        type: chatConstant.START_CHANNEL
    };
}

export function stopChannel() {
    return {
        type: chatConstant.STOP_CHANNEL
    };
}

export function serverOn() {
    return {
        type: chatConstant.SERVER_ON
    };
}

export function serverOff() {
    return {
        type: chatConstant.SERVER_OFF
    };
}
