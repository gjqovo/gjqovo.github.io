import { basic, initSidebar, initTopbar } from './modules/layouts';
import {
  loadImg,
  imgPopup,
  initClipboard,
  highlightLines,
  runCpp,
  runJavascript,
  runPython,
  runRust
} from './modules/plugins';

basic();
initSidebar();
initTopbar();
loadImg();
imgPopup();
initClipboard();
highlightLines();
runCpp();
runJavascript();
runPython();
runRust();
