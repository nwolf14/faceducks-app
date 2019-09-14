import _ from "lodash";


export function getConfig(path: string): any {
  let enviroment = process.env.NODE_ENV;

  if (enviroment === "test") {
    enviroment = "development";
  }
  const config = require(`../config/${enviroment}`).default;

  if (path) {
    return _.get(config, path);
  }
  return config;
}

export const isEnter = (event: React.KeyboardEvent): boolean => event.key === "Enter";

export const fireCallback = (callback: Function, ...props: Array<any>): void => {
  if (typeof callback === "function") {
    callback(...props);
  }
};

export function effectiveDeviceWidth(): number {
  let deviceWidth =
    window.orientation === 0 ? window.screen.width : window.screen.height;
  // iOS returns available pixels, Android returns pixels / pixel ratio
  // http://www.quirksmode.org/blog/archives/2012/07/more_about_devi.html
  if (navigator.userAgent.indexOf("Android") >= 0 && window.devicePixelRatio) {
    deviceWidth = deviceWidth / window.devicePixelRatio;
  }
  return deviceWidth;
}

export function effectiveDeviceHeight(): number {
  let deviceHeight =
    window.orientation === 0 ? window.screen.height : window.screen.width;
  // iOS returns available pixels, Android returns pixels / pixel ratio
  // http://www.quirksmode.org/blog/archives/2012/07/more_about_devi.html
  if (navigator.userAgent.indexOf("Android") >= 0 && window.devicePixelRatio) {
    deviceHeight = deviceHeight / window.devicePixelRatio;
  }
  return deviceHeight;
}

export const generateUniqueKey = (index = '') => '_' + Math.random().toString(36).substr(2, 9) + index;

// // *************************** METHODS FOR FORMS

// export function handleChange(e) {
// 	const inputName = e.target.name;
// 	let value;

// 	if (e.target.type === "checkbox") {
// 		value = e.target.checked;
// 	} else if (e.target.hasAttribute('multiple')) {
// 		value = Array.from(e.target.selectedOptions).map(item => item.value).join(", ");
// 	} else {
// 		value = e.target.value;
// 	}

// 	this.props.storeInputChange({
// 		inputName,
// 		value
// 	});
// }

// export function handleSubmit(e) {
// 	e.preventDefault();
// 	if (this.toggleModal) {
// 		this.props.processForm(this.toggleModal);
// 	} else {
// 		this.props.processForm();
// 	}
// }

// *********************** MODALS

// export function toggleModal() {
// 	this.setState(previousState => ({
// 		...previousState,
// 		showModal: !previousState.showModal
// 	}));
// }
