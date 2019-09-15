import dispatcher from './BuilderDispatcher.js';

export function customizeInterest(interest, isTheme, question) {
	// console.debug("== ACTION » customizeInterest ", { interest, isTheme, question });
	dispatcher.dispatch({
		type: 'CUSTOMIZE_INTEREST',
		interest: interest,
		isTheme,
		question
	})
}

export function applyInterestCustomization(interest) {
	// console.debug("== ACTION » applyInterestCustomization ", { interest });
	dispatcher.dispatch({
		type: 'APPLY_INTEREST',
		interest: interest
	})
}

export function activateQuestion(questionId) {
	// console.debug("== ACTION » activateQuestion ", { questionId });
	dispatcher.dispatch({
		type: 'ACTIVATE_QUESTION',
		questionId: questionId
	})
}

export function activateStep(stepId, callback) {
	// console.debug("== ACTION » activateStep ", { stepId, callback });
	dispatcher.dispatch({
		type: 'ACTIVATE_STEP',
		stepId,
		callback
	})
}

export function nav(status) {
	// console.debug("== ACTION » nav ", { status });
	dispatcher.dispatch({
		type: 'NAV',
		status: status
	})
}

export function beginCustomization(status) {
	// console.debug("== ACTION » beginCustomization ", { status });
	dispatcher.dispatch({
		type: 'BEGIN_CUSTOMIZATION',
		status: status
	})
}

export function selectShoe(shoe) {
	// console.debug("== ACTION » selectShoe ", { shoe });
	dispatcher.dispatch({
		type: 'SELECT_SHOE',
		shoe: shoe
	})
}

export function assetsLoaded() {
	// console.debug("== ACTION » assetsLoaded ");
	dispatcher.dispatch({
		type: 'ASSETS_LOADED',
	})
}

export function assetsProgress(shoe, percent) {
	// console.debug("== ACTION » assetsProgress ", { shoe, percent });
	dispatcher.dispatch({
		type: 'ASSETS_PROGRESS',
		shoe: shoe,
		percent: percent
	})
}

export function b16Loaded(shoe) {
	// console.debug("== ACTION » b16Loaded ", { shoe });
	dispatcher.dispatch({
		type: 'B16_LOADED',
		shoe: shoe
	})
}

export function drag(status) {
	// console.debug("== ACTION » configuratorDragged ", { status });
	dispatcher.dispatch({
		type: 'DRAG',
		status: status
	})
}

export function groupChange({ internalId, b16QuestionId, b16AnswerId, b16PiDText }) {
	// console.debug("== ACTION » groupChange ", { internalId, b16QuestionId, b16AnswerId, b16PiDText });s
	dispatcher.dispatch({
		type: 'GROUP_CHANGE',
		internalId,
		b16QuestionId,
		b16AnswerId,
		b16PiDText
	})
}