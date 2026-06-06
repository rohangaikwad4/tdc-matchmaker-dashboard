/**
 * Hardcoded demo matchmaker credentials for initial login.
 * Additional users are registered via the signup page and stored in localStorage.
 *
 * @type {Array<{ id: string, username: string, password: string, name: string }>}
 */
const matchmakers = [
  { id: 'mm-1', username: 'admin', password: 'admin123', name: 'Priya Sharma' },
  { id: 'mm-2', username: 'matchmaker', password: 'match123', name: 'Rajesh Verma' },
];

export default matchmakers;
