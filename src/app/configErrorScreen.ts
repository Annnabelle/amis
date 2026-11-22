/**
 * Экран «конфигурация не задана».
 *
 * Обычной разметкой, без React и переводов: оба слоя сами зависят от конфигурации,
 * а показать причину нужно именно тогда, когда поднять приложение нельзя.
 */
export const renderConfigErrorScreen = (problems: readonly string[]) => {
  const root = document.getElementById('root');

  if (!root) return;

  const list = problems
    .map((problem) => `<li style="margin:4px 0">${problem}</li>`)
    .join('');

  root.innerHTML = `
    <div style="
      min-height:100vh; display:flex; align-items:center; justify-content:center;
      padding:24px; background:#F4F3EF; color:#141A1A;
      font-family:'IBM Plex Sans','Segoe UI',system-ui,sans-serif;
    ">
      <div style="max-width:560px">
        <h1 style="font-size:20px; margin:0 0 12px">Приложение не настроено</h1>
        <p style="margin:0 0 12px; line-height:1.6">
          Файл <code>/runtime-config.js</code> не отдан сервером или не содержит
          обязательных полей:
        </p>
        <ul style="margin:0 0 16px; padding-left:20px; line-height:1.6">${list}</ul>
        <p style="margin:0; color:#52615F; line-height:1.6">
          На стенде файл отдаёт nginx из каталога окружения; локально его
          создают из <code>runtime-config.example.js</code> в корне репозитория.
        </p>
      </div>
    </div>
  `;
};
