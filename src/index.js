import './index.scss';
import Application from "./Application";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

window.addEventListener('DOMContentLoaded', () => {
    const application = new Application(document.querySelector('canvas'));
    application.start();
    let smoothToggleButton = [];
    document.querySelectorAll('.js-app-toggle-smooth').forEach((el) => {
        smoothToggleButton.push(el);
        el.addEventListener('click', () => {
            application.fpsCounter.setOption('smooth',!application.fpsCounter.getOption('smooth'));
        });
    });

    document.querySelectorAll('.js-app-fps-mode').forEach(e=>{
        e.addEventListener('click', () => {
            application.setFpsCounterType(e.dataset.type);
            smoothToggleButton.map(el=>{
               el.style.display = e.dataset.type === 'simple' ? 'none' : 'inline-block';
            });
            document.querySelectorAll('.js-app-fps-mode').forEach(ie=>{
                ie.classList.remove('active');
            });
            e.classList.add('active');
        });
    });
    document.querySelectorAll('.js-app-language').forEach(e=>{
        e.addEventListener('click', () => {
            document.documentElement.lang = e.dataset.language;
            document.querySelectorAll('.js-app-language').forEach(ie=>{
                ie.classList.remove('active');
            });
            e.classList.add('active');
        });
    });
    document.querySelectorAll('.js-fps-target').forEach(e=>{
        e.value = application.targetFps;
        e.addEventListener('input',evt=>{
            application.targetFps = evt.target.value;
        });
    });


    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
});