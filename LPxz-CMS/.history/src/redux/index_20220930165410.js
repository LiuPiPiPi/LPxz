import { createStore } from 'react-redux';
import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = createStore(reducer);
const persister = 'Free';

export { store, persister };
