// folder.js

window.loadFolderView = function(id) {
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folder = folders.find(f => f.id === id);
    if (!folder) return alert('Folder not found!');
  
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <button id="backBtn" class="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          ${folder.name}
        </h2>
      </div>
  
      <button id="createSubfolderBtn" class="inline-flex items-center gap-1 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Create Subfolder
      </button>
  
      <div id="subfolderContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6"></div>
  
      <label for="folderNote" class="block mt-10 mb-2 text-sm font-medium text-gray-700">Folder Notes</label>
      <textarea id="folderNote" class="block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" rows="5" placeholder="Write something here..."></textarea>
  
      <!-- Modal for creating subfolder -->
      <div id="subfolderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <h3 class="text-lg font-semibold mb-4">Create New Subfolder</h3>
          <input type="text" id="subfolderNameInput" class="w-full rounded-md border border-gray-300 p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter subfolder name" />
          <div class="flex justify-end gap-3">
            <button id="cancelSubfolderBtn" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button id="confirmSubfolderBtn" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Create</button>
          </div>
        </div>
      </div>
    `;
  
    // Back button handler
    document.getElementById('backBtn').onclick = () => {
      if (window.goHome) {
        window.goHome();
      }
    };
  
    // Show modal when clicking create subfolder button
    document.getElementById('createSubfolderBtn').onclick = () => {
      const modal = document.getElementById('subfolderModal');
      const input = document.getElementById('subfolderNameInput');
      input.value = '';
      modal.classList.remove('hidden');
      input.focus();
    };
  
    // Cancel button hides modal
    document.getElementById('cancelSubfolderBtn').onclick = () => {
      document.getElementById('subfolderModal').classList.add('hidden');
    };
  
    // Confirm button creates the subfolder
    document.getElementById('confirmSubfolderBtn').onclick = () => {
      const input = document.getElementById('subfolderNameInput');
      const name = input.value.trim();
      if (!name) {
        alert('Subfolder name cannot be empty.');
        return;
      }
  
      const subfoldersKey = `subfolders-${id}`;
      const subfolders = JSON.parse(localStorage.getItem(subfoldersKey)) || [];
      const subfolderId = Date.now();
  
      subfolders.push({ id: subfolderId, name });
      localStorage.setItem(subfoldersKey, JSON.stringify(subfolders));
  
      document.getElementById('subfolderModal').classList.add('hidden');
  
      renderSubfolders();
    };
  
    // Load note if any
    const note = localStorage.getItem(`folderNote-${id}`) || '';
    const noteArea = document.getElementById('folderNote');
    noteArea.value = note;
  
    noteArea.addEventListener('input', (e) => {
      localStorage.setItem(`folderNote-${id}`, e.target.value);
    });
  
    function renderSubfolders() {
      const container = document.getElementById('subfolderContainer');
      container.innerHTML = '';
  
      const subfoldersKey = `subfolders-${id}`;
      const subfolders = JSON.parse(localStorage.getItem(subfoldersKey)) || [];
  
      subfolders.forEach(sub => {
        const div = document.createElement('div');
        div.className = "rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3";
  
        div.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span class="font-medium text-gray-800">${sub.name}</span>
        `;
  
        container.appendChild(div);
      });
    }
  
    renderSubfolders();
  };
  