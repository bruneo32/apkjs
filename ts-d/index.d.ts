// Type definitions for AndroidJS Interface 1.0.0
// Project: https://github.com/bruneo32/AndroidJS
// Definitions: https://github.com/bruneo32/AndroidJS/tree/main/ts-d
// TypeScript Version: 2.1


export = Android;


/**
 * AndroidJS JSInterface
 */
declare namespace Android {

	/* FUNCTIONS
	======================== */

	/**
	 * Return the current Activity Object
	 */
	function getActivity(): Activity;

	/**
	 * Return the device locale language-country.
	 * Example: "en-US", "en-GB", "es-ES"
	 */
	function getLocale(): string;

	/**
	 * Display a Toast message.
	 * A toast provides simple feedback about an operation in a small popup.
	 * It only fills the amount of space required for the message and the current activity remains visible and interactive.
	 * Toasts automatically disappear after a timeout.
	 * @param message Message to display
	 * @param duration Duration of the toast
	 */
	function showToast(message: string, duration: 0 | 1): void;

	/**
	 * Display a message prompt with
	 * @param title Message title
	 * @param body Message body
	 */
	function showMessage(title: string, body: string): void;

	/**
	 * Display an error message and close the Application
	 * @param title Message title
	 * @param body Message body
	 */
	function showError(title: string, body: string): void;

	function getMsgOptions(): MsgOptions;
	function setMsgOptions(options: MsgOptions): void;

	/**
	 * Returns the current screen orientation
	 */
	function getOrientation(): ScreenOrientation;

	/**
	 * Sets the orientation to follow
	 * @param orientation
	 */
	function setOrientation(orientation: ScreenOrientation): void;

	/**
	 * Set the state of the fullscreen
	 * @param state State to set (If true, FULLSCREEN, else NO_FULLSCREEN)
	 */
	function showFullscreen(state: boolean): void;

	/**
	 * Returns true if app is in fullscreen mode, otherwise false
	 */
	function isFullscreen(): boolean;

	/**
	 * Set the visibility of the ActionBar
	 * (Only NO_FULLSCREEN mode)
	 *
	 * @param state State to set (If true, VISIBLE, else HIDEN)
	 */
	function showActionBar(state: boolean): void;

	/**
	 * Return the visibility state of the ActionBar
	 */
	function getActionBarVisibility(): boolean;



	/* TYPES
	======================== */

	type Activity = any;

	/**
	 * Options of app messages in general
	 */
	interface MsgOptions {
		msgTitle: string
	}


	/**
	 * Show the view or text notification for a short period of time.
	 */
	const TOAST_SHORT = 0;

	/**
	 * Show the view or text notification for a long period of time.
	 */
	const TOAST_LONG = 1;


	const enum ScreenOrientation {
		/**
		 * No preference specified: let the system decide the best orientation. This will either be the orientation selected by the activity below, or the user's preferred orientation if this activity is the bottom of a task. If the user explicitly turned off sensor based orientation through settings sensor based device rotation will be ignored. If not by default sensor based orientation will be taken into account and the orientation will changed based on how the user rotates the device.
		 */
		UNSPECIFIED = -1,

		/**
		 * Would like to have the screen in a landscape orientation: that is, with the display wider than it is tall, ignoring sensor data.
		 */
		LANDSCAPE = 0,

		/**
		 * Would like to have the screen in a portrait orientation: that is, with the display taller than it is wide, ignoring sensor data.
		 */
		PORTRAIT,

		/**
		 * Use the user's current preferred orientation of the handset.
		 */
		USER,

		/**
		 * Keep the screen in the same orientation as whatever is behind this activity.
		 */
		BEHIND,

		/**
		 * Orientation is determined by a physical orientation sensor: the display will rotate based on how the user moves the device. Ignores user's setting to turn off sensor-based rotation.
		 */
		SENSOR,

		/**
		 * Always ignore orientation determined by orientation sensor: the display will not rotate when the user moves the device.
		 */
		NOSENSOR,

		/**
		 * Would like to have the screen in landscape orientation, but can use the sensor to change which direction the screen is facing.
		 */
		SENSOR_LANDSCAPE,

		/**
		 * Would like to have the screen in portrait orientation, but can use the sensor to change which direction the screen is facing.
		 */
		SENSOR_PORTRAIT,

		/**
		 * Would like to have the screen in landscape orientation, turned in the opposite direction from normal landscape.
		 */
		REVERSE_LANDSCAPE,

		/**
		 * Would like to have the screen in portrait orientation, turned in the opposite direction from normal portrait.
		 */
		REVERSE_PORTRAIT,

		/**
		 * Orientation is determined by a physical orientation sensor: the display will rotate based on how the user moves the device. This allows any of the 4 possible rotations, regardless of what the device will normally do (for example some devices won't normally use 180 degree rotation).
		 */
		FULL_SENSOR,

		/**
		 * Would like to have the screen in landscape orientation, but if the user has enabled sensor-based rotation then we can use the sensor to change which direction the screen is facing.
		 */
		USER_LANDSCAPE,

		/**
		 * Would like to have the screen in portrait orientation, but if the user has enabled sensor-based rotation then we can use the sensor to change which direction the screen is facing.
		 */
		USER_PORTRAIT,

		/**
		 * Respect the user's sensor-based rotation preference, but if sensor-based rotation is enabled then allow the screen to rotate in all 4 possible directions regardless of what the device will normally do (for example some devices won't normally use 180 degree rotation).
		 */
		FULL_USER,

		/**
		 * Screen is locked to its current rotation, whatever that is.
		 */
		LOCKED
	}
}
