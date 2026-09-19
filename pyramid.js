/* A true square pyramid, cut into five individually raycastable frustums.
   Three.js is injected, so the UI can also run without WebGL or a network. */
window.PyramidScene = class PyramidScene {
  constructor(THREE, host, layers, onSelect, onHover, onRotationChange) {
    this.T = THREE;
    this.host = host;
    this.layers = layers;
    this.onSelect = onSelect;
    this.onHover = onHover;
    this.onRotationChange = onRotationChange;
    this.selected = -1;
    this.hovered = -1;
    this.pointerInside = false;
    this.focusInside = false;
    this.manuallyPaused = false;
    this.expanded = false;
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-5, 5, 4, -4, .1, 60);
    this.camera.position.set(8, 6.7, 10);
    this.target = new THREE.Vector3(0, 2.2, 0);
    this.camera.lookAt(this.target);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    host.replaceChildren(this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-10, -10);
    this.group = new THREE.Group();
    this.group.rotation.y = -.16;
    this.scene.add(this.group);
    this.meshes = [];
    this.projected = new THREE.Vector3();
    this.baseColors = layers.map(layer => new THREE.Color(layer.color));
    this.highlight = new THREE.Color('#ffffff');
    this.colorTarget = new THREE.Color();
    this.createLights();
    this.createPyramid();
    this.createGround();
    this.bindEvents();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();
    this.lastTime = 0;
    this.renderer.setAnimationLoop(time => this.animate(time));
  }

  createLights() {
    const T = this.T;
    this.scene.add(new T.AmbientLight(0xffffff, .55));
    this.scene.add(new T.HemisphereLight(0xffffff, 0x62666b, 1.3));
    const key = new T.DirectionalLight(0xffffff, 2.8);
    key.position.set(-3, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -7, right: 7, top: 8, bottom: -7, near: .5, far: 30 });
    key.shadow.normalBias = .035;
    key.shadow.bias = -.0003;
    key.shadow.radius = 4;
    this.scene.add(key);
    const fill = new T.DirectionalLight(0xf0f0ed, .8);
    fill.position.set(6, 4, -5);
    this.scene.add(fill);
    const rim = new T.DirectionalLight(0xffffff, 1.1);
    rim.position.set(-5, 5, -4);
    this.scene.add(rim);
  }

  createPyramid() {
    const T = this.T;
    this.layers.forEach((layer, index) => {
      const bottomWidth = 4.6 * (1 - index / 5);
      const topWidth = 4.6 * (1 - (index + 1) / 5);
      // Four radial segments produce flat architectural faces, not a cone.
      const geometry = new T.CylinderGeometry(topWidth / Math.SQRT2, bottomWidth / Math.SQRT2, .82, 4, 1, false);
      geometry.rotateY(Math.PI / 4);
      const side = new T.MeshStandardMaterial({ color: layer.color, metalness: .29, roughness: .34, flatShading: true });
      const top = side.clone();
      top.roughness = .43;
      const bottom = side.clone();
      bottom.color.multiplyScalar(.76);
      const mesh = new T.Mesh(geometry, [side, top, bottom]);
      mesh.position.y = .69 + index * .94;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.index = index;
      mesh.userData.bottomWidth = bottomWidth;
      const edges = new T.LineSegments(new T.EdgesGeometry(geometry, 25), new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .2 }));
      mesh.add(edges);
      this.meshes.push(mesh);
      this.group.add(mesh);
    });

    // A low, restrained plinth visually grounds the architecture.
    const plinth = new T.Mesh(new T.BoxGeometry(5.04, .16, 5.04), new T.MeshStandardMaterial({ color: '#dfe1df', roughness: .4, metalness: .28 }));
    plinth.position.y = .08;
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    this.group.add(plinth);
    const plinthEdges = new T.LineSegments(new T.EdgesGeometry(plinth.geometry), new T.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: .75 }));
    plinth.add(plinthEdges);
  }

  createGround() {
    const T = this.T;
    const shadow = new T.Mesh(new T.PlaneGeometry(200, 200), new T.ShadowMaterial({ color: '#272f3c', opacity: .13 }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -.018;
    shadow.receiveShadow = true;
    this.scene.add(shadow);

    // Locally generated contact shadow; no textures or external image assets.
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 10, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(39, 47, 60, .22)');
    gradient.addColorStop(.55, 'rgba(39, 47, 60, .09)');
    gradient.addColorStop(1, 'rgba(39, 47, 60, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const contact = new T.Mesh(new T.PlaneGeometry(8, 8), new T.MeshBasicMaterial({ map: new T.CanvasTexture(textureCanvas), transparent: true, depthWrite: false }));
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = -.01;
    this.scene.add(contact);

    [3.6, 4.15].forEach((radius, index) => {
      const ring = new T.Mesh(new T.RingGeometry(radius, radius + .008, 128), new T.MeshBasicMaterial({ color: '#b9bfba', transparent: true, opacity: index ? .2 : .34, side: T.DoubleSide, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -.005;
      this.scene.add(ring);
    });
  }

  bindEvents() {
    const canvas = this.renderer.domElement;
    const stage = this.host.parentElement;
    stage.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') this.pointerInside = true;
    });
    stage.addEventListener('pointerleave', () => {
      this.pointerInside = false;
      this.setHovered(-1);
    });
    stage.addEventListener('focusin', () => { this.focusInside = true; });
    stage.addEventListener('focusout', event => { this.focusInside = stage.contains(event.relatedTarget); });
    canvas.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      this.updatePointer(event);
      this.setHovered(this.hitLayer());
    });
    canvas.addEventListener('pointerleave', () => this.setHovered(-1));
    canvas.addEventListener('click', event => {
      this.updatePointer(event);
      const index = this.hitLayer();
      if (index !== -1) this.onSelect(index);
    });
    // A lost graphics context retains the complete, accessible DOM interface.
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      this.unavailable = true;
      this.renderer.setAnimationLoop(null);
      this.resizeObserver.disconnect();
      this.host.dispatchEvent(new Event('model-unavailable'));
    });
    document.addEventListener('visibilitychange', () => {
      if (this.unavailable) return;
      this.lastTime = 0;
      this.invalidate();
      this.renderer.setAnimationLoop(document.hidden ? null : time => this.animate(time));
    });
    this.reducedMotion.addEventListener('change', () => this.invalidate());
  }

  updatePointer(event) {
    const rect = this.host.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  }

  hitLayer() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObjects(this.meshes, false)[0]?.object.userData.index ?? -1;
  }

  setHovered(index) {
    if (this.hovered === index) return;
    this.hovered = index;
    this.invalidate();
    this.renderer.domElement.style.cursor = index < 0 ? 'default' : 'pointer';
    this.onHover(index);
  }

  // Allow easing to settle after a change, then skip expensive idle rendering.
  invalidate() { this.settlingUntil = performance.now() + 1200; }
  select(index) {
    this.selected = index;
    if (index >= 0) {
      this.setHovered(-1);
      this.resetAngle = Math.round((this.group.rotation.y + .16) / (Math.PI * 2)) * Math.PI * 2 - .16;
    }
    this.invalidate();
  }
  setExpanded(expanded) { this.expanded = expanded; this.invalidate(); }
  setPaused(paused) { this.manuallyPaused = paused; this.invalidate(); }

  getLayerBounds(index) {
    const box = new this.T.Box3().setFromObject(this.meshes[index]);
    const rect = this.host.getBoundingClientRect();
    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
    for (const x of [box.min.x, box.max.x]) {
      for (const y of [box.min.y, box.max.y]) {
        for (const z of [box.min.z, box.max.z]) {
          const point = new this.T.Vector3(x, y, z).project(this.camera);
          const px = rect.left + (point.x * .5 + .5) * rect.width;
          const py = rect.top + (-point.y * .5 + .5) * rect.height;
          left = Math.min(left, px); right = Math.max(right, px);
          top = Math.min(top, py); bottom = Math.max(bottom, py);
        }
      }
    }
    return { left, top, width: right - left, height: bottom - top };
  }
  reset() {
    this.invalidate();
    this.selected = -1;
    this.expanded = false;
    this.manuallyPaused = false;
    // Choose the nearest equivalent front angle to avoid an unnecessary spin.
    this.resetAngle = Math.round(this.group.rotation.y / (Math.PI * 2)) * Math.PI * 2 - .16;
  }

  resize() {
    this.invalidate();
    this.width = this.host.clientWidth;
    this.height = this.host.clientHeight;
    if (!this.width || !this.height) return;
    this.renderer.setSize(this.width, this.height);
    const aspect = this.width / this.height;
    // Keep a label rail on the left, even on a narrow phone screen.
    const horizontalSpan = this.width < 440 ? 9.8 : this.width < 560 ? 10 : 10.7;
    this.viewHeight = Math.max(7.5, horizontalSpan / aspect);
    const viewWidth = this.viewHeight * aspect;
    const shift = viewWidth * (this.width <= 620 ? .07 : .14);
    this.camera.left = -viewWidth / 2 - shift;
    this.camera.right = viewWidth / 2 - shift;
    this.camera.top = this.viewHeight / 2;
    this.camera.bottom = -this.viewHeight / 2;
    this.camera.updateProjectionMatrix();
  }

  positionLabels() {
    const labels = document.querySelectorAll('.layer-label');
    const lines = document.querySelectorAll('#leader-lines g');
    const narrow = this.width <= 620;
    const railStart = narrow ? 70 : 235;
    this.meshes.forEach((mesh, index) => {
      // Project the leftmost mid-face corner so leader lines track rotation.
      const half = (mesh.userData.bottomWidth - .46) / 2;
      let leftX = Infinity;
      let labelY = 0;
      for (const x of [-half, half]) {
        for (const z of [-half, half]) {
          this.projected.set(x, 0, z);
          mesh.localToWorld(this.projected);
          this.projected.project(this.camera);
          const screenX = (this.projected.x * .5 + .5) * this.width;
          if (screenX < leftX) {
            leftX = screenX;
            labelY = (-this.projected.y * .5 + .5) * this.height;
          }
        }
      }
      // A fixed label rail keeps 44px targets apart at every rotation angle.
      // Only the leader endpoint follows the projected layer.
      const top = narrow ? 90 : 75;
      const bottom = narrow ? 110 : 30;
      const y = top + (4 - index) * Math.max(44, (this.height - top - bottom) / 4);
      labels[index].style.top = `${y}px`;
      const endX = Math.max(railStart + 7, leftX - 10);
      lines[index].querySelector('path').setAttribute('d', `M ${railStart} ${y} L ${endX} ${labelY}`);
      lines[index].querySelector('circle').setAttribute('cx', endX);
      lines[index].querySelector('circle').setAttribute('cy', labelY);
    });
  }

  animate(time) {
    const reduce = this.reducedMotion.matches;
    const rotating = !reduce && !this.manuallyPaused && !this.pointerInside && !this.focusInside && this.selected === -1;
    if (this.wasRotating !== rotating) {
      this.wasRotating = rotating;
      this.onRotationChange(rotating);
    }
    // 30fps is sufficient for this slow turntable. Paused / reduced-motion
    // scenes stop submitting GPU work once their transition has settled.
    if (!rotating && this.resetAngle === undefined && time > this.settlingUntil && this.hasRendered) return;
    if (this.lastTime && time - this.lastTime < 1000 / 30) return;
    const delta = this.lastTime ? Math.min((time - this.lastTime) / 1000, .1) : 1 / 30;
    this.lastTime = time;
    const ease = reduce ? 1 : 1 - Math.exp(-delta * 6);
    if (this.resetAngle !== undefined) {
      this.group.rotation.y += (this.resetAngle - this.group.rotation.y) * ease;
      if (Math.abs(this.resetAngle - this.group.rotation.y) < .001) this.resetAngle = undefined;
    } else if (rotating) {
      this.group.rotation.y += delta * .085;
    }
    const targetY = 2.2 + (this.expanded ? .24 : 0);
    this.target.y += (targetY - this.target.y) * ease;
    this.camera.lookAt(this.target);
    const targetZoom = this.expanded ? .91 : 1;
    this.camera.zoom += (targetZoom - this.camera.zoom) * ease;
    this.camera.updateProjectionMatrix();

    // Selection changes the material, not the alignment of the building.
    this.meshes.forEach((mesh, index) => {
      const selected = this.selected === index;
      const hovered = this.hovered === index;
      const y = .69 + index * (this.expanded ? 1.16 : .94);
      mesh.position.y += (y - mesh.position.y) * ease;
      this.colorTarget.copy(this.baseColors[index]);
      if (selected || hovered) this.colorTarget.lerp(this.highlight, selected ? .16 : .1);
      mesh.material[0].color.lerp(this.colorTarget, ease);
      mesh.material[1].color.lerp(this.colorTarget, ease);
      mesh.material[0].emissive.copy(this.baseColors[index]);
      mesh.material[0].emissiveIntensity += ((selected ? .15 : hovered ? .06 : 0) - mesh.material[0].emissiveIntensity) * ease;
      mesh.children[0].material.opacity += ((selected ? .7 : hovered ? .4 : .2) - mesh.children[0].material.opacity) * ease;
    });
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld(true);
    this.positionLabels();
    this.renderer.render(this.scene, this.camera);
    this.hasRendered = true;
  }
};
