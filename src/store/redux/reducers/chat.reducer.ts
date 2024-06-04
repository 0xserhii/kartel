import { chatConstant, mainConstant } from "../constants";


const initialState = {
	serverIsOn: false
};

export default function socketReducer(state = initialState, action) {
	switch (action.type) {
		case chatConstant.SERVER_ON:
			return Object.assign({}, state, {
				serverIsOn: true
			});

		case chatConstant.SERVER_OFF:
			return Object.assign({}, state, {
				serverIsOn: false
			});

		case mainConstant.RESET:
			return initialState;

		default:
			return state;
	}
}
