let currentApiUrl = '';

function setStatus(message, type = 'info') {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

async function fetchDirectory() {
    const apiUrl = document.getElementById('api-url').value.trim();
    
    if (!apiUrl) {
        setStatus('Please enter an API URL', 'error');
        return;
    }
    
    currentApiUrl = apiUrl;
    setStatus('Loading directory...', 'loading');
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        displayDirectory(data);
        setStatus(`Successfully loaded ${data.items.length} items`, 'success');
        
    } catch (error) {
        console.error('Error fetching directory:', error);
        setStatus(`Error: ${error.message}`, 'error');
        document.getElementById('directory-listing').innerHTML = '';
    }
}

function displayDirectory(data) {
    const container = document.getElementById('directory-listing');
    
    if (!data.items || data.items.length === 0) {
        container.innerHTML = '<div class="directory-info">No items found in directory</div>';
        return;
    }
    
    const directoryInfo = `
        <div class="directory-info">
            <strong>Current Path:</strong> ${data.current_path}<br>
            <strong>Items:</strong> ${data.items.length}
        </div>
    `;
    
    const itemsHtml = data.items.map(item => `
        <div class="directory-item ${item.type}">
            <div class="item-name">
                <span class="file-icon"></span>
                ${item.name}
            </div>
            <div class="item-details">
                <span class="item-size">${formatFileSize(item.size)}</span>
                <span class="item-type">${item.type}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        ${directoryInfo}
        <div class="directory-items">
            ${itemsHtml}
        </div>
    `;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function refreshDirectory() {
    if (currentApiUrl) {
        fetchDirectory();
    } else {
        setStatus('No API URL set', 'error');
    }
}

// Load directory on page load if URL is pre-filled
window.addEventListener('load', () => {
    const apiUrlInput = document.getElementById('api-url');
    if (apiUrlInput.value.trim()) {
        fetchDirectory();
    }
});

// Allow Enter key to trigger fetch
document.getElementById('api-url').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchDirectory();
    }
});
