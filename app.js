/* UI state is independent of WebGL. Classic local scripts also work on file://. */
(() => {
  'use strict';
  const layers = window.STACK_LAYERS;
  const content = document.querySelector('#panel-content');
  const sceneHost = document.querySelector('#scene');
  const announcer = document.querySelector('#announcer');
  const rotationButton = document.querySelector('#rotation-toggle');
  const explodeButton = document.querySelector('#explode-toggle');
  const dialog = document.querySelector('#about-dialog');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scene;
  let selected = -1;
  let paused = false;
  let expanded = false;
  let fallback = false;
  let panelAnimation;
  const spotlight = new window.LayerSpotlight(index => {
    selected = index;
    scene?.select(index);
    renderDetail(index);
    updateSelection();
    if (fallback) renderFallback();
  });

  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  function renderOverview(animate = true) {
    content.innerHTML = `
      <div class="panel-topline"><p class="panel-eyebrow">WAT JIJ ERAAN HEBT</p><span class="panel-counter">05 <span>LAGEN</span></span></div>
      <div class="panel-icon">${icon('stack')}</div>
      <h2 class="panel-title overview-title">Van fundament<br>naar <span class="accent-word">waarde.</span></h2>
      <p class="panel-description">De mogelijkheden van moderne AI, passend bij jouw organisatie. Limescape verbindt een verantwoorde basis met praktische hulp in jouw dagelijkse werk.</p>
      <div class="overview-principles">
        <div>${icon('shield')}<span>Regie over eigen data</span></div>
        <div>${icon('person')}<span>De mens blijft beslissen</span></div>
        <div>${icon('trace')}<span>Inzicht, kwaliteit en verantwoording</span></div>
      </div>
      <div class="panel-actions"><button class="primary-button" data-select="0" type="button">Verken het fundament ${icon('arrow')}</button><p class="panel-footnote">Begin bij de basis. Ontdek de samenhang.</p></div>`;
    if (animate) animatePanel();
  }

  function animatePanel() {
    panelAnimation?.cancel();
    if (!reducedMotion.matches) {
      panelAnimation = content.animate([{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }

  function renderDetail(index) {
    const layer = layers[index];
    content.innerHTML = `
      <div class="panel-topline"><div><p class="panel-eyebrow">${layer.category.toUpperCase()}</p><span class="panel-counter">${layer.number} <span>/ 05</span></span></div><button class="icon-button" data-overview type="button" aria-label="Terug naar het overzicht" title="Overzicht">${icon('close')}</button></div>
      <div class="panel-icon">${icon(layer.icon)}</div>
      <h2 class="panel-title" id="detail-title" tabindex="-1">${layer.title}</h2>
      <p class="panel-description">${layer.description}</p>
      <div class="panel-technologies"><h3 class="section-label">IN HET KORT</h3><div class="technology-list">${layer.technologies.map(technology => `<span class="technology-tag">${technology}</span>`).join('')}</div></div>
      <div class="design-principle"><h3 class="section-label">WAT DIT VOOR JOU BETEKENT</h3><p>${layer.principle}</p></div>
      ${window.LAYER_SPOTLIGHTS[index] ? `<button class="primary-button spotlight-reopen" data-open-spotlight type="button">Lees meer ${icon('expand')}</button>` : ''}
      <div class="detail-navigation"><span>Laag ${index + 1} van 5</span><div><button class="previous-layer" data-select="${index - 1}" type="button" aria-label="Vorige laag" ${index === 0 ? 'disabled' : ''}>${icon('arrow')}</button><button data-select="${index + 1}" type="button" aria-label="Volgende laag" ${index === 4 ? 'disabled' : ''}>${icon('arrow')}</button></div></div>`;
    animatePanel();
  }

  function selectLayer(index, focusPanel = false) {
    if (index < 0 || index >= layers.length) return;
    selected = index;
    paused = true;
    scene?.select(index);
    scene?.setPaused(true);
    updateControls();
    renderDetail(index);
    updateSelection();
    announcer.textContent = `Laag ${index + 1} van 5: ${layers[index].title}. ${layers[index].description}`;
    if (focusPanel) document.querySelector('#detail-title').focus({ preventScroll: true });
    if (fallback) renderFallback();
    if (window.LAYER_SPOTLIGHTS[index]) openSpotlight(index);
  }

  function openSpotlight(index) {
    const bounds = scene?.getLayerBounds(index)
      ?? sceneHost.querySelector(`[data-fallback-layer="${index}"]`)?.getBoundingClientRect()
      ?? sceneHost.getBoundingClientRect();
    spotlight.open(index, bounds);
  }

  function updateSelection() {
    document.querySelectorAll('[data-layer]').forEach(button => {
      const active = Number(button.dataset.layer) === selected;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-selected', active);
    });
    document.querySelectorAll('#leader-lines g').forEach((line, index) => line.classList.toggle('is-active', index === selected));
    document.querySelector('#interaction-hint').textContent = selected < 0 ? 'Klik op een laag om te verkennen' : `Laag ${selected + 1} · ${layers[selected].category}`;
  }

  function hoverLayer(index) {
    document.querySelectorAll('.layer-label').forEach((label, labelIndex) => label.classList.toggle('is-hovered', index === labelIndex));
  }

  function resetView(focusOverview = false) {
    selected = -1;
    expanded = false;
    paused = false;
    scene?.reset();
    updateControls();
    updateSelection();
    renderOverview();
    if (focusOverview) content.querySelector('.primary-button').focus({ preventScroll: true });
    announcer.textContent = 'Overzicht hersteld. Alle vijf lagen zijn zichtbaar.';
    if (fallback) renderFallback();
  }

  function updateControls() {
    rotationButton.setAttribute('aria-pressed', String(paused));
    const rotationLabel = paused ? 'Automatische rotatie hervatten' : 'Automatische rotatie pauzeren';
    rotationButton.setAttribute('aria-label', rotationLabel);
    rotationButton.title = rotationLabel;
    rotationButton.innerHTML = icon(paused ? 'play' : 'pause');
    explodeButton.setAttribute('aria-pressed', String(expanded));
    explodeButton.setAttribute('aria-label', expanded ? 'Lagen weer samenvoegen' : 'Lagen verder uit elkaar zetten');
    explodeButton.title = expanded ? 'Lagen samenvoegen' : 'Lagen uitvouwen';
  }

  // DOM layer controls are the keyboard / screen-reader equivalent of raycasting.
  document.querySelector('#layer-labels').innerHTML = layers.map((layer, index) => `<button class="layer-label" data-layer="${index}" type="button" aria-pressed="false" aria-label="Laag ${index + 1}: ${layer.title}"><span class="label-number">${layer.number}</span><span class="label-text">${layer.short}</span></button>`).join('');
  document.querySelector('#layer-navigation').innerHTML = layers.map((layer, index) => `<button class="layer-nav-button" data-layer="${index}" type="button" aria-pressed="false" aria-label="Laag ${index + 1}: ${layer.title}" style="--layer-color:${layer.color}"><span class="nav-number">${layer.number}</span><span class="nav-title">${layer.nav}</span><span class="nav-swatch" aria-hidden="true"></span></button>`).join('');
  document.querySelector('#leader-lines').innerHTML = layers.map(() => '<g><path/><circle r="2"/></g>').join('');

  document.querySelectorAll('[data-layer]').forEach(button => {
    const index = Number(button.dataset.layer);
    button.addEventListener('click', () => selectLayer(index));
    button.addEventListener('pointerenter', () => scene?.setHovered(index));
    button.addEventListener('pointerleave', () => scene?.setHovered(-1));
    button.addEventListener('focus', () => scene?.setHovered(index));
    button.addEventListener('blur', () => scene?.setHovered(-1));
  });
  content.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-select')) selectLayer(Number(button.dataset.select), true);
    if (button.hasAttribute('data-overview')) resetView(true);
    if (button.hasAttribute('data-open-spotlight')) openSpotlight(selected);
  });
  document.querySelector('#reset-view').addEventListener('click', () => resetView());
  rotationButton.addEventListener('click', () => {
    paused = !paused;
    // Resuming returns to the overview, where continuous rotation is useful.
    if (!paused && selected !== -1) resetView();
    scene?.setPaused(paused);
    updateControls();
  });
  explodeButton.addEventListener('click', () => {
    expanded = !expanded;
    scene?.setExpanded(expanded);
    updateControls();
    if (fallback) renderFallback();
    announcer.textContent = expanded ? 'De vijf lagen zijn uitgevouwen.' : 'De vijf lagen zijn samengevoegd.';
  });
  document.querySelector('.about-trigger').addEventListener('click', () => dialog.showModal());
  document.querySelector('#close-about').addEventListener('click', () => dialog.close());
  document.querySelector('#start-exploring').addEventListener('click', () => {
    dialog.close();
    selectLayer(0);
    document.querySelector('#architecture').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !dialog.open && !spotlight.dialog.open && selected !== -1) resetView(true);
  });

  function updateMotionPreference() {
    rotationButton.disabled = reducedMotion.matches || fallback;
    if (reducedMotion.matches) rotationButton.title = 'Rotatie uitgeschakeld: voorkeur voor minder beweging';
  }
  reducedMotion.addEventListener('change', updateMotionPreference);

  /* An offline / no-WebGL fallback remains clickable with identical content.
     It is intentionally labeled as 2D, rather than pretending WebGL loaded. */
  function renderFallback() {
    fallback = true;
    const width = sceneHost.clientWidth;
    const height = sceneHost.clientHeight;
    const scale = Math.min(width / 620, height / 530);
    const narrow = width <= 620;
    const centerX = width * (narrow ? .58 : .64);
    const baseY = height * (narrow ? .62 : .72);
    const topY = baseY - 325 * scale;
    const gap = expanded ? 15 : 6;
    const project = (x, y, depth = 0) => `${(centerX + x * scale).toFixed(1)},${(topY + y * scale + depth * scale).toFixed(1)}`;
    let shapes = '';
    layers.forEach((layer, index) => {
      const w = (5 - index) * 34;
      const t = w - 34;
      const y = (4 - index) * 57 - index * gap + 55;
      const lower = y + 57;
      const lift = selected === index ? -7 : 0;
      shapes += `<g class="fallback-layer ${selected === index ? 'is-selected' : ''}" data-fallback-layer="${index}" transform="translate(0 ${lift})"><polygon points="${project(-w, lower, -w * .22)} ${project(0, lower, w * .4)} ${project(0, y, t * .4)} ${project(-t, y, -t * .22)}" fill="${layer.color}" stroke="#ffffff" stroke-opacity=".5"/><polygon points="${project(0, lower, w * .4)} ${project(w, lower, -w * .22)} ${project(t, y, -t * .22)} ${project(0, y, t * .4)}" fill="${layer.color}"/><polygon points="${project(0, lower, w * .4)} ${project(w, lower, -w * .22)} ${project(t, y, -t * .22)} ${project(0, y, t * .4)}" fill="#272f3c" opacity=".18"/></g>`;
      const railTop = narrow ? 90 : 75;
      const railBottom = narrow ? 110 : 30;
      const labelY = railTop + (4 - index) * Math.max(44, (height - railTop - railBottom) / 4);
      document.querySelectorAll('.layer-label')[index].style.top = `${labelY}px`;
    });
    sceneHost.innerHTML = `<svg class="fallback-pyramid" viewBox="0 0 ${width} ${height}" aria-hidden="true"><defs><radialGradient id="fallback-shadow"><stop stop-color="#272f3c" stop-opacity=".17"/><stop offset="1" stop-color="#272f3c" stop-opacity="0"/></radialGradient></defs><ellipse cx="${centerX}" cy="${baseY + 32 * scale}" rx="${205 * scale}" ry="${45 * scale}" fill="url(#fallback-shadow)"/>${shapes}</svg>`;
    sceneHost.querySelectorAll('[data-fallback-layer]').forEach(group => group.addEventListener('click', () => selectLayer(Number(group.dataset.fallbackLayer))));
    document.querySelector('#leader-lines').style.display = 'none';
    document.querySelector('#model-mode').textContent = 'INTERACTIEF 2D-MODEL';
    rotationButton.disabled = true;
    rotationButton.title = 'Rotatie is beschikbaar in de 3D-weergave';
  }

  renderOverview(false);
  // Position the labels before the CDN responds; fallback also covers slow loading.
  renderFallback();
  fallback = false;
  document.querySelector('#model-mode').textContent = '3D-MODEL LADEN';
  const fallbackResize = new ResizeObserver(() => { if (fallback) renderFallback(); });
  fallbackResize.observe(sceneHost);

  async function initializeScene() {
    try {
      // Version pinned. Dynamic CDN import also works when opening index.html directly.
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js');
      scene = new window.PyramidScene(THREE, sceneHost, layers, selectLayer, hoverLayer, rotating => {
        document.querySelector('#model-stage').dataset.rotating = String(rotating);
      });
      scene.select(selected);
      scene.setExpanded(expanded);
      scene.setPaused(paused);
      document.querySelector('#leader-lines').style.display = '';
      document.querySelector('#model-mode').textContent = 'INTERACTIEF 3D-MODEL';
      updateMotionPreference();
      sceneHost.addEventListener('model-unavailable', () => {
        scene = undefined;
        renderFallback();
        announcer.textContent = '3D is niet beschikbaar. Je kunt alle lagen in de 2D-weergave blijven verkennen.';
      }, { once: true });
    } catch (error) {
      console.info('3D-weergave niet beschikbaar; interactieve 2D-weergave actief.', error.message);
      renderFallback();
      announcer.textContent = 'Interactieve 2D-weergave geladen. Alle vijf lagen zijn beschikbaar.';
    }
  }
  initializeScene();
})();
