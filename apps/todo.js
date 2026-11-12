const TodoApp = {
  todos: [], key: 'vpc_todos',
  load() { try { this.todos = JSON.parse(localStorage.getItem(this.key) || '[]'); } catch(e) { this.todos = []; } },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.todos)); } catch(e) {} },
  render(container, winId) {
    this.load();
    const render = () => {
      container.innerHTML = `<div class="todo-app"><div class="todo-header">
        <input type="text" id="${winId}_input" placeholder="Neue Aufgabe...">
        <button id="${winId}_add">Hinzufuegen</button></div>
        <div class="todo-list">${this.todos.map(t => `<div class="todo-item ${t.done?'done':''}">
          <input type="checkbox" data-id="${t.id}" ${t.done?'checked':''}>
          <span class="todo-text">${t.text}</span>
          <button class="todo-delete" data-id="${t.id}">X</button></div>`).join('')}</div></div>`;
      document.getElementById(winId+'_add').onclick = () => {
        const input = document.getElementById(winId+'_input');
        if (!input.value.trim()) return;
        this.todos.unshift({ id: 't_'+Date.now(), text: input.value.trim(), done: false });
        this.save(); render();
      };
      container.querySelectorAll('input[type=checkbox]').forEach(cb => {
        cb.onchange = () => { const t = this.todos.find(x => x.id === cb.dataset.id); if (t) { t.done = cb.checked; this.save(); render(); } };
      });
      container.querySelectorAll('.todo-delete').forEach(btn => {
        btn.onclick = () => { this.todos = this.todos.filter(x => x.id !== btn.dataset.id); this.save(); render(); };
      });
    };
    render();
  }
};
window.TodoApp = TodoApp;
