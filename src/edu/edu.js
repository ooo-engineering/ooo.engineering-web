// Language switching functionality
document.addEventListener('DOMContentLoaded', () => {
  let currentLang = 'ja';
  
  const langSwitch = document.getElementById('langSwitch');
  const htmlElement = document.documentElement;
  
  function switchToEnglish() {
    currentLang = 'en';
    htmlElement.lang = 'en';
    document.body.classList.add('lang-en');
    
    document.querySelectorAll('[data-en]').forEach(element => {
      if (element.tagName === 'SPAN' || element.tagName === 'DIV' || element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'A' || element.tagName === 'DT' || element.tagName === 'DD' || element.tagName === 'LI' || element.tagName === 'BUTTON') {
        element.textContent = element.getAttribute('data-en');
      }
    });
    
    localStorage.setItem('preferred-language', 'en');
  }
  
  function switchToJapanese() {
    currentLang = 'ja';
    htmlElement.lang = 'ja';
    document.body.classList.remove('lang-en');
    
    document.querySelectorAll('[data-ja]').forEach(element => {
      if (element.tagName === 'SPAN' || element.tagName === 'DIV' || element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'A' || element.tagName === 'DT' || element.tagName === 'DD' || element.tagName === 'LI' || element.tagName === 'BUTTON') {
        element.textContent = element.getAttribute('data-ja');
      }
    });
    
    localStorage.setItem('preferred-language', 'ja');
  }
  
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
    currentLang = savedLang;
    if (currentLang === 'en') {
      switchToEnglish();
    }
  }
  
  if (langSwitch) {
    langSwitch.addEventListener('click', () => {
      if (currentLang === 'ja') {
        switchToEnglish();
      } else {
        switchToJapanese();
      }
    });
  }
  
  // Remove the alert handler - let mailto link work naturally
  
  // 3D Code Animation with Three.js
  initCodeAnimation();
});

