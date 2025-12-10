// Artist Manager Component
// Handles all artist-related functionality

export class ArtistManager {
    constructor() {
        this.artists = [];
        this.filteredArtists = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.isLoading = false;
    }

    async init() {
        try {
            await this.loadArtists();
            this.setupEventListeners();
            this.renderArtists();
        } catch (error) {
            console.error('Failed to initialize ArtistManager:', error);
            this.showError();
        }
    }

    async loadArtists() {
        this.setLoading(true);
        
        try {
            const response = await fetch(`${window.HLPFLConfig.apiBaseUrl}/data/artists.json`);
            const data = await response.json();
            this.artists = data.artists || [];
            this.filteredArtists = [...this.artists];
        } catch (error) {
            console.error('Error loading artists:', error);
            this.artists = this.getFallbackArtists();
            this.filteredArtists = [...this.artists];
        } finally {
            this.setLoading(false);
        }
    }

    getFallbackArtists() {
        return [
            {
                id: "luna-echo",
                name: "Luna Echo",
                genre: "Pop / Electronic",
                bio: "Luna Echo blends ethereal vocals with cutting-edge electronic production.",
                stats: { monthly_listeners: "245K", followers: "189K", plays: "12.5M" },
                social: { spotify: "#", instagram: "#", youtube: "#", soundcloud: "#" }
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('artistSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.debounce(this.filterArtists.bind(this), 300)();
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.genre;
                this.filterArtists();
            });
        });
    }

    filterArtists() {
        this.filteredArtists = this.artists.filter(artist => {
            const matchesSearch = !this.searchTerm || 
                artist.name.toLowerCase().includes(this.searchTerm) ||
                artist.genre.toLowerCase().includes(this.searchTerm);
            
            const matchesFilter = this.currentFilter === 'all' ||
                artist.genre.toLowerCase().includes(this.currentFilter.toLowerCase());
            
            return matchesSearch && matchesFilter;
        });
        
        this.renderArtists();
    }

    renderArtists() {
        const grid = document.getElementById('artistsGrid');
        if (!grid) return;
        
        if (this.isLoading) {
            grid.innerHTML = this.getLoadingHTML();
            return;
        }
        
        if (this.filteredArtists.length === 0) {
            grid.innerHTML = this.getNoResultsHTML();
            return;
        }

        grid.innerHTML = this.filteredArtists.map(artist => this.createArtistCard(artist)).join('');
        
        // Add staggered animation
        this.addStaggeredAnimation();
    }

    createArtistCard(artist) {
        const imageUrl = artist.image || `https://picsum.photos/seed/${artist.id}/400/300.jpg`;
        
        return `
            <div class="artist-card fade-in-up" data-artist-id="${artist.id}">
                <div class="artist-header">
                    <img src="${imageUrl}" alt="${artist.name}" class="artist-image" 
                         loading="lazy" onerror="this.src='https://picsum.photos/seed/${artist.id}/400/300.jpg'">
                    <div class="artist-overlay">
                        <div>
                            <h3 class="artist-name">${artist.name}</h3>
                            <p class="artist-genre">${artist.genre}</p>
                        </div>
                    </div>
                </div>
                <div class="artist-content">
                    <p class="artist-bio">${artist.bio}</p>
                    
                    <div class="artist-stats">
                        <div class="stat">
                            <span class="stat-number">${artist.stats?.monthly_listeners || '0'}</span>
                            <span class="stat-label">Monthly Listeners</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${artist.stats?.followers || '0'}</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${artist.stats?.plays || '0'}</span>
                            <span class="stat-label">Total Plays</span>
                        </div>
                    </div>

                    <div class="artist-social">
                        ${this.renderSocialLinks(artist.social)}
                    </div>

                    <div class="artist-actions">
                        <button class="artist-btn artist-btn--primary" onclick="artistManager.showArtistDetails('${artist.id}')">
                            <i class="fas fa-info-circle"></i> View Details
                        </button>
                        <a href="${artist.social?.spotify || '#'}" target="_blank" class="artist-btn artist-btn--secondary">
                            <i class="fas fa-play"></i> Listen Now
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderSocialLinks(social = {}) {
        const platforms = [
            { key: 'spotify', icon: 'fab fa-spotify' },
            { key: 'instagram', icon: 'fab fa-instagram' },
            { key: 'youtube', icon: 'fab fa-youtube' },
            { key: 'soundcloud', icon: 'fab fa-soundcloud' }
        ];

        return platforms.map(platform => {
            if (social[platform.key]) {
                return `<a href="${social[platform.key]}" target="_blank" aria-label="${platform.key}">
                    <i class="${platform.icon}"></i>
                </a>`;
            }
            return '';
        }).join('');
    }

    showArtistDetails(artistId) {
        const artist = this.artists.find(a => a.id === artistId);
        if (!artist) return;

        // Update modal content
        this.updateModalContent(artist);
        
        // Show modal
        const modal = document.getElementById('artistModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Track view event
        this.trackArtistView(artist);
    }

    updateModalContent(artist) {
        const modalContent = document.getElementById('modalContent');
        if (!modalContent) return;
        
        const imageUrl = artist.image || `https://picsum.photos/seed/${artist.id}/900/300.jpg`;
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <img src="${imageUrl}" alt="${artist.name}" 
                     style="width: 100%; height: 100%; object-fit: cover;" 
                     onerror="this.src='https://picsum.photos/seed/${artist.id}/900/300.jpg'">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);">
                    <h2 style="color: var(--color-white); font: 700 2.5rem var(--font-display); margin: 0;">${artist.name}</h2>
                    <p style="color: var(--color-gold); font-size: 1.2rem; margin-top: 10px;">${artist.genre}</p>
                </div>
            </div>
            <div class="modal-body">
                <p style="color: var(--color-text); line-height: 1.8; font-size: 1.1rem; margin-bottom: 30px;">${artist.bio}</p>
                
                ${artist.releases ? this.renderReleases(artist.releases) : ''}
                ${artist.tour ? this.renderTourDates(artist.tour) : ''}
            </div>
        `;
    }

    renderReleases(releases) {
        return `
            <div class="releases-section">
                <h3 style="color: var(--color-white); font: 700 1.8rem var(--font-display); margin-bottom: 20px;">Releases</h3>
                <div class="releases-grid">
                    ${releases.map(release => `
                        <div class="release-card">
                            <img src="${release.cover || `https://picsum.photos/seed/${release.title}/200/200.jpg`}" 
                                 alt="${release.title}" class="release-cover" 
                                 onerror="this.src='https://picsum.photos/seed/${release.title}/200/200.jpg'">
                            <h4 class="release-title">${release.title}</h4>
                            <p class="release-info">${release.type} • ${release.year} • ${release.tracks} tracks</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderTourDates(tour) {
        return `
            <div class="releases-section">
                <h3 style="color: var(--color-white); font: 700 1.8rem var(--font-display); margin-bottom: 20px;">Upcoming Shows</h3>
                ${tour.map(show => `
                    <div style="background: rgba(200, 121, 65, 0.1); padding: 20px; border-radius: var(--radius); margin-bottom: 15px;">
                        <h4 style="color: var(--color-white); margin-bottom: 5px;">${show.venue}</h4>
                        <p style="color: var(--color-text); margin-bottom: 10px;">${show.city}, ${show.country} • ${show.date}</p>
                        <a href="${show.ticket_link}" target="_blank" class="btn btn--primary">Get Tickets</a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    trackArtistView(artist) {
        if (window.trackEvent) {
            window.trackEvent('artist_view', {
                artist_id: artist.id,
                artist_name: artist.name,
                artist_genre: artist.genre
            });
        }
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        this.renderArtists();
    }

    getLoadingHTML() {
        return `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading amazing artists...</p>
            </div>
        `;
    }

    getNoResultsHTML() {
        return `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 20px;"></i>
                <h3 style="color: var(--color-white); margin-bottom: 10px;">No Artists Found</h3>
                <p style="color: var(--color-text-muted);">Try adjusting your search or filters</p>
            </div>
        `;
    }

    addStaggeredAnimation() {
        const cards = document.querySelectorAll('.artist-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        });
    }

    showError() {
        const grid = document.getElementById('artistsGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--color-white); margin-bottom: 10px;">Unable to Load Artists</h3>
                    <p style="color: var(--color-text-muted);">Please check back later.</p>
                </div>
            `;
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global instance
window.artistManager = new ArtistManager();