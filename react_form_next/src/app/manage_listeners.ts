import { EventListenerObjParam, EventStore } from '@/types/interfaces';
import { useRef } from 'react';

export default function useManageListeners() {
    const listenerRef = useRef({});
    const eventStore: EventStore = listenerRef.current;

    function addListeners(listeners: EventListenerObjParam[]): void {
        for (let listener of listeners) {
            document.addEventListener(listener.eventType, listener.callback, listener.useCapture);
            eventStore[listener.name] = {eventType: listener.eventType, callback: listener.callback, useCapture: listener.useCapture};
        }
    }
    function removeListeners(listenerNames: string[]): void {
        for (let listenerName of listenerNames) {
            if (!(listenerName in eventStore)) {
                throw new ReferenceError(`Property "${listenerName}" does not exist on object listenerRef.current`);
            }
            const listenerProps = eventStore[listenerName];
            document.removeEventListener(listenerProps.eventType, listenerProps.callback, listenerProps.useCapture);
            delete eventStore[listenerName];
        }
    }
    return [addListeners, removeListeners] as const;
}