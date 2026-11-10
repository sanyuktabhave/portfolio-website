// Route bundle: loaded only when "/" is requested, so the other case study
// layouts never reach the homepage's critical path.
//
// The stylesheet is a plain import so Vite emits it as a separate CSS file and
// fetches it in parallel with this chunk, rather than after it resolves.
import html from '../reference/home.html?raw'
import breakpoints from '../reference/home.json'
import '../reference/home.css'

export default { html, breakpoints, title: 'Sanyukta Bhave — Product Designer' }
