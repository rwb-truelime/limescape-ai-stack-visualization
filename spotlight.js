/* Presentation content only: these are discussion tools, not live integrations.
   Logos are local; official documentation opens only on an explicit link click. */
window.LAYER_SPOTLIGHTS = {
  0: {
    eyebrow: '01 / GOVERNANCE · HET FUNDAMENT',
    title: 'Verantwoord starten. Samen goed geregeld.',
    introduction: 'Ga je in zee met Limescape? Dan sta je er bij belangrijke governance-vraagstukken niet alleen voor. We helpen je om wetgeving, veiligheid, privacy en kwaliteit te vertalen naar concrete keuzes. Zo bouw je aan AI die past bij jouw organisatie én bij de mensen die ermee werken.',
    pillars: [
      {
        title: 'Compliance', icon: 'shield', label: 'Van wetgeving naar werkbare afspraken',
        description: 'Wat betekenen de EU AI Act en GDPR / AVG voor jouw toepassing? Samen brengen we risico’s, rollen en verplichtingen in kaart. We helpen bij het inrichten van passend menselijk toezicht, transparantie en vastlegging, in afstemming met jouw privacy- en securityverantwoordelijken.',
        outcome: 'Duidelijke kaders voor verantwoord AI-gebruik.',
      },
      {
        title: 'Security-by-design', icon: 'lock', label: 'Veilig ontworpen. Zorgvuldig onderhouden.',
        description: 'Beveiliging nemen we mee vanaf het ontwerp. We richten toegangsrechten en veilige configuraties zorgvuldig in en werken met processen voor software-updates, het opvolgen van kwetsbaarheden en gecontroleerde wijzigingen. Zo blijft veiligheid ook na de ingebruikname op de agenda.',
        outcome: 'Grip op toegang, onderhoud en beveiliging.',
      },
      {
        title: 'Privacy-by-design', icon: 'person', label: 'De juiste data. De juiste toegang.',
        description: 'Samen bepalen we welke persoonsgegevens nodig zijn, wie erbij mag en hoe lang ze bewaard worden. We helpen je de juiste kennisbronnen, modellen en gegevensstromen te kiezen en privacybewuste instellingen toe te passen. Waar nodig ondersteunen we het in kaart brengen van privacyrisico’s voor een DPIA.',
        outcome: 'Privacy verankerd in de inrichting.',
      },
      {
        title: 'Quality assurance', icon: 'trace', label: 'Kwaliteit die je kunt toetsen',
        description: 'We maken vooraf afspraken over wat goed genoeg is. Met heldere acceptatiecriteria, tests en evaluaties toetsen we de werking van de oplossing. Feedback en gecontroleerde releases helpen om verbeteringen door te voeren en kwaliteit tijdens het gebruik te blijven bewaken.',
        outcome: 'Toetsbare kwaliteit en continu verbeteren.',
      },
    ],
    themes: ['Samen inrichten', 'Aantoonbaar beheersen', 'Blijvend verbeteren'],
  },
  4: {
    eyebrow: '05 / APPLICATIE & ORKESTRATIE',
    title: 'Van model naar werkproces.',
    themes: ['Waarde in het werkproces', 'Menselijke regie', 'Verbonden kennis'],
    tools: [
      { name: 'n8n', logo: 'n8n.png', role: 'Workflow-automatisering', tags: ['Visuele flows', 'Integraties', 'Human approval'], url: 'https://docs.n8n.io/', license: 'Fair-code · Sustainable Use License' },
      { name: 'LangChain / LangGraph', logo: 'langchain.svg', role: 'Code-first agents', tags: ['Tools & agents', 'Checkpoints', 'Human-in-the-loop'], url: 'https://docs.langchain.com/oss/python/langgraph/overview', license: 'Open-source frameworks · MIT' },
      { name: 'LiteLLM', logo: 'litellm.webp', role: 'Modelgateway', tags: ['Modelrouting', 'Virtual keys', 'Budgetten'], url: 'https://docs.litellm.ai/', license: 'MIT-kern · aanvullende enterprise-licentie' },
      { name: 'Open WebUI', logo: 'openwebui.png', role: 'AI-werkplek', tags: ['Eigen modellen', 'Kennisbronnen', 'Tools'], url: 'https://docs.openwebui.com/', license: 'Open WebUI License · brandingvoorwaarden' },
      { name: 'Limescape', logo: 'limescape.svg', role: 'Agents & AI flows', tags: ['Menselijke regie', 'Private SaaS op eigen stack'], url: 'https://limescape.ai/platform', license: 'Commercieel platform · private deployment' },
    ],
  },
  3: {
    eyebrow: '04 / EVALS & OBSERVABILITY',
    title: 'Elke stap inzichtelijk. Kwaliteit getest.',
    themes: ['Domeinexperts', 'Representatieve testsets', 'Continu verbeteren'],
    tools: [
      { name: 'Langfuse', logo: 'langfuse.svg', role: 'Observability & experimenten', tags: ['Agent-traces', 'Datasets & evals', 'Menselijke feedback'], url: 'https://langfuse.com/docs', license: 'MIT-kern · aanvullende enterprise-licentie' },
      { name: 'DeepEval', logo: 'deepeval.svg', role: 'Geautomatiseerde AI-tests', tags: ['Tool correctness', 'Bias-tests', 'CI/CD quality gates'], url: 'https://deepeval.com/docs/getting-started', license: 'Open source · Apache-2.0' },
      { name: 'Ragas', logo: 'ragas.png', role: 'RAG-evaluatie', tags: ['Brongetrouwheid', 'Retrievalkwaliteit', 'Regressietests'], url: 'https://docs.ragas.io/en/stable/', license: 'Open source · Apache-2.0' },
    ],
  },
};

