// encuesta.js
import { api } from './api.js';

const form = document.getElementById('formEncuesta');

(async function init(){
  const { survey, questions } = await api.getSurvey();

  form.insertAdjacentHTML('beforeend', `
    <div class="grid grid-2">
      <div><label>Nombre</label><input class="input" name="name" required></div>
      <div><label>Email</label><input type="email" class="input" name="email" required></div>
    </div>
    <hr/>
  `);

  questions.forEach(q=>{
    const opts = q.options.map(o=>`
      <label class="option">
        <input type="radio" name="q_${q.id}" value="${o.id}" required> <b>(${o.code})</b> ${o.text}
      </label>`).join('');
    form.insertAdjacentHTML('beforeend', `
      <div class="card">
        <div class="badge">Pregunta ${q.q_number}</div>
        <p><b>${q.text}</b></p>
        <div class="grid">${opts}</div>
      </div>
    `);
  });

  form.insertAdjacentHTML('beforeend', `<button class="btn" type="submit">Enviar</button>`);

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name'); const email = fd.get('email');
    const answers = questions.map(q=>{
      const option_id = fd.get(`q_${q.id}`);
      return { question_id: q.id, option_id: +option_id };
    });
    const res = await api.saveResponses({ user: { name, email }, answers });
    if(res.ok){
      location.href = `/resultados.html?user_id=${res.user_id}`;
    } else {
      alert('Error: '+res.error);
    }
  });
})();
