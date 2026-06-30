function goTo(pageId) {
  document.querySelectorAll('.view-page').forEach(page => {
    const isActivePage = page.id === `page-${pageId}`;
    page.classList.toggle('hidden', !isActivePage);
    page.classList.toggle('active', isActivePage);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.target === pageId) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });

  // On mobile, hide menu after selection
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden') && window.innerWidth < 768) {
    mobileMenu.classList.add('hidden');
  }
}

// Set initial page and attach listeners
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(link.dataset.target);
    });
  });
  goTo('dashboard'); // Default view

  // 2. Data Initialization
  // Mock data for the directory
  const directoryData = [
    { id: "A-2015-0042", name: "Juan Dela Cruz", batch: "2015", program: "BS in Computer Science", status: "Verified" },
    { id: "A-2018-1123", name: "Maria Clara", batch: "2018", program: "BS in Accountancy", status: "Verified" },
    { id: "A-2022-0591", name: "Jose Rizal", batch: "2022", program: "BA in History", status: "Pending Update" },
    { id: "A-2020-0089", name: "Andres Bonifacio", batch: "2020", program: "BS in Civil Engineering", status: "Verified" },
    { id: "A-2019-3342", name: "Gabriela Silang", batch: "2019", program: "BS in Nursing", status: "Verified" }
  ];

  // Mock data for pending applications/modifications
  let pendingApplications = [
    {
      id: "req-1",
      initials: "JC",
      name: "Juan Dela Cruz",
      meta: "BS in Computer Science, Batch 2015",
      date: "Oct 24, 2023 · 14:30 PHT",
      current: [
        { label: "Current Company", value: "Tech Corp Inc." },
        { label: "Job Title", value: "Junior Developer" }
      ],
      requested: [
        { label: "Current Company", value: "Global Solutions LLC" },
        { label: "Job Title", value: "Senior Software Engineer" }
      ],
      blobs: ["Certificate of Employment (PDF)", "Updated CV (PDF)"]
    },
    {
      id: "req-2",
      initials: "MR",
      name: "Maria Clara",
      meta: "BS in Accountancy, Batch 2018",
      date: "Oct 25, 2023 · 09:15 PHT",
      current: [
        { label: "Contact Email", value: "maria.c@oldmail.com" },
        { label: "Phone Number", value: "+63 917 123 4567" }
      ],
      requested: [
        { label: "Contact Email", value: "m.clara@newmail.com" },
        { label: "Phone Number", value: "+63 917 987 6543" }
      ],
      blobs: ["Valid ID (JPG)"]
    },
    {
      id: "req-3",
      initials: "JR",
      name: "Jose Rizal",
      meta: "BA in History, Batch 2022",
      date: "Oct 26, 2023 · 11:00 PHT",
      current: [
        { label: "Address", value: "123 Old Street, Manila" }
      ],
      requested: [
        { label: "Address", value: "456 New Avenue, Quezon City" }
      ],
      blobs: ["Proof of Billing (PNG)"]
    },
    {
      id: "req-4",
      initials: "GS",
      name: "Gabriela Silang",
      meta: "BS in Nursing, Batch 2019",
      date: "Oct 27, 2023 · 16:45 PHT",
      current: [
        { label: "License Status", value: "Pending Renewal" }
      ],
      requested: [
        { label: "License Status", value: "Active (Renewed 2023)" }
      ],
      blobs: ["PRC ID Front (JPG)", "PRC ID Back (JPG)"]
    }
  ];

  let currentReviewIndex = 0;

  // 3. Render Directory Table
  function renderDirectory() {
    const tbody = document.getElementById('directory-table-body');
    tbody.innerHTML = '';
    
    directoryData.forEach(alumni => {
      const isPending = alumni.status === 'Pending Update';
      const statusClass = isPending 
        ? 'bg-warning-gold/20 text-secondary' 
        : 'bg-success-green/10 text-success-green';
      
      const tr = document.createElement('tr');
      tr.className = 'border-b border-outline-variant hover:bg-surface-container-highest/50 transition-colors';
      tr.innerHTML = `
        <td class="py-3 px-6 text-center">
          <input type="checkbox" class="rounded-[2px] border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer w-4 h-4">
        </td>
        <td class="py-3 px-6 font-semibold text-on-surface">${alumni.name}</td>
        <td class="py-3 px-6 text-on-surface-variant font-mono text-sm">${alumni.id}</td>
        <td class="py-3 px-6 text-on-surface-variant">${alumni.batch}</td>
        <td class="py-3 px-6 text-on-surface-variant">${alumni.program}</td>
        <td class="py-3 px-6 text-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusClass}">
            ${alumni.status}
          </span>
        </td>
        <td class="py-3 px-6 text-right">
          <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Edit Record">
            <span class="material-symbols-outlined text-[20px]" data-icon="edit">edit</span>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 4. Render Applications Queue
  function updateCounters() {
    const count = pendingApplications.length;
    document.getElementById('sidebar-pending-count').textContent = count;
    document.getElementById('sidebar-pending-count').style.display = count > 0 ? 'flex' : 'none';
    document.getElementById('dashboard-pending-count').textContent = count;
    document.getElementById('pending-count-pill').textContent = `${count} Pending`;
  }

  function renderQueueStrip() {
    const strip = document.getElementById('queue-strip');
    strip.innerHTML = '';
    
    pendingApplications.forEach((app, index) => {
      const isActive = index === currentReviewIndex;
      const btn = document.createElement('button');
      btn.className = `shrink-0 px-4 py-2 rounded-full font-label-md text-label-md transition-colors border ${isActive ? 'bg-primary-container text-white border-primary-container' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low'}`;
      btn.textContent = app.name;
      btn.onclick = () => loadReviewCard(index);
      strip.appendChild(btn);
    });
  }

  function loadReviewCard(index) {
    if (pendingApplications.length === 0) {
      document.getElementById('review-card').classList.add('hidden');
      document.getElementById('queue-empty-state').classList.remove('hidden');
      document.getElementById('queue-empty-state').classList.add('flex');
      return;
    }

    currentReviewIndex = index;
    const app = pendingApplications[index];
    
    // Ensure card is visible
    document.getElementById('review-card').classList.remove('hidden');
    document.getElementById('queue-empty-state').classList.add('hidden');
    document.getElementById('queue-empty-state').classList.remove('flex');

    // Header info
    document.getElementById('rv-initials').textContent = app.initials;
    document.getElementById('rv-name').textContent = app.name;
    document.getElementById('rv-meta').textContent = app.meta;
    document.getElementById('rv-date').textContent = app.date;

    // Current fields
    const currentContainer = document.getElementById('rv-current-fields');
    currentContainer.innerHTML = '';
    app.current.forEach(field => {
      currentContainer.innerHTML += `
        <div>
          <p class="font-label-md text-label-md text-on-surface-variant mb-1">${field.label}</p>
          <p class="font-body-md text-body-md text-on-surface bg-surface-container-low px-3 py-2 border border-outline-variant rounded-DEFAULT line-through opacity-70">${field.value}</p>
        </div>
      `;
    });

    // Requested fields
    const requestedContainer = document.getElementById('rv-requested-fields');
    requestedContainer.innerHTML = '';
    app.requested.forEach(field => {
      requestedContainer.innerHTML += `
        <div>
          <p class="font-label-md text-label-md text-on-surface-variant mb-1">${field.label}</p>
          <p class="font-body-md text-body-md text-primary bg-white px-3 py-2 border border-success-green/30 rounded-DEFAULT font-medium shadow-sm">${field.value}</p>
        </div>
      `;
    });

    // Blobs
    const blobsContainer = document.getElementById('rv-blobs');
    blobsContainer.innerHTML = '';
    app.blobs.forEach(blob => {
      blobsContainer.innerHTML += `
        <button class="bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-1.5 flex items-center gap-2 hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface">
          <span class="material-symbols-outlined text-[16px] text-primary" data-icon="attach_file">attach_file</span>
          ${blob}
        </button>
      `;
    });

    // Reset textarea
    document.getElementById('admin-comment').value = '';
    
    renderQueueStrip();
  }

  // 5. Actions
  window.decideApplication = function(action) {
    if (pendingApplications.length === 0) return;
    
    // Animate removal
    const card = document.getElementById('review-card');
    card.style.opacity = '0.5';
    card.style.pointerEvents = 'none';

    setTimeout(() => {
      // Remove from array
      pendingApplications.splice(currentReviewIndex, 1);
      
      // Adjust index if we removed the last item
      if (currentReviewIndex >= pendingApplications.length) {
        currentReviewIndex = Math.max(0, pendingApplications.length - 1);
      }
      
      // Re-render
      updateCounters();
      loadReviewCard(currentReviewIndex);
      
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
    }, 300); // simulate network request
  };

  // Initialize data views on load
  document.addEventListener('DOMContentLoaded', () => {
    renderDirectory();
    updateCounters();
    loadReviewCard(0);
  });
