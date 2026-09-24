//import css at first!!!!
import './verdana.css';
import './handschrift.css';
import './gothic.css';
import './index.css';
import { App } from './App';


const app = App()
document.getElementById('root_static')!.remove() //for indexing by robot only
document.getElementById('root')!.appendChild(app.dom)