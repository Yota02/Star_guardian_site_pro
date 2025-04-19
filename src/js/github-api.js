const GITHUB_OWNER = 'Yota02';
const GITHUB_REPO = 'Star-Guardian-Project';

async function fetchLatestRelease() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`);
        const data = await response.json();

        if (response.ok) {
            // Mise à jour de la version
            document.getElementById('version').textContent = `Version actuelle : ${data.tag_name}`;
            
            // Mise à jour de la date
            const updateDate = new Date(data.published_at);
            const formattedDate = updateDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            document.getElementById('update-date').textContent = `Dernière mise à jour : ${formattedDate}`;
            
            // Recherche spécifiquement du fichier .exe
            if (data.assets && data.assets.length > 0) {
                const exeFile = data.assets.find(asset => asset.name.endsWith('.exe'));
                if (exeFile) {
                    document.getElementById('download-btn').href = exeFile.browser_download_url;
                    document.getElementById('download-btn').innerHTML = `
                        <span class="download-icon">⬇️</span>
                        Télécharger ${exeFile.name} (${Math.round(exeFile.size / 1024 / 1024 * 100) / 100} MB)
                    `;
                } else {
                    throw new Error('Aucun fichier .exe disponible');
                }
            }
        } else {
            throw new Error('Impossible de récupérer la dernière version');
        }
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('version').textContent = 'Version non disponible';
        document.getElementById('update-date').textContent = 'Information temporairement indisponible';
        document.getElementById('download-btn').innerHTML = `
            <span class="download-icon">❌</span>
            Téléchargement non disponible
        `;
        document.getElementById('download-btn').classList.add('disabled');
    }
}

// Ajout d'une animation de chargement
function showLoading() {
    document.getElementById('version').classList.add('loading');
    document.getElementById('update-date').classList.add('loading');
}

function hideLoading() {
    document.getElementById('version').classList.remove('loading');
    document.getElementById('update-date').classList.remove('loading');
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    showLoading();
    fetchLatestRelease().finally(hideLoading);
});