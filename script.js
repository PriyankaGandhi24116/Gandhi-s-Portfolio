/* ==========================================================================
   PRIYANKA GANDHI - 3D PORTFOLIO INTERACTIVE SCRIPT (THREE.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJSScene();
  initTypewriter();
  initThemeToggle();
  initMobileMenu();
  initProjectFilters();
  initStatCounters();
  initScrollSpy();
  initQuickBioModal();
  init3DTilt();
});

/* --------------------------------------------------------------------------
   1. THREE.JS 3D WEBGL BACKGROUND SCENE
   -------------------------------------------------------------------------- */
function initThreeJSScene() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f2fe, 1.5, 100);
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x7000ff, 1.5, 100);
  pointLight2.position.set(-20, -20, 10);
  scene.add(pointLight2);

  // Floating 3D Geometric Objects
  const geometries = [
    new THREE.IcosahedronGeometry(3.5, 1),
    new THREE.TorusKnotGeometry(2.2, 0.6, 100, 16),
    new THREE.OctahedronGeometry(2.8, 0),
    new THREE.TorusGeometry(3, 0.8, 16, 100)
  ];

  const meshes = [];
  const positions = [
    { x: -18, y: 10, z: -10 },
    { x: 18, y: -8, z: -12 },
    { x: 15, y: 12, z: -15 },
    { x: -16, y: -12, z: -8 }
  ];

  geometries.forEach((geom, idx) => {
    const wireframeMat = new THREE.MeshStandardMaterial({
      color: idx % 2 === 0 ? 0x00f2fe : 0x7000ff,
      wireframe: true,
      metalness: 0.8,
      roughness: 0.2
    });

    const mesh = new THREE.Mesh(geom, wireframeMat);
    mesh.position.set(positions[idx].x, positions[idx].y, positions[idx].z);
    scene.add(mesh);
    meshes.push(mesh);
  });

  // 3D Particle System
  const particleCount = 400;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 80;
    particlePositions[i + 1] = (Math.random() - 0.5) * 80;
    particlePositions[i + 2] = (Math.random() - 0.5) * 50;
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.4,
    transparent: true,
    opacity: 0.7
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Mouse Interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth Mouse Rotation
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    scene.rotation.y = targetX * 1.5;
    scene.rotation.x = targetY * 1.5;

    // Rotate Meshes
    meshes.forEach((mesh, index) => {
      mesh.rotation.x = elapsedTime * (0.2 + index * 0.05);
      mesh.rotation.y = elapsedTime * (0.3 + index * 0.05);
      mesh.position.y += Math.sin(elapsedTime + index) * 0.01;
    });

    // Rotate Particle Cloud
    particleSystem.rotation.y = elapsedTime * 0.03;

    renderer.render(scene, camera);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    "Microsoft Power BI Developer",
    "MERN Stack Developer",
    "Full Stack Developer",
    "AI Enthusiast",
    "Canva Content Creator",
    "Social Work Advocate"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. 3D TILT EFFECT ON CARDS
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt-3d, .project-card, .skill-card, .about-card');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* --------------------------------------------------------------------------
   3. THEME TOGGLE (DARK / LIGHT)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('arya_portfolio_theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('arya_portfolio_theme', nextTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   4. MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu')?.querySelector('.nav-list');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. PROJECT FILTERS
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. STAT COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const decimal = stat.getAttribute('data-decimal');
          
          let count = 0;
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              clearInterval(timer);
              stat.textContent = decimal ? `${Math.floor(target)}.${decimal}` : Math.floor(target);
            } else {
              stat.textContent = decimal ? `${Math.floor(count)}.${decimal}` : Math.floor(count);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   7. SCROLL SPY FOR NAVIGATION
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE DASHBOARD MODALS (CHART.JS INTEGRATION)
   -------------------------------------------------------------------------- */
let activeChartInstance = null;

function openDashboardModal(projectKey) {
  const modal = document.getElementById('dashboard-modal');
  const container = document.getElementById('modal-body-container');
  if (!modal || !container) return;

  if (activeChartInstance) {
    activeChartInstance.destroy();
    activeChartInstance = null;
  }

  if (projectKey === 'supply-chain') {
    container.innerHTML = `
      <div class="dashboard-demo-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="tag">Power BI Live Preview</span>
          <h2>Supply Chain Analytics Dashboard</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Simulated interactive Power BI telemetry: Logistics, fulfillment efficiency & demand forecasting.</p>
        </div>
        <a href="https://github.com/Arya842856/SUPPLY-CHAIN-DASHBOARD" target="_blank" rel="noopener noreferrer" class="btn-project-github" style="margin-top: 10px; flex: none;">
          <i class="fa-brands fa-github"></i> Open GitHub Repo
        </a>
      </div>

      <div class="dashboard-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-val">98.4%</div>
          <div class="kpi-lbl">Order Fulfillment</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">1,240</div>
          <div class="kpi-lbl">Units Shipped / Mo</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">3.2 Days</div>
          <div class="kpi-lbl">Avg Lead Time</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">$485K</div>
          <div class="kpi-lbl">Logistics Vol.</div>
        </div>
      </div>

      <div class="chart-container-box">
        <canvas id="modal-chart"></canvas>
      </div>
    `;

    modal.classList.add('active');

    setTimeout(() => {
      const ctx = document.getElementById('modal-chart').getContext('2d');
      activeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Demand Volume (Units)',
              data: [820, 940, 1100, 1050, 1240, 1380, 1420],
              borderColor: '#00f2fe',
              backgroundColor: 'rgba(0, 242, 254, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Order Fulfillment Rate (%)',
              data: [92, 94, 96, 95, 98, 97, 99],
              borderColor: '#7000ff',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#9ca3af' } }
          },
          scales: {
            x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }, 100);

  } else if (projectKey === 'hr-analytics') {
    container.innerHTML = `
      <div class="dashboard-demo-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="tag">Power BI Live Preview</span>
          <h2>HR Analytics & Workforce Dashboard</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Telemetry monitoring employee retention, attrition by department, and talent acquisition performance.</p>
        </div>
        <a href="https://github.com/Arya842856/HR-ANALYTICAL-DASHBOARD" target="_blank" rel="noopener noreferrer" class="btn-project-github" style="margin-top: 10px; flex: none;">
          <i class="fa-brands fa-github"></i> Open GitHub Repo
        </a>
      </div>

      <div class="dashboard-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-val">94.2%</div>
          <div class="kpi-lbl">Retention Rate</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">145</div>
          <div class="kpi-lbl">Total Headcount</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">4.1 Yrs</div>
          <div class="kpi-lbl">Avg Employee Tenure</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-val">12</div>
          <div class="kpi-lbl">Open Requisitions</div>
        </div>
      </div>

      <div class="chart-container-box">
        <canvas id="modal-chart"></canvas>
      </div>
    `;

    modal.classList.add('active');

    setTimeout(() => {
      const ctx = document.getElementById('modal-chart').getContext('2d');
      activeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Engineering', 'Data & Analytics', 'Sales', 'Marketing', 'Operations', 'HR'],
          datasets: [
            {
              label: 'Active Employees',
              data: [52, 24, 30, 18, 15, 6],
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Attrition Count',
              data: [3, 1, 4, 2, 1, 0],
              backgroundColor: '#ef4444'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#9ca3af' } }
          },
          scales: {
            x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }, 100);

  } else if (projectKey === 'men-wear') {
    container.innerHTML = `
      <div class="dashboard-demo-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="tag">Web & AI Showcase</span>
          <h2>BBMens Wear Marketing & E-Commerce Web App</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Modern AI-powered digital marketing portal built with automated email capture integration.</p>
        </div>
        <a href="https://bencerz-style-emporium.lovable.app/" target="_blank" rel="noopener noreferrer" class="btn-project-github" style="background: rgba(37, 99, 235, 0.15); border-color: rgba(37, 99, 235, 0.4); color: #60a5fa; margin-top: 10px; flex: none;">
          <i class="fa-solid fa-globe"></i> Visit Live App
        </a>
      </div>

      <div style="background: rgba(0,0,0,0.4); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--glass-border); text-align: center;">
        <i class="fa-solid fa-shirt" style="font-size: 3.5rem; color: var(--accent-cyan); margin-bottom: 16px;"></i>
        <h3 style="margin-bottom: 8px;">AURA MEN | Modern Urban Wear</h3>
        <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto; font-size: 0.93rem;">
          Designed using AI prompting & ChatGPT for targeted digital marketing campaigns with email collection integration.
        </p>

        <div style="display: flex; gap: 10px; max-width: 400px; margin: 0 auto 20px auto;">
          <input type="email" id="demo-sub-email" placeholder="Enter email for 15% off" style="padding: 10px 14px; border-radius: 6px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); color: #fff; width: 100%;" />
          <button onclick="testSubEmail()" class="btn btn-primary" style="padding: 10px 18px; white-space: nowrap;">Subscribe</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }
}

function closeDashboardModal() {
  const modal = document.getElementById('dashboard-modal');
  if (modal) modal.classList.remove('active');
  if (activeChartInstance) {
    activeChartInstance.destroy();
    activeChartInstance = null;
  }
}

function testSubEmail() {
  const emailInput = document.getElementById('demo-sub-email');
  if (emailInput && emailInput.value) {
    showToast(`Subscribed ${emailInput.value} successfully! Demo API captured.`);
    emailInput.value = '';
  } else {
    showToast('Please enter a valid email address.');
  }
}

/* --------------------------------------------------------------------------
   9. QUICK BIO MODAL
   -------------------------------------------------------------------------- */
function initQuickBioModal() {
  const btn = document.getElementById('quick-resume-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const bioModal = document.getElementById('bio-modal');
      if (bioModal) bioModal.classList.add('active');
    });
  }
}

function closeBioModal() {
  const bioModal = document.getElementById('bio-modal');
  if (bioModal) bioModal.classList.remove('active');
}

/* --------------------------------------------------------------------------
   10. CONTACT FORM SUBMISSION
   -------------------------------------------------------------------------- */
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
    showToast(`Thank you ${name}! Your message has been sent successfully.`);
    event.target.reset();

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  }, 1200);
}

/* --------------------------------------------------------------------------
   11. TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-cyan);"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