function initCodeAnimation() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true,
    antialias: true 
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0x937AFF, 1, 100);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xFF79C6, 1, 100);
  pointLight2.position.set(-10, -10, 10);
  scene.add(pointLight2);

  // Create geodesic sphere
  const sphereRadius = 2.5;
  const detail = 3; // Geodesic detail level
  const sphereGeometry = new THREE.IcosahedronGeometry(sphereRadius, detail);
  
  // Create wireframe for geodesic structure
  const wireframeGeometry = new THREE.EdgesGeometry(sphereGeometry);
  const wireframeMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
  scene.add(wireframe);
  
  // Custom shader material for geodesic surface with ripple effect
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform vec3 uHoverPoint;
    uniform float uHoverStrength;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      vec3 pos = position;
      
      // Simple, elegant ripple effect
      float dist = distance(position, uHoverPoint);
      
      // Single main ripple with slow expansion
      float ripple = sin(dist * 6.0 - uTime * 4.0) * exp(-dist * 2.0);
      
      // Subtle secondary ripple
      float ripple2 = sin(dist * 10.0 - uTime * 6.0) * exp(-dist * 3.0) * 0.5;
      
      // Combine ripples
      float totalRipple = (ripple + ripple2) * uHoverStrength;
      
      pos += normal * totalRipple * 0.15;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uHoverPoint;
    uniform float uHoverStrength;
    
    void main() {
      // Calculate view angle for edge detection
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float viewAngle = dot(viewDir, vNormal);
      
      // Multiple fresnel layers for complex edge effects
      float fresnel = 1.0 - abs(viewAngle);
      float sharpEdge = pow(fresnel, 12.0); // Ultra sharp edge
      float mediumEdge = pow(fresnel, 6.0); // Medium edge
      float softEdge = pow(fresnel, 2.0); // Soft transition
      
      // Base clear color
      vec3 clearColor = vec3(0.99, 0.99, 1.0);
      
      // Multiple gradient cycles with different speeds
      float slowCycle = sin(uTime * 0.3) * 0.5 + 0.5;
      float mediumCycle = sin(uTime * 0.7 + 1.57) * 0.5 + 0.5;
      float fastCycle = sin(uTime * 1.2) * 0.5 + 0.5;
      
      // Normalized positions
      float verticalPos = (vWorldPosition.y + 2.5) / 5.0; // 0 to 1
      float horizontalPos = atan(vWorldPosition.x, vWorldPosition.z) / 3.14159 * 0.5 + 0.5;
      
      // Define color palette
      vec3 violet = vec3(0.4, 0.0, 0.8);
      vec3 purple = vec3(0.6, 0.0, 1.0);
      vec3 pink = vec3(1.0, 0.0, 0.6);
      vec3 orange = vec3(1.0, 0.4, 0.0);
      vec3 cyan = vec3(0.0, 0.8, 1.0);
      vec3 green = vec3(0.0, 1.0, 0.5);
      vec3 yellow = vec3(1.0, 0.9, 0.0);
      
      // Layer 1: Vertical gradient with slow movement
      float grad1Pos = verticalPos + slowCycle * 0.3;
      vec3 layer1 = violet;
      layer1 = mix(layer1, purple, smoothstep(0.0, 0.3, grad1Pos));
      layer1 = mix(layer1, pink, smoothstep(0.3, 0.5, grad1Pos));
      layer1 = mix(layer1, orange, smoothstep(0.5, 0.8, grad1Pos));
      
      // Layer 2: Diagonal gradient with medium movement
      float diagonalPos = (verticalPos + horizontalPos) * 0.5;
      float grad2Pos = diagonalPos + mediumCycle * 0.4;
      vec3 layer2 = cyan;
      layer2 = mix(layer2, green, smoothstep(0.2, 0.5, grad2Pos));
      layer2 = mix(layer2, yellow, smoothstep(0.5, 0.8, grad2Pos));
      
      // Layer 3: Horizontal bands with fast movement
      float bandPos = fract(verticalPos * 5.0 + fastCycle * 2.0);
      vec3 layer3 = mix(purple, cyan, bandPos);
      
      // Combine layers with different edge weights
      vec3 edgeColor = clearColor;
      edgeColor = mix(edgeColor, layer1, sharpEdge * 0.7);
      edgeColor = mix(edgeColor, layer2, mediumEdge * 0.3);
      edgeColor = mix(edgeColor, layer3, softEdge * 0.1);
      
      // Final color application
      vec3 finalColor = clearColor;
      finalColor = mix(finalColor, edgeColor, 1.0);
      
      // Subtle hover effect with single ripple
      float hoverDist = distance(vPosition, uHoverPoint);
      
      // Single elegant ripple ring
      float ripplePhase = hoverDist * 8.0 - uTime * 5.0;
      float rippleRing = 1.0 - smoothstep(0.0, 0.15, abs(sin(ripplePhase)));
      rippleRing *= exp(-hoverDist * 2.5);
      rippleRing *= uHoverStrength;
      
      // Apply ripple as subtle highlight
      if (rippleRing > 0.01) {
        vec3 rippleColor = mix(finalColor, vec3(1.0), 0.2);
        finalColor = mix(finalColor, rippleColor, rippleRing * 0.4);
      }
      
      // Geodesic edge highlights
      float geoEdge = 1.0 - smoothstep(0.0, 0.006, min(vUv.x, min(1.0 - vUv.x, min(vUv.y, 1.0 - vUv.y))));
      if (geoEdge > 0.5) {
        finalColor = mix(finalColor, edgeColor * 0.5, geoEdge * 0.15);
      }
      
      // Transparency with multiple layers
      float alpha = 0.01; // Base transparency
      alpha += sharpEdge * 0.7; // Strong edge visibility
      alpha += mediumEdge * 0.1; // Medium edge layer
      alpha += softEdge * 0.02; // Soft gradient
      alpha += rippleRing * 0.2; // Ripple visibility
      alpha += geoEdge * 0.03; // Geodesic lines
      
      // Ensure minimum visibility
      alpha = max(alpha, 0.02);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;
  
  const sphereMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uHoverPoint: { value: new THREE.Vector3() },
      uHoverStrength: { value: 0 },
      uColor1: { value: new THREE.Color(0x0a0a0a) },
      uColor2: { value: new THREE.Color(0x937AFF) }
    },
    transparent: true,
    side: THREE.DoubleSide,
    wireframe: false
  });
  
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // Create floating particles around sphere
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = sphereRadius + Math.random() * 2;
    
    posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    color: 0x937AFF,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  camera.position.z = 6;

  // Mouse tracking and raycasting
  let mouseX = 0;
  let mouseY = 0;
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let isHoveringOnSphere = false;
  let rippleTimeout;

  function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Raycast to sphere for hover effect
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sphere);
    
    if (intersects.length > 0) {
      // Get intersection point in local coordinates
      const localPoint = sphere.worldToLocal(intersects[0].point.clone());
      sphereMaterial.uniforms.uHoverPoint.value.copy(localPoint);
      sphereMaterial.uniforms.uHoverStrength.value = 1.0;
      
      // Update wireframe opacity on hover
      wireframeMaterial.opacity = 0.3;
      
      isHoveringOnSphere = true;
    } else {
      sphereMaterial.uniforms.uHoverStrength.value *= 0.95;
      wireframeMaterial.opacity = 0.15;
      isHoveringOnSphere = false;
    }
  }
  
  document.addEventListener('mousemove', onMouseMove);

  // Update code snippets to be on sphere surface
  const codeSnippets = document.querySelectorAll('.code-snippet');
  const snippetPositions = [];
  let scrollY = 0;
  let heroSectionBottom = 0;
  
  // Get hero section height
  const heroSection = document.querySelector('.edu-hero');
  if (heroSection) {
    heroSectionBottom = heroSection.offsetHeight;
  }
  
  codeSnippets.forEach((snippet, index) => {
    // Position snippets around sphere
    const theta = (index / codeSnippets.length) * Math.PI * 2;
    const phi = Math.PI / 3 + (index % 2) * Math.PI / 3;
    
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    
    snippetPositions.push({ x, y, z, element: snippet });
  });
  
  // Handle scroll events
  function handleScroll() {
    scrollY = window.scrollY;
    
    // Hide code snippets when scrolled past hero section
    const scrollProgress = Math.min(scrollY / (heroSectionBottom * 0.5), 1);
    const opacity = 1 - scrollProgress;
    
    codeSnippets.forEach(snippet => {
      snippet.style.opacity = opacity;
      snippet.style.pointerEvents = opacity > 0.1 ? 'all' : 'none';
    });
  }
  
  window.addEventListener('scroll', handleScroll);
  
  // Initialize code snippets visibility
  handleScroll();
  
  function updateCodeSnippetsPosition() {
    // Don't update if scrolled too far
    if (scrollY > heroSectionBottom) return;
    
    snippetPositions.forEach((pos) => {
      // Convert 3D position to 2D screen position
      const vector = new THREE.Vector3(
        pos.x * sphereRadius * 1.3,
        pos.y * sphereRadius * 1.3,
        pos.z * sphereRadius * 1.3
      );
      
      // Apply sphere rotation to positions
      vector.applyEuler(sphere.rotation);
      
      // Project to screen
      vector.project(camera);
      
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (vector.y * -0.5 + 0.5) * window.innerHeight - scrollY;
      
      // Update element position
      pos.element.style.left = `${x}px`;
      pos.element.style.top = `${y}px`;
      pos.element.style.transform = `translate(-50%, -50%) scale(${vector.z > 0 ? 1 : 0.5})`;
      
      // Combine scroll opacity with z-position opacity
      const baseOpacity = vector.z > 0 ? 0.8 : 0.3;
      const currentOpacity = pos.element.style.opacity;
      const scrollOpacity = currentOpacity !== '' ? parseFloat(currentOpacity) : 1;
      pos.element.style.opacity = baseOpacity * scrollOpacity;
    });
  }

  // Animation loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Update shader time
    sphereMaterial.uniforms.uTime.value = elapsedTime;
    
    // Rotate sphere based on mouse position
    const targetRotationX = mouseY * 0.5;
    const targetRotationY = mouseX * 0.5;
    
    sphere.rotation.x += (targetRotationX - sphere.rotation.x) * 0.05;
    sphere.rotation.y += (targetRotationY - sphere.rotation.y) * 0.05;
    
    // Sync wireframe rotation
    wireframe.rotation.copy(sphere.rotation);
    
    // Auto-rotate when not interacting
    if (Math.abs(mouseX) < 0.1 && Math.abs(mouseY) < 0.1) {
      sphere.rotation.y += 0.002;
      wireframe.rotation.y += 0.002;
    }
    
    // Rotate particles
    particles.rotation.y = elapsedTime * 0.1;
    particles.rotation.x = elapsedTime * 0.05;
    
    // Enhanced hover animation
    if (isHoveringOnSphere) {
      // Pulsing effect on wireframe
      wireframeMaterial.opacity = 0.3 + Math.sin(elapsedTime * 5) * 0.1;
      
      // Slight sphere scaling
      const scale = 1 + Math.sin(elapsedTime * 3) * 0.02;
      sphere.scale.set(scale, scale, scale);
      wireframe.scale.set(scale, scale, scale);
    } else {
      // Reset scale smoothly
      sphere.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      wireframe.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
    
    // Update code snippets positions
    updateCodeSnippetsPosition();
    
    // Move camera slightly based on mouse
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
    
    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Syntax highlighting effect
  const addSyntaxHighlighting = () => {
    const codeBlocks = document.querySelectorAll('.code-snippet code');
    codeBlocks.forEach(block => {
      let html = block.innerHTML;
      // Swift keywords
      html = html.replace(/\b(import|struct|class|func|var|let|private|public|static|return|if|else|for|while|switch|case|default|true|false|nil|self|super|init|deinit|extension|protocol|enum|typealias|associatedtype|where|throws|try|catch|defer|guard|repeat|break|continue|fallthrough|@State|@Binding|@ObservedObject|@Published|@Environment|View|body|some|withAnimation)\b/g, '<span class="keyword">$1</span>');
      // Strings
      html = html.replace(/("[^"]*")/g, '<span class="string">$1</span>');
      // Comments
      html = html.replace(/(\/\/[^\n]*)/g, '<span class="comment">$1</span>');
      // Types
      html = html.replace(/\b(String|Int|Double|Float|Bool|Array|Dictionary|Set|Optional|Any|AnyObject|Void|SwiftUI|Foundation|VStack|HStack|Text|Button|Color)\b/g, '<span class="type">$1</span>');
      // Numbers
      html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="number">$1</span>');
      
      block.innerHTML = html;
    });
  };
  
  addSyntaxHighlighting();
}