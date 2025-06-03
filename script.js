let currentFolderId = null;

// ================= Render Home Page ===================
function renderHomePage() {
  currentFolderId = null;
  localStorage.removeItem('currentFolderId');

  const app = document.getElementById('app');

  app.innerHTML = `
    <button id="createFolderBtn" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-6 inline-flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Create Folder
    </button>

    <div id="folderContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"></div>

    <!-- Modal for folder creation -->
    <div id="folderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-80">
        <h3 class="text-lg font-semibold mb-4">Create New Folder</h3>
        <input type="text" id="folderNameInput" class="w-full rounded-md border border-gray-300 p-2 mb-4" placeholder="Enter folder name" />
        <div class="flex justify-end gap-3">
          <button id="cancelFolderBtn" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button id="confirmFolderBtn" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Create</button>
        </div>
      </div>
    </div>
  `;

  setupFolderModalEvents();
  renderFolders();
}

// ================= Modal Events ===================
function setupFolderModalEvents() {
  const folderModal = document.getElementById('folderModal');
  const nameInput = document.getElementById('folderNameInput');

  document.getElementById('createFolderBtn').onclick = () => {
    nameInput.value = '';
    folderModal.classList.remove('hidden');
    nameInput.focus();
  };

  document.getElementById('cancelFolderBtn').onclick = () => {
    folderModal.classList.add('hidden');
  };

  document.getElementById('confirmFolderBtn').onclick = () => {
    const name = nameInput.value.trim();
    if (!name) return alert('Folder name cannot be empty!');
    addFolder(name);
    folderModal.classList.add('hidden');
  };
}

// ================= Add Folder ===================
function addFolder(name) {
  const folders = JSON.parse(localStorage.getItem('folders')) || [];
  folders.push({ id: Date.now(), name });
  localStorage.setItem('folders', JSON.stringify(folders));
  renderFolders();
}

// ================= Render Folders ===================
function renderFolders() {
  const container = document.getElementById('folderContainer');
  container.innerHTML = '';

  const folders = JSON.parse(localStorage.getItem('folders')) || [];
  folders.forEach(({ id, name }) => {
    const div = document.createElement('div');
    div.className = "bg-white p-4 rounded-xl shadow-md border relative hover:shadow-lg transition";

    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h2 class="font-semibold text-lg">${name}</h2>
        </div>
        <div class="relative">
          <button onclick="toggleMenu(event, ${id})" class="p-1.5 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </button>
          <div id="menu-${id}" class="hidden absolute right-0 mt-2 w-36 bg-white border rounded-md shadow z-10">
            <button onclick="openFolder(${id})" class="block w-full px-4 py-2 text-sm hover:bg-gray-100">Open</button>
            <button onclick="deleteFolder(${id})" class="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100">Delete</button>
          </div>
        </div>
      </div>
    `;

    div.onclick = (e) => {
      // Ignore clicks on buttons inside menu
      if (!e.target.closest('button')) openFolder(id);
    };

    container.appendChild(div);
  });
}

// ================= Menu Toggle ===================
function toggleMenu(event, id) {
  event.stopPropagation();
  document.querySelectorAll('[id^="menu-"]').forEach(menu => menu.classList.add('hidden'));
  document.getElementById(`menu-${id}`).classList.toggle('hidden');
}

// Close menus when clicking elsewhere
document.addEventListener('click', () => {
  document.querySelectorAll('[id^="menu-"]').forEach(menu => menu.classList.add('hidden'));
});

// ================= Open Folder ===================
function openFolder(id) {
  currentFolderId = id;
  localStorage.setItem('currentFolderId', id);
  if (window.loadFolderView) {
    window.loadFolderView(id);
  }
}

// ================= Delete Folder ===================
let folderToDeleteId = null;

function deleteFolder(id) {
  showDeleteConfirmationModal(id);
}

function showDeleteConfirmationModal(id) {
  folderToDeleteId = id;
  document.getElementById('deleteConfirmModal').classList.remove('hidden');
}

document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => {
  folderToDeleteId = null;
  document.getElementById('deleteConfirmModal').classList.add('hidden');
});

document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
  if (folderToDeleteId !== null) {
    performDelete(folderToDeleteId);
    folderToDeleteId = null;
  }
  document.getElementById('deleteConfirmModal').classList.add('hidden');
});

function performDelete(id) {
  let folders = JSON.parse(localStorage.getItem('folders')) || [];
  folders = folders.filter(folder => folder.id !== id);
  localStorage.setItem('folders', JSON.stringify(folders));

  localStorage.removeItem(`subfolders-${id}`);
  localStorage.removeItem(`folderNote-${id}`);

  if (parseInt(localStorage.getItem('currentFolderId')) === id) {
    localStorage.removeItem('currentFolderId');
  }

  renderFolders();
}

// ================= Go Home ===================
function goHome() {
  localStorage.removeItem('currentFolderId');
  renderHomePage();
}

// ================= On Load ===================
window.onload = () => {
  const folders = JSON.parse(localStorage.getItem('folders')) || [];
  const savedFolderId = parseInt(localStorage.getItem('currentFolderId'), 10);
  const exists = folders.some(folder => folder.id === savedFolderId);

  if (savedFolderId && exists && typeof window.loadFolderView === 'function') {
    window.loadFolderView(savedFolderId);
  } else {
    renderHomePage();
  }
};