window.LayerSpotlight = class LayerSpotlight {
  constructor(onSwitch, onClose) {
    this.dialog = document.querySelector('#layer-spotlight');
    this.content = this.dialog.querySelector('.spotlight-content');
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.onClose = onClose;
    this.dialog.querySelector('[data-close-spotlight]').addEventListener('click', () => this.close());
    this.dialog.addEventListener('cancel', event => {
      event.preventDefault();
      this.close();
    });
    this.dialog.querySelectorAll('[data-spotlight-layer]').forEach(button => {
      button.addEventListener('click', () => {
        if (this.closing) return;
        const index = Number(button.dataset.spotlightLayer);
        if (index === this.index) return;
        onSwitch(index);
        this.render(index);
        this.contentAnimation?.cancel();
        if (!this.motion.matches) this.contentAnimation = this.content.animate([{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220 });
      });
    });
  }

  render(index) {
    this.index = index;
    const data = window.LAYER_SPOTLIGHTS[index];
    this.content.innerHTML = `
      <div class="spotlight-heading">
        <p class="eyebrow">${data.eyebrow}</p>
        <h2 id="spotlight-title">${data.title}</h2>
        ${data.introduction ? `<p class="governance-intro">${data.introduction}</p>` : ''}
      </div>
      ${data.pillars ? `
      <div class="governance-pillars">
        ${data.pillars.map(pillar => `<article class="governance-card">
          <span class="governance-icon"><svg class="icon" aria-hidden="true"><use href="#i-${pillar.icon}"/></svg></span>
          <h3>${pillar.title}</h3>
          <p class="governance-label">${pillar.label}</p>
          <p class="governance-description">${pillar.description}</p>
          <p class="governance-outcome">${pillar.outcome}</p>
        </article>`).join('')}
      </div>
      <section class="governance-assurance" aria-labelledby="assurance-title">
        <div>
          <p class="eyebrow">DE MAKER ACHTER LIMESCAPE</p>
          <h3 id="assurance-title">Gebouwd door TrueLime. Onderbouwd met ISO.</h3>
          <p>TrueLime, de maker van het AI-platform Limescape, is ISO 9001- en ISO 27001-gecertificeerd. Die certificeringen onderbouwen hoe we kwaliteit en informatiebeveiliging in onze organisatie borgen.</p>
          <a class="governance-source" href="https://www.truelime.nl/artikelen/truelime-is-iso-9001-en-27001-gecertificeerd/" target="_blank" rel="noopener noreferrer">Over de ISO-certificeringen van TrueLime <span class="sr-only">(nieuw tabblad)</span><span aria-hidden="true">↗</span></a>
        </div>
        <dl class="governance-certifications">
          <div><dt>ISO 9001</dt><dd>Kwaliteitsmanagement<span>Gecertificeerd sinds 2019</span></dd></div>
          <div><dt>ISO 27001</dt><dd>Informatiebeveiliging<span>Gecertificeerd sinds 2022</span></dd></div>
        </dl>
      </section>
      <p class="governance-context">Een stevig fundament vraagt om samenwerking. Welke maatregelen nodig zijn, hangt af van jouw toepassing, gegevens en processen. De ISO-certificeringen gelden voor TrueLime als organisatie; compliance van jouw AI-toepassing vraagt daarnaast om een passende inrichting en gebruik.</p>
      ` : `<div class="spotlight-tools ${data.tools.length === 5 ? 'spotlight-tools-five' : ''}">
        ${data.tools.map(tool => `<a class="tool-card" href="${tool.url}" target="_blank" rel="noopener noreferrer" aria-label="${tool.name}: officiële documentatie (nieuw tabblad)" title="${tool.license}">
          <span class="tool-logo"><img src="assets/${tool.logo}" alt="" width="240" height="64"></span>
          <h3>${tool.name}</h3>
          <p class="tool-role">${tool.role}</p>
          <div class="tool-tags">${tool.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
        </a>`).join('')}
      </div>`}
      <div class="spotlight-themes" aria-label="Gespreksthema’s">${data.themes.map(theme => `<span>${theme}</span>`).join('')}</div>`;
    this.dialog.querySelectorAll('[data-spotlight-layer]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.spotlightLayer) === index));
    });
    this.dialog.scrollTop = 0;
  }

  open(index, bounds) {
    if (this.dialog.open) return;
    this.returnFocus = document.activeElement;
    this.origin = bounds;
    this.render(index);
    this.dialog.showModal();
    document.documentElement.classList.add('spotlight-open');
    if (this.motion.matches) return;
    // Grow out of the projected slice. A single compositor animation avoids
    // creating another WebGL context or enlarging the renderer's framebuffer.
    this.animation = this.dialog.animate([
      { transform: this.originTransform(), opacity: 0, borderRadius: '24px', offset: 0 },
      { opacity: .15, offset: .24 },
      { transform: 'none', opacity: 1, borderRadius: '0', offset: 1 },
    ], { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' });
  }

  originTransform() {
    const bounds = this.origin;
    const x = bounds.left + bounds.width / 2 - innerWidth / 2;
    const y = bounds.top + bounds.height / 2 - innerHeight / 2;
    return `translate(${x}px, ${y}px) scale(${Math.max(.08, bounds.width / innerWidth)}, ${Math.max(.06, bounds.height / innerHeight)})`;
  }

  async close() {
    if (!this.dialog.open || this.closing) return;
    this.closing = true;
    this.contentAnimation?.cancel();
    this.animation?.cancel();
    if (!this.motion.matches) {
      this.animation = this.dialog.animate([
        { transform: 'none', opacity: 1 },
        { transform: this.originTransform(), opacity: 0 },
      ], { duration: 280, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
      await this.animation.finished.catch(() => {});
    }
    this.dialog.close();
    this.animation?.cancel();
    document.documentElement.classList.remove('spotlight-open');
    this.onClose();
    const target = this.returnFocus?.isConnected && this.returnFocus !== document.body
      ? this.returnFocus : document.querySelector(`.layer-nav-button[data-layer="${this.index}"]`);
    target?.focus({ preventScroll: true });
    this.closing = false;
  }
};
