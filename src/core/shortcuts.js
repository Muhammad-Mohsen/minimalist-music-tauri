(function () {

	const SELF = EventBus.target.KEYBOARD;

	Native.shortcut.register('Space', () => EventBus.dispatch({ type: EventBus.type.PLAY_PAUSE, target: SELF }));
	Native.shortcut.register('0', () => EventBus.dispatch({ type: EventBus.type.FROM_THE_TOP, target: SELF }));
	// Native.shortcut.register('Numpad0', () => EventBus.dispatch({ type: EventBus.type.FROM_THE_TOP, target: SELF })); // DOESN'T WORK
	Native.shortcut.register('ArrowLeft', () => EventBus.dispatch({ type: EventBus.type.RW, target: SELF }));
	Native.shortcut.register('ArrowRight', () => EventBus.dispatch({ type: EventBus.type.FF, target: SELF }));
	Native.shortcut.register('Ctrl+ArrowLeft', () => EventBus.dispatch({ type: EventBus.type.PLAY_PREV, target: SELF }));
	Native.shortcut.register('Ctrl+ArrowRight', () => EventBus.dispatch({ type: EventBus.type.PLAY_NEXT, target: SELF }));

})();
